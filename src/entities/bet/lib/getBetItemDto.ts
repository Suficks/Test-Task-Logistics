/** Ставка аукциона */
export type BetItemPriceInfoDto = {
	price_with_vat: number | null;
	price_no_vat: number | null;
	payment_type: string | null;
	vat_rate: string | null;
};

export type BetItemDto = {
	/** ID ставки */
	id: number;
	/** Дата и время создания ставки */
	created_at: string;
	/** ID аукциона */
	auction_id: number;
	/** ID подписчика (перевозчика) */
	subscriber_id: number;
	/** Имя контактного лица */
	contact_name: string;
	/** Телефон контактного лица */
	contact_phone: string;
	/** Цена ставки с НДС */
	price_with_vat: number;
	/** Цена ставки без НДС */
	price_no_vat: number;
	/** ID организации перевозчика */
	organization_id: number;
	/** ИНН организации перевозчика */
	organization_inn: string;
	/** Название организации перевозчика */
	organization_name: string;
	transporter_comment: string | null;
	/** Ставка отклонена */
	is_rejected: boolean;
	/** Ставка является встречной */
	is_counter: boolean;
	/** Место в рейтинге ставок */
	place: number | null;
	/** Ставка является победившей */
	is_win: boolean;
	/** Номер рейса */
	run_number: number;
	/** Причина отмены ставки */
	cancel_reason: string;
	price_info: BetItemPriceInfoDto;
};

export type BetListResponseDto = {
	bets: BetItemDto[];
};

/** Запрос на установку ставки */
export type SetBetRequestDto = {
	/** Цена ставки (> 0) */
	price: number;
};

export function getBetItemDto({
	id = 42,
	created_at = '2026-05-25T16:05:00',
	auction_id = 1236,
	subscriber_id = 13,
	contact_name = 'Иванов Иван',
	contact_phone = '+79001234567',
	price_with_vat = 30000,
	price_no_vat = 24590.16,
	organization_id = 14,
	organization_inn = '9616244307',
	organization_name = 'ООО Перевозчик',
	transporter_comment = null,
	is_rejected = false,
	is_counter = false,
	place = 1,
	is_win = false,
	run_number = 0,
	cancel_reason = '',
	price_info,
}: Partial<
	Omit<BetItemDto, 'price_info'> & {
		price_info?: Partial<BetItemPriceInfoDto>;
	}
> = {}): BetItemDto {
	return {
		id,
		created_at,
		auction_id,
		subscriber_id,
		contact_name,
		contact_phone,
		price_with_vat,
		price_no_vat,
		organization_id,
		organization_inn,
		organization_name,
		transporter_comment,
		is_rejected,
		is_counter,
		place,
		is_win,
		run_number,
		cancel_reason,
		price_info: {
			price_with_vat,
			price_no_vat,
			payment_type: 'Безналичная с НДС',
			vat_rate: '20',
			...price_info,
		},
	};
}
