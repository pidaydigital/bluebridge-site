import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Keystatic content editor (/keystatic).
 *
 * Storage: local files while developing. Set PUBLIC_KEYSTATIC_STORAGE=github (plus the GitHub App
 * keys described in KEYSTATIC.md) to edit the live site; every save becomes a commit on `main`.
 *
 * Field shapes here must match the `projects` and `pages` schemas in src/content.config.ts.
 */

const storage =
  // Read in the browser too, so it must be a PUBLIC_ variable (it is not a secret).
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: 'pidaydigital/bluebridge-site' } as const)
    : ({ kind: 'local' } as const);

const projectImage = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: 'src/assets/images/projects',
    publicPath: '../../assets/images/projects/',
  });

const labelValue = (itemLabel: string) =>
  fields.object({
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    value: fields.text({ label: 'Value', validation: { isRequired: true } }),
  }, { label: itemLabel });

const sectionIntro = {
  eyebrow: fields.text({ label: 'Eyebrow (small label above the heading)' }),
  heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
  intro: fields.text({ label: 'Intro', multiline: true }),
};

export default config({
  storage,
  ui: {
    brand: { name: 'Blue Bridge Development' },
    navigation: { Projects: ['projects', 'projectsPage'] },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      columns: ['name', 'town'],
      schema: {
        name: fields.slug({
          name: { label: 'Project name', validation: { isRequired: true } },
          slug: { label: 'Web address', description: 'Used in the URL: /projects/<web address>' },
        }),
        town: fields.text({ label: 'Town', validation: { isRequired: true } }),
        sector: fields.select({
          label: 'Sector',
          options: [
            { label: 'Industrial', value: 'industrial' },
            { label: 'Residential', value: 'residential' },
            { label: 'Renewable Energy', value: 'renewable-energy' },
          ],
          defaultValue: 'industrial',
        }),
        status: fields.select({
          label: 'Project status',
          options: [
            { label: 'Planning', value: 'planning' },
            { label: 'In development', value: 'in-development' },
            { label: 'Under construction', value: 'under-construction' },
            { label: 'Now leasing', value: 'now-leasing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Sold out', value: 'sold-out' },
          ],
          defaultValue: 'in-development',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Extra hero badges',
          description: 'Short labels shown next to the status, e.g. "Build-to-suit available".',
          itemLabel: (p) => p.value || 'Tag',
        }),
        order: fields.integer({ label: 'Sort order', description: 'Lower numbers list first.', defaultValue: 0 }),
        summary: fields.text({
          label: 'Summary',
          description: 'Hero intro sentence. Also used on project cards and as the search description fallback.',
          multiline: true,
          validation: { isRequired: true },
        }),
        heroImage: projectImage('Hero photo', 'Aerial or exterior photo, 1600×1000 or larger. Shown under a navy overlay.'),
        heroImageAlt: fields.text({ label: 'Hero photo description (alt text)', validation: { isRequired: true } }),
        hero: fields.object({
          primaryLabel: fields.text({ label: 'Main button label', defaultValue: 'Request the site package' }),
          secondaryLabel: fields.text({ label: 'Second button label', defaultValue: 'See available buildings' }),
        }, { label: 'Hero buttons' }),
        keyFacts: fields.array(labelValue('Key fact'), {
          label: 'Key facts (card overlapping the hero)',
          itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}`,
        }),
        overview: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
          lead: fields.text({ label: 'Lead paragraph', multiline: true }),
          body: fields.text({ label: 'Story', description: 'Separate paragraphs with a blank line.', multiline: true }),
        }, { label: 'The project (story)' }),
        glance: fields.array(labelValue('Row'), {
          label: '"At a glance" rows',
          itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}`,
        }),
        brochure: fields.file({
          label: 'Brochure (PDF)',
          description: 'Optional. Adds a download link under "At a glance".',
          directory: 'public/files/projects',
          publicPath: '/files/projects/',
        }),
        availability: fields.object({
          ...sectionIntro,
          sitePlan: projectImage('Site plan image', 'Upload the site plan drawing or rendering.'),
          sitePlanAlt: fields.text({ label: 'Site plan description (alt text)' }),
          sitePlanCaption: fields.text({ label: 'Site plan caption' }),
        }, { label: 'Site plan and availability' }),
        buildings: fields.array(
          fields.object({
            name: fields.text({ label: 'Building', validation: { isRequired: true } }),
            size: fields.text({ label: 'Size', description: 'e.g. 120,000 SF' }),
            clearHeight: fields.text({ label: 'Clear height', description: 'e.g. 32′' }),
            docks: fields.text({ label: 'Dock doors' }),
            configuration: fields.text({ label: 'Configuration', description: 'e.g. Cross-dock, Rear-load' }),
            status: fields.select({
              label: 'Status',
              options: [
                { label: 'Leased', value: 'leased' },
                { label: 'Available', value: 'available' },
                { label: 'Under construction', value: 'under-construction' },
                { label: 'Build-to-suit', value: 'build-to-suit' },
              ],
              defaultValue: 'available',
            }),
            featured: fields.checkbox({
              label: 'Feature this building',
              description: 'Shows it in the dark "Available now" card beside the site plan.',
            }),
            summary: fields.text({ label: 'Featured card description', multiline: true }),
            delivery: fields.text({ label: 'Delivery', description: 'e.g. Q3 2027' }),
          }),
          { label: 'Buildings', itemLabel: (p) => `${p.fields.name.value} (${p.fields.status.value})` },
        ),
        location: fields.object({
          ...sectionIntro,
          distances: fields.array(labelValue('Distance'), {
            label: 'Distances',
            itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}`,
          }),
          mapImage: projectImage('Map image', 'Optional static map. Without one, a simple location panel shows.'),
          mapImageAlt: fields.text({ label: 'Map description (alt text)' }),
          mapLink: fields.url({ label: 'Map link', description: 'Optional, e.g. a Google Maps link.' }),
        }, { label: 'Location and access' }),
        process: fields.object({
          ...sectionIntro,
          background: fields.select({
            label: 'Background',
            options: [
              { label: 'Blueprint grid and bridge drawing', value: 'blueprint' },
              { label: 'Plain', value: 'plain' },
            ],
            defaultValue: 'blueprint',
          }),
          steps: fields.array(
            fields.object({
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              body: fields.text({ label: 'Text', multiline: true }),
            }),
            { label: 'Steps', itemLabel: (p) => p.fields.title.value },
          ),
        }, { label: 'Our role (process)' }),
        gallery: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          heading: fields.text({ label: 'Heading' }),
          updated: fields.text({ label: 'Updated note', description: 'e.g. Updated March 2027' }),
          items: fields.array(
            fields.object({
              image: projectImage('Photo'),
              alt: fields.text({ label: 'Photo description (alt text)', validation: { isRequired: true } }),
              caption: fields.text({ label: 'Caption' }),
            }),
            { label: 'Photos', description: 'The first photo is shown full width.', itemLabel: (p) => p.fields.alt.value || 'Photo' },
          ),
        }, { label: 'Gallery' }),
        faq: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          heading: fields.text({ label: 'Heading' }),
          items: fields.array(
            fields.object({
              question: fields.text({ label: 'Question', validation: { isRequired: true } }),
              answer: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
            }),
            { label: 'Questions', itemLabel: (p) => p.fields.question.value },
          ),
        }, { label: 'FAQ' }),
        cta: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          body: fields.text({ label: 'Text', multiline: true }),
        }, { label: 'Closing call to action' }),
        seo: fields.object({
          title: fields.text({ label: 'Search title', description: 'Defaults to the project name.' }),
          description: fields.text({ label: 'Search description', description: 'Defaults to the summary.', multiline: true }),
        }, { label: 'Search (SEO)' }),
      },
    }),
  },
  singletons: {
    projectsPage: singleton({
      label: 'Projects page and labels',
      path: 'src/content/pages/projects',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Page title', validation: { isRequired: true } }),
        description: fields.text({ label: 'Search description', multiline: true, validation: { isRequired: true } }),
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline', validation: { isRequired: true } }),
          intro: fields.text({ label: 'Intro', multiline: true }),
        }, { label: 'Hero' }),
        projectLabels: fields.object({
          breadcrumbRoot: fields.text({ label: 'Breadcrumb: projects' }),
          keyFacts: fields.text({ label: 'Key facts (screen-reader label)' }),
          glanceHeading: fields.text({ label: '"At a glance" heading' }),
          brochure: fields.text({ label: 'Brochure link' }),
          featuredEyebrow: fields.text({ label: 'Featured building eyebrow' }),
          featuredCta: fields.text({ label: 'Featured building button' }),
          tableCaption: fields.text({ label: 'Buildings table caption' }),
          columnBuilding: fields.text({ label: 'Column: building' }),
          columnSize: fields.text({ label: 'Column: size' }),
          columnClearHeight: fields.text({ label: 'Column: clear height' }),
          columnDocks: fields.text({ label: 'Column: dock doors' }),
          columnConfiguration: fields.text({ label: 'Column: configuration' }),
          columnStatus: fields.text({ label: 'Column: status' }),
          columnDelivery: fields.text({ label: 'Featured card: delivery' }),
          statusLeased: fields.text({ label: 'Building status: leased' }),
          statusAvailable: fields.text({ label: 'Building status: available' }),
          statusUnderConstruction: fields.text({ label: 'Building status: under construction' }),
          statusBuildToSuit: fields.text({ label: 'Building status: build-to-suit' }),
          projectPlanning: fields.text({ label: 'Project status: planning' }),
          projectInDevelopment: fields.text({ label: 'Project status: in development' }),
          projectUnderConstruction: fields.text({ label: 'Project status: under construction' }),
          projectNowLeasing: fields.text({ label: 'Project status: now leasing' }),
          projectCompleted: fields.text({ label: 'Project status: completed' }),
          projectSoldOut: fields.text({ label: 'Project status: sold out' }),
          mapLink: fields.text({ label: 'Map link label' }),
          stepPrefix: fields.text({ label: 'Step prefix (screen readers)' }),
          relatedHeading: fields.text({ label: 'Related projects heading' }),
          allProjects: fields.text({ label: '"All projects" link' }),
          empty: fields.text({ label: 'Message when there are no projects' }),
          region: fields.text({ label: 'Region after the town', description: 'e.g. South Carolina' }),
        }, { label: 'Labels used on every project page' }),
      },
    }),
  },
});
