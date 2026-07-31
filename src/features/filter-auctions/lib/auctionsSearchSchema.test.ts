import { describe, expect, it } from 'vitest';

import {
	DEFAULT_AUCTIONS_SEARCH,
	cleanAuctionsSearch,
	parseAuctionsSearch,
	toAuctionListRequest,
} from './auctionsSearchSchema';

describe('parseAuctionsSearch', () => {
	it('returns defaults for empty search', () => {
		expect(parseAuctionsSearch({})).toEqual(DEFAULT_AUCTIONS_SEARCH);
	});

	it('parses csv arrays and booleans from string search params', () => {
		expect(
			parseAuctionsSearch({
				page: '2',
				per_page: '10',
				cargo_num: '00000001001',
				status: 'Leading,Losing',
				statuses: '1,2,3',
				auc_type: 'Down,Up',
				is_available: 'true',
				is_bidder: '0',
				current_price_from: '1000',
				current_price_to: '5000',
			}),
		).toEqual({
			page: 2,
			per_page: 10,
			cargo_num: '00000001001',
			status: ['Leading', 'Losing'],
			statuses: [1, 2, 3],
			auc_type: ['Down', 'Up'],
			is_available: true,
			is_bidder: false,
			current_price_from: 1000,
			current_price_to: 5000,
		});
	});

	it('falls back to defaults when search contains invalid enum values', () => {
		expect(
			parseAuctionsSearch({
				page: '2',
				per_page: '10',
				status: 'NotAStatus',
			}),
		).toEqual(DEFAULT_AUCTIONS_SEARCH);
	});

	it('clamps page and per_page with safe fallbacks', () => {
		expect(
			parseAuctionsSearch({
				page: '-1',
				per_page: '999',
				current_price_from: 'abc',
			}),
		).toEqual({
			...DEFAULT_AUCTIONS_SEARCH,
			page: 1,
			per_page: 100,
		});
	});
});

describe('toAuctionListRequest', () => {
	it('builds API request from search params', () => {
		const search = parseAuctionsSearch({
			page: '3',
			per_page: '20',
			load_city: 'Москва',
			unload_city: 'Казань',
			load_date_from: '2026-08-01',
			is_available: 'true',
		});

		expect(toAuctionListRequest(search)).toEqual({
			page: 3,
			per_page: 20,
			cargo_num: undefined,
			status: undefined,
			statuses: undefined,
			auc_type: undefined,
			load_city: 'Москва',
			unload_city: 'Казань',
			load_date_from: '2026-08-01',
			load_date_to: undefined,
			is_available: true,
			is_bidder: undefined,
			current_price_from: undefined,
			current_price_to: undefined,
		});
	});
});

describe('cleanAuctionsSearch', () => {
	it('merges partial params with defaults', () => {
		expect(cleanAuctionsSearch({ page: 4, cargo_num: '42' })).toEqual({
			...DEFAULT_AUCTIONS_SEARCH,
			page: 4,
			cargo_num: '42',
		});
	});
});
