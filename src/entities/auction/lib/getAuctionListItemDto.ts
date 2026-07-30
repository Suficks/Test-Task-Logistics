import type {
	AuctionListTradingStatusDto,
	AuctionStatusDto,
	AuctionTypeDto,
	BidMeasurementTypeDto,
} from '../types';

export type AuctionListItemMainDto = {
	/** ID аукциона */
	id: number;
	/** Номер заявки */
	cargo_num: string;
	/** Дата заявки */
	cargo_date: string;
	/** Тип аукциона */
	auc_type: AuctionTypeDto;
	/** UUID заявки / аукциона */
	order_uid: string;
	/** Дата создания */
	created_at: string;
	/** Приоритет сортировки */
	priority_sort: number;
	/** Сборка */
	is_assembly: boolean;
	/** Цена за км */
	price_per_km: number | null;
};

export type AuctionListItemOrganizerDto = {
	subscriber_id: number;
	organization_id: number;
	organization_name: string;
	organization_inn: string;
	organization_kpp: string;
	is_hide_organization: boolean;
};

export type AuctionListItemRoutePointDto = {
	city: string;
	address: string;
	date: string;
	city_gc_id: number;
	points_count: number;
};

export type AuctionListItemRouteDto = {
	load: AuctionListItemRoutePointDto;
	unload: AuctionListItemRoutePointDto;
};

export type AuctionListItemCargoLoadingTypeDto = {
	side: boolean;
	top: boolean;
	rear: boolean;
	full: boolean;
};

export type AuctionListItemCargoDocsDto = {
	tir: boolean;
	cmr: boolean;
	t1: boolean;
	med: boolean;
};

export type AuctionListItemCargoCarDto = {
	type: string;
	weight: number;
	volume: number;
	width: number;
	length: number;
	height: number;
};

export type AuctionListItemCargoDto = {
	name: string;
	weight: number;
	volume: number;
	body_type: string;
	truck_count: number;
	is_cargo: boolean;
	is_international?: boolean | null;
	containered?: boolean | null;
	incoterms?: string | null;
	conics?: number | null;
	belts?: number | null;
	adr?: number | null;
	coupling?: boolean | null;
	air_pass?: boolean | null;
	low_loader?: boolean | null;
	additional_load?: boolean | null;
	temp_from?: number | null;
	temp_to?: number | null;
	loading_types: AuctionListItemCargoLoadingTypeDto;
	docs: AuctionListItemCargoDocsDto;
	car: AuctionListItemCargoCarDto | null;
};

export type AuctionListItemTradingPriceDto = {
	start: number;
	current: number;
	current_no_vat: number;
};

export type AuctionListItemTradingYourDto = {
	/** Есть ли ставка от текущего пользователя */
	bet: boolean;
	/** Последняя ставка пользователя */
	last_bet: number | null;
};

export type AuctionListItemTradingDto = {
	status: AuctionStatusDto;
	status_mobile: AuctionListTradingStatusDto;
	start_time: string;
	stop_time: string;
	bid_measurement_type: BidMeasurementTypeDto | null;
	can_set_bet: boolean;
	allow_counter_bets: boolean;
	hide_points_address_and_contacts: boolean;
	direction?: string | null;
	comment?: string | null;
	is_bidder: boolean;
	is_available: boolean;
	is_accredited: boolean;
	is_favorite: boolean;
	price: AuctionListItemTradingPriceDto | null;
	your: AuctionListItemTradingYourDto | null;
	red_bet_with_vat: boolean;
	red_bet_no_vat: boolean;
	is_last_bet_with_vat?: boolean;
};

export type AuctionListItemPaymentDto = {
	form: string;
	currency_code: string;
	consignor?: string | null;
	consignee?: string | null;
};

/** Элемент списка аукционов */
export type AuctionListItemDto = {
	main: AuctionListItemMainDto;
	organizer: AuctionListItemOrganizerDto;
	route: AuctionListItemRouteDto;
	cargo: AuctionListItemCargoDto;
	trading: AuctionListItemTradingDto;
	payment: AuctionListItemPaymentDto;
};

type AuctionListItemDtoPartial = {
	main?: Partial<AuctionListItemMainDto>;
	organizer?: Partial<AuctionListItemOrganizerDto>;
	route?: {
		load?: Partial<AuctionListItemRoutePointDto>;
		unload?: Partial<AuctionListItemRoutePointDto>;
	};
	cargo?: Partial<Omit<AuctionListItemCargoDto, 'loading_types' | 'docs' | 'car'>> & {
		loading_types?: Partial<AuctionListItemCargoLoadingTypeDto>;
		docs?: Partial<AuctionListItemCargoDocsDto>;
		car?: Partial<AuctionListItemCargoCarDto> | null;
	};
	trading?: Partial<Omit<AuctionListItemTradingDto, 'price' | 'your'>> & {
		price?: Partial<AuctionListItemTradingPriceDto> | null;
		your?: Partial<AuctionListItemTradingYourDto> | null;
	};
	payment?: Partial<AuctionListItemPaymentDto>;
};

export function getAuctionListItemDto({
	main,
	organizer,
	route,
	cargo,
	trading,
	payment,
}: AuctionListItemDtoPartial = {}): AuctionListItemDto {
	const { loading_types, docs, car, ...cargoRest } = cargo ?? {};
	const { price, your, ...tradingRest } = trading ?? {};

	return {
		main: {
			id: 10,
			cargo_num: '00000001059',
			cargo_date: '2026-05-04T14:49:09',
			auc_type: 'Down',
			order_uid: 'a0',
			created_at: '2026-05-25T11:48:20',
			priority_sort: 0,
			is_assembly: false,
			price_per_km: 199,
			...main,
		},
		organizer: {
			subscriber_id: 98,
			organization_id: 340,
			organization_name: 'ЛИМ',
			organization_inn: '7703769184',
			organization_kpp: '770301001',
			is_hide_organization: false,
			...organizer,
		},
		route: {
			load: {
				city: 'Пермь',
				address: 'Транспортная 9',
				date: '2026-05-26T09:00:00',
				city_gc_id: 59,
				points_count: 1,
				...route?.load,
			},
			unload: {
				city: 'Москва',
				address: 'Ленина 1',
				date: '2026-05-28T18:00:00',
				city_gc_id: 100,
				points_count: 1,
				...route?.unload,
			},
		},
		cargo: {
			name: 'Мороженое',
			weight: 1,
			volume: 1,
			body_type: 'тентованный',
			truck_count: 1,
			is_cargo: true,
			is_international: false,
			containered: false,
			loading_types: {
				side: false,
				top: false,
				rear: true,
				full: false,
				...loading_types,
			},
			docs: {
				tir: false,
				cmr: false,
				t1: false,
				med: false,
				...docs,
			},
			car:
				car === null
					? null
					: {
							type: 'Тягач',
							weight: 20,
							volume: 82,
							width: 2.4,
							length: 13.6,
							height: 2.7,
							...car,
						},
			...cargoRest,
		},
		trading: {
			status: 'Auction',
			status_mobile: 'NotParticipating',
			start_time: '2026-05-26T09:00:00',
			stop_time: '2026-05-26T18:00:00',
			bid_measurement_type: 'PerRoute',
			can_set_bet: true,
			allow_counter_bets: true,
			hide_points_address_and_contacts: false,
			is_bidder: false,
			is_available: true,
			is_accredited: true,
			is_favorite: false,
			price:
				price === null
					? null
					: {
							start: 30000,
							current: 30000,
							current_no_vat: 25000,
							...price,
						},
			your:
				your === null
					? null
					: {
							bet: false,
							last_bet: null,
							...your,
						},
			red_bet_with_vat: false,
			red_bet_no_vat: false,
			...tradingRest,
		},
		payment: {
			form: 'Безналичная с НДС',
			currency_code: '643',
			...payment,
		},
	};
}
