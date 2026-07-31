import { Button, Card, Space, Tag, Typography } from 'antd';
import { Link } from '@tanstack/react-router';

import type { AuctionListItemDto } from '@/entities/auction';
import {
	AUCTION_STATUS_LABELS,
	AUCTION_TYPE_LABELS,
	TRADING_STATUS_LABELS,
} from '@/entities/auction/lib/labels';
import {
	formatDateTime,
	formatPrice,
	formatVolume,
	formatWeight,
} from '@/shared/lib/format';
import { getAuctionPrimaryAction } from '../../lib/getAuctionPrimaryAction';

import styles from './auction-card.module.css';

const { Text, Title } = Typography;

type AuctionCardProps = {
	auction: AuctionListItemDto;
	onPrefetch: (auctionUuid: string) => void;
};

export function AuctionCard({ auction, onPrefetch }: AuctionCardProps) {
	const { main, route, cargo, trading } = auction;
	const orderUid = main.order_uid;
	const action = getAuctionPrimaryAction(auction);

	return (
		<Card
			className={styles.card}
			onMouseEnter={() => onPrefetch(orderUid)}
			onFocus={() => onPrefetch(orderUid)}
		>
			<div className={styles.top}>
				<div className={styles.heading}>
					<Link
						to="/auctions/$auctionId"
						params={{ auctionId: orderUid }}
						onMouseEnter={() => onPrefetch(orderUid)}
						className={styles.titleLink}
					>
						<Title level={4} className={styles.title}>
							Заявка {main.cargo_num}
						</Title>
					</Link>
					<Text type="secondary">{AUCTION_TYPE_LABELS[main.auc_type]}</Text>
				</div>

				<Space size={[8, 8]} wrap>
					<Tag>{AUCTION_STATUS_LABELS[trading.status]}</Tag>
					<Tag
						color={
							trading.status_mobile === 'Leading'
								? 'green'
								: trading.status_mobile === 'Losing'
									? 'orange'
									: trading.status_mobile === 'Winner'
										? 'blue'
										: 'default'
						}
					>
						{TRADING_STATUS_LABELS[trading.status_mobile]}
					</Tag>
					{trading.your?.bet ? (
						<Tag color="blue">Моя ставка есть</Tag>
					) : (
						<Tag>Моей ставки нет</Tag>
					)}
				</Space>
			</div>

			<div className={styles.route}>
				<div>
					<Text type="secondary">Погрузка</Text>
					<div className={styles.city}>{route.load.city}</div>
					<Text type="secondary">{formatDateTime(route.load.date)}</Text>
				</div>
				<div className={styles.arrow} aria-hidden>
					→
				</div>
				<div>
					<Text type="secondary">Выгрузка</Text>
					<div className={styles.city}>{route.unload.city}</div>
					<Text type="secondary">{formatDateTime(route.unload.date)}</Text>
				</div>
			</div>

			<div className={styles.grid}>
				<div>
					<Text type="secondary">Груз</Text>
					<div className={styles.value}>{cargo.name}</div>
				</div>
				<div>
					<Text type="secondary">Вес / объём</Text>
					<div className={styles.value}>
						{formatWeight(cargo.weight)} · {formatVolume(cargo.volume)}
					</div>
				</div>
				<div>
					<Text type="secondary">Кузов</Text>
					<div className={styles.value}>{cargo.body_type || '—'}</div>
				</div>
				<div>
					<Text type="secondary">Текущая цена</Text>
					<div className={styles.price}>
						{formatPrice(trading.price?.current)}
					</div>
				</div>
				<div>
					<Text type="secondary">Цена за км</Text>
					<div className={styles.value}>{formatPrice(main.price_per_km)}</div>
				</div>
				<div>
					<Text type="secondary">Доступность</Text>
					<div className={styles.value}>
						{trading.is_available ? 'Доступен' : 'Недоступен'}
					</div>
				</div>
			</div>

			<div className={styles.actions}>
				<Link
					to="/auctions/$auctionId"
					params={{ auctionId: orderUid }}
					onMouseEnter={() => onPrefetch(orderUid)}
				>
					<Button>Подробнее</Button>
				</Link>
				<Link
					to={action.to}
					params={action.params}
					onMouseEnter={() => onPrefetch(orderUid)}
				>
					<Button type="primary" disabled={action.disabled}>
						{action.label}
					</Button>
				</Link>
			</div>
		</Card>
	);
}
