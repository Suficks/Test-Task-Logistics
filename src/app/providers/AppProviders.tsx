import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { antdTheme } from './antdTheme';

dayjs.locale('ru');

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ConfigProvider locale={ruRU} theme={antdTheme}>
			{children}
		</ConfigProvider>
	);
}
