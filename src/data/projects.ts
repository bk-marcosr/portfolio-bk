import type { FeaturedProject, MinorProject, ProjectStatus } from './types';
import prazinhoDashboard from '../assets/projects/prazinho-dashboard.webp';
import prazinhoVendas from '../assets/projects/prazinho-vendas.webp';
import prazinhoFechamento from '../assets/projects/prazinho-fechamento.webp';

export const STATUS_TONE: Record<ProjectStatus, 'live' | 'signal' | 'neutral'> = {
  producao: 'live',
  ativo: 'signal',
  academico: 'neutral',
  encerrado: 'neutral',
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'campanhas-platform',
    name: 'Campanhas Platform',
    tagline: 'Plataforma de campanhas e vouchers para uma rede de barbearias.',
    summary:
      'Campanhas digitais e físicas por filial, landing pages, voucher único por lead e entrega pelo WhatsApp com fila durável. Back-end, front-end, testes e operação.',
    status: 'producao',
    statusLabel: 'Em produção desde jul/2026',
    period: '2026',
    role: 'Full stack — do banco à operação',
    highlights: [
      'Monólito modular em três processos: SPA, API Express e um worker dedicado. Só o worker roda filas (BullMQ) e jobs.',
      'Contrato HTTP gerado: 147 operações do back-end e 101 chamadas do front conferidas contra OpenAPI 3.1 no CI.',
      'Segurança por padrão: cookie HttpOnly, CSRF, RBAC com escopo por filial e minimização de dados pessoais.',
    ],
    facts: ['147 operações HTTP', '10 fluxos E2E', 'Release com security gate'],
    stack: ['React 19', 'Vite', 'TanStack Query', 'Express', 'Zod', 'Prisma', 'PostgreSQL 16', 'Redis 7', 'BullMQ', 'Docker Compose', 'Traefik', 'Vitest', 'Playwright', 'GitHub Actions'],
    visual: {
      kind: 'flow',
      flow: {
        title: 'campanhas-platform · topologia de produção',
        caption: 'A API não roda migrations nem jobs. O worker é o único processo com filas habilitadas.',
        layers: [
          [{ label: 'Internet' }],
          [{ label: 'Traefik', meta: 'TLS e roteamento' }],
          [
            { label: 'SPA React', meta: 'Nginx não-root' },
            { label: 'API Express', meta: '147 operações', live: true },
          ],
          [
            { label: 'PostgreSQL 16', meta: 'fonte da verdade', live: true },
            { label: 'Redis 7', meta: 'filas BullMQ' },
          ],
          [{ label: 'Worker', meta: 'jobs · WhatsApp · Meta · SMTP' }],
        ],
      },
    },
    sections: [
      {
        title: 'Contexto',
        body: [
          'A rede precisava transformar campanhas — online e na loja — em clientes rastreáveis: captar o lead, validar a elegibilidade, emitir um voucher único e entregá-lo pelo WhatsApp. Sem perder mensagem quando um provedor cai e sem misturar dados entre filiais.',
        ],
      },
      {
        title: 'O que eu construí',
        bullets: [
          'Campanhas digitais e físicas com governança por filial.',
          'Landing pages públicas com preview administrativo, templates e arquivos persistentes.',
          'Claim de lead, elegibilidade, voucher único e histórico de entrega.',
          'Mensageria durável com worker, Redis e provedores de WhatsApp: limites, cooldown, opt-out e saúde de sessões.',
          'Dashboards com indicadores do Meta, funil, custos operacionais e exportações autorizadas.',
        ],
      },
      {
        title: 'Decisões técnicas',
        bullets: [
          'API e worker separados. Um pico de envios não disputa recurso com as rotas públicas, e só um processo mexe em fila.',
          'Contrato como fonte da verdade. O inventário de rotas gera OpenAPI 3.1, tipos do front e validadores; o CI falha se houver divergência.',
          'Fronteiras de módulo verificadas por máquina, não por convenção.',
          'Testes por camada: unidade para regra pura, integração com PostgreSQL e Redis isolados para rotas, RBAC e filas, e Playwright para fluxos de navegador — inclusive consentimento de privacidade.',
        ],
      },
      {
        title: 'Resultado',
        body: [
          'V1 validada e implantada em 27/07/2026, com tag de release apontando para o código efetivamente em produção. A V1 está em manutenção corretiva e a V2 avança com migrations aditivas, preservando os fluxos que já rodam.',
        ],
      },
    ],
  },
  {
    slug: 'rotor',
    name: 'Rotor',
    formerName: 'TradeMind',
    tagline: 'Robô de trading spot com execução real na Binance, feito para nunca ordenar duas vezes.',
    summary:
      'Painel pessoal que analisa o mercado, decide e executa ordens a cada minuto, com trava de execução, IDs idempotentes e reconciliação de posição.',
    status: 'producao',
    statusLabel: 'Em operação desde set/2026',
    period: '2025 — 2026',
    role: 'Projeto pessoal — produto, back-end e interface',
    highlights: [
      'Cada ordem nasce como tentativa registrada, com identificador próprio, antes de chegar à exchange.',
      'Se a resposta da Binance se perde, novas ordens ficam bloqueadas até a reconciliação provar o que aconteceu.',
      'Chaves da exchange só no servidor (Vault). O acesso é conferido no back-end, não só na tela.',
    ],
    facts: ['8 Edge Functions', '22 migrations', 'Ciclo a cada 1 min'],
    stack: ['React', 'TypeScript', 'Vite', 'TanStack Query', 'Supabase Auth', 'PostgreSQL', 'RLS', 'Vault', 'Cron', 'Edge Functions (Deno)', 'Binance Spot API'],
    visual: {
      kind: 'flow',
      flow: {
        title: 'rotor · caminho de uma ordem real',
        caption: 'Resultado incerto bloqueia a próxima ordem até a reconciliação.',
        layers: [
          [{ label: 'Agendador', meta: 'a cada 1 minuto' }],
          [{ label: 'Edge Function', meta: 'acesso, saldo e limites de risco' }],
          [{ label: 'Tentativa registrada', meta: 'ID idempotente + trava', live: true }],
          [{ label: 'Binance Spot API', meta: 'ordem a mercado' }],
          [{ label: 'PostgreSQL', meta: 'operação e posição na mesma transação', live: true }],
        ],
      },
    },
    sections: [
      {
        title: 'Contexto',
        body: [
          'Automatizar compra e venda com dinheiro real muda a régua: um timeout de rede pode virar compra duplicada. O objetivo foi operar uma única conta com segurança antes de pensar em rentabilidade.',
        ],
      },
      {
        title: 'O que eu construí',
        bullets: [
          'Painel em quatro seções: Terminal, Robô, Carteira e Alertas.',
          'Modo simulação com saldo fictício e gravação atômica: se uma parte falha, nada fica pela metade.',
          'Modo real com ordens enviadas pelo servidor e botões manuais marcados como REAL.',
          'Estratégia técnica adaptativa, controle de exposição e alertas.',
        ],
      },
      {
        title: 'Decisões técnicas',
        bullets: [
          'Tentativa antes da ordem: o servidor grava a intenção com ID idempotente, envia à Binance e só então grava operação e posição juntas.',
          'Incerteza bloqueia. Em set/2026 uma compra de BNB ficou com resultado incerto e travou as ordens seguintes. A reconciliação consultou o ID e o histórico na Binance, provou que a ordem não existia e liberou o fluxo — sem compra duplicada.',
          'Trocar entre simulação e real desativa a automação até nova revisão das configurações.',
        ],
      },
      {
        title: 'Resultado e limites',
        body: [
          'Validado em produção em 12/09/2026: autenticação, conexão com a Binance, ciclos automáticos, integridade das ordens, segredos e build. Atende um único proprietário, e o próprio projeto deixa claro que funcionar tecnicamente não garante lucro.',
        ],
      },
    ],
  },
  {
    slug: 'prazinho',
    name: 'Prazinho',
    formerName: 'FinançaFácil',
    tagline: 'Gestão financeira para pequenos negócios e revendedores.',
    summary:
      'Vendas à vista e a prazo, compras com fornecedores, estoque, fechamento mensal e finanças pessoais em um só lugar.',
    status: 'ativo',
    statusLabel: 'Em desenvolvimento ativo',
    period: '2026',
    role: 'Produto, design e engenharia',
    highlights: [
      'Row Level Security em todas as tabelas: a chave do front é pública e o banco decide o que cada usuário vê.',
      'Modo demonstração com back-end em memória para revisar o design com dados fictícios, sem tocar no banco real.',
      'Relatórios em PDF e backup exportável direto do app.',
    ],
    facts: ['16 migrations', 'RLS em todas as tabelas', 'Testes com Vitest'],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Recharts', 'Supabase', 'Vitest', 'Vercel'],
    visual: {
      kind: 'screens',
      caption: 'Telas reais do app em modo demonstração, com dados fictícios.',
      screens: [
        { src: prazinhoDashboard, alt: 'Prazinho — visão geral com dinheiro em caixa, valores a receber e a pagar' },
        { src: prazinhoVendas, alt: 'Prazinho — lista de vendas à vista e a prazo' },
        { src: prazinhoFechamento, alt: 'Prazinho — fechamento mensal' },
      ],
    },
    sections: [
      {
        title: 'Contexto',
        body: [
          'Pequeno revendedor costuma controlar venda parcelada em caderno ou planilha: perde a data da parcela, não sabe quanto tem a receber e mistura o dinheiro da loja com o pessoal.',
        ],
      },
      {
        title: 'O que eu construí',
        bullets: [
          'Vendas à vista e a prazo, com parcelas, vencimentos e atrasos.',
          'Compras e contas a pagar por fornecedor.',
          'Estoque com alerta de reposição.',
          'Fechamento mensal e finanças pessoais separadas do caixa do negócio.',
          'Relatórios em PDF e backup exportável.',
        ],
      },
      {
        title: 'Decisões técnicas',
        bullets: [
          'RLS em todas as tabelas. A única chave no front é a pública; a regra de acesso vive no Postgres.',
          'Cliente de demonstração em memória, escolhido por variável de ambiente no build. Revisar design nunca toca dado real.',
          'Design system por tokens, o que permitiu o rebrand de FinançaFácil para Prazinho sem reescrever telas.',
        ],
      },
      {
        title: 'Resultado',
        body: ['Rebrand e novo design entregues em out/2026. O produto segue em evolução contínua.'],
      },
    ],
  },
  {
    slug: 'rigor',
    name: 'Rigor',
    tagline: 'Análise fundamentalista das empresas da B3 com dados oficiais da CVM.',
    summary:
      'Pipeline em Python que coleta as demonstrações anuais de 2010 a 2025, calcula 12 indicadores e publica a base para um painel web.',
    status: 'academico',
    statusLabel: 'Projeto acadêmico',
    period: '2026',
    role: 'Pipeline de dados e interface web',
    highlights: [
      'Coleta, importação, cálculo, exportação e auditoria orquestrados por um único ponto de entrada, com modo offline.',
      'Cada indicador guarda a fórmula e a operação com os nomes das contas, para conferência.',
      'Valor ausente fica vazio. Não vira zero.',
    ],
    facts: ['2010 — 2025', '12 indicadores', 'SQLite · CSV · Supabase'],
    stack: ['Python', 'SQLite', 'PostgreSQL (Supabase)', 'React', 'TypeScript', 'Vite'],
    visual: {
      kind: 'flow',
      flow: {
        title: 'rigor · pipeline de dados',
        caption: 'Um comando reprocessa tudo; em modo offline, reaproveita os arquivos já baixados.',
        layers: [
          [
            { label: 'CVM', meta: 'DFP: BPA, BPP e DRE' },
            { label: 'B3', meta: 'cadastro e classificação' },
          ],
          [{ label: 'preparar_base.py', meta: 'coleta → cálculo → auditoria' }],
          [
            { label: 'SQLite + CSV', meta: 'base_empresas', live: true },
            { label: 'Supabase', meta: 'leitura pública (anon)' },
          ],
          [{ label: 'Painel web', meta: 'React + TypeScript' }],
        ],
      },
    },
    sections: [
      {
        title: 'Contexto',
        body: [
          'A disciplina pedia indicadores fundamentalistas de todas as empresas da B3 ao longo de 15 anos, a partir dos arquivos brutos da CVM — que mudam de formato com o tempo e têm lacunas.',
        ],
      },
      {
        title: 'O que eu construí',
        bullets: [
          'Coleta automática das demonstrações anuais (BPA, BPP e DRE) e do cadastro de empresas da B3.',
          'Tratamento dos dados e cálculo dos 12 indicadores pedidos.',
          'Banco SQLite e arquivos CSV como entrega, mais envio da base ao Supabase.',
          'Painel web com o resumo de todas as empresas e detalhes carregados sob demanda.',
          'Guia do código arquivo por arquivo, para estudo.',
        ],
      },
      {
        title: 'Decisões técnicas',
        bullets: [
          'Um ponto de entrada coordena todas as etapas; reprocessar é um comando, e o modo offline dispensa a internet.',
          'O painel lê com a chave pública, que só tem permissão de leitura.',
          'O resumo carrega de uma vez; contas, dados de mercado e termos de cada indicador só quando a empresa é aberta.',
        ],
      },
      {
        title: 'Resultado',
        body: ['Base de 2010 a 2025 navegável em um painel web, com cada número rastreável até a conta de origem.'],
      },
    ],
  },
];

export const otherProjects: MinorProject[] = [
  {
    name: 'Ecossistema Talos',
    description: 'Atendimento no WhatsApp com IA: motor em Node.js com Baileys e Gemini, e painel em Next.js para montar fluxos em nós.',
    stack: 'Node.js · Express · Next.js · React Flow',
    year: '2026',
  },
  {
    name: 'BK Flow',
    description: 'SaaS para agências: calendário editorial, aprovação e publicação no Instagram pela Meta Graph API.',
    stack: 'React · Supabase · Edge Functions',
    year: '2026',
  },
  {
    name: 'Pleno Movimento',
    description: 'Gestão de studio de pilates: alunos, aulas, agenda, pagamentos e portal do aluno.',
    stack: 'React · Supabase · RLS',
    year: '2026',
  },
  {
    name: 'AgendaLink',
    description: 'Agendamento online para autônomos, com pagamento pelo Stripe Checkout.',
    stack: 'React · Supabase · Stripe',
    year: '2026',
  },
  {
    name: 'OrçaPro',
    description: 'Orçamentos em PDF para freelancers e MEIs.',
    stack: 'React · Supabase · react-pdf',
    year: '2026',
  },
  {
    name: 'BK Echo',
    description: 'Transcrição de áudio e geração de documentos com IA, com aprovação humana antes de publicar.',
    stack: 'Next.js · OpenAI · Supabase',
    year: '2026',
  },
  {
    name: 'CVM Extract',
    description: 'Extração de demonstrações financeiras da CVM em Python. Código aberto.',
    stack: 'Python',
    year: '2026',
    url: 'https://github.com/bk-marcosr/CVM_extract',
  },
];

export function getProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
