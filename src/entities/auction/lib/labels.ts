import type {
	AuctionListTradingStatusDto,
	AuctionStatusDto,
	AuctionTypeDto,
	BidMeasurementTypeDto,
	OperationTypeDto,
	PaymentDelayTypeDto,
	TradingStatusDto,
} from '../types';

export const AUCTION_TYPE_LABELS: Record<AuctionTypeDto, string> = {
	Request: 'Заявочный',
	Up: 'На повышение',
	Down: 'На понижение',
	FixPrice: 'Фикс. цена',
	Unknown: 'Неизвестно',
};

export const AUCTION_STATUS_LABELS: Record<AuctionStatusDto, string> = {
	Planning: 'Планирование',
	Auction: 'Идут торги',
	DeterminateWinner: 'Определение победителя',
	WaitDeal: 'Ожидание сделки',
	InProgress: 'В работе',
	Finished: 'Завершён',
	Stopped: 'Остановлен',
	Canceled: 'Отменён',
	Unknown: 'Неизвестно',
};

export const TRADING_STATUS_LABELS: Record<TradingStatusDto, string> = {
	NotParticipating: 'Не участвую',
	Leading: 'Лидирую',
	Losing: 'Перебит',
	OnPending: 'На рассмотрении',
	Confirmed: 'Подтверждён',
	ChoosingWinner: 'Выбор победителя',
	Winner: 'Победитель',
	Accepted: 'Принято',
	Unknown: 'Неизвестно',
};

export const BID_MEASUREMENT_LABELS: Record<BidMeasurementTypeDto, string> = {
	PerRoute: 'За рейс',
	PerKm: 'За км',
	Unknown: 'Неизвестно',
};

export const OPERATION_TYPE_LABELS: Record<OperationTypeDto, string> = {
	Loading: 'Погрузка',
	Unloading: 'Выгрузка',
	Unknown: 'Неизвестно',
};

export const PAYMENT_DELAY_LABELS: Record<PaymentDelayTypeDto, string> = {
	CalendarDays: 'Календарные дни',
	WorkDays: 'Рабочие дни',
	Unknown: 'Неизвестно',
};

export const AUCTION_STATUS_CODE_OPTIONS: Array<{
	value: number;
	label: string;
}> = [
	{ value: 1, label: AUCTION_STATUS_LABELS.Planning },
	{ value: 2, label: AUCTION_STATUS_LABELS.Auction },
	{ value: 3, label: AUCTION_STATUS_LABELS.DeterminateWinner },
	{ value: 4, label: AUCTION_STATUS_LABELS.WaitDeal },
	{ value: 5, label: AUCTION_STATUS_LABELS.InProgress },
	{ value: 6, label: AUCTION_STATUS_LABELS.Finished },
	{ value: 7, label: AUCTION_STATUS_LABELS.Stopped },
	{ value: 8, label: AUCTION_STATUS_LABELS.Canceled },
];

export const TRADING_STATUS_OPTIONS = (
	[
		'NotParticipating',
		'Leading',
		'Losing',
		'Winner',
		'Confirmed',
		'Unknown',
	] as AuctionListTradingStatusDto[]
).map((value) => ({
	value,
	label: TRADING_STATUS_LABELS[value],
}));

export const AUCTION_TYPE_OPTIONS = (
	['Request', 'Up', 'Down', 'FixPrice'] as const
).map((value) => ({
	value,
	label: AUCTION_TYPE_LABELS[value],
}));
