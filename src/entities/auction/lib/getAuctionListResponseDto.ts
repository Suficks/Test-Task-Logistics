import type { AuctionListItemDto } from './getAuctionListItemDto';
import type { AuctionTypeDto, TradingStatusDto } from '../types';

export type AuctionListMetaDto = {
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
};

/** Фильтры и пагинация списка аукционов */
export type AuctionListRequestDto = {
	page?: number;
	per_page?: number;
	is_oldest?: boolean;
	sort?: Record<string, 'asc' | 'desc'> | null;
	status?: TradingStatusDto[];
	mobile_statuses?: number[];
	statuses?: number[];
	cargo_num?: string;
	weight_from?: number;
	weight_to?: number;
	volume_from?: number;
	volume_to?: number;
	body_types?: string[];
	form_type?: string | null;
	is_international_shipment?: boolean;
	load_city?: string;
	load_gc_id?: number;
	load_range?: number;
	unload_city?: string;
	unload_gc_id?: number;
	unload_range?: number;
	load_date_from?: string;
	load_date_to?: string;
	unload_date_from?: string;
	unload_date_to?: string;
	create_date_from?: string;
	create_date_to?: string;
	start_time_from?: string;
	start_time_to?: string;
	stop_time_from?: string;
	stop_time_to?: string;
	is_available?: boolean;
	is_favorite?: boolean;
	is_bidder?: boolean;
	customer?: string;
	customer_ids?: number[];
	contractor?: string | null;
	auction_ids?: number[];
	replace_external_pads?: boolean | null;
	current_price_from?: number | null;
	current_price_to?: number | null;
	price_per_km_from?: number | null;
	price_per_km_to?: number | null;
	auc_type?: Exclude<AuctionTypeDto, 'Unknown'>[];
};

/** Ответ списка аукционов */
export type AuctionListResponseDto = {
	data: AuctionListItemDto[];
	meta: AuctionListMetaDto;
};
