import type { ReactNode } from 'react';
import { Layout, Typography } from 'antd';
import { Link } from '@tanstack/react-router';

import { DEFAULT_AUCTIONS_SEARCH } from '@/features/filter-auctions';

import styles from './app-layout.module.css';

const { Header, Content } = Layout;

export type AppLayoutProps = {
	children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<Layout className={styles.layout}>
			<Header className={styles.header}>
				<Link to="/" search={DEFAULT_AUCTIONS_SEARCH} className={styles.brand}>
					<img className={styles.logo} src="/full_logo.png" alt="Логотип" />
				</Link>

				<Typography.Title level={3} className={styles.title}>
					Грузовые аукционы
				</Typography.Title>
			</Header>

			<Content className={styles.content}>{children}</Content>
		</Layout>
	);
}
