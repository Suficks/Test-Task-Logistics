import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/auctions/$auctionId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/auctions/$auctionId"!</div>
}
