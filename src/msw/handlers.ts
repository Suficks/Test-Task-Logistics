import { delay, http, HttpResponse } from 'msw';

import type { AuctionListRequestDto } from '@/entities/auction';
import type { SetBetRequestDto } from '@/entities/bet';
import { API_BASE_URL } from '@/shared/api/client';
import {
	getAuction,
	getAuctionBets,
	getAuctions,
	MockError,
	setBet,
} from '@/shared/api/mocks';

const MOCK_DELAY_MS = 300;

function problemResponse(error: MockError) {
	return HttpResponse.json(
		error.body ?? {
			code: 'resource_not_found',
			title: error.message,
			message: error.message,
			trace_id: null,
		},
		{
			status: error.status,
			headers: {
				'Content-Type': 'application/problem+json',
			},
		},
	);
}

export const listAuctionsHandler = http.post(
	`${API_BASE_URL}/auctions/list`,
	async ({ request }) => {
		const body = (await request.json().catch(() => ({}))) as AuctionListRequestDto;
		await delay(MOCK_DELAY_MS);

		return HttpResponse.json(getAuctions(body ?? {}), { status: 200 });
	},
);

export const getAuctionHandler = http.get(
	`${API_BASE_URL}/auctions/:auctionUuid`,
	async ({ params }) => {
		const auctionUuid = String(params.auctionUuid);
		await delay(MOCK_DELAY_MS);

		try {
			return HttpResponse.json(getAuction({ auctionUuid }), { status: 200 });
		} catch (error) {
			if (error instanceof MockError) {
				return problemResponse(error);
			}
			throw error;
		}
	},
);

export const listBetsHandler = http.get(
	`${API_BASE_URL}/auctions/:auctionUuid/bets`,
	async ({ params, request }) => {
		const auctionUuid = String(params.auctionUuid);
		const url = new URL(request.url);
		const allParam = url.searchParams.get('all');
		const all =
			allParam == null ? undefined : allParam === 'true' || allParam === '1';

		await delay(MOCK_DELAY_MS);

		try {
			return HttpResponse.json(getAuctionBets({ auctionUuid, all }), {
				status: 200,
			});
		} catch (error) {
			if (error instanceof MockError) {
				return problemResponse(error);
			}
			throw error;
		}
	},
);

export const setBetHandler = http.post(
	`${API_BASE_URL}/auctions/:auctionUuid/bets`,
	async ({ params, request }) => {
		const auctionUuid = String(params.auctionUuid);
		const body = (await request.json()) as SetBetRequestDto;

		await delay(MOCK_DELAY_MS);

		try {
			setBet({ auctionUuid, setBetRequest: body });
			return new HttpResponse(null, { status: 200 });
		} catch (error) {
			if (error instanceof MockError) {
				return problemResponse(error);
			}
			throw error;
		}
	},
);

export const handlers = [
	listAuctionsHandler,
	getAuctionHandler,
	listBetsHandler,
	setBetHandler,
];
