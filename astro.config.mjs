import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import netlify from '@astrojs/netlify/edge-functions'
import sitemap from '@astrojs/sitemap'
import inject from '@rollup/plugin-inject'
import stdLibBrowser from 'node-stdlib-browser'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const SITE = 'https://y3llow.xyz'

// https://astro.build/config
export default defineConfig({
	site: 'https://y3llow.xyz',
	integrations: [
		solid(),
	],
	adapter: netlify(),
	vite: {
		resolve: {
			alias: stdLibBrowser
		},
		build: {
			target: [ 'es2020' ],
		},
		optimizeDeps: {
			include: ['buffer', 'process'],
			exclude: ["solid-headless", "caip", "@felte/reporter-solid"],
		},
		ssr: {
			noExternal: ["solid-headless", "caip", "@felte/reporter-solid"],
		},
		plugins: [
			{
				...inject({
					global: [
						require.resolve(
							'node-stdlib-browser/helpers/esbuild/shim'
						),
						'global'
					],
					process: [
						require.resolve(
							'node-stdlib-browser/helpers/esbuild/shim'
						),
						'process'
					],
					Buffer: [
						require.resolve(
							'node-stdlib-browser/helpers/esbuild/shim'
						),
						'Buffer'
					]				}),
				enforce: 'post'
			}
		]
	}
})
