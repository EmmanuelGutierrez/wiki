import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const contentFolder = process.env.WIKI_CONTENT_DIR || import.meta.env?.WIKI_CONTENT_DIR || 'wiki';
const contentDir = `./src/content/${contentFolder}`;

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: contentDir }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional().default(999),
  }),
});

export const collections = { wiki };
