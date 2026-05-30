/**
 * Satteri HAST plugin to modify tables.
 *
 * 1. Wrap with `<div class="scrollable">`
 * 2. Add "striped" class
 */
import { defineHastPlugin } from 'satteri';

const plugin = defineHastPlugin({
	name: 'tables',
	element: {
		filter: ['table'],
		visit(node, ctx) {
			const currentClass = node.properties?.className || '';
			const newClass = currentClass ? `${currentClass} striped` : 'striped';
			ctx.setProperty(node, 'className', newClass);
			ctx.wrapNode(node, {
				type: 'element',
				tagName: 'div',
				properties: { className: 'scrollable' },
				children: [],
			});
		},
	},
});

export default plugin;
