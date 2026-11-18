import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type ProjectLabels = NonNullable<CollectionEntry<'pages'>['data']['projectLabels']>;
export type BuildingStatus = Project['data']['buildings'][number]['status'];
export type BadgeTone = 'neutral' | 'brand' | 'accent' | 'outline' | 'inverse' | 'navy' | 'plan' | 'highlight';

export async function getProjectLabels(): Promise<ProjectLabels> {
  const labels = (await getEntry('pages', 'projects'))?.data.projectLabels;
  if (!labels) throw new Error('Missing projectLabels in src/content/pages/projects.yaml');
  return labels;
}

/** Each building status gets its own Badge style. */
export function buildingStatus(status: BuildingStatus, labels: ProjectLabels): { label: string; tone: BadgeTone } {
  switch (status) {
    case 'leased':
      return { label: labels.statusLeased, tone: 'navy' };
    case 'available':
      return { label: labels.statusAvailable, tone: 'brand' };
    case 'under-construction':
      return { label: labels.statusUnderConstruction, tone: 'neutral' };
    case 'build-to-suit':
      return { label: labels.statusBuildToSuit, tone: 'plan' };
  }
}

export function projectStatusLabel(status: Project['data']['status'], labels: ProjectLabels): string {
  return {
    planning: labels.projectPlanning,
    'in-development': labels.projectInDevelopment,
    'under-construction': labels.projectUnderConstruction,
    'now-leasing': labels.projectNowLeasing,
    completed: labels.projectCompleted,
    'sold-out': labels.projectSoldOut,
  }[status];
}

export async function sectorTitles(): Promise<Record<string, string>> {
  const sectors = await getCollection('sectors');
  return Object.fromEntries(sectors.map((s) => [s.id, s.data.title]));
}

export async function getSortedProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort(
    (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || a.data.name.localeCompare(b.data.name),
  );
}

/** Up to `limit` other projects, same sector first. */
export function relatedProjects(current: Project, all: Project[], limit = 3): Project[] {
  const others = all.filter((p) => p.id !== current.id);
  const same = others.filter((p) => p.data.sector === current.data.sector);
  const rest = others.filter((p) => p.data.sector !== current.data.sector);
  return [...same, ...rest].slice(0, limit);
}

/** Text fields hold paragraphs separated by blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
