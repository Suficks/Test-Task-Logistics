import { createFileRoute } from '@tanstack/react-router';

import { AuctionBetsPage } from '@/pages/AuctionBetsPage';

export const Route = createFileRoute('/_layout/auctions/$auctionId/bets')({
	component: AuctionBetsPage,
});
