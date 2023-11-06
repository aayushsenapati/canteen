import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server:{
		hmr: {
			host: '0.0.0.0',
			clientPort: 3001,
		}
	},
	plugins: [sveltekit()]
});
