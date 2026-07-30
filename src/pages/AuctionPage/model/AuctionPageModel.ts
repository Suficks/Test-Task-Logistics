import { makeAutoObservable } from 'mobx';
import type { QueryClient } from '@tanstack/react-query';

import type { AuctionShowResponseDto } from '@/entities/auction';
import { auctionKeys } from '@/entities/auction';
import { AuctionsApi } from '@/shared/api/services';
import { QueryWithState } from '@/shared/lib/transports';

export class AuctionPageModel {
	api = {
		auctions: new AuctionsApi(),
	};

	detailQuery: QueryWithState<
		AuctionShowResponseDto,
		Error,
		AuctionShowResponseDto,
		ReturnType<typeof auctionKeys.detail>
	>;

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

		makeAutoObservable(
			this,
			{
				detailQuery: false,
				api: false,
				auctionUuid: false,
			},
			{ autoBind: true },
		);
	}

	get auction(): AuctionShowResponseDto | undefined {
		return this.detailQuery.data;
	}

	get hideContacts(): boolean {
		return Boolean(
			this.auction?.trading.hide_points_address_and_contacts,
		);
	}

	get hideCargoPrice(): boolean {
		return Boolean(this.auction?.trading.no_view_cargo_price);
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

	refetch(): void {
		void this.detailQuery.refetch();
	}

	dispose(): void {
		this.detailQuery.dispose();
	}
}
