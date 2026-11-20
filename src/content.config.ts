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

/**
 * Projects: one YAML file per project, edited in Keystatic (keystatic.config.ts mirrors these fields).
 * Keystatic writes empty text fields as "" and leaves out empty images, so text is `.default('')`
 * and images are optional except the hero.
 */
const text = () => z.string().default('');
const labelValue = z.object({ label: z.string(), value: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      town: z.string(),
      sector: z.enum(['industrial', 'residential', 'renewable-energy']),
      status: z.enum(['planning', 'in-development', 'under-construction', 'now-leasing', 'completed', 'sold-out']),
      tags: z.array(z.string()).default([]),
      order: z.number().nullable().default(0),
      summary: z.string(),
      heroImage: image(),
      heroImageAlt: z.string(),
      hero: z.object({ primaryLabel: text(), secondaryLabel: text() }).default({ primaryLabel: '', secondaryLabel: '' }),
      keyFacts: z.array(labelValue).default([]),
      overview: z.object({ eyebrow: text(), heading: z.string(), lead: text(), body: text() }),
      glance: z.array(labelValue).default([]),
      brochure: z.string().nullable().optional(),
      availability: z.object({
        eyebrow: text(),
        heading: z.string(),
        intro: text(),
        sitePlan: image().nullable().optional(),
        sitePlanAlt: text(),
        sitePlanCaption: text(),
      }),
      buildings: z
        .array(
          z.object({
            name: z.string(),
            size: text(),
            clearHeight: text(),
            docks: text(),
            configuration: text(),
            status: z.enum(['leased', 'available', 'under-construction', 'build-to-suit']),
            featured: z.boolean().default(false),
            summary: text(),
            delivery: text(),
          }),
        )
        .default([]),
      location: z.object({
        eyebrow: text(),
        heading: z.string(),
        intro: text(),
        distances: z.array(labelValue).default([]),
        mapImage: image().nullable().optional(),
        mapImageAlt: text(),
        mapLink: z.string().nullable().optional(),
      }),
      process: z.object({
        eyebrow: text(),
        heading: z.string(),
        intro: text(),
        background: z.enum(['blueprint', 'plain']).default('blueprint'),
        steps: z.array(z.object({ title: z.string(), body: text() })).default([]),
      }),
      gallery: z.object({
        eyebrow: text(),
        heading: text(),
        updated: text(),
        items: z.array(z.object({ image: image(), alt: z.string(), caption: text() })).default([]),
      }),
      faq: z.object({
        eyebrow: text(),
        heading: text(),
        items: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
      }),
      cta: z.object({ eyebrow: text(), headline: text(), body: text() }),
      seo: z.object({ title: text(), description: text() }).default({ title: '', description: '' }),
    }),
});

/** Labels shared by every project page (Keystatic singleton "Projects page and labels"). */
const projectLabels = z.object({
  breadcrumbRoot: z.string(),
  keyFacts: z.string(),
  glanceHeading: z.string(),
  brochure: z.string(),
  featuredEyebrow: z.string(),
  featuredCta: z.string(),
  tableCaption: z.string(),
  columnBuilding: z.string(),
  columnSize: z.string(),
  columnClearHeight: z.string(),
  columnDocks: z.string(),
  columnConfiguration: z.string(),
  columnStatus: z.string(),
  columnDelivery: z.string(),
  statusLeased: z.string(),
  statusAvailable: z.string(),
  statusUnderConstruction: z.string(),
  statusBuildToSuit: z.string(),
  projectPlanning: z.string(),
  projectInDevelopment: z.string(),
  projectUnderConstruction: z.string(),
  projectNowLeasing: z.string(),
  projectCompleted: z.string(),
  projectSoldOut: z.string(),
  mapLink: z.string(),
  stepPrefix: z.string(),
  relatedHeading: z.string(),
  allProjects: z.string(),
  empty: z.string(),
  region: z.string(),
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
    ctaEmailLabel: z.string(),
    ctaCallPrefix: z.string(),
    footerBlurb: z.string(),
    footerLinksHeading: z.string(),
    footerContactHeading: z.string(),
    skipLinkLabel: z.string(),
    menuLabel: z.string(),
  }),
});

const sitemapPage = z.object({
  title: z.string(),
  note: z.string().optional(),
  phase: z.union([z.literal(1), z.literal(2)]),
  /** Set once the page is built. */
  href: z.string().optional(),
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
      /** The planned site structure; only on pages/sitemap.yaml. */
      sitemap: z
        .object({
          eyebrow: z.string(),
          heading: z.string(),
          intro: z.string(),
          source: z.string(),
          phase1: z.string(),
          phase2: z.string(),
          live: z.string(),
          totals: z.string(),
          legendHeading: z.string(),
          legendPhase1: z.string(),
          legendPhase2: z.string(),
          legendLive: z.string(),
          home: sitemapPage,
          sections: z.array(sitemapPage.extend({ pages: z.array(sitemapPage).default([]) })),
        })
        .optional(),
      /** Shared project-page labels; only on pages/projects.yaml. */
      projectLabels: projectLabels.optional(),
      /** Free-form sample copy used only by the /styleguide page. */
      samples: z
        .object({
          intro: z.string(),
          sections: z.record(z.string(), z.string()),
          buttons: z.record(z.string(), z.string()),
          badges: z.array(z.object({ label: z.string(), tone: z.enum(['neutral', 'brand', 'accent', 'outline', 'inverse', 'navy', 'plan', 'highlight']) })),
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
