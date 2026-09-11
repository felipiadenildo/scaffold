# Scaffold

Um sistema de rotina e ambiente para TDAH — para quem tem o diagnóstico e para quem apoia.

O nome remete ao seu conceito central: um andaime (*scaffold*) que sustenta a estrutura até que ela possa se sustentar sozinha. É exatamente esse o papel deste material.

## Estrutura do Repositório

- **`manual/`** — O livro de referência: o manual, os templates e o guia de produtos, construído em Astro + Starlight. Explica o porquê e o como pensar de cada solução.
- **`app/`** — A plataforma: onde toda solução fica disponível online, mesmo a impressa. Ver [`app/ORGANIZACAO.md`](app/ORGANIZACAO.md) para a organização interna.
  - **`app/web/`** — O código-fonte da plataforma em si (React + Vite).
  - **`app/print/`** — Design e PDFs prontos pra imprimir.
  - **`app/utilities/`** — Recursos auxiliares, como planilhas e templates externos (Notion/Sheets).

