import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/* ---------- Shared building blocks (mirror the section component props) ---------- */

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const hero = z.object({
  eyebrow: z.string().optional(),
  headline: z.string(),
  intro: z.string().optional(),
  primary: link.optional(),
  secondary: link.optional(),
});

const stat = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

const step = z.object({
  title: z.string(),
  body: z.string(),
});

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const cta = z.object({
  eyebrow: z.string().optional(),
  headline: z.string(),
  body: z.string().optional(),
  primary: link,
  secondary: link.optional(),
});

const sectionIntro = {
  eyebrow: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
};

/* ---------- Collections ---------- */

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      sector: z.string().optional(),
      location: z.string().optional(),
      status: z.string().optional(),
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

/** Site-wide settings: brand, contact details, navigation. Single entry: `site`. */
const settings = defineCollection({
  loader: file('./src/content/settings.yaml'),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    description: z.string(),
    region: z.string(),
    phone: z.string(),
    phoneHref: z.string(),
    email: z.email(),
    logoAlt: z.string(),
    nav: z.array(link),
    headerCta: link,
    footerBlurb: z.string(),
    footerLinksHeading: z.string(),
    footerContactHeading: z.string(),
    skipLinkLabel: z.string(),
    menuLabel: z.string(),
  }),
});

/** Per-page copy. Each optional block maps to a section component. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      noindex: z.boolean().default(false),
      hero: hero.optional(),
      sectorsSection: z.object(sectionIntro).optional(),
      statBand: z.object({ heading: z.string().optional(), stats: z.array(stat) }).optional(),
      projects: z
        .object({
          ...sectionIntro,
          items: z.array(
            z.object({
              title: z.string(),
              summary: z.string(),
              sector: z.string().optional(),
              location: z.string().optional(),
              status: z.string().optional(),
              image: image(),
              imageAlt: z.string(),
              href: z.string().optional(),
            }),
          ),
        })
        .optional(),
      process: z.object({ ...sectionIntro, steps: z.array(step) }).optional(),
      faq: z.object({ ...sectionIntro, items: z.array(faqItem) }).optional(),
      cta: cta.optional(),
      /** Free-form sample copy used only by the /styleguide page. */
      samples: z
        .object({
          intro: z.string(),
          sections: z.record(z.string(), z.string()),
          buttons: z.record(z.string(), z.string()),
          badges: z.array(z.object({ label: z.string(), tone: z.enum(['neutral', 'brand', 'accent', 'outline', 'inverse']) })),
          stats: z.array(stat),
          cards: z.array(
            z.object({
              eyebrow: z.string().optional(),
              title: z.string(),
              body: z.string(),
              href: z.string().optional(),
              linkLabel: z.string().optional(),
              image: image().optional(),
              imageAlt: z.string().optional(),
            }),
          ),
          colors: z.array(z.object({ name: z.string(), token: z.string(), note: z.string() })),
          type: z.array(
            z.object({
              token: z.enum(['display', 'h1', 'h2', 'h3', 'h4', 'lead', 'body', 'small', 'eyebrow']),
              note: z.string(),
              sample: z.string(),
            }),
          ),
        })
        .optional(),
    }),
});

export const collections = { projects, sectors, partners, locations, faqs, settings, pages };
