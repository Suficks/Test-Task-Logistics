import {
	MutationObserver,
	type DefaultError,
	type MutateOptions,
	type MutationObserverOptions,
	type MutationObserverResult,
	type QueryClient,
} from '@tanstack/query-core';
import { makeAutoObservable, runInAction } from 'mobx';

export class MutationWithState<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
> {
	private observer: MutationObserver<TData, TError, TVariables, TContext>;
	private unsubscribe: () => void;

	result: MutationObserverResult<TData, TError, TVariables, TContext>;

	constructor(
		queryClient: QueryClient,
		options: MutationObserverOptions<TData, TError, TVariables, TContext>,
	) {
		this.observer = new MutationObserver(queryClient, options);
		this.result = this.observer.getCurrentResult();

		makeAutoObservable<typeof this, 'observer' | 'unsubscribe'>(
			this,
			{
				observer: false,
				unsubscribe: false,
			},
			{ autoBind: true },
		);

		this.unsubscribe = this.observer.subscribe((result) => {
			runInAction(() => {
				this.result = result;
			});
		});
	}

	get data(): TData | undefined {
		return this.result.data;
	}

	get error(): TError | null {
		return this.result.error;
	}

	get isPending(): boolean {
		return this.result.isPending;
	}

	get isError(): boolean {
		return this.result.isError;
	}

	get isSuccess(): boolean {
		return this.result.isSuccess;
	}

	mutate(
		variables: TVariables,
		options?: MutateOptions<TData, TError, TVariables, TContext>,
	): Promise<TData> {
		return this.observer.mutate(variables, options);
	}

	reset(): void {
		this.observer.reset();
	}

	dispose(): void {
		this.unsubscribe();
	}
}
