import type {
	AuctionListItemDto,
	AuctionListMetaDto,
	AuctionListRequestDto,
	AuctionListResponseDto,
	AuctionShowResponseDto,
	AuctionStatusDto,
	TradingStatusDto,
} from '@/entities/auction';
import type {
	BetItemDto,
	BetListResponseDto,
	SetBetRequestDto,
} from '@/entities/bet';
import { getBetItemDto } from '@/entities/bet';
import type { ValidationProblemDto } from '../types';
import { MockError } from './MockError';
import {
	CURRENT_USER_ORG_ID,
	CURRENT_USER_SUBSCRIBER_ID,
	generate,
	priceNoVat,
	type StoredAuction,
} from './seedAuctions';

const STATUS_TO_CODE: Record<AuctionStatusDto, number> = {
	Planning: 1,
	Auction: 2,
	DeterminateWinner: 3,
	WaitDeal: 4,
	InProgress: 5,
	Finished: 6,
	Stopped: 7,
	Canceled: 8,
	Unknown: 0,
};

let nextBetId = 2000;
const auctions = generate();

function getOrderUid(auction: StoredAuction): string {
	return auction.listItem.main.order_uid;
}

function findAuction(auctionUuid: string): StoredAuction {
	const auction = auctions.find((item) => getOrderUid(item) === auctionUuid);

	if (!auction) {
		throw new MockError('Not Found', 404, {
			code: 'resource_not_found',
			title: 'Не найдено',
			message: 'Аукцион не найден',
			trace_id: null,
		});
	}

	return auction;
}

function matchesFilters(
	item: AuctionListItemDto,
	filters: AuctionListRequestDto = {},
): boolean {
	const trading = item.trading;
	const main = item.main;
	const cargo = item.cargo;
	const route = item.route;
	const price = trading?.price;

	if (filters.cargo_num && main?.cargo_num !== filters.cargo_num) {
		return false;
	}

	if (filters.status?.length) {
		const statusMobile = trading?.status_mobile;
		if (!statusMobile || !filters.status.includes(statusMobile as TradingStatusDto)) {
			return false;
		}
	}

	if (filters.statuses?.length) {
		const code = trading?.status ? STATUS_TO_CODE[trading.status] : undefined;
		if (code == null || !filters.statuses.includes(code)) {
			return false;
		}
	}

	if (filters.auc_type?.length) {
		const aucType = main?.auc_type;
		if (
			!aucType ||
			!filters.auc_type.includes(
				aucType as NonNullable<AuctionListRequestDto['auc_type']>[number],
			)
		) {
			return false;
		}
	}

	if (filters.load_city && route?.load?.city !== filters.load_city) {
		return false;
	}

	if (filters.unload_city && route?.unload?.city !== filters.unload_city) {
		return false;
	}

	if (filters.load_date_from && (route?.load?.date ?? '') < filters.load_date_from) {
		return false;
	}

	if (filters.load_date_to && (route?.load?.date ?? '') > filters.load_date_to) {
		return false;
	}

	if (filters.is_available != null && trading?.is_available !== filters.is_available) {
		return false;
	}

	if (filters.is_bidder != null && trading?.is_bidder !== filters.is_bidder) {
		return false;
	}

	if (filters.is_favorite != null && trading?.is_favorite !== filters.is_favorite) {
		return false;
	}

	const currentPrice =
		typeof price === 'object' && price ? price.current : undefined;

	if (
		filters.current_price_from != null &&
		(currentPrice == null || currentPrice < filters.current_price_from)
	) {
		return false;
	}

	if (
		filters.current_price_to != null &&
		(currentPrice == null || currentPrice > filters.current_price_to)
	) {
		return false;
	}

	if (filters.weight_from != null && (cargo?.weight ?? 0) < filters.weight_from) {
		return false;
	}

	if (filters.weight_to != null && (cargo?.weight ?? 0) > filters.weight_to) {
		return false;
	}

	if (filters.customer) {
		const query = filters.customer.toLowerCase();
		const name = item.organizer?.organization_name?.toLowerCase() ?? '';
		const inn = item.organizer?.organization_inn ?? '';
		if (!name.includes(query) && !inn.includes(filters.customer)) {
			return false;
		}
	}

	return true;
}

function buildMeta(total: number, page: number, perPage: number): AuctionListMetaDto {
	const lastPage = Math.max(1, Math.ceil(total / perPage));
	const safePage = Math.min(Math.max(page, 1), lastPage);
	const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
	const to = Math.min(safePage * perPage, total);

	return {
		current_page: safePage,
		from,
		last_page: lastPage,
		per_page: perPage,
		to,
		total,
	};
}

export function getAuctions(
	filters: AuctionListRequestDto = {},
): AuctionListResponseDto {
	const page = filters.page ?? 1;
	const perPage = filters.per_page ?? 20;

	const filtered = auctions
		.map((auction) => auction.listItem)
		.filter((item) => matchesFilters(item, filters));

	const sorted = [...filtered].sort((a, b) => {
		const aTime = a.trading?.start_time ?? '';
		const bTime = b.trading?.start_time ?? '';
		return filters.is_oldest ? aTime.localeCompare(bTime) : bTime.localeCompare(aTime);
	});

	const meta = buildMeta(sorted.length, page, perPage);
	const start = ((meta.current_page ?? 1) - 1) * perPage;

	return {
		data: sorted.slice(start, start + perPage),
		meta,
	};
}

export function getAuction({
	auctionUuid,
}: {
	auctionUuid: string;
}): AuctionShowResponseDto {
	return findAuction(auctionUuid).detail;
}

function isActiveBet(bet: BetItemDto): boolean {
	return !bet.is_rejected && !bet.cancel_reason;
}

function compareBetsByRank(
	a: BetItemDto,
	b: BetItemDto,
	direction: 'asc' | 'desc',
): number {
	const priceDiff =
		direction === 'asc'
			? a.price_with_vat - b.price_with_vat
			: b.price_with_vat - a.price_with_vat;

	if (priceDiff !== 0) {
		return priceDiff;
	}

	return a.created_at.localeCompare(b.created_at);
}

/** Пересчитывает места: Down/остальные — дешевле выше, Up — дороже выше. */
function rankAuctionBets(
	bets: BetItemDto[],
	aucType: string | null | undefined,
): BetItemDto[] {
	const direction = aucType === 'Up' ? 'desc' : 'asc';
	const active = bets
		.filter(isActiveBet)
		.sort((a, b) => compareBetsByRank(a, b, direction));
	const inactive = bets.filter((bet) => !isActiveBet(bet));

	active.forEach((bet, index) => {
		Object.assign(bet, { place: index + 1, is_win: false });
	});
	inactive.forEach((bet) => {
		Object.assign(bet, { place: null, is_win: false });
	});

	return [...active, ...inactive];
}

function sortBetsForResponse(bets: BetItemDto[]): BetItemDto[] {
	return [...bets].sort((a, b) => {
		if (a.place == null && b.place == null) {
			return b.created_at.localeCompare(a.created_at);
		}
		if (a.place == null) {
			return 1;
		}
		if (b.place == null) {
			return -1;
		}
		return a.place - b.place;
	});
}

export function getAuctionBets({
	auctionUuid,
	all,
}: {
	auctionUuid: string;
	all?: boolean | null;
}): BetListResponseDto {
	const auction = findAuction(auctionUuid);

	if (auction.detail.hide_bets_history || auction.detail.trading.hide_bets_history) {
		return { bets: [] };
	}

	const bets = all
		? auction.bets
		: auction.bets.filter(isActiveBet);

	return { bets: sortBetsForResponse(bets) };
}

export function setBet({
	auctionUuid,
	setBetRequest,
}: {
	auctionUuid: string;
	setBetRequest: SetBetRequestDto;
}): void {
	const auction = findAuction(auctionUuid);

	if (!auction.detail.trading.can_set_bet) {
		throw new MockError('Validation Failed', 422, {
			code: 'validation_failed',
			title: 'Ошибка валидации',
			message: 'Запрос содержит некорректные поля.',
			trace_id: null,
			errors: [
				{
					field: 'price',
					message: 'Ставка недоступна для этого аукциона.',
					code: 'bet_not_allowed',
				},
			],
		});
	}

	const price = setBetRequest.price;
	const tradingPrice = auction.detail.trading.price ?? {};
	const errors: NonNullable<ValidationProblemDto['errors']> = [];

	if (price == null || price <= 0) {
		errors.push({
			field: 'price',
			message: 'Цена обязательна и должна быть больше 0.',
			code: 'min_value',
		});
	}

	if (price != null && tradingPrice.min != null && price < tradingPrice.min) {
		errors.push({
			field: 'price',
			message: `Цена не может быть меньше ${tradingPrice.min}.`,
			code: 'min_value',
		});
	}

	if (price != null && tradingPrice.max != null && price > tradingPrice.max) {
		errors.push({
			field: 'price',
			message: `Цена не может быть больше ${tradingPrice.max}.`,
			code: 'max_value',
		});
	}

	if (
		price != null &&
		tradingPrice.step != null &&
		tradingPrice.step > 0 &&
		tradingPrice.min != null
	) {
		const diff = price - tradingPrice.min;
		const steps = diff / tradingPrice.step;
		if (Math.abs(steps - Math.round(steps)) > 1e-6) {
			errors.push({
				field: 'price',
				message: `Цена должна соответствовать шагу ${tradingPrice.step}.`,
				code: 'step',
			});
		}
	}

	if (errors.length > 0) {
		throw new MockError('Validation Failed', 422, {
			code: 'validation_failed',
			title: 'Ошибка валидации',
			message: 'Запрос содержит некорректные поля.',
			trace_id: null,
			errors,
		});
	}

	const safePrice = price as number;
	const noVat = priceNoVat(safePrice);
	const auctionId = auction.detail.main.id;
	const createdAt = new Date().toISOString().slice(0, 19);
	const aucType = auction.detail.main.auc_type;
	const step = tradingPrice.step ?? 0;
	const min = tradingPrice.min ?? 0;
	const max = tradingPrice.max ?? Number.POSITIVE_INFINITY;

	const newBet = getBetItemDto({
		id: nextBetId++,
		created_at: createdAt,
		auction_id: auctionId,
		subscriber_id: CURRENT_USER_SUBSCRIBER_ID,
		organization_id: CURRENT_USER_ORG_ID,
		organization_name: 'ООО Перевозчик',
		price_with_vat: safePrice,
		price_no_vat: noVat,
		place: null,
		is_win: false,
		is_rejected: false,
		cancel_reason: '',
	});

	const otherBets = auction.bets.filter(
		(bet) => bet.subscriber_id !== CURRENT_USER_SUBSCRIBER_ID,
	);
	auction.bets = rankAuctionBets([newBet, ...otherBets], aucType);

	const leadingBet = auction.bets.find(isActiveBet) ?? newBet;
	const leadingPrice = leadingBet.price_with_vat;
	const leadingNoVat = leadingBet.price_no_vat;
	const distance = auction.detail.cargo.distance ?? 0;
	const pricePerKm =
		distance > 0
			? Math.round((leadingNoVat / distance) * 100) / 100
			: 0;
	const available =
		aucType === 'Up'
			? Math.min(max, leadingPrice + step)
			: Math.max(min, leadingPrice - step);
	const isLeading = newBet.place === 1;
	const statusMobile: TradingStatusDto = isLeading ? 'Leading' : 'Losing';

	Object.assign(auction.detail.trading, {
		status_mobile: statusMobile,
		is_bidder: true,
		can_set_bet: true,
		price: {
			...tradingPrice,
			current: leadingPrice,
			current_no_vat: leadingNoVat,
			available,
			available_no_vat: priceNoVat(available),
			price_per_km: pricePerKm,
		},
		your: {
			...auction.detail.trading.your,
			bet: true,
			last_bet: noVat,
			last_bet_with_vat: safePrice,
			win: false,
		},
	});

	Object.assign(auction.listItem.main ?? {}, { price_per_km: pricePerKm });
	Object.assign(auction.listItem.trading ?? {}, {
		status_mobile: statusMobile,
		is_bidder: true,
		can_set_bet: true,
		is_available: true,
	});

	const listPrice =
		auction.listItem.trading?.price &&
		typeof auction.listItem.trading.price === 'object'
			? auction.listItem.trading.price
			: null;

	if (listPrice) {
		Object.assign(listPrice, {
			current: leadingPrice,
			current_no_vat: leadingNoVat,
		});
	} else if (auction.listItem.trading) {
		auction.listItem.trading.price = {
			start: tradingPrice.start ?? leadingPrice,
			current: leadingPrice,
			current_no_vat: leadingNoVat,
		};
	}

	if (auction.listItem.trading?.your) {
		Object.assign(auction.listItem.trading.your, {
			bet: true,
			last_bet: safePrice,
		});
	} else if (auction.listItem.trading) {
		auction.listItem.trading.your = {
			bet: true,
			last_bet: safePrice,
		};
	}
}