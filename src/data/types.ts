import type { ImageMetadata } from 'astro';

export type LaneId = 'campanhas' | 'rotor' | 'prazinho' | 'rigor' | 'rr';

export type SimAction =
  | { kind: 'burst'; label: string; amount?: number }
  | { kind: 'toggle-down'; label: string; labelActive: string }
  | { kind: 'lose-response'; label: string };

export interface SimCounter {
  /** Campo de LaneCounts exibido. */
  field: 'done' | 'hollow' | 'failed' | 'waiting';
  label: string;
}

export interface Screenshot {
  src: ImageMetadata;
  alt: string;
}

export interface CaseSection {
  title: string;
  body?: string[];
  bullets?: string[];
}

export interface FeaturedProject {
  slug: string;
  lane: LaneId;
  color: string;
  name: string;
  formerName?: string;
  /** Uma linha: o que é e o estado atual. */
  line: string;
  /** Parágrafo curto que explica o ponto do projeto. */
  lead: string;
  facts: string[];
  stack: string[];
  sim?: {
    actions: SimAction[];
    counters: SimCounter[];
    caption: string;
  };
  screens?: { items: Screenshot[]; caption: string };
  period: string;
  role: string;
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
  color?: string;
}
