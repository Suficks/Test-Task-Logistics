import type { AuctionListItemDto } from '@/entities/auction';

export type AuctionPrimaryAction = {
	label: string;
	disabled: boolean;
	to: '/auctions/$auctionId/bets';
	params: { auctionId: string };
};

export function getAuctionPrimaryAction(
	auction: AuctionListItemDto,
): AuctionPrimaryAction {
	const canSetBet = Boolean(auction.trading.can_set_bet);
	const hasBet = Boolean(auction.trading.your?.bet);
	const orderUid = auction.main.order_uid;

	if (canSetBet && hasBet) {
		return {
			label: 'Изменить ставку',
			disabled: false,
			to: '/auctions/$auctionId/bets',
			params: { auctionId: orderUid },
		};
	}

	if (canSetBet) {
		return {
			label: 'Сделать ставку',
			disabled: false,
			to: '/auctions/$auctionId/bets',
			params: { auctionId: orderUid },
		};
	}

	return {
		label: 'Смотреть ставки',
		disabled: false,
		to: '/auctions/$auctionId/bets',
		params: { auctionId: orderUid },
	};
}
