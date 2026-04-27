import { type CollectionEntry, getCollection } from 'astro:content';

export const ARCHIVES_PAGE_SIZE = 30;

// get and sort the archive entries into date order
const archiveEntries = await getCollection('archives');
archiveEntries.sort((a, b) => {
	if (a.data.date > b.data.date) return 1;
	if (b.data.date > a.data.date) return -1;
	if (a.id > b.id) return 1;
	if (b.id > a.id) return -1;
	return 0;
});
export { archiveEntries };

// entries by category, or category/year for match reports
const groupedArchiveEntries = archiveEntries.reduce(
	(entries, entry) => {
		const category = entry.data.category;
		if (category === undefined) return entries;
		let group = category;
		if (category === 'match-report') {
			group += '/' + entry.id.split('/')[0];
		}
		if (!entries[group]) entries[group] = [];
		entries[group].push(entry);
		return entries;
	},
	{} as { [group: string]: CollectionEntry<'archives'>[] }
);

// gets the archives index page number so an archive page can link back to the
// index it's on
export function getArchivesPage(index: number) {
	return Math.floor(index / ARCHIVES_PAGE_SIZE) + 1;
}

export function getRelatedEntries(
	category: CollectionEntry<'archives'>['data']['category'],
	id: string
) {
	const group = category + (category === 'match-report' ? '/' + id.split('/')[0] : '');
	return groupedArchiveEntries[group].filter(({ id: entryId }) => {
		return entryId !== id;
	});
}

export function getNextPrev(index: number) {
	return {
		prev: index > 0 ? archiveEntries[index - 1] : undefined,
		next: index < archiveEntries.length - 1 ? archiveEntries[index + 1] : undefined,
	};
}
