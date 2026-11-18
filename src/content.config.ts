import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      sector: z.string().optional(),
      location: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});

const sectors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sectors' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,yaml}', base: './src/content/partners' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.url().optional(),
      logo: image().optional(),
      logoAlt: z.string().optional(),
    }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.{md,yaml}', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

const settings = defineCollection({
  loader: file('./src/content/settings.yaml'),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string().optional(),
    description: z.string(),
    headline: z.string().optional(),
    intro: z.string().optional(),
  }),
});

export const collections = { projects, sectors, partners, locations, faqs, settings };
