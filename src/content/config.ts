import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    categories: z.array(z.string()),
    github: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { posts };
