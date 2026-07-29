import { Layout, Typography } from 'antd';
import { Link } from '@tanstack/react-router';

import styles from './app-layout.module.css';
import type { ReactNode } from 'react';

const { Header, Content } = Layout;

export type LayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: LayoutProps) {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Link to="/">
          <img className={styles.logo} src="/full_logo.png" alt="logo" />
        </Link>

        <Typography.Title level={2} className={styles.title}>
          Грузовые Аукционы
        </Typography.Title>
      </Header>

      <Content className={styles.content}>
        {children}
      </Content>
    </Layout>
  );
}