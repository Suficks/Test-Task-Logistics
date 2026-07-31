import { z } from 'zod';

import type { AuctionListRequestDto } from '@/entities/auction';

const tradingStatusSchema = z.enum([
	'NotParticipating',
	'Leading',
	'Losing',
	'OnPending',
	'Confirmed',
	'ChoosingWinner',
	'Winner',
	'Accepted',
	'Unknown',
]);

const auctionTypeSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice']);

const optionalString = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	return String(value);
}, z.string().optional());

const optionalBoolean = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	if (value === true || value === 'true' || value === '1') {
		return true;
	}
	if (value === false || value === 'false' || value === '0') {
		return false;
	}
	return undefined;
}, z.boolean().optional());

const optionalNumber = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
}, z.number().optional());

const csvTradingStatuses = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	const items = Array.isArray(value)
		? value.map(String)
		: String(value)
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean);
	return items;
}, z.array(tradingStatusSchema).optional());

const csvAuctionTypes = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	const items = Array.isArray(value)
		? value.map(String)
		: String(value)
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean);
	return items;
}, z.array(auctionTypeSchema).optional());

const csvNumbers = z.preprocess((value) => {
	if (value == null || value === '') {
		return undefined;
	}
	const items = Array.isArray(value)
		? value.map(String)
		: String(value)
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean);
	const numbers = items
		.map(Number)
		.filter((item) => Number.isFinite(item));
	return numbers.length > 0 ? numbers : undefined;
}, z.array(z.number()).optional());

export const auctionsSearchSchema = z.object({
	page: z.preprocess((value) => {
		const number = Number(value ?? 1);
		return Number.isFinite(number) && number > 0 ? Math.floor(number) : 1;
	}, z.number().int().positive()),
	per_page: z.preprocess((value) => {
		const number = Number(value ?? 5);
		if (!Number.isFinite(number) || number <= 0) {
			return 5;
		}
		return Math.min(Math.floor(number), 100);
	}, z.number().int().positive().max(100)),
	cargo_num: optionalString,
	status: csvTradingStatuses,
	statuses: csvNumbers,
	auc_type: csvAuctionTypes,
	load_city: optionalString,
	unload_city: optionalString,
	load_date_from: optionalString,
	load_date_to: optionalString,
	is_available: optionalBoolean,
	is_bidder: optionalBoolean,
	current_price_from: optionalNumber,
	current_price_to: optionalNumber,
});

export type AuctionsSearchParams = z.infer<typeof auctionsSearchSchema>;

export const DEFAULT_AUCTIONS_SEARCH: AuctionsSearchParams = {
	page: 1,
	per_page: 5,
};

export function parseAuctionsSearch(search: unknown): AuctionsSearchParams {
	const result = auctionsSearchSchema.safeParse(search);
	if (result.success) {
		return result.data;
	}
	return auctionsSearchSchema.parse({});
}

export function toAuctionListRequest(
	search: AuctionsSearchParams,
): AuctionListRequestDto {
	return {
		page: search.page,
		per_page: search.per_page,
		cargo_num: search.cargo_num,
		status: search.status,
		statuses: search.statuses,
		auc_type: search.auc_type,
		load_city: search.load_city,
		unload_city: search.unload_city,
		load_date_from: search.load_date_from,
		load_date_to: search.load_date_to,
		is_available: search.is_available,
		is_bidder: search.is_bidder,
		current_price_from: search.current_price_from,
		current_price_to: search.current_price_to,
	};
}

export function cleanAuctionsSearch(
	params: Partial<AuctionsSearchParams>,
): AuctionsSearchParams {
	return parseAuctionsSearch({
		...DEFAULT_AUCTIONS_SEARCH,
		...params,
	});
}
