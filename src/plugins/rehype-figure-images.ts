/**
 * Rehype plugin to change image rendering so that single images are rendered
 * inside a figure tag and not p, and also single images with other markup are
 * rendered as figure with figcaption.
 *
 * So, images like
 *
 * ![My picture](picture.jpg)\
 * *Back:* ...\
 * *Front:* ...
 *
 * are rendered as
 *
 * <figure>
 *     <img src=".." alt="..">
 *     <figcaption>...</figcaption>
 * </figure>
 *
 * The image MUST be after a newline so that it is the first element in the
 * paragraph. The \ after () is optional (but preferred as whitespace is
 * processed better with it), the text must just be rendered in the same
 * paragraph as the image.
 *
 * Note: this plugin WILL NOT change paragraphs with multiple images, though it
 * could be changed to do that.
 */
import type { Root } from 'hast';
import type { Transformer } from 'unified';

import { h } from 'hastscript';
import { isElement } from 'hast-util-is-element';
import { SKIP, visit } from 'unist-util-visit';
import { whitespace } from 'hast-util-whitespace';

export default function rehypeFigureImages(): Transformer<Root> {
	// The Transformer function
	return (tree) => {
		visit(tree, { tagName: 'p' }, (node) => {
			const children = node.children;
			// Check for p with img as first child
			if (!Array.isArray(children) || !isElement(children[0], 'img')) return;
			// If img is only child then just change p wrapper to figure
			if (children.length === 1) {
				node.tagName = 'figure';
				return SKIP;
			}
			let captionStart = 0;
			for (let i = 1; i < children.length; i++) {
				if (isElement(children[i], 'img')) {
					return SKIP;
				}
				// remove leading whitespace and line feeds from caption
				if (!captionStart && !whitespace(children[i]) && !isElement(children[i], 'br')) {
					captionStart = i;
				}
			}
			// Modify the p tag to be a figure with only the img as a child, then
			// add the caption
			node.tagName = 'figure';
			node.children = [children[0]];
			if (captionStart) {
				node.children.push(h('figcaption', children.slice(captionStart)));
			}
			return SKIP;
		});
	};
}
