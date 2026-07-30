import { Card, Descriptions, Typography } from 'antd';

import { PAYMENT_DELAY_LABELS } from '@/entities/auction/lib/labels';
import type { AuctionShowResponseDto } from '@/entities/auction';

import sectionStyles from '../section-card.module.css';

type AuctionPaymentCardProps = {
	payment: AuctionShowResponseDto['payment'];
};

export function AuctionPaymentCard({ payment }: AuctionPaymentCardProps) {
	return (
		<Card className={sectionStyles.card}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Оплата
			</Typography.Title>
			<Descriptions column={1} size="small">
				<Descriptions.Item label="Форма">{payment.form}</Descriptions.Item>
				<Descriptions.Item label="Условие">
					{payment.condition || '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Отсрочка">
					{payment.delay != null
						? `${payment.delay} (${
								payment.delay_type
									? PAYMENT_DELAY_LABELS[payment.delay_type]
									: '—'
							})`
						: '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Валюта">
					{payment.currency_code}
				</Descriptions.Item>
				<Descriptions.Item label="Предоплата">
					{payment.prepay || '—'}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
