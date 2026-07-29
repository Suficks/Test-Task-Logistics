import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/auctions/$auctionId/bets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auctions/$auctionId/bets"!</div>
}
