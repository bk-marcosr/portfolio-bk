import type { FeaturedProject, MinorProject } from './types';
import { COLORS } from '../scripts/sim/lanes';
import prazinhoDashboard from '../assets/projects/prazinho-dashboard.webp';
import prazinhoVendas from '../assets/projects/prazinho-vendas.webp';
import prazinhoFechamento from '../assets/projects/prazinho-fechamento.webp';

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'campanhas-platform',
    lane: 'campanhas',
    color: COLORS.campanhas,
    name: 'Campanhas Platform',
    line: 'Campanhas e vouchers para uma rede de barbearias. Em produção desde julho de 2026.',
    lead: 'O lead entra pela landing page, recebe um voucher único e a mensagem sai pelo WhatsApp. Se o provedor cair, nada se perde: a fila segura e o worker retoma de onde parou.',
    facts: [
      '147 operações HTTP com contrato OpenAPI gerado e conferido no CI.',
      'API e worker em processos separados — só o worker mexe na fila.',
      '10 fluxos de ponta a ponta no Playwright, inclusive consentimento de privacidade.',
    ],
    stack: ['React 19', 'Express', 'Prisma', 'PostgreSQL 16', 'Redis', 'BullMQ', 'Docker', 'Playwright'],
    sim: {
      actions: [
        { kind: 'burst', label: 'Disparar campanha', amount: 24 },
        { kind: 'toggle-down', label: 'Derrubar o provedor', labelActive: 'Religar o provedor' },
      ],
      counters: [
        { field: 'done', label: 'entregues' },
        { field: 'waiting', label: 'na fila' },
      ],
      caption: 'Derruba o provedor no meio de um disparo: a fila cresce, nada some, e tudo sai quando ele volta.',
    },
    period: '2026',
    role: 'Full stack, do banco à operação',
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
    lane: 'rotor',
    color: COLORS.rotor,
    name: 'Rotor',
    formerName: 'TradeMind',
    line: 'Robô de trading com dinheiro real na Binance. Operando desde setembro de 2026.',
    lead: 'Cada ordem passa por uma trava antes de sair. Se a resposta da Binance se perde, nenhuma ordem nova sai até a reconciliação provar o que aconteceu. Foi isso que segurou uma compra duplicada de BNB em setembro.',
    facts: [
      'Tentativa registrada com ID idempotente antes de a ordem sair.',
      'Operação e posição gravadas na mesma transação.',
      'Chaves só no servidor. 8 Edge Functions, ciclo a cada minuto.',
    ],
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vault', 'Edge Functions', 'Binance API'],
    sim: {
      actions: [
        { kind: 'burst', label: 'Enviar ordem', amount: 1 },
        { kind: 'lose-response', label: 'Perder a resposta da Binance' },
      ],
      counters: [
        { field: 'done', label: 'executadas' },
        { field: 'failed', label: 'reconciliadas' },
        { field: 'waiting', label: 'esperando a trava' },
      ],
      caption: 'Perde a resposta de uma ordem e manda outras atrás: elas param na trava até a reconciliação liberar.',
    },
    period: '2025 — 2026',
    role: 'Projeto pessoal: produto, servidor e interface',
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
    lane: 'prazinho',
    color: COLORS.prazinho,
    name: 'Prazinho',
    formerName: 'FinançaFácil',
    line: 'Venda a prazo, estoque e fechamento do mês para pequeno revendedor.',
    lead: 'Feito para quem anota fiado no caderno. A chave que vai para o navegador é pública; quem decide o que cada usuário enxerga é o banco, com RLS em todas as tabelas.',
    facts: [
      '16 migrations versionadas.',
      'Modo demonstração com back-end em memória: revisar design nunca toca dado real.',
      'Relatório em PDF e backup exportável direto do app.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'shadcn/ui', 'Supabase', 'Vitest', 'Vercel'],
    screens: {
      items: [
        { src: prazinhoDashboard, alt: 'Prazinho: visão geral com dinheiro em caixa, a receber e a pagar' },
        { src: prazinhoVendas, alt: 'Prazinho: lista de vendas à vista e a prazo' },
        { src: prazinhoFechamento, alt: 'Prazinho: fechamento do mês' },
      ],
      caption: 'Telas reais, no modo demonstração do próprio app (dados fictícios).',
    },
    period: '2026',
    role: 'Produto, design e engenharia',
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
    lane: 'rigor',
    color: COLORS.rigor,
    name: 'Rigor',
    line: 'Quinze anos de balanços da CVM viram doze indicadores por empresa da B3.',
    lead: 'Pipeline em Python, um comando só, com modo offline. Quando falta dado na fonte, o indicador fica em branco. Não vira zero.',
    facts: [
      'De 2010 a 2025, todas as empresas listadas.',
      'Cada indicador guarda a fórmula e as contas de origem.',
      'Painel web lendo o Supabase só com chave de leitura.',
    ],
    stack: ['Python', 'SQLite', 'Supabase', 'React', 'TypeScript'],
    sim: {
      actions: [{ kind: 'burst', label: 'Processar uma empresa', amount: 12 }],
      counters: [
        { field: 'done', label: 'calculados' },
        { field: 'hollow', label: 'em branco' },
      ],
      caption: 'Os quadrados vazados são indicadores sem dado na fonte: entram na conta como vazio, não como zero.',
    },
    period: '2026',
    role: 'Pipeline de dados e painel web',
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
  { name: 'Ecossistema Talos', description: 'Atendimento no WhatsApp com IA: motor em Node.js com Baileys e Gemini, painel em Next.js para montar fluxos.', stack: 'Node.js, Next.js, React Flow', year: '2026' },
  { name: 'BK Flow', description: 'Calendário editorial, aprovação e publicação no Instagram para agências.', stack: 'React, Supabase, Meta Graph', year: '2026' },
  { name: 'Pleno Movimento', description: 'Gestão de studio de pilates: alunos, aulas, agenda, pagamentos e portal do aluno.', stack: 'React, Supabase', year: '2026' },
  { name: 'AgendaLink', description: 'Agendamento para autônomos com pagamento pelo Stripe.', stack: 'React, Supabase, Stripe', year: '2026' },
  { name: 'OrçaPro', description: 'Orçamento em PDF para freelancer e MEI.', stack: 'React, Supabase', year: '2026' },
  { name: 'BK Echo', description: 'Transcrição de áudio e geração de documento com IA, com aprovação humana.', stack: 'Next.js, OpenAI', year: '2026' },
  { name: 'CVM Extract', description: 'Extração de demonstrações financeiras da CVM. Código aberto.', stack: 'Python', year: '2026', url: 'https://github.com/bk-marcosr/CVM_extract' },
];

export function getProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
