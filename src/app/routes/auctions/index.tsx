import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auctions/')({
  component: AuctionsPage,
});