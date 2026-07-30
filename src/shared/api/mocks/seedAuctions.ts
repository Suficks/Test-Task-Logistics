import type {
	AuctionListItemDto,
	AuctionListTradingStatusDto,
	AuctionShowResponseDto,
	AuctionStatusDto,
	AuctionTypeDto,
	TradingStatusDto,
} from '@/entities/auction';
import {
	getAuctionListItemDto,
	getAuctionShowResponseDto,
	getRoutePointDto,
} from '@/entities/auction';
import type { BetItemDto } from '@/entities/bet';
import { getBetItemDto } from '@/entities/bet';

export type StoredAuction = {
	listItem: AuctionListItemDto;
	detail: AuctionShowResponseDto;
	bets: BetItemDto[];
};

const CURRENT_USER_SUBSCRIBER_ID = 13;
const CURRENT_USER_ORG_ID = 14;
const VAT_RATE = 0.2;

function priceNoVat(priceWithVat: number): number {
	return Math.round((priceWithVat / (1 + VAT_RATE)) * 100) / 100;
}

function createStoredAuction(params: {
	id: number;
	orderUid: string;
	cargoNum: string;
	aucType: AuctionTypeDto;
	status: AuctionStatusDto;
	statusMobile: TradingStatusDto & AuctionListTradingStatusDto;
	canSetBet: boolean;
	isAvailable: boolean;
	isBidder: boolean;
	isFavorite?: boolean;
	hideBetsHistory?: boolean;
	hidePoints?: boolean;
	loadCity: string;
	loadGcId: number;
	unloadCity: string;
	unloadGcId: number;
	loadDate: string;
	unloadDate: string;
	cargoName: string;
	weight: number;
	volume: number;
	bodyType: string;
	currentPrice: number;
	startPrice: number;
	step: number;
	min: number;
	max: number;
	distance: number;
	yourBet?: number | null;
	organizerName?: string;
	bets?: BetItemDto[];
}): StoredAuction {
	const pricePerKm =
		params.distance > 0
			? Math.round((priceNoVat(params.currentPrice) / params.distance) * 100) / 100
			: 0;

	const yourBet = params.yourBet ?? null;
	const hasYourBet = yourBet != null;

	const listItem = getAuctionListItemDto({
		main: {
			id: params.id,
			cargo_num: params.cargoNum,
			order_uid: params.orderUid,
			auc_type: params.aucType,
			price_per_km: pricePerKm,
			created_at: '2026-05-20T10:00:00',
			cargo_date: params.loadDate,
		},
		organizer: {
			organization_name: params.organizerName ?? 'ЛИМ',
			organization_id: 340,
		},
		route: {
			load: {
				city: params.loadCity,
				city_gc_id: params.loadGcId,
				date: params.loadDate,
				address: `${params.loadCity}, склад 1`,
			},
			unload: {
				city: params.unloadCity,
				city_gc_id: params.unloadGcId,
				date: params.unloadDate,
				address: `${params.unloadCity}, склад 2`,
			},
		},
		cargo: {
			name: params.cargoName,
			weight: params.weight,
			volume: params.volume,
			body_type: params.bodyType,
		},
		trading: {
			status: params.status,
			status_mobile: params.statusMobile,
			can_set_bet: params.canSetBet,
			is_available: params.isAvailable,
			is_bidder: params.isBidder,
			is_favorite: params.isFavorite ?? false,
			hide_points_address_and_contacts: params.hidePoints ?? false,
			start_time: '2026-05-25T09:00:00',
			stop_time: '2026-05-30T18:00:00',
			price: {
				start: params.startPrice,
				current: params.currentPrice,
				current_no_vat: priceNoVat(params.currentPrice),
			},
			your: {
				bet: hasYourBet,
				last_bet: yourBet,
			},
		},
	});

	const detail = getAuctionShowResponseDto({
		main: {
			id: params.id,
			cargo_num: params.cargoNum,
			order_uid: params.orderUid,
			auc_type: params.aucType,
			cargo_date: params.loadDate,
			created_at: '2026-05-20T10:00:00',
		},
		organizer: {
			organization_name: params.organizerName ?? 'ЛИМ',
			organization_id: 340,
		},
		cargo: {
			distance: params.distance,
			body_type: params.bodyType,
			truck_count: 1,
		},
		trading: {
			status: params.status,
			status_mobile: params.statusMobile,
			can_set_bet: params.canSetBet,
			is_bidder: params.isBidder,
			is_favorite: params.isFavorite ?? false,
			hide_bets_history: params.hideBetsHistory ?? false,
			hide_points_address_and_contacts: params.hidePoints ?? false,
			start_time: '2026-05-25T09:00:00',
			stop_time: '2026-05-30T18:00:00',
			price: {
				start: params.startPrice,
				start_no_vat: priceNoVat(params.startPrice),
				current: params.currentPrice,
				current_no_vat: priceNoVat(params.currentPrice),
				available: params.currentPrice - params.step,
				available_no_vat: priceNoVat(params.currentPrice - params.step),
				min: params.min,
				min_no_vat: priceNoVat(params.min),
				max: params.max,
				max_no_vat: priceNoVat(params.max),
				step: params.step,
				step_no_vat: priceNoVat(params.step),
				price_per_km: pricePerKm,
			},
			your: {
				bet: hasYourBet,
				last_bet: yourBet != null ? priceNoVat(yourBet) : null,
				last_bet_with_vat: yourBet,
				win: params.statusMobile === 'Winner',
			},
		},
		hide_bets_history: params.hideBetsHistory ?? false,
		routes: [
			getRoutePointDto({
				row_num: 1,
				op_type: 'Loading',
				start_date: params.loadDate,
				end_date: params.loadDate,
				location: {
					city_name: params.loadCity,
					city_full_name: `${params.loadCity}, Россия`,
					city_gc_id: params.loadGcId,
					loading_address: params.hidePoints
						? ''
						: `${params.loadCity}, склад 1`,
					lon: 56.238,
					lat: 58.01,
				},
				cargo: {
					name: params.cargoName,
					weight: params.weight.toFixed(3),
					volume: params.volume.toFixed(3),
				},
				contact: params.hidePoints
					? { name: '', phone: '' }
					: { name: 'Петров Пётр', phone: '+79001112233' },
			}),
			getRoutePointDto({
				row_num: 2,
				op_type: 'Unloading',
				start_date: params.unloadDate,
				end_date: params.unloadDate,
				location: {
					city_name: params.unloadCity,
					city_full_name: `${params.unloadCity}, Россия`,
					city_gc_id: params.unloadGcId,
					loading_address: params.hidePoints
						? ''
						: `${params.unloadCity}, склад 2`,
					lon: 37.617,
					lat: 55.756,
				},
				cargo: {
					name: params.cargoName,
					weight: params.weight.toFixed(3),
					volume: params.volume.toFixed(3),
				},
				contact: params.hidePoints
					? { name: '', phone: '' }
					: { name: 'Сидоров Сидор', phone: '+79004445566' },
			}),
		],
		contacts: params.hidePoints
			? []
			: undefined,
	});

	return {
		listItem,
		detail,
		bets: params.bets ?? [],
	};
}

export function generate(): StoredAuction[] {
	return [
		createStoredAuction({
			id: 1001,
			orderUid: '11111111-1111-4111-8111-111111111111',
			cargoNum: '00000001001',
			aucType: 'Down',
			status: 'Auction',
			statusMobile: 'NotParticipating',
			canSetBet: true,
			isAvailable: true,
			isBidder: false,
			loadCity: 'Пермь',
			loadGcId: 59,
			unloadCity: 'Москва',
			unloadGcId: 100,
			loadDate: '2026-08-01T09:00:00',
			unloadDate: '2026-08-03T18:00:00',
			cargoName: 'Мороженое',
			weight: 12,
			volume: 40,
			bodyType: 'рефрижератор',
			currentPrice: 45000,
			startPrice: 50000,
			step: 500,
			min: 20000,
			max: 50000,
			distance: 1400,
			bets: [
				getBetItemDto({
					id: 1,
					auction_id: 1001,
					price_with_vat: 45000,
					price_no_vat: priceNoVat(45000),
					organization_name: 'ООО СеверТранс',
					place: 1,
					created_at: '2026-07-29T10:00:00',
				}),
			],
		}),
		createStoredAuction({
			id: 1002,
			orderUid: '22222222-2222-4222-8222-222222222222',
			cargoNum: '00000001002',
			aucType: 'Up',
			status: 'Auction',
			statusMobile: 'Leading',
			canSetBet: true,
			isAvailable: true,
			isBidder: true,
			yourBet: 32000,
			loadCity: 'Казань',
			loadGcId: 16,
			unloadCity: 'Самара',
			unloadGcId: 63,
			loadDate: '2026-08-05T08:00:00',
			unloadDate: '2026-08-06T20:00:00',
			cargoName: 'Металлопрокат',
			weight: 20,
			volume: 30,
			bodyType: 'тентованный',
			currentPrice: 32000,
			startPrice: 25000,
			step: 1000,
			min: 25000,
			max: 80000,
			distance: 350,
			bets: [
				getBetItemDto({
					id: 2,
					auction_id: 1002,
					subscriber_id: CURRENT_USER_SUBSCRIBER_ID,
					organization_id: CURRENT_USER_ORG_ID,
					organization_name: 'ООО Перевозчик',
					price_with_vat: 32000,
					price_no_vat: priceNoVat(32000),
					place: 1,
					created_at: '2026-07-29T12:00:00',
				}),
				getBetItemDto({
					id: 3,
					auction_id: 1002,
					subscriber_id: 99,
					organization_id: 99,
					organization_name: 'АО Логистик',
					price_with_vat: 30000,
					price_no_vat: priceNoVat(30000),
					place: 2,
					created_at: '2026-07-29T11:00:00',
				}),
			],
		}),
		createStoredAuction({
			id: 1003,
			orderUid: '33333333-3333-4333-8333-333333333333',
			cargoNum: '00000001003',
			aucType: 'Down',
			status: 'Auction',
			statusMobile: 'Losing',
			canSetBet: true,
			isAvailable: true,
			isBidder: true,
			yourBet: 38000,
			loadCity: 'Екатеринбург',
			loadGcId: 66,
			unloadCity: 'Новосибирск',
			unloadGcId: 54,
			loadDate: '2026-08-10T10:00:00',
			unloadDate: '2026-08-12T16:00:00',
			cargoName: 'Стройматериалы',
			weight: 18,
			volume: 55,
			bodyType: 'тентованный',
			currentPrice: 35000,
			startPrice: 42000,
			step: 500,
			min: 20000,
			max: 42000,
			distance: 1600,
			bets: [
				getBetItemDto({
					id: 4,
					auction_id: 1003,
					subscriber_id: 50,
					organization_id: 50,
					organization_name: 'ООО УралКарго',
					price_with_vat: 35000,
					price_no_vat: priceNoVat(35000),
					place: 1,
				}),
				getBetItemDto({
					id: 5,
					auction_id: 1003,
					subscriber_id: CURRENT_USER_SUBSCRIBER_ID,
					organization_id: CURRENT_USER_ORG_ID,
					organization_name: 'ООО Перевозчик',
					price_with_vat: 38000,
					price_no_vat: priceNoVat(38000),
					place: 2,
				}),
			],
		}),
		createStoredAuction({
			id: 1004,
			orderUid: '44444444-4444-4444-8444-444444444444',
			cargoNum: '00000001004',
			aucType: 'FixPrice',
			status: 'Auction',
			statusMobile: 'NotParticipating',
			canSetBet: true,
			isAvailable: true,
			isBidder: false,
			loadCity: 'Санкт-Петербург',
			loadGcId: 78,
			unloadCity: 'Москва',
			unloadGcId: 100,
			loadDate: '2026-08-02T07:00:00',
			unloadDate: '2026-08-02T22:00:00',
			cargoName: 'Электроника',
			weight: 5,
			volume: 12,
			bodyType: 'фургон',
			currentPrice: 28000,
			startPrice: 28000,
			step: 0,
			min: 28000,
			max: 28000,
			distance: 700,
		}),
		createStoredAuction({
			id: 1005,
			orderUid: '55555555-5555-4555-8555-555555555555',
			cargoNum: '00000001005',
			aucType: 'Request',
			status: 'Planning',
			statusMobile: 'NotParticipating',
			canSetBet: false,
			isAvailable: false,
			isBidder: false,
			loadCity: 'Краснодар',
			loadGcId: 23,
			unloadCity: 'Ростов-на-Дону',
			unloadGcId: 61,
			loadDate: '2026-08-15T09:00:00',
			unloadDate: '2026-08-15T18:00:00',
			cargoName: 'Продукты питания',
			weight: 8,
			volume: 20,
			bodyType: 'рефрижератор',
			currentPrice: 15000,
			startPrice: 15000,
			step: 500,
			min: 10000,
			max: 20000,
			distance: 280,
		}),
		createStoredAuction({
			id: 1006,
			orderUid: '66666666-6666-4666-8666-666666666666',
			cargoNum: '00000001006',
			aucType: 'Down',
			status: 'Finished',
			statusMobile: 'Winner',
			canSetBet: false,
			isAvailable: false,
			isBidder: true,
			yourBet: 22000,
			loadCity: 'Нижний Новгород',
			loadGcId: 52,
			unloadCity: 'Казань',
			unloadGcId: 16,
			loadDate: '2026-07-20T09:00:00',
			unloadDate: '2026-07-21T18:00:00',
			cargoName: 'Мебель',
			weight: 10,
			volume: 45,
			bodyType: 'тентованный',
			currentPrice: 22000,
			startPrice: 30000,
			step: 500,
			min: 15000,
			max: 30000,
			distance: 400,
			bets: [
				getBetItemDto({
					id: 6,
					auction_id: 1006,
					subscriber_id: CURRENT_USER_SUBSCRIBER_ID,
					organization_id: CURRENT_USER_ORG_ID,
					organization_name: 'ООО Перевозчик',
					price_with_vat: 22000,
					price_no_vat: priceNoVat(22000),
					place: 1,
					is_win: true,
				}),
			],
		}),
		createStoredAuction({
			id: 1007,
			orderUid: '77777777-7777-4777-8777-777777777777',
			cargoNum: '00000001007',
			aucType: 'Down',
			status: 'Auction',
			statusMobile: 'NotParticipating',
			canSetBet: true,
			isAvailable: true,
			isBidder: false,
			hideBetsHistory: true,
			hidePoints: true,
			isFavorite: true,
			loadCity: 'Москва',
			loadGcId: 100,
			unloadCity: 'Санкт-Петербург',
			unloadGcId: 78,
			loadDate: '2026-08-08T11:00:00',
			unloadDate: '2026-08-09T17:00:00',
			cargoName: 'Химия (не ADR)',
			weight: 15,
			volume: 35,
			bodyType: 'цистерна',
			currentPrice: 55000,
			startPrice: 60000,
			step: 1000,
			min: 30000,
			max: 60000,
			distance: 700,
			organizerName: 'ХимЛогистика',
			bets: [
				getBetItemDto({
					id: 7,
					auction_id: 1007,
					price_with_vat: 55000,
					price_no_vat: priceNoVat(55000),
					place: 1,
				}),
			],
		}),
		createStoredAuction({
			id: 1008,
			orderUid: '88888888-8888-4888-8888-888888888888',
			cargoNum: '00000001008',
			aucType: 'Down',
			status: 'Canceled',
			statusMobile: 'NotParticipating',
			canSetBet: false,
			isAvailable: false,
			isBidder: false,
			loadCity: 'Самара',
			loadGcId: 63,
			unloadCity: 'Пермь',
			unloadGcId: 59,
			loadDate: '2026-07-25T09:00:00',
			unloadDate: '2026-07-27T18:00:00',
			cargoName: 'Автозапчасти',
			weight: 7,
			volume: 18,
			bodyType: 'фургон',
			currentPrice: 18000,
			startPrice: 20000,
			step: 500,
			min: 10000,
			max: 20000,
			distance: 900,
			bets: [
				getBetItemDto({
					id: 8,
					auction_id: 1008,
					price_with_vat: 18000,
					price_no_vat: priceNoVat(18000),
					is_rejected: true,
					cancel_reason: 'Аукцион отменён организатором',
					place: null,
				}),
			],
		}),
	];
}

export { CURRENT_USER_ORG_ID, CURRENT_USER_SUBSCRIBER_ID, priceNoVat };
