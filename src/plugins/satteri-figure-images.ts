/**
 * Satteri HAST plugin to change image rendering so that single images are
 * rendered inside a figure tag and not p, and also single images with other
 * markup are rendered as figure with figcaption.
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
import { defineHastPlugin, type HastNode } from 'satteri';

const plugin = defineHastPlugin({
	name: 'figure-images',
	element: {
		filter: ['p'],
		visit(node) {
			// Check for p with img as first child
			const children = node.children || [];
			if (children.length === 0) return;
			const firstChild = children[0];
			if (firstChild.type !== 'element' || firstChild.tagName !== 'img') {
				return;
			}
			// If img is only child then just change p wrapper to figure
			if (children.length === 1) {
				return { ...node, tagName: 'figure' };
			}

			let captionStart = 0;
			for (let i = 1; i < children.length; i++) {
				const child = children[i];
				// ignore multiple images in a paragraph
				if (child.type === 'element' && child.tagName === 'img') {
					return;
				}
				if (!captionStart) {
					// remove leading whitespace and line feeds from caption
					if (
						!(child.type === 'text' && /^\s*$/.test(child.value || '')) &&
						!(child.type === 'element' && child.tagName === 'br')
					) {
						captionStart = i;
					}
				}
			}
			// create a figure tag with only the img as a child, then add the
			// caption if it's not all whitespace
			const figure: HastNode = {
				type: 'element',
				tagName: 'figure',
				properties: {},
				children: [children[0]],
			};
			if (captionStart) {
				figure.children.push({
					type: 'element',
					tagName: 'figcaption',
					properties: {},
					children: children.slice(captionStart),
				});
			}
			return figure;
		},
	},
});

export default plugin;
