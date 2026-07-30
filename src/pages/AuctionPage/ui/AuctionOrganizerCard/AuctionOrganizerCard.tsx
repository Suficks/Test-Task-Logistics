import { Card, Descriptions, Typography } from 'antd';

import type { AuctionShowResponseDto } from '@/entities/auction';

import sectionStyles from '../section-card.module.css';

type AuctionOrganizerCardProps = {
	organizer: AuctionShowResponseDto['organizer'];
};

export function AuctionOrganizerCard({ organizer }: AuctionOrganizerCardProps) {
	return (
		<Card className={sectionStyles.card}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Организатор
			</Typography.Title>
			<Descriptions column={1} size="small">
				<Descriptions.Item label="Организация">
					{organizer.organization_name}
				</Descriptions.Item>
				<Descriptions.Item label="ИНН">
					{organizer.organization_inn}
				</Descriptions.Item>
				<Descriptions.Item label="КПП">
					{organizer.organization_kpp}
				</Descriptions.Item>
				<Descriptions.Item label="Код подписчика">
					{organizer.subscriber_code}
				</Descriptions.Item>
				<Descriptions.Item label="Инфобаза">
					{organizer.infobase_code}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
