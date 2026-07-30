import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Skeleton } from 'antd';
import { getRouteApi } from '@tanstack/react-router';

import { AuctionPageModel } from '../model/AuctionPageModel';
import { AuctionCargoCard } from './AuctionCargoCard';
import { AuctionContactsCard } from './AuctionContactsCard';
import { AuctionMainCard } from './AuctionMainCard';
import { AuctionOrganizerCard } from './AuctionOrganizerCard';
import { AuctionPageHeader } from './AuctionPageHeader';
import { AuctionPaymentCard } from './AuctionPaymentCard';
import { AuctionRoutes } from './AuctionRoutes';
import { AuctionTradingCard } from './AuctionTradingCard';

import styles from './auction-page.module.css';

const routeApi = getRouteApi('/_layout/auctions/$auctionId/');

export const AuctionPage = observer(function AuctionPage() {
	const queryClient = useQueryClient();
	const { auctionId } = routeApi.useParams();

	const modelRef = useRef<AuctionPageModel | null>(null);
	if (
		modelRef.current == null ||
		modelRef.current.auctionUuid !== auctionId
	) {
		modelRef.current?.dispose();
		modelRef.current = new AuctionPageModel(queryClient, auctionId);
	}
	const model = modelRef.current;

	useEffect(() => {
		return () => {
			modelRef.current?.dispose();
			modelRef.current = null;
		};
	}, []);

	const auction = model.auction;
	const trading = auction?.trading;

	return (
		<div className={styles.page}>
			<AuctionPageHeader
				auctionId={auctionId}
				auction={auction}
				hasOwnBet={model.hasOwnBet}
				canSetBet={model.canSetBet}
				hideBetsHistory={model.hideBetsHistory}
			/>

			{model.detailQuery.isError && (
				<Alert
					className={styles.state}
					type="error"
					showIcon
					message="Не удалось загрузить аукцион"
					description={
						model.detailQuery.error instanceof Error
							? model.detailQuery.error.message
							: 'Попробуйте ещё раз'
					}
					action={
						<Button size="small" onClick={() => model.refetch()}>
							Повторить
						</Button>
					}
				/>
			)}

			{model.detailQuery.isPending && (
				<div className={styles.skeletonCard}>
					<Skeleton active paragraph={{ rows: 10 }} />
				</div>
			)}

			{auction && trading && (
				<div className={styles.grid}>
					<AuctionMainCard main={auction.main} />
					<AuctionOrganizerCard organizer={auction.organizer} />
					<AuctionContactsCard
						contacts={auction.contacts}
						hideContacts={model.hideContacts}
					/>
					<AuctionPaymentCard payment={auction.payment} />
					<AuctionTradingCard
						trading={trading}
						hideBetsHistory={model.hideBetsHistory}
					/>
					<AuctionCargoCard
						cargo={auction.cargo}
						hideCargoPrice={model.hideCargoPrice}
					/>
					<AuctionRoutes
						routes={auction.routes}
						hideContacts={model.hideContacts}
					/>
				</div>
			)}
		</div>
	);
});
