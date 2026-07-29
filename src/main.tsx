import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { routeTree } from './routeTree.gen.ts';
import { createQueryClient } from './shared/config/queryClient.ts';

import './index.css'
import { ConfigProvider } from 'antd';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Tinos, sans-serif',
          },
        }}
      >
        <RouterProvider router={router} defaultPreload="viewport" />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
