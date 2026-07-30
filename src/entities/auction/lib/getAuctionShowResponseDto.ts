import type {
	AuctionStatusDto,
	AuctionTypeDto,
	BidMeasurementTypeDto,
	OperationTypeDto,
	PaymentDelayTypeDto,
	TradingStatusDto,
} from '../types';

export type AuctionShowMainDto = {
	id: number;
	cargo_num: string;
	cargo_date: string;
	order_uid: string;
	auc_type: AuctionTypeDto;
	created_at: string;
};

export type AuctionShowOrganizerDto = {
	subscriber_id: number;
	subscriber_code: string;
	infobase_code: string;
	organization_name: string;
	organization_inn: string;
	organization_kpp: string;
	organization_id: number;
};

export type ContactDto = {
	name: string | null;
	phone: string | null;
	work_phone: string | null;
	uid: string | null;
	email: string | null;
};

export type LoadingTypesDto = {
	side: boolean;
	top: boolean;
	rear: boolean;
	full: boolean;
};

export type DocsDto = {
	tir: boolean;
	cmr: boolean;
	t1: boolean;
	med: boolean;
};

export type CarRequirementsDto = {
	type: string;
	weight: number | null;
	volume: number | null;
	width: number | null;
	length: number | null;
	height: number | null;
};

export type AuctionShowCargoDto = {
	price: string;
	currency: number | null;
	is_international: boolean;
	distance: number | null;
	truck_count: number;
	body_type: string;
	temp_from: number | null;
	temp_to: number | null;
	conics: number | null;
	belts: number | null;
	adr: number | null;
	coupling: boolean | null;
	air_pass: boolean | null;
	low_loader: boolean | null;
	additional_load: boolean | null;
	containered: boolean;
	container_type: string | null;
	container_size: string | null;
	loading_types: LoadingTypesDto;
	docs: DocsDto;
	car: CarRequirementsDto | null;
};

export type AuctionShowTradingPriceDto = {
	start: number | null;
	start_no_vat: number | null;
	current: number | null;
	current_no_vat: number | null;
	available: number | null;
	available_no_vat: number | null;
	min: number | null;
	min_no_vat: number | null;
	max: number | null;
	max_no_vat: number | null;
	step: number | null;
	step_no_vat: number | null;
	price_per_km: number;
};

export type AuctionShowTradingYourDto = {
	bet: boolean;
	last_bet: number | null;
	last_bet_with_vat: number | null;
	win: boolean;
};

export type AuctionShowTradingSettingsDto = {
	prolong_after_bet: number | null;
	winner_confirm: number | null;
	winner_counter_mode: number | null;
	transmission_time_in: number | null;
	coefficient: number | null;
};

export type AuctionShowTradingDto = {
	status: AuctionStatusDto;
	status_mobile: TradingStatusDto;
	start_time: string;
	stop_time: string;
	bid_measurement_type: BidMeasurementTypeDto;
	can_set_bet: boolean;
	allow_counter_bets: boolean;
	hide_bets_history: boolean;
	hide_places: boolean;
	no_view_cargo_price: boolean;
	hide_points_address_and_contacts: boolean;
	is_bidder: boolean;
	is_favorite: boolean;
	is_last_bet_with_vat: boolean | null;
	red_bet_with_vat: boolean;
	red_bet_no_vat: boolean;
	send_deal_before_load: boolean;
	chat_id: string | null;
	price: AuctionShowTradingPriceDto;
	your: AuctionShowTradingYourDto;
	settings: AuctionShowTradingSettingsDto;
};

export type AuctionShowPaymentDto = {
	condition: string | null;
	condition_predefined: string | null;
	form: string;
	delay: number | null;
	delay_type: PaymentDelayTypeDto | null;
	currency_code: string;
	prepay: string | null;
};

export type AssemblyDto = {
	num: string | null;
	date: string | null;
};

export type RoutePointLocationDto = {
	city_name: string;
	city_full_name: string;
	city_gc_id: number;
	loading_address: string;
	lon: number;
	lat: number;
};

export type RoutePointCargoDto = {
	name: string;
	package_name: string;
	weight: string;
	volume: string;
	length: string;
	width: string;
	height: string;
	oversized: boolean;
	package_amount: number | null;
};

export type RoutePointContactDto = {
	name: string;
	phone: string;
};

export type RoutePointDto = {
	row_num: number;
	op_type: OperationTypeDto;
	start_date: string;
	end_date: string;
	comment: string | null;
	contractor: string;
	contractor_inn: string;
	location: RoutePointLocationDto;
	cargo: RoutePointCargoDto;
	contact: RoutePointContactDto;
};

export type AdmittedOrganizationDto = {
	id: number;
	inn: string;
	is_main: boolean;
	name: string;
	full_name: string;
	site: string | null;
	subscriber_id: number;
	subscriber_code: string;
	subscriber_role: string | null;
	infobase_code: string;
	infobase_address: string | null;
	nalog_key: string | null;
	hide_me: boolean;
	current_vat_rate: string | null;
};

/** Детальные данные аукциона */
export type AuctionShowResponseDto = {
	main: AuctionShowMainDto;
	organizer: AuctionShowOrganizerDto;
	contacts: ContactDto[];
	cargo: AuctionShowCargoDto;
	trading: AuctionShowTradingDto;
	payment: AuctionShowPaymentDto;
	assembly: AssemblyDto;
	routes: RoutePointDto[];
	admitted_organizations: AdmittedOrganizationDto[];
	hide_bets_history: boolean;
};

export function getContactDto({
	name = 'Иванов Иван Иванович',
	phone = '+79001234567',
	work_phone = null,
	uid = '550e8400-e29b-41d4-a716-446655440000',
	email = 'ivanov@example.com',
}: Partial<ContactDto> = {}): ContactDto {
	return { name, phone, work_phone, uid, email };
}

export function getRoutePointDto({
	row_num = 1,
	op_type = 'Loading',
	start_date = '2026-05-26T09:00:00',
	end_date = '2026-05-26T18:00:00',
	comment = null,
	contractor = '',
	contractor_inn = '',
	location,
	cargo,
	contact,
}: Partial<
	Omit<RoutePointDto, 'location' | 'cargo' | 'contact'> & {
		location?: Partial<RoutePointLocationDto>;
		cargo?: Partial<RoutePointCargoDto>;
		contact?: Partial<RoutePointContactDto>;
	}
> = {}): RoutePointDto {
	return {
		row_num,
		op_type,
		start_date,
		end_date,
		comment,
		contractor,
		contractor_inn,
		location: {
			city_name: 'Пермь',
			city_full_name: 'Пермь, Россия',
			city_gc_id: 59,
			loading_address: 'Транспортная 9',
			lon: 56.238,
			lat: 58.01,
			...location,
		},
		cargo: {
			name: 'Мороженое',
			package_name: '',
			weight: '1.000',
			volume: '1.000',
			length: '0',
			width: '0',
			height: '0',
			oversized: false,
			package_amount: null,
			...cargo,
		},
		contact: {
			name: '',
			phone: '',
			...contact,
		},
	};
}

type AuctionShowResponseDtoPartial = {
	main?: Partial<AuctionShowMainDto>;
	organizer?: Partial<AuctionShowOrganizerDto>;
	contacts?: ContactDto[];
	cargo?: Partial<Omit<AuctionShowCargoDto, 'loading_types' | 'docs' | 'car'>> & {
		loading_types?: Partial<LoadingTypesDto>;
		docs?: Partial<DocsDto>;
		car?: Partial<CarRequirementsDto> | null;
	};
	trading?: Partial<Omit<AuctionShowTradingDto, 'price' | 'your' | 'settings'>> & {
		price?: Partial<AuctionShowTradingPriceDto>;
		your?: Partial<AuctionShowTradingYourDto>;
		settings?: Partial<AuctionShowTradingSettingsDto>;
	};
	payment?: Partial<AuctionShowPaymentDto>;
	assembly?: Partial<AssemblyDto>;
	routes?: RoutePointDto[];
	admitted_organizations?: AdmittedOrganizationDto[];
	hide_bets_history?: boolean;
};

export function getAuctionShowResponseDto({
	main,
	organizer,
	contacts,
	cargo,
	trading,
	payment,
	assembly,
	routes,
	admitted_organizations,
	hide_bets_history = false,
}: AuctionShowResponseDtoPartial = {}): AuctionShowResponseDto {
	const { loading_types, docs, car, ...cargoRest } = cargo ?? {};
	const { price, your, settings, ...tradingRest } = trading ?? {};

	return {
		main: {
			id: 1236,
			cargo_num: '00000001059',
			cargo_date: '2026-05-04T14:49:09',
			order_uid: '3a05d045-0e67-4f85-b20a-de81d18bba7a',
			auc_type: 'Down',
			created_at: '2026-05-25T11:48:20',
			...main,
		},
		organizer: {
			subscriber_id: 98,
			subscriber_code: '12345',
			infobase_code: 'RU_Cargo_01',
			organization_name: 'ЛИМ',
			organization_inn: '7703769184',
			organization_kpp: '770301001',
			organization_id: 340,
			...organizer,
		},
		contacts: contacts ?? [getContactDto()],
		cargo: {
			price: '0',
			currency: 643,
			is_international: false,
			distance: 1500,
			truck_count: 1,
			body_type: 'тентованный',
			temp_from: null,
			temp_to: null,
			conics: null,
			belts: null,
			adr: null,
			coupling: null,
			air_pass: null,
			low_loader: null,
			additional_load: null,
			containered: false,
			container_type: null,
			container_size: null,
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
			start_time: '2026-05-25T16:03:00',
			stop_time: '2026-05-25T16:18:00',
			bid_measurement_type: 'PerRoute',
			can_set_bet: true,
			allow_counter_bets: true,
			hide_bets_history: false,
			hide_places: false,
			no_view_cargo_price: false,
			hide_points_address_and_contacts: false,
			is_bidder: false,
			is_favorite: false,
			is_last_bet_with_vat: null,
			red_bet_with_vat: false,
			red_bet_no_vat: false,
			send_deal_before_load: false,
			chat_id: null,
			price: {
				start: 30000,
				start_no_vat: 25000,
				current: 30000,
				current_no_vat: 25000,
				available: 29000,
				available_no_vat: 24166,
				min: 20000,
				min_no_vat: 16666.67,
				max: 30000,
				max_no_vat: 25000,
				step: 500,
				step_no_vat: 416.67,
				price_per_km: 16.39,
				...price,
			},
			your: {
				bet: false,
				last_bet: null,
				last_bet_with_vat: null,
				win: false,
				...your,
			},
			settings: {
				prolong_after_bet: 10,
				winner_confirm: 1,
				winner_counter_mode: null,
				transmission_time_in: 24,
				coefficient: 10,
				...settings,
			},
			...tradingRest,
		},
		payment: {
			condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
			condition_predefined: 'ПоОригиналамНаладных',
			form: 'Безналичная с НДС',
			delay: 30,
			delay_type: 'CalendarDays',
			currency_code: '643',
			prepay: '0',
			...payment,
		},
		assembly: {
			num: null,
			date: null,
			...assembly,
		},
		routes: routes ?? [
			getRoutePointDto({ row_num: 1, op_type: 'Loading' }),
			getRoutePointDto({
				row_num: 2,
				op_type: 'Unloading',
				start_date: '2026-05-28T09:00:00',
				end_date: '2026-05-28T18:00:00',
				location: {
					city_name: 'Москва',
					city_full_name: 'Москва, Россия',
					city_gc_id: 100,
					loading_address: 'Ленина 1',
					lon: 37.617,
					lat: 55.756,
				},
			}),
		],
		admitted_organizations: admitted_organizations ?? [
			{
				id: 14,
				inn: '9616244307',
				is_main: true,
				name: 'ООО Перевозчик',
				full_name: 'Общество с ограниченной ответственностью Перевозчик',
				site: null,
				subscriber_id: 13,
				subscriber_code: '54321',
				subscriber_role: null,
				infobase_code: 'RU_Cargo_01',
				infobase_address: null,
				nalog_key: null,
				hide_me: false,
				current_vat_rate: '20',
			},
		],
		hide_bets_history,
	};
}
