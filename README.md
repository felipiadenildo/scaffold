# Scaffold

Um sistema de rotina e ambiente para TDAH — para quem tem o diagnóstico e para quem apoia.

O nome remete ao seu conceito central: um andaime (*scaffold*) que sustenta a estrutura até que ela possa se sustentar sozinha. É exatamente esse o papel deste material.

## Estrutura do Repositório

- **`manual/`** — O livro de referência: o manual, os templates e o guia de produtos, construído em Astro + Starlight. Explica o porquê e o como pensar de cada solução.
- **`app/`** — A plataforma: onde toda solução fica disponível online, mesmo a impressa. Ver [`app/ORGANIZACAO.md`](app/ORGANIZACAO.md) para a organização interna.
  - **`app/web/`** — O código-fonte da plataforma em si (React + Vite).
  - **`app/print/`** — Design e PDFs prontos pra imprimir.
  - **`app/utilities/`** — Recursos auxiliares, como planilhas e templates externos (Notion/Sheets).
- **`reference/historico-original/`** — material de origem do conceito (guia de rotina/ambiente para TDAH e o "Projeto Andaime"). Estava misplaced em `client-izadora/` desde a reorganização de 07/09/2026; movido pra cá em 16/09/2026 por ser a base conceitual deste projeto, não material da cliente.

