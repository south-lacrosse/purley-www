/**
 * Integration to remove extraneous image files in build directory.
 *
 * Astro doesn't know that our original images in the galleries collection won't
 * be used externally, so it copies them over to be on the safe side. This
 * integration deletes them.
 */
import type { AstroIntegration } from 'astro';

import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function removeOriginalImages(): AstroIntegration {
	// Original images have the pattern {name}.{original hash}.{original_ext}
	// Generated images {name}.{original hash}_{additional hash}.{new_ext}
	// The original hash is always 8 characters, but the additional one is variable

	// We could probably just delete all files ending in .jpg as Astro optimises all
	// images to webp, but this pattern is extra safe in case we generate optimised
	// jpgs.
	const ORIGINAL_PATTERN = /\..{8}\.jpg$/;
	let assetsDir: string;
	return {
		name: 'roi',
		hooks: {
			'astro:config:done': ({ config }) => {
				// outDir is a file URL
				assetsDir = fileURLToPath(new URL(config.build.assets, config.outDir));
			},
			'astro:build:done': async ({ logger }) => {
				let found = 0;
				let removed = 0;

				const files = await readdir(assetsDir);
				for (const file of files) {
					if (!ORIGINAL_PATTERN.test(file)) {
						continue;
					}
					found++;
					try {
						await unlink(path.join(assetsDir, file));
						removed++;
					} catch (e) {
						logger.error('' + e);
					}
				}
				if (found > 0) {
					logger.info(`Removed ${removed}/${found} original images`);
				}
			},
		},
	};
}
