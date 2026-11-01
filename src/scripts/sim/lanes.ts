import type { LaneConfig } from './types';

export const COLORS = {
  campanhas: '#ef5f67',
  rotor: '#7aa2f7',
  prazinho: '#2fc68a',
  rigor: '#e9a23b',
  rr: '#a683d8',
} as const;

export const LANES: Record<keyof typeof COLORS, LaneConfig> = {
  campanhas: {
    id: 'campanhas',
    label: 'campanhas',
    color: COLORS.campanhas,
    stations: [
      { label: 'lead', kind: 'source', at: 0 },
      { label: 'fila', kind: 'queue', at: 0.34, serviceMs: 40 },
      { label: 'worker', kind: 'worker', at: 0.64, serviceMs: 380 },
      { label: 'whatsapp', kind: 'sink', at: 1 },
    ],
    spawnEveryMs: [520, 1150],
    counter: 'mensagens entregues',
    burst: 16,
  },
  rotor: {
    id: 'rotor',
    label: 'rotor',
    color: COLORS.rotor,
    stations: [
      { label: 'sinal', kind: 'source', at: 0 },
      { label: 'trava', kind: 'gate', at: 0.3, serviceMs: 140 },
      { label: 'binance', kind: 'remote', at: 0.64, serviceMs: 620 },
      { label: 'posição', kind: 'sink', at: 1 },
    ],
    spawnEveryMs: [1500, 2700],
    counter: 'ordens executadas',
    burst: 3,
    uncertainRatio: 0.07,
    reconcileMs: 2600,
  },
  prazinho: {
    id: 'prazinho',
    label: 'prazinho',
    color: COLORS.prazinho,
    stations: [
      { label: 'venda', kind: 'source', at: 0 },
      { label: 'parcelas', kind: 'worker', at: 0.42, serviceMs: 300 },
      { label: 'vencimento', kind: 'queue', at: 0.72, serviceMs: 60 },
      { label: 'recebido', kind: 'sink', at: 1 },
    ],
    spawnEveryMs: [700, 1500],
    counter: 'parcelas recebidas',
    burst: 8,
  },
  rigor: {
    id: 'rigor',
    label: 'rigor',
    color: COLORS.rigor,
    stations: [
      { label: 'cvm', kind: 'source', at: 0 },
      { label: 'cálculo', kind: 'worker', at: 0.5, serviceMs: 200 },
      { label: 'indicador', kind: 'sink', at: 1 },
    ],
    spawnEveryMs: [380, 900],
    counter: 'indicadores',
    burst: 12,
    hollowRatio: 0.22,
  },
  rr: {
    id: 'rr',
    label: 'rr chevrolet',
    color: COLORS.rr,
    stations: [
      { label: 'crm', kind: 'source', at: 0 },
      { label: 'conciliação', kind: 'worker', at: 0.46, serviceMs: 360 },
      { label: 'kpi', kind: 'sink', at: 1 },
    ],
    spawnEveryMs: [900, 1700],
    counter: 'leads conciliados',
    burst: 10,
  },
};

export const HERO_LANES: LaneConfig[] = [LANES.campanhas, LANES.rotor, LANES.prazinho, LANES.rigor, LANES.rr];
