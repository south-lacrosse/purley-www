import type { CollectionEntry } from 'astro:content';

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

export function titleDate(date: Date) {
	return dateTimeFormat.format(date);
}

export function entryTitle(entry: CollectionEntry<'archives'>) {
	let title = entry.data.title;
	if (entry.data.showDate) {
		title += ' - ' + titleDate(entry.data.date);
	}
	return title;
}
