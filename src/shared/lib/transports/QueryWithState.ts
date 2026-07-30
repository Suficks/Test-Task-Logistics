import {
	QueryObserver,
	type DefaultError,
	type QueryClient,
	type QueryKey,
	type QueryObserverOptions,
	type QueryObserverResult,
} from '@tanstack/query-core';
import { makeAutoObservable, runInAction } from 'mobx';

export class QueryWithState<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
> {
	private observer: QueryObserver<
		TQueryFnData,
		TError,
		TData,
		TQueryFnData,
		TQueryKey
	>;

	private unsubscribe: () => void;

	result: QueryObserverResult<TData, TError>;

	constructor(
		queryClient: QueryClient,
		options: QueryObserverOptions<
			TQueryFnData,
			TError,
			TData,
			TQueryFnData,
			TQueryKey
		>,
	) {
		this.observer = new QueryObserver(queryClient, options);
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

	get isLoading(): boolean {
		return this.result.isLoading;
	}

	get isPending(): boolean {
		return this.result.isPending;
	}

	get isFetching(): boolean {
		return this.result.isFetching;
	}

	get isError(): boolean {
		return this.result.isError;
	}

	get error(): TError | null {
		return this.result.error;
	}

	get isSuccess(): boolean {
		return this.result.isSuccess;
	}

	setOptions(
		options: QueryObserverOptions<
			TQueryFnData,
			TError,
			TData,
			TQueryFnData,
			TQueryKey
		>,
	): void {
		this.observer.setOptions(options);
	}

	refetch(): Promise<QueryObserverResult<TData, TError>> {
		return this.observer.refetch();
	}

	dispose(): void {
		this.unsubscribe();
	}
}
