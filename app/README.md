# Scaffold App — a plataforma

`app/` é a plataforma do Scaffold: o lugar onde qualquer solução — impressa, Notion/Sheets ou web — fica disponível online, mesmo que o resultado final seja algo que se imprime. Quem entra aqui não precisa saber se a solução por trás é um PDF desenhado no Figma, uma planilha do Google Sheets ou um app React — só precisa encontrar a ferramenta certa e usá-la. Ver [`ORGANIZACAO.md`](ORGANIZACAO.md) para o raciocínio completo por trás dessa divisão e as decisões de tecnologia.

## Estrutura de Diretórios

- **`web/`** — O código-fonte da plataforma em si (React + Vite + TypeScript + Framer Motion). É a fachada de tudo: catálogo com uma página por solução, com download de PDF, link pra duplicar Notion/Sheets, ou a ferramenta interativa embutida, dependendo do que aquela solução é por trás.
- **`print/`** — O que vira papel de verdade: arquivo de design de origem (Figma/Canva/o que for escolhido) e os PDFs exportados, prontos pra imprimir em casa, disponibilizados pra download em `web/`. Cada ferramenta (`a5-sheet`, `sos-card`, `dopamine-menu`, `shopping-list`, `meal-prep`) tem sua própria subpasta.
- **`utilities/`** — Recursos que vivem no Notion ou no Google Sheets: cada subpasta guarda o link do modelo mestre e um snapshot exportado (backup fora da plataforma original), não o conteúdo editável em si.

## Regra de desenvolvimento

O formato de cada solução segue a função dela, não o contrário: papel quando precisa estar visível sem abrir nada; Notion/Sheets quando precisa de histórico ou busca; web quando dá pra resolver um atrito real que nenhum dos dois resolve de graça. Ver seção 2 de `ORGANIZACAO.md` antes de decidir onde uma ferramenta nova deveria morar.
