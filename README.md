# marcos.dev

Portfólio de Marcos Gabriel — desenvolvedor full stack.

O site mostra os sistemas funcionando: o topo é uma simulação em canvas das filas, travas e pipelines dos projetos, e cada projeto tem uma simulação própria para o visitante mexer (derrubar o provedor do Campanhas, perder a resposta da Binance no Rotor, processar uma empresa no Rigor).

Astro + Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) e Lenis. Fontes Funnel Display e Funnel Sans servidas localmente.

## Rodando

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # astro check + build em dist/
npm run preview
```

Requer Node.js 22+.

## Editando conteúdo

Todo o texto do site sai de `src/data/`:

| Arquivo | O que tem |
| --- | --- |
| `src/data/profile.ts` | nome, contatos, frase de abertura, trajetória e stack |
| `src/data/projects.ts` | projetos em destaque (texto, simulação, prints, estudo de caso) e outros projetos |

Cada projeto em destaque gera uma página em `/projetos/<slug>/`. Prints ficam em `src/assets/projects/` e são otimizados no build.

## Design

Base preto, branco e cinza. Cada projeto tem a cor do próprio produto, usada só como sinal (nunca fundo, gradiente ou brilho):

| Projeto | Cor | Origem |
| --- | --- | --- |
| Campanhas Platform | `#ef5f67` | vermelho de queda do Rotor |
| Rotor | `#7aa2f7` | azul de destaque do Rotor |
| Prazinho | `#2fc68a` | verde do tema escuro original do Prazinho |
| Rigor | `#e9a23b` | âmbar de alerta do Rotor/Rigor |
| RR Chevrolet | `#a683d8` | violeta dos gráficos do Prazinho |

O motor das simulações fica em `src/scripts/sim/` (`engine.ts` simula estações, filas, trava e reconciliação; `lanes.ts` define cada sistema). Ele pausa fora da tela e respeita `prefers-reduced-motion`.

## Deploy

**Vercel (recomendado):** importe o repositório; o Astro é detectado sem configuração. O site sai na raiz do domínio.

**GitHub Pages:** o workflow `.github/workflows/deploy-pages.yml` publica a cada push na `main`. Em *Settings → Pages*, a fonte precisa estar em **GitHub Actions**. O workflow define `SITE_URL` e `BASE_PATH=/portfolio-bk`.
