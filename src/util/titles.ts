import type { CollectionEntry } from 'astro:content';

const options: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);

export function titleDate(date: Date) {
	return dateTimeFormat.format(date);
}

export function entryTitle(entry: CollectionEntry<'archives'>) {
	let title = entry.data.title;
	if (entry.data.category === 'match-report' && !entry.data.isApprox) {
		title += ' - ' + titleDate(entry.data.date);
	}
	return title;
}
