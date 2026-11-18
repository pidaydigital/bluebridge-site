# Blue Bridge Development — website

Astro 7 + TypeScript (strict) + Tailwind CSS 4, deployed to Vercel via `@astrojs/vercel`. Sitemap via `@astrojs/sitemap`.

## Commands

- `npm run dev` — local dev server
- `npm run build` — type-check (`astro check`) then build
- `npm run preview` — preview the production build

## Structure

- `src/content/` — all site copy. Collections are defined in `src/content.config.ts`:
  `projects/`, `sectors/`, `partners/`, `locations/`, `faqs/`, and `settings.yaml` (site-wide settings + page copy).
- `src/components/ui/` — small reusable primitives (buttons, cards, etc.)
- `src/components/sections/` — page sections composed from UI components
- `src/components/seo/` — `SEO.astro` (title, description, canonical, Open Graph, Twitter)
- `src/layouts/BaseLayout.astro` — the shared HTML shell; renders the SEO component
- `src/actions/` — Astro Actions (server-side form handling, etc.)
- `src/pages/` — routes
- `src/assets/images/` — images processed by Astro (use these, not `public/`, for content images)

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
