// https://astro.build/config

import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// Astro copies original images when building, so we delete then here as we
// don't ever use them.
import removeOriginalImages from './src/integrations/remove-original-images';

import rehypeFigureImages from './src/plugins/rehype-figure-images';
import rehypeTables from './src/plugins/rehype-tables';

export default defineConfig({
	// when comparing different builds uncomment the following line (and don't
	// forget to put it back after)
	// compressHTML: false,
	site: 'https://purley.southlacrosse.org.uk',
	// see docs/design-notes.md for trailing slash and build file format
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	integrations: [mdx(), sitemap(), removeOriginalImages()],
	markdown: {
		rehypePlugins: [rehypeFigureImages, rehypeTables],
	},
	image: {
		layout: 'constrained',
		// custom breakpoints as our images are mainly 775/800px, so the default
		// 750px breakpoint would generate images too close to the original
		breakpoints: [640, 828, 1080, 1280, 1668, 2048, 2560],
	},
});
