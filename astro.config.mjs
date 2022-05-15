import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import netlify from '@astrojs/netlify/edge-functions'
import sitemap from '@astrojs/sitemap'

const SITE = 'https://y3llow.xyz'

// https://astro.build/config
export default defineConfig({
	site: 'https://y3llow.xyz',
	integrations: [
		solid(),
	],
	adapter: netlify(),
	vite: {
		build: {
			target: [ 'es2020' ],
		},
		optimizeDeps: {
			exclude: ["solid-headless", "caip", "@felte/reporter-solid"],
		  },
		  ssr: {
			noExternal: ["solid-headless", "caip", "@felte/reporter-solid"],
		  },
	}
})
