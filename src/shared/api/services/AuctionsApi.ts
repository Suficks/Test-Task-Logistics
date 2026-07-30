import { API_BASE_URL } from '../client';
import type {
	AuctionListRequestDto,
	AuctionListResponseDto,
	AuctionShowResponseDto,
} from '@/entities/auction';
import type { BetListResponseDto, SetBetRequestDto } from '@/entities/bet';

export class ApiRequestError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ApiRequestError';
	}
}

async function parseError(response: Response): Promise<never> {
	let body: unknown;

	try {
		body = await response.json();
	} catch {
		body = undefined;
	}

	const message =
		typeof body === 'object' &&
		body !== null &&
		'message' in body &&
		typeof body.message === 'string'
			? body.message
			: response.statusText || 'Request failed';

	throw new ApiRequestError(message, response.status, body);
}

export class AuctionsApi {
	async listAuctions(
		body: AuctionListRequestDto = {},
	): Promise<AuctionListResponseDto> {
		const response = await fetch(`${API_BASE_URL}/auctions/list`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			await parseError(response);
		}

		return response.json() as Promise<AuctionListResponseDto>;
	}

	async getAuction(body: {
		auctionUuid: string;
	}): Promise<AuctionShowResponseDto> {
		const response = await fetch(
			`${API_BASE_URL}/auctions/${body.auctionUuid}`,
		);

		if (!response.ok) {
			await parseError(response);
		}

		return response.json() as Promise<AuctionShowResponseDto>;
	}

	async listBets(body: {
		auctionUuid: string;
		all?: boolean | null;
	}): Promise<BetListResponseDto> {
		const url = new URL(
			`${API_BASE_URL}/auctions/${body.auctionUuid}/bets`,
			window.location.origin,
		);

		if (body.all != null) {
			url.searchParams.set('all', String(body.all));
		}

		const response = await fetch(url.pathname + url.search);

		if (!response.ok) {
			await parseError(response);
		}

		return response.json() as Promise<BetListResponseDto>;
	}

	async setBet(body: {
		auctionUuid: string;
		setBetRequest: SetBetRequestDto;
	}): Promise<void> {
		const response = await fetch(
			`${API_BASE_URL}/auctions/${body.auctionUuid}/bets`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body.setBetRequest),
			},
		);

		if (!response.ok) {
			await parseError(response);
		}
	}
}
