import type { Experience, Principle, StackGroup } from './types';

export const profile = {
  name: 'Marcos Gabriel',
  role: 'Desenvolvedor full stack',
  location: 'Belém, PA',
  email: 'marcosgabriel20061216@gmail.com',
  github: 'https://github.com/bk-marcosr',
  linkedin: 'https://www.linkedin.com/in/marcos-gabriel-rodrigues-ba%C3%ADa-0181022a5/',
  repo: 'https://github.com/bk-marcosr/portfolio-bk',
  headline:
    'Construo sistemas que vão para produção: plataformas com fila, pagamento e IA, e automações que tiram trabalho manual da operação.',
  description:
    'Desenvolvedor full stack em Belém (PA). Plataformas com fila, pagamento e IA, e automação de dados na RR Chevrolet.',
  now: [
    { label: 'Agora', value: 'Automação & Dados na RR Chevrolet' },
    { label: 'Formação', value: 'Sistemas de Informação · UFRA' },
    { label: 'Base', value: 'TypeScript · React · Node.js · PostgreSQL · Python' },
  ],
} as const;

export const about: string[] = [
  'Trabalho do banco de dados à interface. A parte que mais me prende é a que pouca gente mostra: fila que não perde mensagem, ordem que não pode duplicar, dado que precisa bater com a fonte oficial.',
  'Hoje divido o tempo entre a automação de dados na RR Chevrolet, a faculdade de Sistemas de Informação na UFRA e projetos sob a BKode. Gosto de problema com regra de negócio de verdade e de deixar o sistema documentado para quem vem depois.',
];

export const principles: Principle[] = [
  {
    title: 'Regra crítica mora no banco',
    body: 'Isolamento por usuário ou filial fica em Row Level Security e constraints, não espalhado em ifs no front.',
    evidence: 'RLS em todas as tabelas do Prazinho · escopo por filial na Campanhas Platform',
  },
  {
    title: 'Dinheiro exige idempotência',
    body: 'Toda ordem nasce como tentativa registrada com ID próprio. Resultado incerto bloqueia a próxima até a reconciliação.',
    evidence: 'Execução de ordens do Rotor',
  },
  {
    title: 'Ausência de dado não é zero',
    body: 'Lacuna fica vazia e explícita. Número inventado para fechar gráfico é bug, não arredondamento.',
    evidence: 'Indicadores do Rigor · métricas da Campanhas Platform',
  },
  {
    title: 'Documentação é parte da entrega',
    body: 'Contrato de API gerado, decisões registradas e runbook de release. O próximo dev não deveria precisar de mim.',
    evidence: 'OpenAPI 3.1 gerado e ADRs na Campanhas · comprovante de validação do Rotor',
  },
];

export const experience: Experience[] = [
  {
    period: '2026 — atual',
    org: 'RR Chevrolet',
    role: 'Automação & Dados',
    description:
      'Robôs RPA (Rocketbot + Python) que extraem eventos do CRM, conciliam com a base de leads de campanhas e geram dashboard e relatório de KPI. Reorganizei os robôs em orquestrador + módulos isolados e corrigi a janela de conciliação, eliminando cerca de 92% dos falsos positivos.',
    current: true,
  },
  {
    period: '2024 — atual',
    org: 'BKode',
    role: 'Fundador · desenvolvedor',
    description:
      'Produtos próprios e projetos para clientes: plataforma de campanhas para rede de barbearias, gestão de studio de pilates, agendamento com pagamento e SaaS financeiros.',
    current: true,
  },
  {
    period: '2026 — atual',
    org: 'UTIC — Empresa Júnior de TI da UFRA',
    role: 'Diretor Administrativo-Financeiro',
    description: 'Estrutura financeira da empresa júnior e política interna de alocação de recursos.',
  },
  {
    period: 'Em curso',
    org: 'UFRA',
    role: 'Bacharelado em Sistemas de Informação',
    description: 'Universidade Federal Rural da Amazônia, Belém (PA).',
  },
];

export const stack: StackGroup[] = [
  { label: 'Linguagens', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
  { label: 'Front-end', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'TanStack Query', 'shadcn/ui'] },
  { label: 'Back-end', items: ['Node.js', 'Express', 'Zod', 'Prisma', 'Supabase Edge Functions'] },
  { label: 'Dados e filas', items: ['PostgreSQL', 'Row Level Security', 'Redis', 'BullMQ', 'SQLite'] },
  { label: 'Qualidade e entrega', items: ['Vitest', 'Playwright', 'Docker Compose', 'GitHub Actions', 'Vercel'] },
  { label: 'Integrações e IA', items: ['Stripe', 'Binance API', 'Meta Graph API', 'WhatsApp', 'Gemini', 'OpenAI'] },
  { label: 'Automação', items: ['Rocketbot (RPA)', 'Python'] },
];
