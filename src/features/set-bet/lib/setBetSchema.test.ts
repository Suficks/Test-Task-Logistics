import { describe, expect, it } from 'vitest';

import { createSetBetSchema } from './setBetSchema';

describe('createSetBetSchema', () => {
	const schema = createSetBetSchema({
		min: 20000,
		max: 50000,
		step: 500,
	});

	it('accepts a valid price within bounds and step', () => {
		expect(schema.safeParse({ price: 44500 }).success).toBe(true);
	});

	it('rejects missing or non-positive price', () => {
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ price: 0 }).success).toBe(false);
		expect(schema.safeParse({ price: -100 }).success).toBe(false);
	});

	it('rejects price below min or above max', () => {
		expect(schema.safeParse({ price: 19999 }).success).toBe(false);
		expect(schema.safeParse({ price: 50001 }).success).toBe(false);
	});

	it('rejects price that does not match step from min', () => {
		expect(schema.safeParse({ price: 20100 }).success).toBe(false);
		expect(schema.safeParse({ price: 20500 }).success).toBe(true);
	});

	it('skips step check when bounds are incomplete', () => {
		const looseSchema = createSetBetSchema({ step: 500 });
		expect(looseSchema.safeParse({ price: 123 }).success).toBe(true);
	});
});
