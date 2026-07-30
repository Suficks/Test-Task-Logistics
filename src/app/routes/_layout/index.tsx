import { createFileRoute } from '@tanstack/react-router';

import { AuctionsPage, parseAuctionsSearch } from '@/pages/AuctionsPage';

export const Route = createFileRoute('/_layout/')({
	validateSearch: (search) => parseAuctionsSearch(search),
	component: AuctionsPage,
});
