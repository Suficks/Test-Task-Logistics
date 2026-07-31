import { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { Typography } from 'antd';
import { getRouteApi } from '@tanstack/react-router';

import {
	AuctionsFilters,
	cleanAuctionsSearch,
	toAuctionListRequest,
	type AuctionsSearchParams,
} from '@/features/filter-auctions';
import { AuctionsList } from '@/widgets/auctions-list';
import { AuctionsPageModel } from '../model/AuctionsPageModel';

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
		<div>
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

			<AuctionsList
				auctions={model.auctions}
				meta={model.meta}
				isPending={model.listQuery.isPending}
				isError={model.listQuery.isError}
				isEmpty={model.isEmpty}
				errorMessage={
					model.listQuery.error instanceof Error
						? model.listQuery.error.message
						: undefined
				}
				onRetry={() => model.refetch()}
				onPrefetch={model.prefetchDetail}
				onPageChange={(page, perPage) =>
					updateSearch({ page, per_page: perPage })
				}
			/>
		</div>
	);
});
