import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, App, Button, Skeleton, Tag, Typography } from 'antd';
import { Link, getRouteApi } from '@tanstack/react-router';

import {
	AUCTION_STATUS_LABELS,
	AUCTION_TYPE_LABELS,
	TRADING_STATUS_LABELS,
} from '@/entities/auction/lib/labels';
import { SetBetForm } from '@/features/set-bet';
import { ApiRequestError } from '@/shared/api/services';
import { AuctionBetsPageModel } from '../model/AuctionBetsPageModel';
import { BetsList } from './BetsList';

import styles from './auction-bets-page.module.css';

const routeApi = getRouteApi('/_layout/auctions/$auctionId/bets');

export const AuctionBetsPage = observer(function AuctionBetsPage() {
	const queryClient = useQueryClient();
	const { message } = App.useApp();
	const { auctionId } = routeApi.useParams();

	const modelRef = useRef<AuctionBetsPageModel | null>(null);
	if (
		modelRef.current == null ||
		modelRef.current.auctionUuid !== auctionId
	) {
		modelRef.current?.dispose();
		modelRef.current = new AuctionBetsPageModel(queryClient, auctionId);
	}
	const model = modelRef.current;

	useEffect(() => {
		return () => {
			modelRef.current?.dispose();
			modelRef.current = null;
		};
	}, []);

	const auction = model.auction;
	const isLoading =
		model.detailQuery.isPending || model.betsQuery.isPending;
	const isError = model.detailQuery.isError || model.betsQuery.isError;

	const handleSubmit = async (values: { price: number }) => {
		const wasOwnBet = model.hasOwnBet;

		try {
			await model.submitBet({ price: values.price });
			message.success(wasOwnBet ? 'Ставка обновлена' : 'Ставка принята');
		} catch (error) {
			if (error instanceof ApiRequestError && error.status === 422) {
				const validation = model.getValidationErrors();
				message.error(
					validation[0]?.message ??
						error.message ??
						'Ошибка валидации ставки',
				);
				return;
			}

			message.error(
				error instanceof Error
					? error.message
					: 'Не удалось отправить ставку',
			);
		}
	};

	return (
		<div>
			<div className={styles.topBar}>
				<div className={styles.titleBlock}>
					<Link
						to="/auctions/$auctionId"
						params={{ auctionId }}
						className={styles.backLink}
					>
						К аукциону
					</Link>
					{auction && (
						<>
							<Typography.Title level={2} className={styles.title}>
								Ставки · заявка {auction.main.cargo_num}
							</Typography.Title>
							<div className={styles.tags}>
								<Tag>{AUCTION_TYPE_LABELS[auction.main.auc_type]}</Tag>
								<Tag>
									{AUCTION_STATUS_LABELS[auction.trading.status]}
								</Tag>
								<Tag>
									{
										TRADING_STATUS_LABELS[
											auction.trading.status_mobile
										]
									}
								</Tag>
								{model.hasOwnBet ? (
									<Tag color="blue">Моя ставка есть</Tag>
								) : (
									<Tag>Моей ставки нет</Tag>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			{isError && (
				<Alert
					className={styles.state}
					type="error"
					showIcon
					message="Не удалось загрузить ставки"
					description={
						(model.detailQuery.error instanceof Error
							? model.detailQuery.error.message
							: null) ||
						(model.betsQuery.error instanceof Error
							? model.betsQuery.error.message
							: 'Попробуйте ещё раз')
					}
					action={
						<Button size="small" onClick={() => model.refetch()}>
							Повторить
						</Button>
					}
				/>
			)}

			{isLoading && !auction && (
				<div className={styles.skeletonCard}>
					<Skeleton active paragraph={{ rows: 8 }} />
				</div>
			)}

			{auction && (
				<div className={styles.grid}>
					<div className={styles.formSticky}>
						<SetBetForm
							key={`${auction.trading.price.available}-${auction.trading.price.current}`}
							bounds={model.priceBounds}
							hasOwnBet={model.hasOwnBet}
							canSetBet={model.canSetBet}
							isSubmitting={model.setBetMutation.isPending}
							serverErrors={model.getValidationErrors()}
							onSubmit={handleSubmit}
						/>
					</div>

					<div className={styles.list}>
						<BetsList
							bets={model.bets}
							participantsCount={model.participantsCount}
							hideBetsHistory={model.hideBetsHistory}
							isLoading={model.betsQuery.isPending}
							isEmpty={model.isBetsEmpty && !model.hideBetsHistory}
						/>
					</div>
				</div>
			)}
		</div>
	);
});
