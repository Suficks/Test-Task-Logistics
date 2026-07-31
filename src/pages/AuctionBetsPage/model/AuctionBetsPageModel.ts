import { makeAutoObservable } from 'mobx';
import type { QueryClient } from '@tanstack/react-query';

import type { AuctionShowResponseDto } from '@/entities/auction';
import { auctionKeys } from '@/entities/auction';
import type {
	BetItemDto,
	BetListResponseDto,
	SetBetRequestDto,
} from '@/entities/bet';
import { ApiRequestError, AuctionsApi } from '@/shared/api/services';
import {
	MutationWithState,
	QueryWithState,
} from '@/shared/lib/transports';

export class AuctionBetsPageModel {
	api = {
		auctions: new AuctionsApi(),
	};

	detailQuery: QueryWithState<
		AuctionShowResponseDto,
		Error,
		AuctionShowResponseDto,
		ReturnType<typeof auctionKeys.detail>
	>;

	betsQuery: QueryWithState<
		BetListResponseDto,
		Error,
		BetListResponseDto,
		ReturnType<typeof auctionKeys.bets>
	>;

	setBetMutation: MutationWithState<void, Error, SetBetRequestDto>;

	constructor(
		public queryClient: QueryClient,
		public auctionUuid: string,
	) {
		this.detailQuery = new QueryWithState(this.queryClient, {
			queryKey: auctionKeys.detail(this.auctionUuid),
			queryFn: () =>
				this.api.auctions.getAuction({ auctionUuid: this.auctionUuid }),
			staleTime: 30_000,
		});

		this.betsQuery = new QueryWithState(this.queryClient, {
			queryKey: auctionKeys.bets(this.auctionUuid),
			queryFn: () =>
				this.api.auctions.listBets({
					auctionUuid: this.auctionUuid,
					all: true,
				}),
			staleTime: 15_000,
		});

		this.setBetMutation = new MutationWithState(this.queryClient, {
			mutationFn: (setBetRequest) =>
				this.api.auctions.setBet({
					auctionUuid: this.auctionUuid,
					setBetRequest,
				}),
			onSuccess: async () => {
				await Promise.all([
					this.queryClient.invalidateQueries({
						queryKey: auctionKeys.lists(),
					}),
					this.queryClient.invalidateQueries({
						queryKey: auctionKeys.detail(this.auctionUuid),
					}),
					this.queryClient.invalidateQueries({
						queryKey: auctionKeys.bets(this.auctionUuid),
					}),
				]);
			},
		});

		makeAutoObservable(
			this,
			{
				detailQuery: false,
				betsQuery: false,
				setBetMutation: false,
				api: false,
				auctionUuid: false,
				queryClient: false,
			},
			{ autoBind: true },
		);
	}

	get auction(): AuctionShowResponseDto | undefined {
		return this.detailQuery.data;
	}

	get bets(): BetItemDto[] {
		return this.betsQuery.data?.bets ?? [];
	}

	get participantsCount(): number {
		return new Set(this.bets.map((bet) => bet.organization_id)).size;
	}

	get hideBetsHistory(): boolean {
		return Boolean(
			this.auction?.hide_bets_history ||
				this.auction?.trading.hide_bets_history,
		);
	}

	get canSetBet(): boolean {
		return Boolean(this.auction?.trading.can_set_bet);
	}

	get hasOwnBet(): boolean {
		return Boolean(this.auction?.trading.your.bet);
	}

	get isBetsEmpty(): boolean {
		return this.betsQuery.isSuccess && this.bets.length === 0;
	}

	get priceBounds() {
		const price = this.auction?.trading.price;
		return {
			min: price?.min ?? null,
			max: price?.max ?? null,
			step: price?.step ?? null,
			available: price?.available ?? null,
			current: price?.current ?? null,
		};
	}

	async submitBet(setBetRequest: SetBetRequestDto): Promise<void> {
		await this.setBetMutation.mutate(setBetRequest);
	}

	getValidationErrors(): Array<{ field: string; message: string }> {
		const error = this.setBetMutation.error;
		if (!(error instanceof ApiRequestError) || error.status !== 422) {
			return [];
		}

		const body = error.body;
		if (
			typeof body === 'object' &&
			body !== null &&
			'errors' in body &&
			Array.isArray(body.errors)
		) {
			return body.errors.filter(
				(item): item is { field: string; message: string } =>
					typeof item === 'object' &&
					item !== null &&
					'field' in item &&
					'message' in item &&
					typeof item.field === 'string' &&
					typeof item.message === 'string',
			);
		}

		return [];
	}

	refetch(): void {
		void this.detailQuery.refetch();
		void this.betsQuery.refetch();
	}

	dispose(): void {
		this.detailQuery.dispose();
		this.betsQuery.dispose();
		this.setBetMutation.dispose();
	}
}
