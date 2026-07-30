import { Card, Descriptions, Typography } from 'antd';

import { BID_MEASUREMENT_LABELS } from '@/entities/auction/lib/labels';
import type { AuctionShowResponseDto } from '@/entities/auction';
import {
	formatDateTime,
	formatFlag,
	formatPrice,
} from '@/shared/lib/format';

import sectionStyles from '../section-card.module.css';

type AuctionTradingCardProps = {
	trading: AuctionShowResponseDto['trading'];
	hideBetsHistory: boolean;
};

export function AuctionTradingCard({
	trading,
	hideBetsHistory,
}: AuctionTradingCardProps) {
	return (
		<Card className={`${sectionStyles.card} ${sectionStyles.fullWidth}`}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Параметры торгов
			</Typography.Title>
			<Descriptions
				className={sectionStyles.descriptions}
				column={{ xs: 1, sm: 2, md: 3 }}
				size="small"
			>
				<Descriptions.Item label="Текущая цена">
					<span className={sectionStyles.priceHighlight}>
						{formatPrice(trading.price.current)}
					</span>
				</Descriptions.Item>
				<Descriptions.Item label="Доступная цена">
					{formatPrice(trading.price.available)}
				</Descriptions.Item>
				<Descriptions.Item label="Стартовая">
					{formatPrice(trading.price.start)}
				</Descriptions.Item>
				<Descriptions.Item label="Min / Max">
					{formatPrice(trading.price.min)} —{' '}
					{formatPrice(trading.price.max)}
				</Descriptions.Item>
				<Descriptions.Item label="Шаг">
					{formatPrice(trading.price.step)}
				</Descriptions.Item>
				<Descriptions.Item label="Цена за км">
					{formatPrice(trading.price.price_per_km)}
				</Descriptions.Item>
				<Descriptions.Item label="Ед. ставки">
					{BID_MEASUREMENT_LABELS[trading.bid_measurement_type]}
				</Descriptions.Item>
				<Descriptions.Item label="Начало / конец">
					{formatDateTime(trading.start_time)} —{' '}
					{formatDateTime(trading.stop_time)}
				</Descriptions.Item>
				<Descriptions.Item label="Можно ставить">
					{formatFlag(trading.can_set_bet)}
				</Descriptions.Item>
				<Descriptions.Item label="Встречные ставки">
					{formatFlag(trading.allow_counter_bets)}
				</Descriptions.Item>
				<Descriptions.Item label="Моя ставка">
					{trading.your.bet
						? formatPrice(trading.your.last_bet_with_vat)
						: 'Нет'}
				</Descriptions.Item>
				<Descriptions.Item label="Последняя без НДС">
					{formatPrice(trading.your.last_bet)}
				</Descriptions.Item>
				<Descriptions.Item label="Победа">
					{formatFlag(trading.your.win)}
				</Descriptions.Item>
				<Descriptions.Item label="Продление после ставки">
					{trading.settings.prolong_after_bet != null
						? `${trading.settings.prolong_after_bet} мин`
						: '—'}
				</Descriptions.Item>
				<Descriptions.Item label="История ставок">
					{hideBetsHistory ? 'Скрыта' : 'Доступна'}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
