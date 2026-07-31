import { z } from 'zod';

export type BetPriceBounds = {
	min?: number | null;
	max?: number | null;
	step?: number | null;
};

export function createSetBetSchema(bounds: BetPriceBounds = {}) {
	const { min, max, step } = bounds;

	return z.object({
		price: z
			.number({ error: 'Укажите цену ставки' })
			.positive('Цена должна быть больше 0')
			.superRefine((price, ctx) => {
				if (min != null && price < min) {
					ctx.addIssue({
						code: 'custom',
						message: `Цена не может быть меньше ${min}`,
					});
				}

				if (max != null && price > max) {
					ctx.addIssue({
						code: 'custom',
						message: `Цена не может быть больше ${max}`,
					});
				}

				if (step != null && step > 0 && min != null) {
					const diff = price - min;
					const steps = diff / step;
					if (Math.abs(steps - Math.round(steps)) > 1e-6) {
						ctx.addIssue({
							code: 'custom',
							message: `Цена должна соответствовать шагу ${step}`,
						});
					}
				}
			}),
	});
}

export type SetBetFormValues = z.infer<ReturnType<typeof createSetBetSchema>>;
