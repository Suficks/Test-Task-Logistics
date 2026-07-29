import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

import { AppLayout } from '@/shared/ui/AppLayout';

const Layout = observer(function Layout() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
});

export const Route = createFileRoute('/_layout')({
	component: Layout,
});
