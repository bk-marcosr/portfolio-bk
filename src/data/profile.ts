import type { Experience } from './types';
import { COLORS } from '../scripts/sim/lanes';

export const profile = {
  name: 'Marcos Gabriel',
  role: 'Desenvolvedor full stack',
  location: 'Belém, PA',
  email: 'marcosgabriel20061216@gmail.com',
  github: 'https://github.com/bk-marcosr',
  linkedin: 'https://www.linkedin.com/in/marcos-gabriel-rodrigues-ba%C3%ADa-0181022a5/',
  repo: 'https://github.com/bk-marcosr/portfolio-bk',
  description:
    'Desenvolvedor full stack em Belém (PA). Sistemas com fila, pagamento e dados — e automação na RR Chevrolet.',
} as const;

/**
 * Frase de abertura. Cada trecho colorido aponta para o projeto que prova aquilo.
 * `tone` usa a cor do projeto; texto sem tone fica neutro.
 */
export const statement: { text: string; tone?: keyof typeof COLORS }[] = [
  { text: 'Hoje automatizo dados na RR Chevrolet. Fora dela, construo sistemas que não podem ' },
  { text: 'perder mensagem', tone: 'campanhas' },
  { text: ', ' },
  { text: 'duplicar ordem', tone: 'rotor' },
  { text: ', ' },
  { text: 'esquecer parcela', tone: 'prazinho' },
  { text: ' nem ' },
  { text: 'inventar número', tone: 'rigor' },
  { text: '.' },
];

export const experience: Experience[] = [
  {
    period: '2026 — hoje',
    org: 'RR Chevrolet',
    role: 'Automação & Dados',
    description:
      'Robôs em Rocketbot e Python que exportam eventos do CRM, cruzam com a planilha de leads das campanhas e entregam dashboard e relatório de KPI. Reorganizei os robôs em orquestrador e módulos isolados e corrigi a janela de conciliação, cortando cerca de 92% dos falsos positivos.',
    color: COLORS.rr,
  },
  {
    period: '2024 — hoje',
    org: 'BKode',
    role: 'Fundador, desenvolvedor',
    description:
      'Produtos próprios e sistemas para clientes: a plataforma de campanhas de uma rede de barbearias, a gestão de um studio de pilates, agendamento com pagamento e os SaaS financeiros.',
  },
  {
    period: '2026 — hoje',
    org: 'UTIC',
    role: 'Diretor Administrativo-Financeiro',
    description: 'Empresa júnior de TI da UFRA. Cuido da estrutura financeira e da política de alocação de recursos.',
  },
  {
    period: 'em curso',
    org: 'UFRA',
    role: 'Sistemas de Informação',
    description: 'Universidade Federal Rural da Amazônia, Belém.',
  },
];

export const stack: { label: string; items: string }[] = [
  { label: 'Linguagens', items: 'TypeScript, JavaScript, Python, SQL' },
  { label: 'Interface', items: 'React, Next.js, Vite, Tailwind, TanStack Query' },
  { label: 'Servidor', items: 'Node.js, Express, Zod, Prisma, Supabase Edge Functions' },
  { label: 'Dados e filas', items: 'PostgreSQL com RLS, Redis, BullMQ, SQLite' },
  { label: 'Entrega', items: 'Vitest, Playwright, Docker Compose, GitHub Actions, Vercel' },
  { label: 'Integrações', items: 'Stripe, Binance, Meta Graph, WhatsApp, Gemini, OpenAI' },
];
