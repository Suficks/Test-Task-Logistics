import { Card, Descriptions, Space, Tag, Typography } from 'antd';

import type { AuctionShowResponseDto } from '@/entities/auction';
import {
	formatDocs,
	formatFlag,
	formatLoadingTypes,
} from '@/shared/lib/format';

import sectionStyles from '../section-card.module.css';

type AuctionCargoCardProps = {
	cargo: AuctionShowResponseDto['cargo'];
	hideCargoPrice: boolean;
};

function CargoFeatures({
	coupling,
	lowLoader,
	additionalLoad,
}: {
	coupling?: boolean | null;
	lowLoader?: boolean | null;
	additionalLoad?: boolean | null;
}) {
	const features = [
		coupling && 'Сцепка',
		lowLoader && 'Низкорамный',
		additionalLoad && 'Догруз',
	].filter(Boolean) as string[];

	if (features.length === 0) {
		return '—';
	}

	return (
		<Space size={[4, 4]} wrap>
			{features.map((feature) => (
				<Tag key={feature} color="blue">
					{feature}
				</Tag>
			))}
		</Space>
	);
}

export function AuctionCargoCard({
	cargo,
	hideCargoPrice,
}: AuctionCargoCardProps) {
	return (
		<Card className={`${sectionStyles.card} ${sectionStyles.fullWidth}`}>
			<Typography.Title level={4} className={sectionStyles.sectionTitle}>
				Груз и требования к ТС
			</Typography.Title>
			<Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
				<Descriptions.Item label="Тип кузова">
					{cargo.body_type || '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Машин">
					{cargo.truck_count}
				</Descriptions.Item>
				<Descriptions.Item label="Дистанция">
					{cargo.distance != null ? `${cargo.distance} км` : '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Цена груза">
					{hideCargoPrice ? 'Скрыто' : cargo.price || '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Международная">
					{formatFlag(cargo.is_international)}
				</Descriptions.Item>
				<Descriptions.Item label="Тип погрузки">
					{formatLoadingTypes(cargo.loading_types)}
				</Descriptions.Item>
				<Descriptions.Item label="Документы">
					{formatDocs(cargo.docs)}
				</Descriptions.Item>
				<Descriptions.Item label="Температура">
					{cargo.temp_from != null || cargo.temp_to != null
						? `${cargo.temp_from ?? '—'} … ${cargo.temp_to ?? '—'}`
						: '—'}
				</Descriptions.Item>
				<Descriptions.Item label="ADR / ремни / коники">
					{[
						cargo.adr != null && `ADR ${cargo.adr}`,
						cargo.belts != null && `Ремни ${cargo.belts}`,
						cargo.conics != null && `Коники ${cargo.conics}`,
					]
						.filter(Boolean)
						.join(' · ') || '—'}
				</Descriptions.Item>
				<Descriptions.Item label="ТС">
					{cargo.car
						? [
								cargo.car.type,
								cargo.car.weight != null && `${cargo.car.weight} т`,
								cargo.car.volume != null && `${cargo.car.volume} м³`,
								cargo.car.length != null && `Д ${cargo.car.length}`,
								cargo.car.width != null && `Ш ${cargo.car.width}`,
								cargo.car.height != null && `В ${cargo.car.height}`,
							]
								.filter(Boolean)
								.join(' · ')
						: '—'}
				</Descriptions.Item>
				<Descriptions.Item label="Особенности ТС">
					<CargoFeatures
						coupling={cargo.coupling}
						lowLoader={cargo.low_loader}
						additionalLoad={cargo.additional_load}
					/>
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
