import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { AppProviders } from '@/app/providers';
import { createQueryClient } from '@/shared/config/queryClient';
import { routeTree } from './routeTree.gen.ts';

import './index.css';

async function enableMocking() {
	const { worker } = await import('./msw/worker');

	return worker.start({
		onUnhandledRequest: 'bypass',
	});
}

const queryClient = createQueryClient();

export const router = createRouter({
	routeTree,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	defaultPreload: 'intent',
	context: {
		queryClient,
	},
	scrollRestoration: true,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AppProviders>
					<RouterProvider router={router} defaultPreload="viewport" />
				</AppProviders>
			</QueryClientProvider>
		</StrictMode>,
	);
});
