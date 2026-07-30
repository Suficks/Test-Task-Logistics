import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Switch,
} from 'antd';
import dayjs from 'dayjs';
import { z } from 'zod';

import { getCities } from '@/shared/api/mocks/cities';
import {
	AUCTION_STATUS_CODE_OPTIONS,
	AUCTION_TYPE_OPTIONS,
	TRADING_STATUS_OPTIONS,
} from '@/entities/auction/lib/labels';
import type { AuctionsSearchParams } from '../../lib/auctionsSearchSchema';

import styles from './auctions-filters.module.css';

const filtersFormSchema = z.object({
	cargo_num: z.string().optional(),
	status: z
		.array(
			z.enum([
				'NotParticipating',
				'Leading',
				'Losing',
				'OnPending',
				'Confirmed',
				'ChoosingWinner',
				'Winner',
				'Accepted',
				'Unknown',
			]),
		)
		.optional(),
	statuses: z.array(z.number()).optional(),
	auc_type: z.array(z.enum(['Request', 'Up', 'Down', 'FixPrice'])).optional(),
	load_city: z.string().optional(),
	unload_city: z.string().optional(),
	load_date_from: z.string().optional(),
	load_date_to: z.string().optional(),
	is_available: z.boolean().optional(),
	is_bidder: z.boolean().optional(),
	current_price_from: z.number().nullable().optional(),
	current_price_to: z.number().nullable().optional(),
});

type FiltersFormValues = z.infer<typeof filtersFormSchema>;

type AuctionsFiltersProps = {
	value: AuctionsSearchParams;
	onSubmit: (next: Partial<AuctionsSearchParams>) => void;
	onReset: () => void;
};

function toFormValues(value: AuctionsSearchParams): FiltersFormValues {
	return {
		cargo_num: value.cargo_num ?? '',
		status: value.status,
		statuses: value.statuses,
		auc_type: value.auc_type,
		load_city: value.load_city,
		unload_city: value.unload_city,
		load_date_from: value.load_date_from,
		load_date_to: value.load_date_to,
		is_available: value.is_available,
		is_bidder: value.is_bidder,
		current_price_from: value.current_price_from ?? null,
		current_price_to: value.current_price_to ?? null,
	};
}

export function AuctionsFilters({
	value,
	onSubmit,
	onReset,
}: AuctionsFiltersProps) {
	const cities = getCities().map((city) => ({
		value: city.name,
		label: city.name,
	}));

	const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
		resolver: zodResolver(filtersFormSchema),
		defaultValues: toFormValues(value),
		values: toFormValues(value),
	});

	const submit = handleSubmit((values) => {
		onSubmit({
			cargo_num: values.cargo_num?.trim() || undefined,
			status: values.status?.length ? values.status : undefined,
			statuses: values.statuses?.length ? values.statuses : undefined,
			auc_type: values.auc_type?.length ? values.auc_type : undefined,
			load_city: values.load_city || undefined,
			unload_city: values.unload_city || undefined,
			load_date_from: values.load_date_from || undefined,
			load_date_to: values.load_date_to || undefined,
			is_available: values.is_available,
			is_bidder: values.is_bidder,
			current_price_from: values.current_price_from ?? undefined,
			current_price_to: values.current_price_to ?? undefined,
			page: 1,
		});
	});

	return (
		<div className={styles.panel}>
			<Form layout="vertical" onFinish={() => void submit()}>
				<Row gutter={[16, 0]}>
					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Номер заявки">
							<Controller
								name="cargo_num"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										allowClear
										placeholder="00000001001"
										value={field.value ?? ''}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Мой статус">
							<Controller
								name="status"
								control={control}
								render={({ field }) => (
									<Select
										mode="multiple"
										allowClear
										options={TRADING_STATUS_OPTIONS}
										placeholder="Выберите статус"
										maxTagCount="responsive"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Статус аукциона">
							<Controller
								name="statuses"
								control={control}
								render={({ field }) => (
									<Select
										mode="multiple"
										allowClear
										options={AUCTION_STATUS_CODE_OPTIONS}
										placeholder="Выберите статус"
										maxTagCount="responsive"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Тип аукциона">
							<Controller
								name="auc_type"
								control={control}
								render={({ field }) => (
									<Select
										mode="multiple"
										allowClear
										options={AUCTION_TYPE_OPTIONS}
										placeholder="Выберите тип"
										maxTagCount="responsive"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Город погрузки">
							<Controller
								name="load_city"
								control={control}
								render={({ field }) => (
									<Select
										allowClear
										showSearch
										options={cities}
										placeholder="Город"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Город выгрузки">
							<Controller
								name="unload_city"
								control={control}
								render={({ field }) => (
									<Select
										allowClear
										showSearch
										options={cities}
										placeholder="Город"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Дата погрузки">
							<Controller
								name="load_date_from"
								control={control}
								render={({ field: fromField }) => (
									<Controller
										name="load_date_to"
										control={control}
										render={({ field: toField }) => (
											<DatePicker.RangePicker
												showTime
												className={styles.fullWidth}
												format="DD.MM.YYYY HH:mm"
												value={[
													fromField.value ? dayjs(fromField.value) : null,
													toField.value ? dayjs(toField.value) : null,
												]}
												onChange={(range) => {
													fromField.onChange(
														range?.[0]?.toISOString() ?? undefined,
													);
													toField.onChange(
														range?.[1]?.toISOString() ?? undefined,
													);
												}}
											/>
										)}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12} lg={8} xl={6}>
						<Form.Item label="Цена от / до">
							<div className={styles.priceRow}>
								<Controller
									name="current_price_from"
									control={control}
									render={({ field }) => (
										<InputNumber
											className={styles.fullWidth}
											min={0}
											placeholder="От"
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								<Controller
									name="current_price_to"
									control={control}
									render={({ field }) => (
										<InputNumber
											className={styles.fullWidth}
											min={0}
											placeholder="До"
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
							</div>
						</Form.Item>
					</Col>

					<Col xs={12} md={6} lg={4} xl={3}>
						<Form.Item label="Доступен">
							<Controller
								name="is_available"
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value === true}
										onChange={(checked) =>
											field.onChange(checked ? true : undefined)
										}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col xs={12} md={6} lg={4} xl={3}>
						<Form.Item label="Я участвовал">
							<Controller
								name="is_bidder"
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value === true}
										onChange={(checked) =>
											field.onChange(checked ? true : undefined)
										}
									/>
								)}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className={styles.actions}>
					<Button
						onClick={() => {
							reset(toFormValues({ page: 1, per_page: value.per_page }));
							onReset();
						}}
					>
						Сбросить
					</Button>
					<Button type="primary" htmlType="submit">
						Применить
					</Button>
				</div>
			</Form>
		</div>
	);
}
