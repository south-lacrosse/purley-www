import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		ignores: ['dist/', '.astro/'],
	},
	eslint.configs.recommended, // JavaScript
	...tseslint.configs.recommended, // TypeScript
	...eslintPluginAstro.configs.recommended, // Astro
]);
