import type { ProblemDetailDto, ValidationProblemDto } from '../types';

export class MockError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly body?: ProblemDetailDto | ValidationProblemDto,
	) {
		super(message);
		this.name = 'MockError';
	}
}
