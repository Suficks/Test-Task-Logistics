import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

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
    <RouterProvider router={router} />
  </StrictMode>,
)
