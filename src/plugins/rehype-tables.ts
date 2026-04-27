/**
 * Rehype plugin to modify tables.
 *
 * 1. Wrap with `<div class="scrollable">`
 * 2. Add "striped" class
 */
import type { Root } from 'hast';
import type { Transformer } from 'unified';

import { h } from 'hastscript';
import { SKIP, visit } from 'unist-util-visit';

export default function rehypeTables(): Transformer<Root> {
	// The Transformer function
	return (tree) => {
		visit(tree, { tagName: 'table' }, (node, index, parent) => {
			if (parent && typeof index === 'number') {
				if (!node.properties.className) {
					node.properties.className = 'striped';
				} else {
					node.properties.className += ' striped';
				}
				parent.children[index] = h('div', { class: 'scrollable' }, node);
			}
			return SKIP;
		});
	};
}
