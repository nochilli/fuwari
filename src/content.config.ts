import { defineCollection } from "astro:content";
import type { CollectionConfig } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

type PostData = {
	title: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	image: string;
	tags: string[];
	category: string | null;
	lang: string;
	prevTitle: string;
	prevSlug: string;
	nextTitle: string;
	nextSlug: string;
};
const postsSchema: z.ZodType<PostData> = z.object({
	title: z.string(),
	published: z.date(),
	updated: z.date().optional(),
	draft: z.boolean().optional().default(false),
	description: z.string().optional().default(""),
	image: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	category: z.string().optional().nullable().default(""),
	lang: z.string().optional().default(""),

	/* For internal use */
	prevTitle: z.string().default(""),
	prevSlug: z.string().default(""),
	nextTitle: z.string().default(""),
	nextSlug: z.string().default(""),
});
const postsCollection: CollectionConfig<typeof postsSchema> = defineCollection({
	loader: glob({
		base: "./src/content/posts",
		pattern: "**/*.md",
		generateId: ({ entry }) => entry.replace(/\.md$/, ""),
	}),
	schema: postsSchema,
});
const specSchema: z.ZodType<object> = z.object({});
const specCollection: CollectionConfig<
	typeof specSchema
> = defineCollection({
	loader: glob({ base: "./src/content/spec", pattern: "**/*.md" }),
	schema: specSchema,
});
export const collections: {
	posts: typeof postsCollection;
	spec: typeof specCollection;
} = {
	posts: postsCollection,
	spec: specCollection,
};
