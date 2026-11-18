# Blue Bridge Development — website

Astro 7 + TypeScript (strict) + Tailwind CSS 4, deployed to Vercel via `@astrojs/vercel`. Sitemap via `@astrojs/sitemap`.

## Commands

- `npm run dev` — local dev server
- `npm run build` — type-check (`astro check`) then build
- `npm run preview` — preview the production build

## Structure

- `src/content/` — all site copy. Collections are defined in `src/content.config.ts`:
  `projects/`, `sectors/`, `partners/`, `locations/`, `faqs/`, `pages/` (per-page copy, one YAML per page;
  blocks map to section components) and `settings.yaml` (brand, contact details, navigation).
- `src/components/ui/` — small reusable primitives (buttons, cards, etc.)
- `src/components/sections/` — page sections composed from UI components
- `src/components/seo/` — `SEO.astro` (title, description, canonical, Open Graph, Twitter) and
  `Schema.astro` (JSON-LD; builders in `src/lib/schema.ts`)
- `src/components/layout/` — `Header.astro` and `Footer.astro` (rendered by BaseLayout)
- `src/layouts/BaseLayout.astro` — the shared HTML shell; renders the SEO component
- `src/actions/` — Astro Actions (server-side form handling, etc.)
- `src/pages/` — routes
- `src/assets/images/` — images processed by Astro (use these, not `public/`, for content images)

## Design system

- Tokens live in `src/styles/global.css` (`@theme`). Brand: navy `navy-700` #2b3990 (logo), action blue
  `blue-600` #0f45b6, neutral `steel-*` (logo grey #6d6e71), sparing `accent-400`.
- Fonts are self-hosted (fontsource, OFL): Sansation for headings (`font-display`), Open Sans for body (`font-sans`).
  Never load fonts from Google or other CDNs.
- Type scale: `text-display`, `text-h1`–`text-h4`, `text-lead`, `text-body`, `text-small`, `eyebrow`, `text-stat`.
  Use these rather than arbitrary sizes. Layout helpers: `container-site`, `section`.
- Build with the existing components (`ui/`: Button, Card, Stat, Badge, SectionHeading; `sections/`: Hero,
  StatBand, ProjectGrid, ProcessSteps, CTA, FAQ) before creating new ones. Add any new component to `/styleguide`.
- Design mobile-first: base styles target phones, then layer `sm:`/`md:`/`lg:` overrides.
- `/styleguide` is an internal review page: `noindex` and excluded from the sitemap.

## Rules

1. **Pages are static by default.** Every page is prerendered. Only opt a page out with
   `export const prerender = false` when it genuinely needs on-demand rendering (e.g. it calls an Action).
2. **All copy lives in `src/content`.** Don't hard-code user-facing text in pages or components —
   add it to a collection or `settings.yaml` and read it with `astro:content`. Add/extend schemas in
   `src/content.config.ts` when needed.
3. **Every page uses `BaseLayout` and an SEO component.** Pass a page-specific `title` and `description`
   to `BaseLayout`, which renders `src/components/seo/SEO.astro`.
4. **Images use Astro's `<Image />` (or `<Picture />`) from `astro:assets`, always with meaningful `alt` text.**
   Store images in `src/assets/images/` (or reference them from content via the `image()` schema helper).
   Use `alt=""` only for purely decorative images.
5. **No client-side JavaScript unless needed.** Prefer plain Astro components and CSS. Only add
   `<script>` tags or `client:*` directives when interactivity truly requires it, and use the narrowest
   hydration directive (`client:visible` / `client:idle` over `client:load`).
6. **Run `npm run build` before every commit.** It must pass (type-check + build) — don't commit a broken build.
