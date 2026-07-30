import { makeAutoObservable } from 'mobx';
import type { QueryClient } from '@tanstack/react-query';

import type {
	AuctionListItemDto,
	AuctionListMetaDto,
	AuctionListRequestDto,
	AuctionListResponseDto,
} from '@/entities/auction';
import { auctionKeys } from '@/entities/auction';
import { AuctionsApi } from '@/shared/api/services';
import { QueryWithState } from '@/shared/lib/transports';

export class AuctionsPageModel {
	listQuery: QueryWithState<
		AuctionListResponseDto,
		Error,
		AuctionListResponseDto,
		ReturnType<typeof auctionKeys.list>
	>;

	constructor(
		public queryClient: QueryClient,
		public filters: AuctionListRequestDto,
	) {
		this.listQuery = new QueryWithState(this.queryClient, {
			queryKey: auctionKeys.list(this.filters),
			queryFn: () => this.api.auctions.listAuctions(this.filters),
			staleTime: 30_000,
		});

		makeAutoObservable(
			this,
			{
				filters: false,
				listQuery: false,
				api: false,
			},
			{ autoBind: true },
		);
	}

	api = {
		auctions: new AuctionsApi(),
	};

	get auctions(): AuctionListItemDto[] {
		return this.listQuery.data?.data ?? [];
	}

	get meta(): AuctionListMetaDto | undefined {
		return this.listQuery.data?.meta;
	}

	get isEmpty(): boolean {
		return this.listQuery.isSuccess && this.auctions.length === 0;
	}

	setFilters(filters: AuctionListRequestDto): void {
		this.filters = filters;
		this.listQuery.setOptions({
			queryKey: auctionKeys.list(filters),
			queryFn: () => this.api.auctions.listAuctions(this.filters),
		});
	}

	refetch(): void {
		void this.listQuery.refetch();
	}

	prefetchDetail(auctionUuid: string): void {
		void this.queryClient.prefetchQuery({
			queryKey: auctionKeys.detail(auctionUuid),
			queryFn: () => this.api.auctions.getAuction({ auctionUuid }),
		});
	}

	dispose(): void {
		this.listQuery.dispose();
	}
}
