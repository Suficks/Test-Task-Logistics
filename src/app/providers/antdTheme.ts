import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
	token: {
		colorPrimary: '#0f766e',
		colorInfo: '#0f766e',
		colorSuccess: '#16a34a',
		colorSuccessBg: '#f0fdf4',
		colorSuccessBgHover: '#dcfce7',
		colorSuccessBorder: '#bbf7d0',
		colorWarning: '#d97706',
		colorWarningBg: '#fffbeb',
		colorWarningBgHover: '#fef3c7',
		colorWarningBorder: '#fde68a',
		colorError: '#dc2626',
		colorErrorBg: '#fef2f2',
		colorErrorBorder: '#fecaca',
		colorText: '#0f172a',
		colorTextSecondary: '#475569',
		colorBorder: '#e2e8f0',
		colorBgLayout: '#eef2f5',
		colorBgContainer: '#ffffff',
		borderRadius: 10,
		controlHeight: 40,
		boxShadowSecondary:
			'0 1px 0 rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.08)',
		boxShadowTertiary:
			'0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 28px rgba(15, 23, 42, 0.08)',
	},
	components: {
		Layout: {
			headerBg: '#ffffff',
			headerHeight: 72,
			headerPadding: '0 24px',
			bodyBg: '#eef2f5',
		},
		Card: {
			borderRadiusLG: 14,
		},
		Tag: {
			defaultBg: '#f8fafc',
		},
		Button: {
			borderRadius: 10,
			controlHeight: 40,
		},
		Select: {
			controlHeight: 40,
		},
		Input: {
			controlHeight: 40,
		},
		DatePicker: {
			controlHeight: 40,
		},
	},
};
