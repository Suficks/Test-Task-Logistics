import { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Empty, Pagination, Skeleton, Typography } from 'antd';
import { getRouteApi } from '@tanstack/react-router';

import {
	cleanAuctionsSearch,
	toAuctionListRequest,
	type AuctionsSearchParams,
} from '../lib/auctionsSearchSchema';
import { AuctionsPageModel } from '../model/AuctionsPageModel';
import { AuctionCard } from './AuctionCard';
import { AuctionsFilters } from './AuctionsFilters';

import styles from './auctions-page.module.css';

const routeApi = getRouteApi('/_layout/');

export const AuctionsPage = observer(function AuctionsPage() {
	const queryClient = useQueryClient();
	const navigate = routeApi.useNavigate();
	const search = routeApi.useSearch();

	const filters = useMemo(() => toAuctionListRequest(search), [search]);

	const modelRef = useRef<AuctionsPageModel | null>(null);
	if (modelRef.current == null) {
		modelRef.current = new AuctionsPageModel(queryClient, filters);
	}
	const model = modelRef.current;

	useEffect(() => {
		return () => {
			modelRef.current?.dispose();
			modelRef.current = null;
		};
	}, []);

	useEffect(() => {
		model.setFilters(filters);
	}, [filters, model]);

	const updateSearch = (next: Partial<AuctionsSearchParams>) => {
		void navigate({
			search: (prev) =>
				cleanAuctionsSearch({
					...prev,
					...next,
				}),
		});
	};

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div>
					<Typography.Title level={2} className={styles.title}>
						Список аукционов
					</Typography.Title>
				</div>
			</div>

			<AuctionsFilters
				value={search}
				onSubmit={updateSearch}
				onReset={() =>
					void navigate({
						search: cleanAuctionsSearch({
							page: 1,
							per_page: search.per_page,
						}),
					})
				}
			/>

			{model.listQuery.isError && (
				<Alert
					className={styles.state}
					type="error"
					showIcon
					message="Не удалось загрузить аукционы"
					description={
						model.listQuery.error instanceof Error
							? model.listQuery.error.message
							: 'Попробуйте ещё раз'
					}
					action={
						<Button size="small" onClick={() => model.refetch()}>
							Повторить
						</Button>
					}
				/>
			)}

			{model.listQuery.isPending && (
				<div className={styles.list}>
					{Array.from({ length: 3 }).map((_, index) => (
						<div key={index} className={styles.skeletonCard}>
							<Skeleton active paragraph={{ rows: 5 }} />
						</div>
					))}
				</div>
			)}

			{model.isEmpty && (
				<div className={styles.state}>
					<Empty description="По заданным фильтрам аукционов нет" />
				</div>
			)}

			{!model.listQuery.isPending && !model.listQuery.isError && (
				<>
					<div className={styles.list}>
						{model.auctions.map((auction) => (
							<AuctionCard
								key={auction.main.order_uid}
								auction={auction}
								onPrefetch={model.prefetchDetail}
							/>
						))}
					</div>

					{model.meta && model.meta.total > 0 && (
						<div className={styles.pagination}>
							<Pagination
								current={model.meta.current_page}
								pageSize={model.meta.per_page}
								total={model.meta.total}
								showSizeChanger
								pageSizeOptions={[5, 10, 20]}
								onChange={(page, perPage) =>
									updateSearch({ page, per_page: perPage })
								}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
});
