# Scaffold app (web)

Código do app do Scaffold: React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion + React Router,
instalável e offline (PWA). A visão geral do projeto, as capturas de tela e a licença estão no
[README da raiz](../../README.pt-BR.md).

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # testes (Vitest)
npm run lint       # oxlint
npm run build      # checa os tipos e gera a versão de produção em dist/
npm run capturas   # gera as imagens do README em docs/screenshots (com o dev rodando)
```

## Publicação

O app roda no Cloudflare Workers (arquivos estáticos, ver `wrangler.jsonc`). Pra publicar à mão,
copie `.env.example` pra `.env`, preencha o token e rode:

```bash
npm test && npm run build && set -a && . ./.env && set +a && npx wrangler deploy
```

## Estrutura

- `src/pages/`: uma página por ferramenta do catálogo; o Planner fica em `src/pages/planners/`.
- `src/data/`: conteúdo das ferramentas, modelo de dados do Planner e a camada de armazenamento
  (`localStorage` com versão de formato e migrações).
- `src/i18n/`: textos em português (`pt.ts`, a referência), inglês e espanhol.
- `src/layout/`: cabeçalho, rodapé, idioma e tema claro/escuro.
- `src/pdf/`: geração dos PDFs de impressão.
- `src/styles/tokens.css`: os mesmos tokens visuais do `manual/`, pra manual e app parecerem o
  mesmo produto.
- `scripts/`: geração de ícones, teste dos PDFs e das capturas de tela.
