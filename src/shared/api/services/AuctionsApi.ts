import type {
	AuctionListRequestDto,
	AuctionListResponseDto,
	AuctionShowResponseDto,
} from '@/entities/auction';
import type { BetListResponseDto, SetBetRequestDto } from '@/entities/bet';
import {
	getAuction,
	getAuctionBets,
	getAuctions,
	setBet,
} from '../mocks';

const MOCK_DELAY_MS = 300;

function delay(ms = MOCK_DELAY_MS): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AuctionsApi {
	async listAuctions(
		body: AuctionListRequestDto = {},
	): Promise<AuctionListResponseDto> {
		await delay();
		return getAuctions(body);
	}

	async getAuction(body: {
		auctionUuid: string;
	}): Promise<AuctionShowResponseDto> {
		await delay();
		return getAuction(body);
	}

	async listBets(body: {
		auctionUuid: string;
		all?: boolean | null;
	}): Promise<BetListResponseDto> {
		await delay();
		return getAuctionBets(body);
	}

	async setBet(body: {
		auctionUuid: string;
		setBetRequest: SetBetRequestDto;
	}): Promise<void> {
		await delay();
		setBet(body);
	}
}

export const auctionsApi = new AuctionsApi();
