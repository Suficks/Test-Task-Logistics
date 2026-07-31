import { describe, expect, it } from 'vitest';

import { getAuctionListItemDto } from '@/entities/auction';
import { getAuctionPrimaryAction } from './getAuctionPrimaryAction';

describe('getAuctionPrimaryAction', () => {
	it('returns "Сделать ставку" when betting is allowed and user has no bet', () => {
		const auction = getAuctionListItemDto({
			main: { order_uid: 'a1' },
			trading: {
				can_set_bet: true,
				your: { bet: false, last_bet: null },
			},
		});

		expect(getAuctionPrimaryAction(auction)).toEqual({
			label: 'Сделать ставку',
			disabled: false,
			to: '/auctions/$auctionId/bets',
			params: { auctionId: 'a1' },
		});
	});

	it('returns "Изменить ставку" when user already has a bet', () => {
		const auction = getAuctionListItemDto({
			main: { order_uid: 'a2' },
			trading: {
				can_set_bet: true,
				your: { bet: true, last_bet: 32000 },
			},
		});

		expect(getAuctionPrimaryAction(auction)).toMatchObject({
			label: 'Изменить ставку',
			params: { auctionId: 'a2' },
		});
	});

	it('returns "Смотреть ставки" when betting is unavailable', () => {
		const auction = getAuctionListItemDto({
			main: { order_uid: 'a3' },
			trading: {
				can_set_bet: false,
				your: { bet: false, last_bet: null },
			},
		});

		expect(getAuctionPrimaryAction(auction)).toMatchObject({
			label: 'Смотреть ставки',
			params: { auctionId: 'a3' },
		});
	});
});
