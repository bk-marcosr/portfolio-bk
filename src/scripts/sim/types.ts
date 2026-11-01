export type StationKind = 'source' | 'queue' | 'worker' | 'gate' | 'remote' | 'sink';

export interface StationConfig {
  label: string;
  kind: StationKind;
  /** Posição horizontal na linha, de 0 (início) a 1 (fim). */
  at: number;
  /** Tempo de processamento de um item na estação, em ms. */
  serviceMs?: number;
  /**
   * Se o worker cair, em vez de segurar os itens ele os desvia para este destino
   * (ex.: "humano"). Sem fallback, worker fora do ar segura a fila.
   */
  fallback?: string;
}

export interface LaneConfig {
  id: string;
  label: string;
  color: string;
  stations: StationConfig[];
  /** Intervalo aleatório entre chegadas automáticas, em ms. */
  spawnEveryMs: [number, number];
  /** Texto do contador principal (ex.: "mensagens entregues"). */
  counter: string;
  /** Itens disparados quando o visitante toca na linha. */
  burst: number;
  /** Fração de itens sem dado (desenhados vazados, contados à parte). */
  hollowRatio?: number;
  /** Fração de ordens cuja resposta se perde na estação remota. */
  uncertainRatio?: number;
  /** Quanto tempo a reconciliação leva para resolver uma resposta perdida, em ms. */
  reconcileMs?: number;
}

export interface LaneCounts {
  done: number;
  hollow: number;
  failed: number;
  diverted: number;
  waiting: number;
  down: boolean;
  locked: boolean;
}
