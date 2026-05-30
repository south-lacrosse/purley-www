# Markdown Plugins

This directory contains plugins to alter the default markdown output. We currently use the Sätteri parser, which is written is Rust, and much faster than the Unified system Astro originally used.

To be on the safe side, we have kept the Rehype plugins which were used on the Unified system. The `astro.config.ts` settings would be:

```js
import { unified } from '@astrojs/markdown-remark';
import rehypeFigureImages from './src/plugins/rehype-figure-images';
import rehypeTables from './src/plugins/rehype-tables';

export default defineConfig({
    markdown: {
        processor: unified({
            rehypePlugins: [rehypeFigureImages, rehypeTables],
        }),
    }
    ...
}
```
