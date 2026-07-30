import { Card, Descriptions, Space, Typography } from 'antd';

import type { AuctionShowResponseDto } from '@/entities/auction';

import sectionStyles from '../section-card.module.css';

type AuctionContactsCardProps = {
	contacts: AuctionShowResponseDto['contacts'];
	hideContacts: boolean;
};

export function AuctionContactsCard({
	contacts,
	hideContacts,
}: AuctionContactsCardProps) {
	return (
		<Card className={sectionStyles.card}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Контакты
			</Typography.Title>
			{hideContacts || contacts.length === 0 ? (
				<Typography.Text className={sectionStyles.muted}>
					Контакты скрыты или отсутствуют
				</Typography.Text>
			) : (
				<Space direction="vertical" size={12} style={{ width: '100%' }}>
					{contacts.map((contact, index) => (
						<Descriptions
							key={contact.uid ?? index}
							column={1}
							size="small"
						>
							<Descriptions.Item label="Имя">
								{contact.name || '—'}
							</Descriptions.Item>
							<Descriptions.Item label="Телефон">
								{contact.phone || '—'}
							</Descriptions.Item>
							<Descriptions.Item label="Рабочий">
								{contact.work_phone || '—'}
							</Descriptions.Item>
							<Descriptions.Item label="Email">
								{contact.email || '—'}
							</Descriptions.Item>
						</Descriptions>
					))}
				</Space>
			)}
		</Card>
	);
}
