# Archives

Apart from the home page, almost all pages on the site are stored in markdown (`.md`) or extended markdown (`.mdx`) format in the [src/archives](../src/archives) directory.

Markdown is an easy-to-use markup language that is used with plain text to add formatting elements (headings, bulleted lists, URLs) to plain text without the use of a formal text editor or the use of HTML tags. This makes creating pages for this site much easier.

Our Astro build tool uses [GitHub flavoured markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), [Smartypants](https://daringfireball.net/projects/smartypants/) to smarten up punctuation, and we have a few of custom additions to markdown as below:

## Frontmatter

Each markdown file has a section of frontmatter, or metadata, enclosed by triple-dashed lines (`---`).

```md
---
title: Cambridge Uni at Home
titleShort: 19 Oct Cambridge
date: 2002-10-19
category: match-report
---
```

Whenever Astro runs (dev or build) it will validate the frontmatter against the scheme we provide, and fail if it's invalid. Our custom metadata fields are (`title` and `date` are mandatory, the rest are optional):

* `title` - long title, displayed at the top of the page and as the page title
* `titleShort` - short title, only displayed for links to related pages that appears in the page footer, so only needed for match reports
* `author` - author name to give credit to external sources, displayed just below title for match reports
* `date` - archive date in format like `1933-05-01`. Archives are listed in date order
* `isApprox` - default false, true if the date is approximate, which stops the date from being displayed just after the title in match reports
* `category` - type of archive, one of `match-report`, `results`, or  `stats`

The category determine which related pages are linked to in the footer:

* `match-report` will list the results page and other match reports for the year (folder)
* `results` will link to all other results pages
* `stats` will link to all other stats pages

## Captioned Images

If you have an image with a caption then you should start a paragraph with your image:

```md
![Alt text](image.jpg)\
Caption text here \
Caption line 2
```

This will only work if the image is the first element in a paragraph, so it must have a blank line preceding it. It is best to have a `\` line break before the caption text, as this and any leading whitespace will be removed from the caption.

Note: this is non-standard, and relies on our `plugins/rehype-figure-images.ts` rehype plugin. The plugin will also enclose any images on their own line with a `<figure>` tag instead of the usual paragraph `<p>`.

## Image Galleries

Galleries are added using the `Gallery` component. Usage is:

```mdx
---
// frontmatter
---
import Gallery from '~/components/Gallery.astro';

Some text here

<Gallery id="gal-id" name="gal-name" />
```

Attributes are:

* `id` - id of the gallery, optional. Galleries should be stored in `src/archives` as `gallery.gal.json` (see existing files for the format), and the id will be the relative filename before the `.gal.json`. If the id is not supplied it will default to the same id as the markdown file, so if you have `dir/entry.md` then the gallery loaded will be `dir/entry.gal.json`
* `name` - gallery name on the page, defaults to "1". You only need this if you have multiple galleries on the page, and want the lightbox to treat them as distinct, otherwise the lightbox will loop through all images on the page as if they were one gallery.

Gallery files look something like:

```json
{
    "alt": "default alt text for images - optional",
    "images": [
        {
            "src": "image1.jpg",
            "caption": "Caption which can have HTML<br>2nd line"
        },
        {
            "src": "image2.jpg",
            "caption": "Caption 2",
            "alt": "Specific alt for this image - optional, defaults to alt above or 'Game photo'"
        },
    ]
}
```

`src` is relative to the JSON file, otherwise it must be an absolute path.

Images must be stored inside the `src` directory (normally in the same directory as the gallery file) so that Astro can process them to create responsive images.

## Paragraph Styles

```md
<p class="small">Make this entire paragraph small, and reduce top and bottom margins.</p>
```

Note that you must use plain HTML inside `<p>` tags.

## Embedding YouTube Videos

In a `.mdx` file enter the following:

```mdx
import { YouTube } from '@astro-community/astro-embed-youtube';

Here's my video:

<YouTube id="TtRtkTzHVBU" />
```

See [Astro Embed YouTube](https://astro-embed.netlify.app/components/youtube/) for details.
