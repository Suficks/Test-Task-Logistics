/** Тип аукциона */
export type AuctionTypeDto = 'Request' | 'Up' | 'Down' | 'FixPrice' | 'Unknown';

/** Статус аукциона */
export type AuctionStatusDto =
	| 'Planning'
	| 'Auction'
	| 'DeterminateWinner'
	| 'WaitDeal'
	| 'InProgress'
	| 'Finished'
	| 'Stopped'
	| 'Canceled'
	| 'Unknown';

/** Торговый статус пользователя (деталка / фильтры) */
export type TradingStatusDto =
	| 'NotParticipating'
	| 'Leading'
	| 'Losing'
	| 'OnPending'
	| 'Confirmed'
	| 'ChoosingWinner'
	| 'Winner'
	| 'Accepted'
	| 'Unknown';

/** Торговый статус пользователя в списке */
export type AuctionListTradingStatusDto =
	| 'NotParticipating'
	| 'Leading'
	| 'Losing'
	| 'Winner'
	| 'Confirmed'
	| 'Unknown';

/** Единица измерения ставки */
export type BidMeasurementTypeDto = 'PerRoute' | 'PerKm' | 'Unknown';

/** Тип операции маршрутной точки */
export type OperationTypeDto = 'Loading' | 'Unloading' | 'Unknown';

/** Тип отсрочки платежа */
export type PaymentDelayTypeDto = 'CalendarDays' | 'WorkDays' | 'Unknown';
