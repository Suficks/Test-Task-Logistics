import { Alert, Button, Empty, Pagination, Skeleton } from 'antd';

import type {
	AuctionListItemDto,
	AuctionListMetaDto,
} from '@/entities/auction';
import { Panel } from '@/shared/ui/Panel';
import { AuctionCard } from '../AuctionCard';

import styles from './auctions-list.module.css';

export type AuctionsListProps = {
	auctions: AuctionListItemDto[];
	meta?: AuctionListMetaDto;
	isPending: boolean;
	isError: boolean;
	isEmpty: boolean;
	errorMessage?: string;
	onRetry: () => void;
	onPrefetch: (auctionUuid: string) => void;
	onPageChange: (page: number, perPage: number) => void;
};

export function AuctionsList({
	auctions,
	meta,
	isPending,
	isError,
	isEmpty,
	errorMessage,
	onRetry,
	onPrefetch,
	onPageChange,
}: AuctionsListProps) {
	if (isError) {
		return (
			<Alert
				className={styles.state}
				type="error"
				showIcon
				message="Не удалось загрузить аукционы"
				description={errorMessage ?? 'Попробуйте ещё раз'}
				action={
					<Button size="small" onClick={onRetry}>
						Повторить
					</Button>
				}
			/>
		);
	}

	if (isPending) {
		return (
			<div className={styles.list}>
				{Array.from({ length: 3 }).map((_, index) => (
					<Panel key={index} className={styles.skeletonCard}>
						<Skeleton active paragraph={{ rows: 5 }} />
					</Panel>
				))}
			</div>
		);
	}

	if (isEmpty) {
		return (
			<Panel className={styles.state}>
				<Empty description="По заданным фильтрам аукционов нет" />
			</Panel>
		);
	}

	return (
		<>
			<div className={styles.list}>
				{auctions.map((auction) => (
					<AuctionCard
						key={auction.main.order_uid}
						auction={auction}
						onPrefetch={onPrefetch}
					/>
				))}
			</div>

			{meta && meta.total > 0 && (
				<Panel className={styles.pagination}>
					<Pagination
						current={meta.current_page}
						pageSize={meta.per_page}
						total={meta.total}
						showSizeChanger
						pageSizeOptions={[5, 10, 20]}
						onChange={onPageChange}
					/>
				</Panel>
			)}
		</>
	);
}
