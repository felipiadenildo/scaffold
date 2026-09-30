<div align="center">

<img src="app/web/icones/icone.svg" alt="Ícone do Scaffold" width="88" />

# Scaffold

**Rotina e ambiente para TDAH, no papel e na tela.**

Um manual de referência e um app que colocam o manual em prática, para quem tem o diagnóstico e para quem apoia.

[**Abrir o app**](https://scaffold-app.scaffold-app.workers.dev) · [**Ler o manual**](https://felipiadenildo.github.io/scaffold/) · [Enviar sugestão](#contato)

[English](README.md) · **Português** · [Español](README.es.md)

[![CI](https://github.com/felipiadenildo/scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/felipiadenildo/scaffold/actions/workflows/ci.yml)
[![Licença: AGPL-3.0](https://img.shields.io/badge/licen%C3%A7a-AGPL--3.0-2f6b5f)](LICENSE)
[![Conteúdo: CC BY-NC-SA 4.0](https://img.shields.io/badge/conte%C3%BAdo-CC%20BY--NC--SA%204.0-8a6d3b)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt_BR)
![PWA](https://img.shields.io/badge/PWA-offline-5a4fcf)
![Idiomas](https://img.shields.io/badge/idiomas-pt%20%7C%20en%20%7C%20es-555)

<br />

<img src="docs/screenshots/planner.webp" alt="Planner diário do Scaffold com a frente e o verso da folha lado a lado" width="880" />

</div>

## Sumário

- [Sobre](#sobre)
- [O app](#o-app)
- [O manual](#o-manual)
- [Capturas de tela](#capturas-de-tela)
- [Princípios](#princípios)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Rodando localmente](#rodando-localmente)
- [Próximos passos](#próximos-passos)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)
- [Contato](#contato)

## Sobre

*Scaffold* é andaime em inglês: a estrutura que sustenta a obra até ela ficar de pé sozinha. O projeto tem esse papel na rotina de quem vive com TDAH. Ele não tenta mudar a pessoa. Ele organiza o ambiente, o papel e a tela para que o dia dependa menos de memória e força de vontade.

São duas partes que se completam:

| | O que é | Onde fica |
|---|---|---|
| **Manual** | Explica o porquê e o como pensar de cada solução, com fontes checadas | [felipiadenildo.github.io/scaffold](https://felipiadenildo.github.io/scaffold/) |
| **App** | Coloca as soluções em uso, no celular, no computador ou impressas | [scaffold-app.scaffold-app.workers.dev](https://scaffold-app.scaffold-app.workers.dev) |

## O app

### Planner diário

O centro do app. Cada dia é uma folha de papel com frente e verso.

- **Blocos por período do dia**, marcados pelas refeições, com espaço para um título extra (uma consulta, um evento).
- **Humor do dia** em cinco níveis.
- **Habit tracker** e **"Não pode deixar de fazer"**, o mínimo que sustenta um dia difícil.
- **Sobre o dia** e **Anotações** para o que atravessar o caminho.
- **Modelos** prontos (Leve, Padrão e Detalhado) ou criados por você, com os dias da semana em que cada um vem sugerido.
- **Impressão** de folhas em branco em A5 ou A4 (dois planners por folha), com opções para economizar tinta.

<p align="center">
  <img src="docs/screenshots/virar-folha.gif" alt="A folha do planner virando da frente para o verso" width="720" />
</p>

### Também no app

- **Funciona sem internet** e pode ser instalado como app (PWA), no celular ou no computador.
- **Seus dados ficam no seu aparelho.** Não precisa de conta. Dá para baixar uma cópia e levar para outro aparelho.
- **Três idiomas** (português, inglês e espanhol) e **tema claro e escuro**.
- Fonte [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/), feita para facilitar a leitura.

### Em desenvolvimento

Lista de Compras, Dopamine Menu, Meal Prep e Cartão SOS já podem ser usados no app, mas o design e o conteúdo ainda vão mudar. Financeiro (planilha) e Viagem (checklists no Notion) estão descritos no manual.

## O manual

Doze capítulos sobre rotina e ambiente, escritos em português, com templates e um guia de produtos:

1. Fundamentos
2. Ambientes físicos
3. Sistema analógico
4. Sistema digital
5. Protocolos de crise emocional
6. Rotinas do dia a dia
7. Saúde, corpo e ciclo
8. Planejamento de médio e longo prazo
9. Relações e comunicação
10. Automação e distrações
11. O papel de quem ajuda
12. Quando buscar ajuda profissional

[Ler o manual](https://felipiadenildo.github.io/scaffold/)

> O Scaffold é material de apoio e não substitui acompanhamento profissional. Em uma crise, veja o [Cartão SOS](https://felipiadenildo.github.io/scaffold/templates/cartao-sos/) ou ligue para o CVV (188, 24 horas).

## Capturas de tela

<table>
  <tr>
    <td width="33%" align="center"><img src="docs/screenshots/celular.webp" alt="Planner no celular" /><br /><sub>No celular</sub></td>
    <td width="67%" align="center"><img src="docs/screenshots/planner-escuro.webp" alt="Planner no tema escuro" /><br /><sub>Tema escuro</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/modelos.webp" alt="Escolha do modelo no primeiro acesso" /><br /><sub>Escolha do modelo</sub></td>
    <td align="center"><img src="docs/screenshots/impressao.webp" alt="Janela de impressão com prévia" /><br /><sub>Impressão com prévia</sub></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><img src="docs/screenshots/catalogo.webp" alt="Catálogo de ferramentas" width="720" /><br /><sub>Catálogo de ferramentas</sub></td>
  </tr>
</table>

## Princípios

- **Menos atrito, mais uso.** Cada tela pede o mínimo de decisões. O que não ajuda no dia a dia fica de fora.
- **Papel e tela têm o mesmo peso.** Tudo que existe no app pode ser impresso.
- **Privacidade por padrão.** Sem conta, sem rastreamento, sem servidor guardando o que você escreve.
- **Acessibilidade.** Fonte legível, contraste nos dois temas, navegação por teclado e leitor de tela.
- **Baseado em fontes.** As escolhas do app seguem o manual, e o manual cita de onde tirou cada ideia.

## Tecnologias

| Parte | Tecnologias |
|---|---|
| App | React 19, TypeScript, Vite, Tailwind CSS 4, Motion, React Router |
| Offline e instalação | vite-plugin-pwa (Workbox) |
| PDF | jsPDF e html2canvas-pro |
| Testes e qualidade | Vitest, happy-dom, oxlint |
| Manual | Astro e Starlight |
| Hospedagem | Cloudflare Workers (app) e GitHub Pages (manual) |

## Estrutura do repositório

```
scaffold/
├── app/
│   ├── web/        código do app (React + Vite)
│   └── print/      modelos para impressão
├── manual/         site do manual (Astro + Starlight)
└── docs/           imagens usadas neste README
```

## Rodando localmente

Precisa de [Node.js](https://nodejs.org/) 22 ou mais recente.

```bash
git clone https://github.com/felipiadenildo/scaffold.git
cd scaffold/app/web
npm install
npm run dev        # http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm test` | Roda os testes (Vitest) |
| `npm run lint` | Verifica o código (oxlint) |
| `npm run build` | Checa os tipos e gera a versão de produção em `dist/` |
| `npm run capturas` | Gera as imagens deste README (com o `npm run dev` rodando) |

Para o manual:

```bash
cd scaffold/manual
npm install
npm run dev        # http://localhost:4321/scaffold
```

## Próximos passos

- [ ] Ajustes de uso no celular (janelas em telas estreitas e deslizar para trocar de dia)
- [ ] Dicas no primeiro acesso, explicando cada parte da folha
- [ ] Planner semanal e mensal
- [ ] Login opcional para sincronizar entre aparelhos
- [ ] PDF vetorial, com texto nítido e arquivo menor

## Como contribuir

Sugestões, relatos de uso e correções são muito bem-vindos, principalmente de quem vive com TDAH ou apoia alguém que vive.

- **Encontrou um problema ou tem uma ideia?** Abra uma [issue](https://github.com/felipiadenildo/scaffold/issues).
- **Quer mexer no código?** Faça um fork, crie uma branch e abra um pull request explicando o que mudou e por quê. Antes de enviar, rode `npm test`, `npm run lint` e `npm run build` em `app/web`.
- **Quer corrigir o manual?** Cada página do manual tem um link "Editar página" que abre o arquivo aqui no GitHub.

## Licença

- **Código** (app e site do manual): [GNU Affero General Public License v3.0](LICENSE). Você pode usar, estudar, modificar e redistribuir. Se publicar uma versão modificada, inclusive como serviço na internet, precisa disponibilizar o código-fonte dela sob a mesma licença.
- **Conteúdo do manual** (textos, templates e guia de produtos): [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt_BR). Pode ser compartilhado e adaptado com crédito, sem fins comerciais e sob a mesma licença.

Copyright © 2026 Felipi Adenildo.

## Contato

Tem uma sugestão, uma crítica ou uma história de como o Scaffold ajudou (ou não ajudou)? Todo retorno ajuda o projeto a melhorar.

- **Formulário de contato:** [felipiadenildo.github.io/scaffold/contato](https://felipiadenildo.github.io/scaffold/contato/)
- **Issues no GitHub:** [github.com/felipiadenildo/scaffold/issues](https://github.com/felipiadenildo/scaffold/issues)
- **GitHub:** [@felipiadenildo](https://github.com/felipiadenildo)
