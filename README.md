# marcos.dev

Portfólio de Marcos Gabriel — desenvolvedor full stack.

Site estático em **Astro + Tailwind CSS v4**, sem JavaScript no cliente. Fontes Geist servidas localmente, imagens otimizadas para WebP no build.

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
| `src/data/profile.ts` | nome, contatos, resumo, experiência, princípios e stack |
| `src/data/projects.ts` | projetos em destaque (estudos de caso, diagramas, prints) e lista de outros projetos |

Cada projeto em destaque gera uma página em `/projetos/<slug>/`. Prints ficam em `src/assets/projects/` e são otimizados no build.

## Design

Base preto, branco e cinza. Cor só como sinal:

- **verde `#2fc68a`** (do Prazinho, design dark original) — estado vivo: em produção, atual, resultado;
- **azul `#7aa2f7`** (do Rotor) — estrutura e interação: linhas de diagrama, foco, hover.

Linhas de 1px, sem glow, sem gradiente colorido. Tokens em `src/styles/global.css`.

## Deploy

**Vercel (recomendado):** importe o repositório; o Astro é detectado sem configuração. O site sai na raiz do domínio.

**GitHub Pages:** o workflow `.github/workflows/deploy-pages.yml` publica a cada push na `main`. Em *Settings → Pages*, a fonte precisa estar em **GitHub Actions**. O workflow define `SITE_URL` e `BASE_PATH=/portfolio-bk`.
