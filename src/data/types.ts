import type { ImageMetadata } from 'astro';

export type LaneId = 'rotor' | 'prazinho' | 'talos' | 'rigor' | 'rr';

export type SimAction =
  | { kind: 'burst'; label: string; amount?: number }
  | { kind: 'toggle-down'; label: string; labelActive: string }
  | { kind: 'lose-response'; label: string };

export interface SimCounter {
  /** Campo de LaneCounts exibido. */
  field: 'done' | 'hollow' | 'failed' | 'diverted' | 'waiting';
  label: string;
}

export interface Screenshot {
  src: ImageMetadata;
  alt: string;
}

/** Mídia principal do capítulo: vídeo da interface real ou imagem grande. */
export type ChapterMedia =
  | { kind: 'video'; src: string; poster: string; width: number; height: number; label: string; phone?: Screenshot }
  | { kind: 'image'; image: Screenshot; label: string; phone?: Screenshot };

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
  /** Categoria curta para a lista de trabalhos (ex.: "Trading · pessoal"). */
  category: string;
  year: string;
  /** Prévia da lista de trabalhos quando o projeto não tem mídia própria. */
  indexImage?: Screenshot;
  /** Uma linha: o que é e o estado atual. */
  line: string;
  /** Parágrafo curto que explica o ponto do projeto. */
  lead: string;
  facts: string[];
  stack: string[];
  media?: ChapterMedia;
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
  /** Cor que pinta a linha da trajetória no hover e quando aberta. */
  color: string;
}
