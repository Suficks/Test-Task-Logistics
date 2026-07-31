import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, InputNumber, Typography } from 'antd';

import { formatPrice } from '@/shared/lib/format';
import {
	createSetBetSchema,
	type BetPriceBounds,
	type SetBetFormValues,
} from '../../lib/setBetSchema';

import styles from './set-bet-form.module.css';

type SetBetFormProps = {
	bounds: BetPriceBounds & {
		available?: number | null;
		current?: number | null;
	};
	hasOwnBet: boolean;
	canSetBet: boolean;
	isSubmitting: boolean;
	serverErrors?: Array<{ field: string; message: string }>;
	onSubmit: (values: SetBetFormValues) => Promise<void> | void;
};

export function SetBetForm({
	bounds,
	hasOwnBet,
	canSetBet,
	isSubmitting,
	serverErrors = [],
	onSubmit,
}: SetBetFormProps) {
	const schema = useMemo(
		() =>
			createSetBetSchema({
				min: bounds.min,
				max: bounds.max,
				step: bounds.step,
			}),
		[bounds.min, bounds.max, bounds.step],
	);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SetBetFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			price: bounds.available ?? bounds.current ?? undefined,
		},
	});

	if (!canSetBet) {
		return (
			<Card className={styles.card}>
				<Typography.Title level={4} className={styles.title}>
					Сделать ставку
				</Typography.Title>
				<Alert
					type="info"
					showIcon
					message="Ставка сейчас недоступна"
					description="Форма недоступна, пока нельзя делать ставки по этому аукциону."
				/>
			</Card>
		);
	}

	const priceError =
		errors.price?.message ??
		serverErrors.find((error) => error.field === 'price')?.message;

	return (
		<Card className={styles.card}>
			<Typography.Title level={4} className={styles.title}>
				{hasOwnBet ? 'Изменить ставку' : 'Сделать ставку'}
			</Typography.Title>

			<div className={styles.hints}>
				<Typography.Text type="secondary">
					Текущая: {formatPrice(bounds.current)}
				</Typography.Text>
				<Typography.Text type="secondary">
					Доступная: {formatPrice(bounds.available)}
				</Typography.Text>
				<Typography.Text type="secondary">
					Min / Max: {formatPrice(bounds.min)} — {formatPrice(bounds.max)}
				</Typography.Text>
				<Typography.Text type="secondary">
					Шаг: {formatPrice(bounds.step)}
				</Typography.Text>
			</div>

			<Form
				layout="vertical"
				onFinish={() => {
					void handleSubmit(async (values) => {
						await onSubmit(values);
					})();
				}}
			>
				<Form.Item
					label="Цена ставки, ₽"
					required
					validateStatus={priceError ? 'error' : undefined}
					help={priceError}
				>
					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<InputNumber
								className={styles.input}
								min={bounds.min ?? 1}
								max={bounds.max ?? undefined}
								step={bounds.step && bounds.step > 0 ? bounds.step : 1}
								controls
								placeholder="Введите цену"
								value={field.value}
								onBlur={field.onBlur}
								onChange={(value) => field.onChange(value ?? undefined)}
							/>
						)}
					/>
				</Form.Item>

				<Button type="primary" htmlType="submit" loading={isSubmitting}>
					{hasOwnBet ? 'Обновить ставку' : 'Отправить ставку'}
				</Button>
			</Form>
		</Card>
	);
}
