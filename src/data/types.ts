import type { ImageMetadata } from 'astro';

export type ProjectStatus = 'producao' | 'ativo' | 'academico' | 'encerrado';

export interface FlowNode {
  label: string;
  meta?: string;
  /** Marca o nó com o ponto verde de "vivo" (ex.: fonte da verdade, processo em produção). */
  live?: boolean;
}

export interface Flow {
  title: string;
  caption?: string;
  /** Cada camada é uma linha do diagrama; o fluxo desce de uma camada para a próxima. */
  layers: FlowNode[][];
}

export interface Screenshot {
  src: ImageMetadata;
  alt: string;
}

export type ProjectVisual =
  | { kind: 'flow'; flow: Flow }
  | { kind: 'screens'; screens: Screenshot[]; caption: string };

export interface CaseSection {
  title: string;
  body?: string[];
  bullets?: string[];
}

export interface FeaturedProject {
  slug: string;
  name: string;
  formerName?: string;
  tagline: string;
  summary: string;
  status: ProjectStatus;
  statusLabel: string;
  period: string;
  role: string;
  highlights: string[];
  facts: string[];
  stack: string[];
  visual: ProjectVisual;
  sections: CaseSection[];
}

export interface MinorProject {
  name: string;
  description: string;
  stack: string;
  year: string;
  url?: string;
}

export interface Experience {
  period: string;
  org: string;
  role: string;
  description: string;
  current?: boolean;
}

export interface Principle {
  title: string;
  body: string;
  evidence: string;
}

export interface StackGroup {
  label: string;
  items: string[];
}
