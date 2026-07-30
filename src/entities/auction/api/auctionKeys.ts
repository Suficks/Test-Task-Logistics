import type { AuctionListRequestDto } from '../lib/getAuctionListResponseDto';

export const auctionKeys = {
	all: ['auctions'] as const,
	lists: () => [...auctionKeys.all, 'list'] as const,
	list: (filters: AuctionListRequestDto) =>
		[...auctionKeys.lists(), filters] as const,
	details: () => [...auctionKeys.all, 'detail'] as const,
	detail: (auctionUuid: string) =>
		[...auctionKeys.details(), auctionUuid] as const,
	bets: (auctionUuid: string) =>
		[...auctionKeys.all, 'bets', auctionUuid] as const,
};
