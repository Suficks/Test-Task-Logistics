import { createFileRoute } from '@tanstack/react-router';

import { parseAuctionsSearch } from '@/features/filter-auctions';
import { AuctionsPage } from '@/pages/AuctionsPage';

export const Route = createFileRoute('/_layout/')({
	validateSearch: (search) => parseAuctionsSearch(search),
	component: AuctionsPage,
});
