import { Card, Descriptions, Typography } from 'antd';

import { AUCTION_TYPE_LABELS } from '@/entities/auction/lib/labels';
import type { AuctionShowResponseDto } from '@/entities/auction';
import { formatDateTime } from '@/shared/lib/format';

import sectionStyles from '../section-card.module.css';

type AuctionMainCardProps = {
	main: AuctionShowResponseDto['main'];
};

export function AuctionMainCard({ main }: AuctionMainCardProps) {
	return (
		<Card className={sectionStyles.card}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Основные данные
			</Typography.Title>
			<Descriptions column={1} size="small">
				<Descriptions.Item label="Номер заявки">
					{main.cargo_num}
				</Descriptions.Item>
				<Descriptions.Item label="Дата заявки">
					{formatDateTime(main.cargo_date)}
				</Descriptions.Item>
				<Descriptions.Item label="Создан">
					{formatDateTime(main.created_at)}
				</Descriptions.Item>
				<Descriptions.Item label="UUID">{main.order_uid}</Descriptions.Item>
				<Descriptions.Item label="Тип">
					{AUCTION_TYPE_LABELS[main.auc_type]}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
