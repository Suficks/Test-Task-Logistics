import { Button, Tag, Typography } from 'antd';
import { Link } from '@tanstack/react-router';

import {
	AUCTION_STATUS_LABELS,
	AUCTION_TYPE_LABELS,
	TRADING_STATUS_LABELS,
} from '@/entities/auction/lib/labels';
import type { AuctionShowResponseDto } from '@/entities/auction';
import { DEFAULT_AUCTIONS_SEARCH } from '@/features/filter-auctions';

import styles from './auction-page-header.module.css';

function tradingStatusColor(status: string): string {
	if (status === 'Leading' || status === 'Winner' || status === 'Accepted') {
		return 'green';
	}
	if (status === 'Losing' || status === 'OnPending') {
		return 'orange';
	}
	if (status === 'Confirmed' || status === 'ChoosingWinner') {
		return 'blue';
	}
	return 'default';
}

type AuctionPageHeaderProps = {
	auctionId: string;
	auction?: AuctionShowResponseDto;
	hasOwnBet: boolean;
	canSetBet: boolean;
	hideBetsHistory: boolean;
};

export function AuctionPageHeader({
	auctionId,
	auction,
	hasOwnBet,
	canSetBet,
	hideBetsHistory,
}: AuctionPageHeaderProps) {
	const trading = auction?.trading;
	const primaryBetLabel = hasOwnBet ? 'Изменить ставку' : 'Сделать ставку';

	return (
		<div className={styles.topBar}>
			<div className={styles.titleBlock}>
				<Link to="/" search={DEFAULT_AUCTIONS_SEARCH}>
					К списку аукционов
				</Link>
				{auction && trading && (
					<>
						<Typography.Title level={2} className={styles.title}>
							Заявка {auction.main.cargo_num}
						</Typography.Title>
						<div className={styles.tags}>
							<Tag>{AUCTION_TYPE_LABELS[auction.main.auc_type]}</Tag>
							<Tag>{AUCTION_STATUS_LABELS[trading.status]}</Tag>
							<Tag color={tradingStatusColor(trading.status_mobile)}>
								{TRADING_STATUS_LABELS[trading.status_mobile]}
							</Tag>
							{hasOwnBet ? (
								<Tag color="blue">Моя ставка есть</Tag>
							) : (
								<Tag>Моей ставки нет</Tag>
							)}
						</div>
					</>
				)}
			</div>

			{auction && (
				<div className={styles.actions}>
					<Link to="/auctions/$auctionId/bets" params={{ auctionId }}>
						<Button>
							{hideBetsHistory
								? 'История ставок скрыта'
								: 'Смотреть ставки'}
						</Button>
					</Link>
					{canSetBet ? (
						<Link to="/auctions/$auctionId/bets" params={{ auctionId }}>
							<Button type="primary">{primaryBetLabel}</Button>
						</Link>
					) : (
						<Button type="primary" disabled>
							Ставка недоступна
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
