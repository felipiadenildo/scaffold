# Scaffold App — web

Plataforma do Scaffold: React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion (`motion`) + React Router.

MVP navegável — sem persistência, sem login, sem backend ainda. Ver [`../ORGANIZACAO.md`](../ORGANIZACAO.md) para o raciocínio da stack e o roadmap.

## Desenvolvimento

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build de produção em dist/
```

## Estrutura

- `src/data/` — conteúdo de cada ferramenta, portado de `manual/src/content/docs/templates/*.md`.
- `src/pages/` — uma página por item do catálogo.
- `src/layout/` — header, navegação e tema claro/escuro compartilhados.
- `src/styles/tokens.css` — mesmos tokens visuais do `manual/`, pra manual e app parecerem o mesmo produto.
