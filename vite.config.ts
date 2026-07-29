import path from 'node:path';

import { defineConfig } from 'vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			autoCodeSplitting: true,
			routesDirectory: 'src/app/routes',
			generatedRouteTree: 'src/routeTree.gen.ts',
			routeToken: '_root',
		}),
		react()
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
