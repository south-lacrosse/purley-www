# Design Notes

This project is built using [Astro](https://docs.astro.build).

Folder structure:

```text
├── .astro    (Astro generated files)
├── .vscode   (VSCode config)
├── bin       (useful command line tools)
├── cspell    (code spell checker dictionaries)
├── data      (original data files and their build scripts)
├── docs      (documentation)
├── dist      (generated website, only exists after build)
├── public    (static website assets, images etc.)
└── src       (Astro source directory)
    ├── archives      (archive pages in Markdown format, .md or extended .mdx,
    │                  and galleries .gal.json)
    ├── components    (custom Astro components like our Gallery)
    ├── data          (JSON data files for stats and results)
    ├── integrations  (Astro integrations to customise the build)
    ├── layouts       (page layouts, reusable HTML scaffolding for our pages)
    ├── pages         (pages and routes which generate the site)
    ├── plugins       (remark & rehype plugins to modify markdown/html)
    ├── styles        (CSS)
    └── util          (utility code)
```

## Content Collections

Most of our pages are generated using [Astro content collections](https://docs.astro.build/en/guides/content-collections/). We have four:

* `archives` - our archive pages are markdown and extended markdown files (`.md` and `mdx`) in `src/archives`
* `galleries` - JSON files ending `.gal.json` in `src/archives` listing images, alt text, and captions. Rendered by the `Gallery.astro` component to display thumbnails, and show full images in a lightbox
* `results` - JSON files in `src/data/results` of a season's results and links to match reports, rendered with the `Results.astro` component
* `stats` - JSON files in `src/data/stats` of a season's statistics, rendered with the `Statistics.astro` component

The `archives` collection is rendered using dynamic routes in `src/pages` with:

* `[...id].astro` - matches file paths of any depth, so will generate `/2000/flags` for source file `src/archives2000/flags.md`
* `[page].astro` - creates the archives index, `page` will be replaced by the page number

Note the variable name inside the square must match a property in the params returned in the exported `getStaticPaths()` function.

## Astro Configuration

The following documents our settings in `astro.config.ts`.

### Responsive Images

We have Astro configured to generate responsive image sizes, i.e. automatically create smaller images, and modify any `img` tags with `srcset` and `sizes` so the smaller images are served if the screen size is too small to display the larger image. It does this for images in markdown, in the Astro `Image` component, or loaded via `getImage`.

Note that responsive images **must** be in the `src` directory so that Astro can process them.

```json
image: {
    layout: 'constrained',
    breakpoints: [640, 828, 1080, 1280, 1668, 2048, 2560],
},
```

Note that we have set custom breakpoints as the defaults are `[640, 750, 828, 1080...]`, and most of our images are 775 or 800 pixels wide, so the 750px breakpoint would generate responsive images very close to the originals.

### Trailing Slash

We made the decision not to have trailing slashes. We set `trailingSlash` to `never` as otherwise:

* URLs with and without the trailing / would be valid
* the sitemap (/sitemap-0.xml) would have all URLs ending with /

### Build File Format

We also change the build to `format: 'file',` so we generate `page.html` instead of `page/index.html`. This is required for certain hosts, eg. on Cloudflare Pages with the default file format `page/index.html` it redirects `/page` to `/page/`, but with file `page.html` it stays with `/page`.

Obviously this may need changing if we move hosts.

```json
build: {
    format: 'file',
},
```

## Search

Search is provided by [Pagefind](https://pagefind.app/) using the [Astro Pagefind integration](https://github.com/shishkin/astro-pagefind).

Configuration is in `astro.config.ts`, with the root selector set to `article`, which we use to enclose archives content, markdown pages in `src/pages`, and `index.astro`.
