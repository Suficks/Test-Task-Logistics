import { createFileRoute } from '@tanstack/react-router';

import { AuctionPage } from '@/pages/AuctionPage';

export const Route = createFileRoute('/_layout/auctions/$auctionId/')({
	component: AuctionPage,
});
