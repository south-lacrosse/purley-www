# Purley Lacrosse Website

## Quickstart

1. [Install Node.js](https://nodejs.org/en/download/)
1. Clone this repo to your local machine
1. Install all necessary packages with `npm install`
1. Run `npm run dev` to start the dev server
1. Go to <http://localhost:4321/>

## Commands

Run from the command line within the project:

* `npm install` - install dependencies
* `npm run dev` - start local dev server at `localhost:4321`
* `npm run build` - build production site to `./dist/`
* `npm run preview` - preview your build locally before deploying
* `npm run astro ...` - run CLI commands like `astro add`
* `npm run astro preferences disable devToolbar` - disable (or enable) the development toolbar in browser
* `npm run astro preferences list`- list preferences
* `npm run astro -- --help` - Get help using the Astro CLI

## Related Documents

* [How to add new archive pages](docs/archives.md)
* [Design Notes](docs/design-notes.md)
* [Technical Notes](docs/technical-notes.md) - useful if you are updating the code

## Deploying

Running `npm run build` builds the site to static HTML in `./dist/`. You can deploy these files to any web host.

We have decided to use Cloudflare as out hosts as they will host static sites for free, and you can set up custom domains. We have installed the Cloudflare Workers and Pages App on this GitHub repo, so changes are automatically deployed when a change is pushed to GitHub.

See our [Cloudflare docs](docs/cloudflare.md) for more details.
