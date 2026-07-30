import { Card, Descriptions, Typography } from 'antd';

import { OPERATION_TYPE_LABELS } from '@/entities/auction/lib/labels';
import type { RoutePointDto } from '@/entities/auction';
import { formatDateTime } from '@/shared/lib/format';

import sectionStyles from '../section-card.module.css';
import styles from './auction-routes.module.css';

type RoutePointCardProps = {
	point: RoutePointDto;
	hideContacts: boolean;
};

function RoutePointCard({ point, hideContacts }: RoutePointCardProps) {
	return (
		<div className={styles.routePoint}>
			<div className={styles.routePointTitle}>
				{point.row_num}. {OPERATION_TYPE_LABELS[point.op_type]}
			</div>
			<Descriptions column={1} size="small">
				<Descriptions.Item label="Город">
					{point.location.city_full_name || point.location.city_name}
				</Descriptions.Item>
				<Descriptions.Item label="Адрес">
					{hideContacts ? 'Скрыто' : point.location.loading_address || '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Период">
					{formatDateTime(point.start_date)} —{' '}
					{formatDateTime(point.end_date)}
				</Descriptions.Item>
				<Descriptions.Item label="Груз">
					{point.cargo.name || '—'}, {point.cargo.weight} т,{' '}
					{point.cargo.volume} м³
				</Descriptions.Item>
				{!hideContacts && (
					<Descriptions.Item label="Контакт">
						{[point.contact.name, point.contact.phone]
							.filter(Boolean)
							.join(' · ') || '—'}
					</Descriptions.Item>
				)}
				{point.comment && (
					<Descriptions.Item label="Комментарий">
						{point.comment}
					</Descriptions.Item>
				)}
			</Descriptions>
		</div>
	);
}

type AuctionRoutesProps = {
	routes: RoutePointDto[];
	hideContacts: boolean;
};

export function AuctionRoutes({ routes, hideContacts }: AuctionRoutesProps) {
	return (
		<Card className={`${sectionStyles.card} ${sectionStyles.fullWidth}`}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Маршрут
			</Typography.Title>
			<div className={styles.routeList}>
				{routes.map((point) => (
					<RoutePointCard
						key={`${point.row_num}-${point.op_type}`}
						point={point}
						hideContacts={hideContacts}
					/>
				))}
			</div>
		</Card>
	);
}
