# Plano — Fase 0 (antes do login)

Documento de trabalho. Registra as decisões tomadas em conversa (setembro/2026) e o plano técnico de
implementação, etapa por etapa. As fases seguintes (login, nuvem, reportar, privacidade, ambientes)
ficam para um plano próprio, depois que a Fase 0 estiver concluída.

**Forma de trabalho:** uma etapa por vez. Antes de começar, um resumo curto do que será feito para
confirmação; ao terminar, um checklist do que mudou para conferência manual. Só se avança depois da
aprovação. Cada etapa aprovada vira um commit próprio na branch `fase-0`.

**Regra de design:** preservar a identidade visual atual (tokens de `src/styles/tokens.css`, folha de
papel, botões redondos da barra do Planner, `<details>` como menu suspenso). Mudança visual só com
justificativa e referência.

---

## 1. Decisões tomadas

### Planner: modelos e dias
- **Modelos:** a pessoa tem uma lista ordenada de modelos. Cada modelo define só a **estrutura** da
  folha: blocos (1 a 6, com nome), se o humor aparece, se o "Sobre o dia" aparece, se as seções de
  hábitos e de "Não pode deixar de fazer" aparecem, e os **dias da semana** em que ele vem
  pré-selecionado.
- **Um dia só existe depois de criado.** Dia inexistente = folha pontilhada, sem cor, com os modelos
  como **botões**, na ordem definida pela pessoa. O modelo do dia da semana vem em destaque.
  Um clique cria o dia.
- **Cada dia guarda a própria cópia da estrutura.** Editar a estrutura de um dia (ou trocar o modelo
  dele) afeta **só aquele dia**. Editar um modelo afeta **só os dias criados depois** com ele.
  Nenhuma edição se espalha por vários dias.
- **Rearranjo dentro do dia:** se um bloco com texto deixa de existir, o texto vai para o bloco
  anterior (ou o seguinte, se era o primeiro) no formato `**Nome do bloco:** texto`.
- **Primeira vez no Planner:** mensagem de boas-vindas + modelos prontos como botões (Padrão em
  destaque) + "Montar o meu". Os modelos prontos são copiados para a lista da pessoa, no idioma
  atual, e passam a ser dela.
- **Modelos prontos:** Padrão (4 blocos, seg–sex), Fim de semana (1 bloco "Meu dia", sáb–dom),
  Dia difícil (mínimo, com destaque para "Não pode deixar de fazer"), Trabalho/estudo (Manhã, Tarde,
  Noite).
- **Nomes sugeridos por número de blocos:** 1 Meu dia · 2 Café da manhã, Almoço · 3 + Jantar ·
  4 + Lanche da tarde · 5 + Antes de dormir · 6 Ao acordar + os 5. Só são aplicados a blocos cujo
  nome ainda não foi editado.

### Hábitos e "Não pode deixar de fazer"
- **Duas listas únicas**, iguais em todos os modelos (o modelo só decide se a seção aparece).
- Editáveis no editor ou direto na folha. Adicionar, remover ou renomear vale **daquele dia em
  diante**, sem pergunta. O passado não muda.
- Em dias passados a lista fica **bloqueada**: só marcar e desmarcar (no modo edição do dia).
- Por baixo: lista com versões por data (`desde → itens`); marcações salvas pelo **ID** do item.

### Idioma
- pt / en / es, só a interface. Detectado do navegador na primeira visita; trocado pelo botão 🌐.
- O que a pessoa escreveu nunca é traduzido. Os modelos prontos saem no idioma atual no momento
  da escolha.
- Ferramentas em teste ficam só em português, com aviso quando o idioma for outro.
- Preferir ícone + dica (tooltip) a texto sempre que possível.

### Interface
- **Cabeçalho (telas gerais):** 🌐 idioma · ☾ tema · 👤 perfil, no canto direito.
- **Início:** Planner em destaque; abaixo, a seção "Em teste".
- **Modo foco (Planner):** sem itens de cabeçalho. Na barra atual, junto dos botões existentes:
  ✎ editar (abre o editor na data atual) e 👤 perfil ao lado do calendário. Em tela estreita, as
  ações se agrupam num botão ⋯ ("Hoje" fica fora). No modo foco, o menu de perfil tem só o
  essencial (tema; conta na fase de login).
- **Editor ("Montar meu planner"):** fundo de **tapete de corte** (quadriculado + réguas), folha com
  borda tracejada de recorte, faixa "✂ Editando: <nome>" + Concluir. Desktop: folha no centro,
  modelos à esquerda, propriedades à direita. Celular: barra de ícones fixa embaixo
  (Modelos · Frente · Verso · Concluir), cada um abre um painel que sobe de baixo. Modo **guiado**
  na primeira montagem, modo **livre** nas seguintes.

### Fica para depois da Fase 0
Horários nos blocos e itens · arrastar para reordenar · editor de texto visual (Tiptap) · resetar
itens · imprimir semana / dia preenchido.

---

## 2. Arquitetura técnica

### Armazenamento
- `src/data/armazenamento/`: camada genérica sobre `localStorage` (ler, salvar, remover, listar por
  prefixo) com **versão de formato** (`scaffold.formato`) e um executor de migrações, rodado em
  `main.tsx` antes do primeiro render.
- **Store reativo** (`useSyncExternalStore`): todas as leituras passam por ele, então dois
  componentes que leem o mesmo dado (ex.: a folha e o gerador de PDF) nunca ficam dessincronizados
  — é a correção de raiz do bug do PDF com lista desatualizada. Escuta o evento `storage` para
  refletir mudanças feitas em outra aba.
- Dados com `atualizadoEm` desde já (útil para importar/juntar e para a sincronização futura).

### Modelo de dados do Planner (`src/data/planner/`)
```ts
interface Bloco { id: string; nome: string; nomeEditado: boolean }
interface Estrutura { blocos: Bloco[]; humor: boolean; sobreDia: boolean; habitos: boolean; importantes: boolean }
interface Modelo { id: string; nome: string; estrutura: Estrutura; diasSemana: number[] }
interface ItemLista { id: string; texto: string }
interface ListaVersionada { versoes: { desde: string; itens: ItemLista[] }[] }
interface Dia {
  data: string; modeloId: string | null; estrutura: Estrutura
  humor: NivelHumor | null; blocos: Record<string, { tituloExtra: string; texto: string }>
  sobreDia: string; anotacoes: string
  marcados: { habitos: Record<string, boolean>; importantes: Record<string, boolean> }
  criadoEm: string; atualizadoEm: string
}
```
- **Funções puras** (testadas): `resolverLista(lista, data)`, `editarLista(lista, data, itens)`,
  `criarDia(modelo, data)`, `aplicarEstrutura(dia, estrutura)` (com rearranjo),
  `sugerirNomes(n, idioma)`, `modeloDoDiaDaSemana(modelos, data)`.
- Hooks finos por cima: `useDia(data)`, `useModelos()`, `useListaDoDia(tipo, data)`,
  `usePlannerConfig()`.
- Cor do bloco derivada da posição (paleta de 6: os 4 tons atuais + 2 novos no mesmo espírito
  terroso/pastel, claro e escuro).

### Dados do protótipo (formato 1 → 2)
- Os dados salvos pelo protótipo (chaves `scaffold.planner.*`) são **descartados**, não convertidos:
  ninguém usava de verdade (decisão da conversa de 30/09/2026). O executor de migrações
  (`migracoes.ts`) fica pronto para as próximas mudanças de formato, que aí sim serão convertidas.

### Idioma (`src/i18n/`)
- `pt.ts` (fonte de verdade), `en.ts` e `es.ts` com `satisfies Dicionario` — o TypeScript acusa
  chave faltando. `useT()` via contexto; `lang` do `<html>` e locale das datas acompanham.
- Sem biblioteca externa.

### Testes
- Vitest só para as funções puras e a migração (`npm test`). O resto é conferência manual por etapa.

---

## 3. Etapas

| Etapa | Conteúdo | Resultado visível |
|---|---|---|
| **0-A · Base de dados** | Vitest · camada de armazenamento + store reativo · modelo de dados e funções puras · migração formato 1→2 · Planner atual passa a usar a camada nova (sem mudança visual) · correção do PDF desatualizado | Nenhum visual; PDF passa a refletir a lista na hora |
| **0-B · Casca do app** | i18n pt/en/es · cabeçalho com 🌐 · ☾ · 👤 · script anti-flash de tema no `index.html` (citado no `ThemeToggle` mas ausente) · início com Planner em destaque + "Em teste" com aviso de idioma · componente de menu suspenso reaproveitável (extraído do padrão `<details>` atual) | App navegável nos 3 idiomas |
| **0-C · Planner com modelos** | Folha pontilhada para dia inexistente com modelos em botões · primeira vez com boas-vindas e modelos prontos · listas de hábitos/importantes versionadas na folha (bloqueio no passado) · ✎ e 👤 na barra + agrupamento ⋯ em tela estreita | Planner funcionando com modelos, sem editor |
| **0-D · Editor** | Rota do editor · tapete de corte · layout desktop (painéis) e celular (barra + painel de baixo) · blocos (−/+, ✕, + entre blocos, nomes sugeridos) · seções liga/desliga · itens das listas · gerenciar modelos (ordem, dias da semana, duplicar, excluir) · editar um dia / trocar modelo com rearranjo · modo guiado | Montar e editar modelos e dias |
| **0-E · Uso no celular** | Campos que crescem com o texto · área de toque maior · desfazer ao remover item · atalhos de lista (`- `, `1. `) · preferências salvas (largura, modo de visualização) | Uso diário confortável no celular |
| **0-F · Impressão** | Painel de impressão: este dia ou um modelo, A5/A4, itens incluídos, itens ou linhas em branco, prévia, aviso de "não cabe" · impressão no idioma atual | PDF fiel à estrutura escolhida |
| **0-G · Segurança** | PWA (manifest, ícones, offline, aviso de nova versão, instalar no Android e guia no iPhone, `storage.persist`) · exportar/importar JSON (substituir ou juntar) · tela de erro amigável | Pronto para a fase de login |
