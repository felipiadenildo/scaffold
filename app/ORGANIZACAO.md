# Organização de `app/` — diagnóstico e histórico da decisão

Documento de trabalho. Onde eu tenho uma recomendação clara eu digo qual é e por quê; onde é decisão sua, eu deixo registrado o que foi decidido e por quê.

> **Nota de nomenclatura:** a renomeação `tools/` → `app/` e `site/` → `manual/`, discutida na seção 0, **já foi aplicada** — histórico do `site/` preservado via `git subtree` dentro de `manual/`. As seções abaixo ainda descrevem o raciocínio original; onde uma decisão específica já foi tomada em conversa posterior (ferramenta de design dos impressos, stack do `app/web`, hospedagem), isso está registrado no plano de execução, não reaberto aqui.

## 0. Por que `tools` vira `app`, e o que fazer com `site`

A observação que motivou essa mudança muda a natureza da pasta: `tools` deixava de ser só "uma gaveta de arquivos-fonte" (HTML de mockup, link do Notion, código de protótipo web) pra virar **o produto em si** — o lugar onde qualquer pessoa entra, sem precisar saber se a solução por trás é HTML, Figma, Notion ou Sheets, e sai com o que precisa: vê o Cartão SOS, baixa o PDF, abre a planilha, duplica o Notion, usa a Lista de Compras interativa direto no navegador. Isso é uma plataforma, não uma pasta de utilitários soltos — o nome precisa refletir isso.

**`tools/` → `app/`.** Curto, sem ambiguidade, e segue a convenção que o resto do repositório já usa (nomes de pasta em inglês: print, utilities, web). A divisão interna continua a mesma — print/utilities/web como origem de cada solução, ver seção 3 — só que agora com uma camada de apresentação por cima: o que hoje é `tools/web` deixa de ser só "os 3 protótipos interativos" e vira **a fachada de tudo**, um catálogo com uma página por solução, que expõe o PDF pra baixar, o link pra duplicar, ou o protótipo embutido, dependendo do que aquela solução é por trás (ver seção 6.2).

**`site/` → `manual/`.** O nome "site" não está errado hoje pra o que ele é — um site de documentação em Starlight — mas fica ambíguo ao lado de `app` assim que os dois forem produtos publicados de verdade (as duas coisas *são* sites, tecnicamente). "Manual" descreve com precisão o papel dele no sistema: o porquê e o como pensar, enquanto `app` é o onde efetivamente pegar a ferramenta pronta. Isso também casa com a forma como o Starlight já se autodescreve hoje (`description: 'Manual de referência sobre rotina e ambiente para TDAH'`, em `astro.config.mjs`).

Com isso, a dupla fica **`manual/`** (Starlight, existe hoje como `site/`) e **`app/`** (era `tools/`, vira a plataforma). Um linka pro outro: o manual explica e aponta pra ferramenta pronta no app; o app pode linkar de volta pro capítulo do manual quando fizer sentido dar contexto antes de usar algo.

Importante: renomear `site/` não é só troca de texto no `.md` — mexe num repositório com histórico e workflow de deploy configurados de verdade (`site/.git`, `astro.config.mjs`, `.github/workflows/*.yml`, a URL base `/scaffold` no Astro). Por isso trato isso como proposta a confirmar, não como algo já decidido — fica formalizado como decisão pendente na seção 7, junto com a extensão natural da pergunta: **o domínio final fica `.../manual/` e `.../app/` como duas seções do mesmo site, ou dois deploys separados?** Minha inclinação inicial é duas seções do mesmo domínio (`felipiadenildo.github.io/scaffold/manual/...` e `.../app/...`), pelo mesmo argumento de pipeline único já feito na seção 6.1 — mas isso trava melhor depois que a decisão do monorepo (1.1) estiver resolvida.

## 1. O que eu encontrei, olhando o repositório de verdade

Antes de propor estrutura nova, o estado atual tem quatro problemas que valem resolver **antes** de organizar o resto, porque eles afetam qualquer estrutura que a gente desenhar depois.

### 1.1. `app/` (hoje `tools/`) não está em nenhum repositório Git

O repositório Git real do projeto vive em `site/.git` — ou seja, o repo GitHub `felipiadenildo/scaffold` hoje é o conteúdo da pasta `site/`, e nada além dela. A pasta raiz (`scaffold/`, onde `tools/` e o `README.md` do projeto vivem) **não é um repositório Git**. Isso significa que, neste exato momento, tudo que existe em `tools/` não está versionado, não tem histórico, e não vai para o GitHub Pages junto com o manual.

Isso é a decisão mais importante deste documento, porque toda a proposta abaixo assume uma resposta pra ela. As opções reais são:

| Opção | Como fica | Trade-off |
|---|---|---|
| **A. Monorepo — recomendado** | `git init` na raiz, `manual/` (ex-`site/`) e `app/` (ex-`tools/`) viram duas pastas do mesmo repositório. O workflow de deploy aponta pra `manual/` e/ou `app/` como diretórios de build, conforme a decisão da seção 0. | Precisa preservar o histórico que já existe em `site/.git` (dá pra fazer com `git subtree` ou reescrevendo o remote depois de mover `.git` pra raiz — não é destrutivo se feito com cuidado). Ganha: um repo só, um `git log` só, PR único quando um template muda em `manual/` e `app/` ao mesmo tempo. |
| **B. Dois repositórios separados** | `manual` continua como está. `app` vira um repositório novo, próprio. | Zero risco de mexer no histórico existente. Perde: qualquer sincronização entre o mockup em `app/print` e o mockup embutido no manual vira coisa manual entre dois repos, PR cruzado é mais raro de acontecer na prática. |
| **C. Submódulo Git** | `app` como submódulo dentro de `manual`, ou vice-versa. | Tecnicamente resolve, mas submódulo é atrito operacional alto pra um projeto solo — historicamente é a opção que mais gera "esqueci de atualizar o submódulo" no fluxo do dia a dia. Não recomendo pra este caso. |

**Minha recomendação é A**, principalmente porque a seção 1.2 (remover a duplicação entre `app/print` e `manual/public/_mockups`) só funciona de graça, sem script de sincronização, se as duas pastas estiverem no mesmo repositório.

### 1.2. Os mockups impressos já estão duplicados manualmente

Conferi arquivo por arquivo: `tools/print/a5-sheet/folha-a5.html`, `tools/print/sos-card/cartao-sos.html`, `tools/print/dopamine-menu/dopamine-menu.html` e `tools/print/shopping-list/lista-compras.html` são **byte-a-byte idênticos** aos arquivos em `site/public/_mockups/`. Ou seja: hoje, atualizar um template impresso significa lembrar de copiar o HTML pra dois lugares. Isso é exatamente o tipo de atrito que o próprio manual do projeto (`03-sistema-analogico.md`) descreve como causa de abandono de sistema — só que aplicado ao seu processo de manutenção do repo, não à rotina de quem usa o Scaffold.

Resolve assim, uma vez o monorepo (1.1) estiver decidido: `app/print/<slug>/` vira a única fonte, e `manual/public/_mockups` vira um **symlink** para dentro de `app/print` (ou o build do Astro copia de lá via um script de 5 linhas em `predev`/`prebuild`). Zero cópia manual, zero risco de divergência.

### 1.3. Os "templates de impressão" de hoje são mockups visuais, não arquivos prontos pra imprimir

Abri `folha-a5.html` e os outros: são HTML/CSS bonitos, usando a fonte acessível certa (Atkinson Hyperlegible, mesma do manual — ótimo, dá consistência de marca), mas são literalmente rotulados "mockup visual" no próprio `<h1>`, com `box-shadow`, fundo cinza de página, sem `@page` em milímetro real, sem sangria, pensados pra serem vistos na tela dentro do site, não impressos como estão. Isso é coerente com o que o `tools/README.md` já descreve como estado desejado ("tipografia definitiva, exportações em PDF... Canva/Figma") vs. estado atual — ou seja, vocês já sabiam que isso era provisório. A seção 4 propõe como fechar essa lacuna.

### 1.4. `app/utilities/` está vazia, e um dos três itens provavelmente está na pasta errada

`finance/`, `meal-prep/` e `travel/` existem como pastas vazias. Cruzando com o conteúdo real de cada template no manual:

- **`financeiro.md`** descreve uma planilha com abas, fórmulas, gráfico — isso é Sheets de verdade, pertence a `utilities/finance`. ✅ confere.
- **`viagem.md`** descreve uma página duplicável no Notion, com checklist e prompt de IA — isso é Notion de verdade, pertence a `utilities/travel`. ✅ confere.
- **`meal-prep.md`** descreve uma **folha física de estoque de freezer**, em ASCII art idêntico em espírito ao da Lista de Compras (pendurar em algum lugar visível, preencher à mão, sem apps). Isso não é um recurso de Sheets/Notion — é um template impresso, ponto de performance, igual ao `shopping-list`. **Eu recomendo mover `meal-prep` de `app/utilities/` para `app/print/`.**

Isso não é só arrumação estética — é o princípio central da seção 2 aplicado de volta à própria pasta `app/`: o formato de cada ferramenta tem que seguir a função dela, e `meal-prep` como está hoje tem função de "quadro na parede", não de "planilha que se consulta".

---

## 2. O princípio organizador: o formato segue a função

O manual do projeto já define essa lógica, em `04-sistema-digital.md` — eu só estou nomeando o padrão pra usar como critério de decisão daqui pra frente, inclusive pra qualquer ferramenta nova que vocês adicionarem no futuro:

| Precisa de... | Formato certo | Por quê |
|---|---|---|
| Estar visível sem abrir nada, no ponto onde a ação acontece | **Print** (`app/print`) | "Fora da vista, fora da mente" — TDAH perde pra fricção de abrir um app antes mesmo de decidir usar a ferramenta. |
| Histórico, busca por palavra-chave, ou estrutura que cresce (documentos, páginas por viagem) | **Notion** (`app/utilities`) | Fichário físico não escala pra "todo projeto que já existiu". Busca de texto resolve o que papel não resolve. |
| Cálculo, visibilidade de saldo decrescente, gráfico | **Sheets** (`app/utilities`) | Número abstrato não convence quem tem impulsividade; ver saldo cair em tempo real, sim. |
| Interatividade que nem papel nem planilha genérica dão de graça — cálculo automático, geração de QR, preenchimento guiado, estado salvo sem digitar tudo de novo | **Web** (`app/web`) | É onde uma solução sua pode ficar melhor que o Notion/Sheets genérico — mas só vale a complexidade extra se o ganho for real, não só "porque dá pra programar".|

Vale reforçar a diferença entre esse quadro e a decisão da seção 0: isto aqui organiza **onde cada solução nasce e é mantida** (o arquivo-fonte). A plataforma `app/` organiza **onde cada solução é encontrada e usada**, independente de ter nascido como HTML, planilha ou link do Notion — as duas camadas coexistem, uma é a origem, a outra é a vitrine.

O ponto que vale destacar antes de ir pra tecnologia: **web não é automaticamente upgrade de tudo, mesmo dentro da plataforma `app`.** O Cartão SOS, por exemplo, existe em `app/web/src/sos-card` como protótipo, mas o próprio manual do projeto argumenta que a crise emocional é exatamente o momento em que abrir um app, esperar carregar e navegar é fricção alta demais — é por isso que o cartão físico vive na primeira divisória do fichário, não escondido num celular que também é fonte da distração. Na página desse item dentro do `app`, faz sentido a versão interativa existir como **prévia/apoio** (deixar a pessoa ver como fica antes de imprimir, ou usar como fallback de "esqueci o cartão físico em casa"), com o botão de **baixar o PDF pra imprimir** como ação principal da página, não a versão web. Isso é uma pergunta em aberto pra você confirmar no final do documento (seção 7) — inclusive qual ação fica em destaque em cada página do catálogo (ver 6.2).

Onde web **de fato** tende a superar Notion/Sheets genéricos, porque a ferramenta pode ser desenhada especificamente pro fluxo e reduzir passos que o Notion/Sheets sempre vão exigir manualmente: lista de compras (marcar item com um toque, sem editar checkbox de planilha pelo celular), controle financeiro semanal (saldo decrescente visual, o "ver o número cair" que o manual descreve, sem montar fórmula), e a central de viagens (duplicar checklist com um clique em vez de copiar página no Notion). Esses são bons candidatos a virar produto próprio depois.

---

## 3. Estrutura de pastas proposta

```
scaffold/                          (raiz vira repo Git — ver 1.1)
├── manual/                        # ex-site/: Astro + Starlight, o livro de referência
│   └── public/_mockups/           # symlink -> ../../app/print (ver 1.2)
├── app/                           # ex-tools/: a plataforma — tudo disponível online
│   ├── README.md
│   ├── print/                     # fonte única dos templates impressos
│   │   ├── a5-sheet/
│   │   │   ├── folha-a5.html      # HTML/CSS com @page real (ver 4.2)
│   │   │   ├── folha-a5.pdf       # exportado, pronto pra imprimir em casa
│   │   │   └── SPEC.md            # papel, sangria, fonte, link do arquivo de design se houver
│   │   ├── sos-card/
│   │   ├── shopping-list/
│   │   ├── dopamine-menu/
│   │   └── meal-prep/             # movido de utilities/ (ver 1.4)
│   ├── utilities/
│   │   ├── finance/
│   │   │   ├── README.md          # link "Fazer uma cópia" do Sheets público
│   │   │   └── snapshot.xlsx      # export periódico, versionado
│   │   └── travel/
│   │       ├── README.md          # link "Duplicar" do Notion
│   │       └── snapshot.md        # export Markdown do Notion, versionado
│   └── web/                       # o código-fonte da plataforma em si (ver 6)
│       ├── package.json
│       └── src/
│           ├── catalogo/          # página /app/ — lista tudo, ver 6.2
│           ├── a5-sheet/
│           ├── sos-card/
│           └── shopping-list/
```

Cada item do catálogo (impresso, Notion/Sheets ou web) é descrito por um pequeno metadado — nome, categoria, ação principal, link/arquivo de origem — que a página de catálogo em `app/web/src/catalogo` lê pra montar a lista automaticamente. Isso evita ter que atualizar uma página de índice à mão toda vez que uma solução nova entra no repositório.

---

## 4. `app/print` — aprofundando

### 4.1. O problema real a resolver

Vocês têm dois públicos diferentes pra essas peças impressas, e eles pedem ferramentas diferentes:

1. **Quem vai imprimir em casa, numa impressora doméstica comum.** Não precisa de sangria, não precisa de CMYK, precisa de um PDF que sai exatamente no tamanho certo (A5, ou meia folha A4) direto da impressora.
2. **Peças que fazem mais sentido mandar pra gráfica** — principalmente o Cartão SOS, se vocês quiserem o formato "cartão de visita" (9×5 cm) em papel mais rígido, plastificado, pra guardar na carteira de verdade. Isso já pede sangria, CMYK, e um arquivo de gráfica de verdade.

Recomendo **não usar a mesma ferramenta pras duas coisas**. Detalhando:

### 4.2. Caminho 1 — HTML/CSS com impressão real (recomendo como padrão pra tudo que é "imprimir em casa")

Vocês já têm HTML/CSS acessível e com a fonte certa. O que falta é fechar a lacuna entre "mockup bonito na tela" e "arquivo que imprime no tamanho certo". Isso se resolve sem sair do HTML:

- `@page { size: 148mm 210mm; margin: 10mm; }` no CSS de impressão, com a medida real do papel (A5 = 148×210mm; a folha A4 dobrada ao meio que o template já sugere também é A5 na prática).
- Um `@media print` que já existe no arquivo, mas hoje só esconde título/subtítulo — precisa também remover `box-shadow`, fundo cinza, e garantir que cada "folha" vire uma página de PDF própria (`break-after: page` ou `break-inside: avoid`, que o CSS já usa parcialmente).
- Geração do PDF: o próprio "Imprimir → Salvar como PDF" do navegador já resolve pra impressão doméstica, contanto que o `@page` esteja certo. Zero ferramenta nova.
- Se num momento futuro vocês quiserem algo mais controlado (marcas de corte, sangria de verdade, múltiplas variações do mesmo cartão em lote), a ferramenta certa é o **[Paged.js](https://pagedjs.org)** — um polyfill open source de CSS Paged Media, roda no navegador ou via CLI, e converte o mesmo HTML/CSS que vocês já têm em PDF com sangria e marcas de corte, sem trocar de tecnologia nem duplicar o template em outra ferramenta.

Vantagem grande desse caminho: a mesma fonte (`app/print/<slug>/*.html`) serve **quatro coisas ao mesmo tempo** — o mockup visual embutido no manual, a página de preview dentro do catálogo `app/web` (ver seção 6), o gerador de PDF pra imprimir em casa, e a base pro Paged.js se um dia precisar de gráfica. Fonte única, zero sincronização manual.

### 4.3. Caminho 2 — arquivo de design de verdade, só onde vale a pena (Cartão SOS pra gráfica)

Pra uma peça pequena, em papel especial, potencialmente pedida em lote numa gráfica local ou impressa em papel cartão plastificado, comparando as opções reais do mercado hoje:

| Ferramenta | Prós pro seu caso | Contras |
|---|---|---|
| **Figma (recomendo)** | Gratuito no plano pessoal, componentes com *variants* (os 5 cartões SOS viram variantes de um componente só — muda a cor de um token, muda nos 5 de uma vez), exporta PDF/PNG em lote, medida exata em mm via plugin, arquivo fica na nuvem e dá pra linkar no repositório. | Curva de aprendizado inicial se nunca usou ferramenta de design vetorial — mas é a mais transferível pro resto do mercado de design hoje. |
| **Canva** | Mais fácil de começar sem nenhuma experiência prévia, tem templates prontos de cartão e planner buscando por "cartão de visita" ou "planner A5", e tem impressão sob demanda integrada (pede o cartão físico direto pela plataforma, inclusive com envio pro Brasil). | Pouco controle fino de reuso sistemático (variantes/componentes são mais limitados que Figma), arquivo não é facilmente referenciável/versionável fora da própria conta Canva. |
| **Affinity Publisher** | Pago uma vez só (sem assinatura), pensado pra layout multi-página, se algum dia vocês quiserem um "caderno" impresso maior que uma folha avulsa. | Ferramenta desktop, curva de aprendizado de diagramação tradicional, exagero pra uma peça de cartão único. |

**Minha recomendação prática:** Figma pro Cartão SOS especificamente (por causa do reuso via componente entre os 5 cenários), e nenhuma ferramenta nova pra Folha A5, Lista de Compras, Dopamine Menu e Meal Prep — essas seguem 100% pelo caminho 1 (HTML/CSS), porque são conteúdo tabular/checklist, não peça gráfica com ilustração.

Termos de busca úteis, já que você pediu exemplos concretos pra explorar: no **Figma Community**, buscar "ADHD planner" ou "A5 planner template" traz uma quantidade grande de referências de layout já testadas por outras pessoas com o mesmo público-alvo — vale olhar como referência de hierarquia visual, não pra copiar conteúdo. No **Canva**, buscar "cartão de visita" já filtra direto pro tamanho 9×5cm com sangria pronta.

### 4.4. Especificação técnica de referência (pra colocar no `SPEC.md` de cada template)

| Item | Folha A5 / Lista / Menu / Meal Prep | Cartão SOS (versão carteira) |
|---|---|---|
| Tamanho | 148 × 210 mm (A5) | 90 × 50 mm (padrão BR de cartão de visita — ajustar se decidirem por outro) |
| Sangria | Não precisa (impressão doméstica, sem corte de gráfica) | 3 mm, se for pra gráfica |
| Cor | RGB (impressora doméstica) | CMYK, se for pra gráfica |
| Fonte | Atkinson Hyperlegible (já em uso — manter, é fonte desenhada pra baixa visão/dislexia, decisão certa) | idem |
| Fonte de verdade | `app/print/<slug>/*.html` | Arquivo Figma, linkado no `SPEC.md` |

---

## 5. `app/utilities` (Notion / Sheets) — aprofundando

### 5.1. O problema de versionar algo que não é um arquivo

Notion e Sheets não são arquivos de texto — não dá pra fazer `git diff` de verdade num board do Notion. O objetivo aqui não é versionar o conteúdo pixel a pixel, é garantir que **o link certo sempre existe**, que **existe um backup legível fora da plataforma**, e que fica documentado o que cada template contém sem precisar abrir a ferramenta.

### 5.2. Fluxo de distribuição — o padrão de mercado, aplicado aqui

- **Notion (`travel/`):** você mantém a página-mestre na sua própria conta. Ativa "Compartilhar → Publicar na web" com o link de duplicação habilitado (é o mesmo mecanismo que templates gratuitos de "ADHD Second Brain" no marketplace oficial do Notion usam, aliás citado no próprio manual de vocês como referência a não reinventar). Quem acessa o link vê um botão "Duplicar" que copia a página inteira pro workspace da pessoa. O `app/utilities/travel/README.md` guarda só esse link, mais um export em Markdown (Notion tem "Exportar → Markdown & CSV" nativo) commitado como snapshot de backup — não fica atualizado em tempo real, mas garante que o conteúdo sobrevive mesmo se o link quebrar um dia. O catálogo em `app/web` lê esse mesmo `README.md` pra montar a página de preview do item (ver 6.2).
- **Sheets (`finance/`):** mesma lógica — arquivo mestre com "Compartilhar → Qualquer pessoa com o link → Leitor", e a pessoa faz "Arquivo → Fazer uma cópia" pra ter a versão editável dela. Trava as células de fórmula (Dados → Intervalos protegidos) pra ninguém quebrar o cálculo sem querer. O `finance/README.md` guarda o link, e um `.xlsx` exportado periodicamente entra como snapshot — `.xlsx` preserva fórmula, `.csv` não, então `.xlsx` é a escolha certa aqui.

### 5.3. Meal Prep sai daqui (ver 1.4)

Como já justificado, `meal-prep` deveria estar em `app/print`, não aqui — a menos que vocês decidam expandir o conceito pra algo que realmente precise de histórico/busca (por exemplo, um catálogo de receitas testadas, que aí sim ganharia sentido como base no Notion). Se essa ideia existir, vale registrar como um item **novo e separado**, não uma continuação do template de estoque de freezer que já existe.

---

## 6. `app/web` — o código-fonte da plataforma, aprofundando

### 6.1. O que muda com a decisão da seção 0

Na leitura original deste documento, a pergunta era "vale separar essas 3 telas interativas do site de documentação, ou é exagero pro tamanho que elas têm hoje?", e a recomendação era manter tudo dentro do projeto Astro do manual, sem um segundo `package.json`.

Com `app` virando **a plataforma que expõe toda solução** — impressa, Notion/Sheets ou web, todas na mesma vitrine — essa pergunta muda de figura. `app/web` deixa de ser "3 telas extras" e passa a ser **o código-fonte do produto principal**: um catálogo completo, com uma página por solução. Isso por si só já justifica um projeto próprio, com seu próprio `package.json` — não é mais uma questão de "vale isolar uma feature pequena", é reconhecer que existem dois produtos diferentes (o manual e a plataforma), cada um com seu propósito.

### 6.2. Arquitetura recomendada

- **Projeto Astro próprio em `app/web`**, sem o layout do Starlight — layout de catálogo/produto tem necessidades diferentes de layout de documentação (grade de cards, filtro por categoria, página de item com preview). Compartilha os mesmos tokens de cor/fonte do `manual` (dá pra literalmente importar o mesmo CSS de design tokens dos dois projetos, sem duplicar).
- **Uma página de catálogo (`/app/`)**, listando toda solução por um metadado simples — nome, categoria (impresso / Notion / Sheets / web), slug, ação principal — lido de um arquivo de configuração central (ex. `app/web/src/content/catalogo.json`), não escrita à mão card por card. Adicionar uma ferramenta nova vira "adicionar uma entrada no JSON", não "criar uma página nova do zero".
- **Uma página por solução (`/app/<slug>/`)**, com o comportamento variando por tipo, resolvido por um layout único parametrizado pelo metadado, não uma página reescrita por tipo:
  - **Impresso** (`folha-a5`, `cartao-sos`, `lista-compras`, `dopamine-menu`, `meal-prep`): preview do HTML de `app/print/<slug>` embutido, botão "Baixar PDF" como ação principal.
  - **Notion/Sheets** (`financeiro`, `viagem`): resumo lido do `README.md` de `app/utilities/<slug>`, botão "Duplicar no Notion" ou "Abrir no Sheets" apontando pro link mestre.
  - **Web nativo** (o caso raro que realmente ganha em ser só web, ver 6.4): o próprio protótipo interativo embutido direto na página, sem link externo.
- **Deploy combinado, um domínio só:** `app/web` builda pra `app/web/dist`; o workflow de CI copia esse resultado pra dentro do build do `manual` antes do `actions/deploy-pages` (ex. `manual/dist/app/`). Resultado: `felipiadenildo.github.io/scaffold/manual/...` pro livro de referência, `.../app/...` pra plataforma, um `deploy-pages` só, sem precisar de dois domínios nem duas configurações de Pages.

### 6.3. Framework de interação

Nenhuma dessas ferramentas precisa de SPA pesado (React Router, estado global complexo, backend). O padrão que resolve com menos peça em movimento:

- **Astro islands** com **Preact** (ou nem isso — várias dessas telas são só formulário + `localStorage`, dá pra fazer em JS vanilla direto no componente Astro) só onde precisa de interatividade — o resto continua HTML estático, rápido, sem hidratar nada à toa.
- **`localStorage`** para persistir a Folha A5 do dia, o menu de dopamina escolhido, os itens marcados na lista de compras — sem precisar de conta de usuário nem backend. Isso é coerente com o princípio "sem setup" que o próprio manual do projeto defende pra tudo que é digital.
- Geração de QR code da lista de compras: em vez de depender de um serviço de QR estático externo (que trava o link pra sempre), uma biblioteca cliente como `qrcode` (npm) gera o QR na hora, inclusive já apontando pro `localStorage`/URL da própria lista — no fim, isso pode ser exatamente a ferramenta que substitui o "Google Docs + gerador de QR externo" que o manual descreve hoje como solução provisória de baixo código.

### 6.4. O que cada item mostra como ação principal — e o que priorizar primeiro

Seguindo o princípio da seção 2, o catálogo não trata toda entrada como "app igual" — a ação em destaque de cada página muda pelo tipo de ganho real:

1. **Lista de Compras** — candidata a virar item **web nativo** de verdade dentro do catálogo (não só link): QR sempre atualizado, marcar item com um toque, sem depender de link estático do Google Docs. Maior ganho relativo de todos.
2. **Financeiro** — hoje entra como item Notion/Sheets (link "Abrir no Sheets"); migra pra web nativo só se/quando o Sheets manual virar fricção real: saldo decrescente visual, alerta de orçamento semanal automático, sem montar fórmula.
3. **Folha A5** e **Cartão SOS** — entram como itens **impressos**: ação principal é "Baixar PDF", com a versão interativa disponível na mesma página como prévia/apoio, não como destaque — pelo argumento já feito na seção 2 sobre ponto de performance.
4. **Central de Viagens** — entra como item Notion (ação "Duplicar"); é o de maior esforço pra virar web nativo (basicamente recriar um mini-Notion de propósito único), então o último a valer a complexidade, só se o Notion realmente virar fricção demais no uso real.

---

## 7. Perguntas em aberto — decisões que são suas

1. **Nomes `manual/` e `app/` (0):** topo com essa dupla, ou prefere outros nomes? (alternativas consideradas e descartadas: `plataforma/` — mais longo, sem ganho real sobre `app`; `central/` — bonito por ecoar o vocabulário do próprio manual, mas menos padrão pra quem for ler o repo de fora.)
2. **Domínio único com duas seções, `.../manual/` e `.../app/` (0):** confirma essa direção, ou prefere dois deploys/domínios separados desde já?
3. **Monorepo (1.1):** topo com A (unificar tudo num repo só, preservando o histórico de `site/`)? Se sim, eu cuido da migração com cuidado (sem perder histórico) antes de mexer em mais nada.
4. **Mover `meal-prep` pra `print/` (1.4):** concorda com a leitura de que é ponto de performance, não planilha/Notion?
5. **Ação principal do Cartão SOS e da Folha A5 no catálogo (2, 6.4):** confirma que a ação em destaque é "Baixar PDF", com a versão interativa como apoio, não o contrário? Ou já tem um caso de uso específico em mente (ex. alguém sem impressora em casa) que muda essa prioridade?
6. **Lista de Compras como primeiro item web nativo (6.4):** topa começar por aí, já que é onde o ganho de sair do link estático do Google Docs é maior?
7. **Cartão SOS em Figma (4.3):** você já tem alguma conta/preferência de ferramenta de design (Figma, Canva, outra) ou começamos do zero?

Quando essas estiverem respondidas, o próximo passo natural é eu montar um checklist de execução por fase: renomear as pastas e resolver o Git primeiro (1, 0), depois a deduplicação de mockup (1.2), depois o primeiro `SPEC.md` + PDF de verdade de um template piloto — provavelmente a Folha A5, por ser a peça mais usada no dia a dia — e só depois o catálogo do `app/web` em si.
