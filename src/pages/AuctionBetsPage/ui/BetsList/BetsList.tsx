import { Card, Empty, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { BetItemDto } from '@/entities/bet';
import { CURRENT_USER_ORG_ID } from '@/shared/api/mocks/seedAuctions';
import { formatDateTime, formatPrice } from '@/shared/lib/format';

import styles from './bets-list.module.css';

type BetsListProps = {
	bets: BetItemDto[];
	participantsCount: number;
	hideBetsHistory: boolean;
	isLoading: boolean;
	isEmpty: boolean;
};

export function BetsList({
	bets,
	participantsCount,
	hideBetsHistory,
	isLoading,
	isEmpty,
}: BetsListProps) {
	const columns: ColumnsType<BetItemDto> = [
		{
			title: 'Место',
			dataIndex: 'place',
			width: 80,
			render: (place: number | null) => place ?? '—',
		},
		{
			title: 'Перевозчик',
			dataIndex: 'organization_name',
			render: (name: string, bet) => (
				<Space direction="vertical" size={0}>
					<span className={styles.name}>
						{name}
						{bet.organization_id === CURRENT_USER_ORG_ID ? (
							<Tag className={styles.ownTag} color="blue">
								Вы
							</Tag>
						) : null}
					</span>
					<Typography.Text type="secondary" className={styles.meta}>
						ИНН {bet.organization_inn || '—'}
					</Typography.Text>
				</Space>
			),
		},
		{
			title: 'С НДС',
			dataIndex: 'price_with_vat',
			render: (price: number) => formatPrice(price),
		},
		{
			title: 'Без НДС',
			dataIndex: 'price_no_vat',
			render: (price: number) => formatPrice(price),
		},
		{
			title: 'Дата',
			dataIndex: 'created_at',
			render: (value: string) => formatDateTime(value),
		},
		{
			title: 'Статус',
			key: 'status',
			render: (_, bet) => (
				<Space size={[4, 4]} wrap>
					{bet.is_win ? <Tag color="green">Победитель</Tag> : null}
					{bet.is_counter ? <Tag color="orange">Встречная</Tag> : null}
					{bet.is_rejected || bet.cancel_reason ? (
						<Tag color="red">Отменена</Tag>
					) : null}
					{!bet.is_win &&
					!bet.is_counter &&
					!bet.is_rejected &&
					!bet.cancel_reason ? (
						<Tag>Активна</Tag>
					) : null}
				</Space>
			),
		},
		{
			title: 'Причина отмены',
			dataIndex: 'cancel_reason',
			render: (reason: string) => reason || '—',
		},
	];

	return (
		<Card className={styles.card}>
			<div className={styles.header}>
				<Typography.Title level={4} className={styles.title}>
					История ставок
				</Typography.Title>
				{!hideBetsHistory && (
					<Typography.Text type="secondary">
						Участников: {participantsCount}
					</Typography.Text>
				)}
			</div>

			{hideBetsHistory ? (
				<Empty description="История ставок скрыта организатором" />
			) : isEmpty ? (
				<Empty description="Ставок пока нет" />
			) : (
				<Table
					rowKey="id"
					columns={columns}
					dataSource={bets}
					loading={isLoading}
					pagination={false}
					scroll={{ x: 900 }}
					size="middle"
				/>
			)}
		</Card>
	);
}
