import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const archives = defineCollection({
	loader: glob({ base: './src/archives', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		titleShort: z.string().optional(),
		author: z.string().optional(),
		date: z.date(),
		isApprox: z.boolean().default(false),
		category: z.enum(['match-report', 'results', 'stats']).optional(),
	}),
});

const galleries = defineCollection({
	loader: glob({
		base: './src/archives',
		pattern: '**/*.gal.json',
		generateId: ({ entry }) => entry.replace(/\.gal\.json$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			alt: z.string().optional(),
			images: z.array(
				z.object({
					src: image(),
					alt: z.string().optional(),
					caption: z.string(),
				})
			),
		}),
});

const results = defineCollection({
	loader: glob({ base: './src/data/results', pattern: '*.json' }),
	schema: z.object({
		league: z.string(),
		flags: z.string(),
		fixtures: z.array(
			z.object({
				date: z.string(),
				opposition: z.string().optional(),
				location: z.string().optional(),
				competition: z.string().optional(),
				result: z.string().optional(),
				comment: z.string().optional(),
				report: z.string().optional(),
			})
		),
	}),
});

const stats = defineCollection({
	loader: glob({ base: './src/data/stats', pattern: '*.json' }),
	schema: z.object({
		season: z.string(),
		friendlies: z.boolean().optional(),
		refGames: z.boolean().optional(),
		players: z.array(
			z.object({
				name: z.string(),
				position: z.string(),
				squadNumber: z.string().optional(),
				stats: z.array(z.object({ slug: z.string(), apps: z.number(), goals: z.number() })),
				ref: z.string().optional(),
			})
		),
	}),
});

export const collections = { archives, galleries, results, stats };
