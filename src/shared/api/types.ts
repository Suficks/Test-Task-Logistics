/** Единый формат ошибки API */
export type ProblemDetailDto = {
	code: string;
	title: string;
	message: string;
	trace_id: string | null;
};

export type ValidationErrorDto = {
	field: string;
	message: string;
	code: string | null;
};

export type ValidationProblemDto = {
	code: string;
	title: string;
	message: string;
	trace_id: string | null;
	errors: ValidationErrorDto[];
};
