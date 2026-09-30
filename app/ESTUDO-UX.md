# Estudo: engajamento, notificações, visões semanal e mensal e primeiro acesso

Estudo de 30/09/2026 para decidir as próximas melhorias de UX e UI. Parte do que o manual já
defende, compara com o que a pesquisa e outros apps fazem e termina com uma proposta de etapas e as
decisões que precisam de resposta.

---

## 1. O ponto de partida: o que o manual pede

Quatro fios atravessam o manual ([Fundamentos](../manual/src/content/docs/manual/01-fundamentos.md))
e qualquer ideia nova precisa passar por eles:

1. **Externalizar** em vez de confiar na memória.
2. **Reduzir vergonha** em vez de aumentar cobrança.
3. **Ancorar em evento**, não em horário.
4. **Ter sempre uma versão mínima**, ao lado da ideal.

E duas frases do manual pesam diretamente neste estudo:

- "A solução é redesenhar o ambiente para que agir seja automático, **não adicionar mais lembrete,
  mais cobrança, mais força de vontade**." (Fundamentos)
- "Evite versões gamificadas, com muitos widgets e progressões visuais, **logo de início**. Podem
  ajudar depois." (Sistema Digital)

Ou seja: notificação e gamificação não estão proibidas, mas precisam ser **ambiente**, não
**cobrança**, e entrar aos poucos.

O manual também já tem os rituais que o app pode materializar:

| No manual | Onde está | O que o app pode fazer |
|---|---|---|
| Ritual de fim de dia, "pouso do dia", folha de amanhã pronta | Folha A5, Sistema Analógico | Notificação e tela de fim de dia |
| *Decision banking*: decidir à noite o que for possível | Rotinas do Dia a Dia | Preparar a tarefa principal de amanhã |
| Protocolo de Baixo Esforço: "se os 4 foram feitos, o dia foi um sucesso" | Folha A5 (verso) | Modo dia difícil e celebração dos 4 |
| Vitória do dia, "uma coisa, só uma" | Folha A5 | Coleção de vitórias na semana e no mês |
| Energia do dia (baixa, média, alta) | Folha A5 | Sugerir o modelo Leve em dia de energia baixa |
| Revisão semanal e mensal, 3 perguntas, sem autocobrança | Planejamento, Registro de Revisão | Verso das visões semanal e mensal |
| Mini-prazos com o mesmo peso de um compromisso | Planejamento | Marcos na visão mensal |
| Temptation bundling, Dopamine Menu como recompensa | Rotinas, Dopamine Menu | Recompensa depois dos essenciais |

---

## 2. Notificações

### O que a pesquisa mostra

- **Lembrete genérico não funciona bem com TDAH.** Num ensaio com 109 adultos com TDAH, SMS
  lembrando de voltar ao programa não aumentou a conclusão dos módulos nem os acessos
  ([Nordby et al., 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9149073/)).
- **Lembrete ligado ao momento da ação funciona.** Planos "se X, então Y" (*implementation
  intentions*) melhoraram a inibição de resposta em crianças com TDAH até o nível de crianças sem
  TDAH ([Gawrilow e Gollwitzer, 2008](https://link.springer.com/article/10.1007/s10608-007-9150-1)).
  A notificação boa não diz "abra o app", diz "depois do almoço: ligar pro dentista".
- **Notificação demais piora a atenção.** Com os alertas ligados, pessoas sem diagnóstico relataram
  mais desatenção e hiperatividade ([Kushlev et al., CHI 2016](https://dl.acm.org/doi/10.1145/2858036.2858359)).
  Poucas notificações, e só as que o usuário escolheu.
- **O mesmo aviso, no mesmo horário, vira ruído.** A Duolingo publicou o algoritmo que escolhe os
  textos dos lembretes: ele favorece mensagens **novas** e deixa as repetidas "descansarem"
  ([Yancey e Settles, KDD 2020](https://research.duolingo.com/papers/yancey.kdd20.pdf)). Variar o
  texto é uma das poucas coisas da Duolingo que vale copiar.

### Por que não copiar a "cobrança" da Duolingo

A coruja que faz chantagem emocional funciona para métrica de uso, mas vai contra o fio 2 do manual:
vergonha reduz o acesso ao córtex pré-frontal e piora a próxima tentativa. Para quem tem disforia
sensível à rejeição ([Protocolos de Crise](../manual/src/content/docs/manual/05-protocolos-crise-emocional.md)),
"você me abandonou" pesa muito mais do que para a média.

O carisma pode existir sem culpa: humor leve, acolhimento, curiosidade. A regra é **nunca falar do
que não foi feito, só do próximo passo possível**.

### Três tipos de notificação, na ordem de valor

1. **Pouso do dia (noite).** Um convite curto no horário que a pessoa escolher: "Pouso do dia:
   qual foi a vitória de hoje? E a tarefa principal de amanhã?" Tocar abre uma tela de 1 minuto:
   vitória, essenciais, tarefa de amanhã, e fecha com "Amanhã é outra folha". É o ritual do manual,
   é *decision banking* e é a que mais combina com a proposta. **Começar por esta.**
2. **Transição de bloco (opcional, por bloco).** Não "você está seguindo o bloco?" (soa como
   fiscal), e sim a âncora do manual: "Depois do almoço: terminar o relatório (parte 1)". Usa o
   texto que a pessoa escreveu no bloco. O horário é só um aproximado da âncora (a refeição), e a
   pessoa liga só nos blocos que quiser. Se o bloco estiver vazio, não notifica.
3. **Essenciais do dia (no máximo uma por dia, tarde).** Só se o "Não pode deixar de fazer" tiver
   itens abertos, e com o tom do protocolo: "Ainda dá tempo do mínimo: água e comer algo. Isso já
   conta." Nunca contagem de pendências, nunca "você esqueceu".

Regras para todas:
- Tudo desligado por padrão. O pedido de permissão só aparece quando a pessoa ativa um lembrete.
- Limite de 3 por dia, textos que variam, silêncio se o app foi aberto há pouco.
- Um botão "hoje não" que silencia o resto do dia, sem pedir justificativa.
- Dia marcado como difícil (ver seção 5) só recebe, no máximo, o pouso do dia.

### O que é possível tecnicamente

| Caminho | Funciona com o app fechado? | Observação |
|---|---|---|
| Aviso dentro do app, ao abrir | Não | Já dá pra fazer hoje, sem servidor |
| Selo no ícone (Badging API) | Sim, estático | Número de essenciais em aberto no ícone do app instalado. Funciona no computador e no iPhone (com permissão de notificação); no Android, não |
| Notification Triggers (agendar no aparelho) | Seria | **Abandonada pelo Chrome**, nunca saiu ([Chrome](https://developer.chrome.com/docs/web-platform/notification-triggers)) |
| Periodic Background Sync | Às vezes | Só Chrome/Edge, app instalado, horário decidido pelo navegador ([Chrome](https://developer.chrome.com/docs/capabilities/periodic-background-sync)): não serve pra lembrete com hora |
| **Web Push por um servidor** | **Sim** | Único caminho confiável. No iPhone, só com o app instalado na tela inicial (iOS 16.4+) ([Pushpad](https://pushpad.xyz/blog/ios-special-requirements-for-web-push-notifications)) |

**Conclusão:** notificação com horário exige um pequeno servidor. Proposta que preserva o princípio
de privacidade do projeto:

- Um Worker no Cloudflare (mesma conta, plano gratuito) com **Cron Trigger** a cada 15 minutos e um
  banco D1 guardando **só** o endereço de push do aparelho, os horários escolhidos e o fuso. **Nada
  do que a pessoa escreve vai para o servidor.** Bibliotecas de Web Push que rodam em Workers:
  [PushForge](https://github.com/draphy/pushforge), [@block65/webcrypto-web-push](https://www.npmjs.com/package/@block65/webcrypto-web-push).
- O servidor manda só um sinal ("é a hora do pouso do dia"). Quem escreve o texto é o service
  worker, no próprio aparelho, lendo um resumo do dia que o app deixa no IndexedDB (o service
  worker não enxerga o `localStorage`). Assim a notificação pode citar a tarefa do bloco sem ela
  sair do celular.
- O iPhone exige que todo push mostre uma notificação (não existe push "silencioso" para web),
  então o texto precisa sempre fazer sentido, mesmo quando tudo já foi feito ("Tudo certo por
  hoje. Quer anotar a vitória?").

Isso não depende da fase de login: a assinatura de push é do aparelho, não da pessoa.

---

## 3. Gamificação e carisma

### O que a pesquisa mostra

- **Sequência que zera é o maior risco.** O padrão em que um deslize vira abandono total tem nome:
  efeito de violação da abstinência, o "efeito dane-se" (Marlatt; Polivy). E perder um dia não
  atrapalha a formação do hábito: no estudo clássico de Lally et al., faltar uma oportunidade
  **não afetou de forma relevante** o processo ([Lally et al., 2010](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674)).
  O que derruba é a reação ao contador zerado, não a falta.
- **Recompensa que controla mata a motivação.** Pela teoria da autodeterminação, pontos e medalhas
  ajudam quando reforçam **competência e autonomia** e atrapalham quando viram "faça X para ganhar
  Y" ([efeito de superjustificação](https://en.wikipedia.org/wiki/Overjustification_effect);
  [Rutledge et al., 2018](https://selfdeterminationtheory.org/wp-content/uploads/2020/10/2018_RutledgeWalshEtAl_Gamification.pdf)).
- **Recomeços motivam.** Início de semana, de mês ou de ano aumentam a disposição para retomar
  metas, porque separam o "eu de antes" do "eu de agora"
  ([Dai, Milkman e Riis, 2014](https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1901)). O
  manual já usa isso: "Amanhã é outra folha".
- **Gamificação em saúde mental** usa sobretudo progresso visível, níveis, recompensas e narrativa
  ([Cheng et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6617915/)), mas os apps para TDAH
  ainda perdem a maioria dos usuários mesmo com esses recursos
  ([revisão sistemática recente](https://pubmed.ncbi.nlm.nih.gov/41625634/)). Gamificação ajuda, não salva.
- **O exemplo que funciona com público neurodivergente é o Finch:** um bichinho que cresce quando
  você se cuida e nada de ruim acontece quando você falta
  ([Reset ADHD](https://www.resetadhd.com/adhd-resource-hub/finch-self-care)).

### Proposta: gamificação que acolhe

| Elemento | Como funciona | Por que assim |
|---|---|---|
| **Constância da semana** | Anel "4 de 7 dias com a folha usada", zera toda segunda | Sem sequência que quebra; a segunda é um recomeço natural |
| **"Usada" = qualquer marca** | Um bloco escrito, um humor, um essencial marcado | Manual: "um bloco com só a tarefa principal já é uma folha usada com sucesso" |
| **Os 4 essenciais** | Ao marcar os 4, uma celebração curta: "Se os 4 foram feitos, o dia foi um sucesso." | Frase literal do manual; celebra o mínimo, não o máximo |
| **Pote de vitórias** | A vitória do dia vai para uma coleção que aparece na semana e no mês | Reforça competência sem comparar nem contar |
| **O andaime que sobe** (opcional) | Uma construção que ganha um andar a cada semana de uso; nunca é demolida, só pausa | Carisma ligado ao nome do projeto, no espírito do Finch |
| **Recompensa do Dopamine Menu** | Depois dos essenciais, sugerir uma atividade do Dopamine Menu | *Temptation bundling*, que o manual já recomenda |

O que fica de fora: ranking, pontos que se perdem, contador de dias seguidos, mensagem sobre o que
faltou, comparação com outras pessoas.

Seguindo o manual ("não logo de início"), o andaime e o anel aparecem depois de uma ou duas semanas
de uso, com uma opção para desligar tudo que for lúdico.

---

## 4. Visões semanal e mensal

### O que os apps fazem

- **Google Agenda:** dia, 3 dias, semana, mês e "programação" (lista). No celular, deslizar troca o
  período ([Google](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DAndroid)).
- **Samsung Calendar:** ano, mês, semana e dia, e **figurinhas e emojis direto no dia** da visão
  mensal, que deixam padrões visíveis olhando 30 dias de uma vez
  ([Android Police](https://www.androidpolice.com/overlooked-one-ui-app-is-unsung-hero-on-samsung-galaxy-phones/)).
- **Tiimo e Structured:** linha do tempo visual com blocos coloridos, feitos para TDAH
  ([Tiimo](https://www.tiimoapp.com/product)).
- **Bullet journal:** registro mensal, grade de hábitos (hábitos nas linhas, dias nas colunas) e o
  "ano em pixels", um quadradinho colorido por dia para o humor
  ([Little Coffee Fox](https://littlecoffeefox.com/year-in-pixels/)).

### A abordagem proposta: reflexão e visão de conjunto, não outra agenda

O manual defende **um sistema só** e deixa compromisso de calendário e projeto para as ferramentas
certas (Sistema Analógico e Sistema Digital). Se a visão semanal virar uma agenda com horários, ela
compete com o Google Agenda e vira "mais um lugar onde a informação pode estar". Por isso a proposta
segue a metáfora que o app já tem, **a folha com frente e verso**:

**Folha da semana**
- **Frente, "como foi":** os 7 dias lado a lado (no celular, empilhados em lista). Cada dia mostra a
  cor do humor, os essenciais marcados, o título extra dos blocos (a "Consulta 10h") e a vitória.
  Tocar num dia abre a folha dele. Dia não criado aparece pontilhado, como já é hoje.
- **Verso, "revisão da semana":** as 3 perguntas do manual (o que funcionou, o que não funcionou, o
  que muda) e a vitória da semana. Dez minutos, bullets curtos.
- Constância da semana e hábitos da semana numa grade pequena (7 colunas).

**Folha do mês**
- **Frente:** a grade do mês com a cor do humor em cada dia (o "mês em pixels"), um ponto para os
  dias com os 4 essenciais e os títulos extras como marcos. Uma grade de hábitos do mês embaixo.
- **Verso, "revisão do mês":** as perguntas do Registro de Revisão (compromissos contra energia
  real, a folha ainda ajuda?, algum sistema foi abandonado?, ajuste para o mês que vem) e o pote de
  vitórias do mês.

**Navegação:** o mesmo gesto do dia (deslizar troca a semana ou o mês), o mesmo menu de visões que
já existe ("Scaffold | ícone"), e as duas visões imprimíveis em A5, para o fichário.

**Planejar pra frente, de leve:** permitir marcar um compromisso ou mini-prazo num dia futuro (o
manual pede que mini-prazos tenham o mesmo peso visual de um compromisso). Sem horários nem
recorrência: quem precisa disso já tem o Google Agenda. Mais adiante, dá pra **ler** uma agenda
externa (arquivo ICS) só para mostrar os compromissos, sem virar outra agenda.

---

## 5. Primeiro acesso e ensino pelo uso

Hoje existe a janela de boas-vindas (4 frases e a escolha do modelo). Ela está boa e deve continuar
curta. Um tour longo no início afasta, principalmente com TDAH. A proposta é **ensinar no momento
em que cada coisa aparece**, em três camadas:

1. **Dicas no lugar, uma por vez.** Na primeira vez que o elemento aparece, um balão curto com a
   ideia do manual e um "por quê?" que leva ao capítulo. Exemplos:
   - Blocos: "Os blocos seguem as refeições, não o relógio. Âncoras resistem melhor a imprevistos."
   - Hábitos: "Marque o que der. Um item marcado já conta."
   - Não pode deixar de fazer: "É o mínimo de um dia difícil. Se os 4 foram feitos, o dia foi um sucesso."
   - Humor: "Um toque basta. No fim do mês, vira um mapa do seu humor."
   - Imprimir: "Papel e tela valem o mesmo. A folha impressa vai pro fichário."
2. **Um "?" discreto em cada seção**, sempre disponível, com a explicação e o link para o manual.
3. **Guias que estimulam o uso, pelo comportamento:**
   - Na terceira noite de uso: "Quer deixar a tarefa principal de amanhã pronta? Decidir à noite
     poupa a manhã."
   - Depois de dias sem abrir: "Bom te ver. Hoje é uma folha nova." Nunca "você sumiu".
   - Numa segunda-feira ou dia 1: convite para a revisão da semana ou do mês (recomeço).
   - Humor "difícil" ou "muito difícil": oferecer o modo dia difícil e o Cartão SOS.

Limites: no máximo uma dica por abertura do app, todas em pt/en/es, e uma opção para desligar.

---

## 6. Outras ideias

- **Modo dia difícil.** Um toque transforma a folha no Protocolo de Baixo Esforço (os 4
  essenciais) e desliga lembretes, exceto o pouso do dia. É a "versão mínima" do fio 4.
- **Energia do dia**, que já está na Folha A5 do manual: com energia baixa, sugerir o modelo Leve
  para aquele dia.
- **Tarefa principal destacada** em cada bloco ("uma tarefa principal por bloco, mais no máximo
  uma de apoio").
- **Timer visual** (disco que encolhe, 15 a 20 minutos, ou 5 a 10 em dia de energia baixa) a
  partir de um bloco, como o manual recomenda para o Pomodoro adaptado.
- **Selo no ícone do app** com os essenciais em aberto: lembrete externo e silencioso, sem som.
- **Tela "Agora"**: aberta pela notificação, mostra só o bloco atual e os essenciais, sem a folha
  inteira.
- **Imprimir a semana**, que já estava na lista de "depois".
- **Compartilhar com quem apoia** (capítulo 11): fica para depois do login.
- **Reduzir movimento**: celebrações e animações respeitam a preferência do sistema.

---

## 7. Proposta de etapas

| Etapa | O que entra | Precisa de servidor? |
|---|---|---|
| **A. Ensinar e acolher** | Dicas no lugar, "?" por seção, modo dia difícil, celebração dos 4 essenciais, tela de pouso do dia ao abrir o app à noite | Não |
| **B. Folha da semana** | Frente (7 dias), verso (revisão da semana), constância da semana, imprimir | Não |
| **C. Folha do mês** | Mês em pixels, grade de hábitos, marcos, revisão do mês, pote de vitórias | Não |
| **D. Notificações** | Worker de push, pouso do dia, transição de bloco, essenciais; selo no ícone | Sim (Worker + D1, grátis) |
| **E. Lúdico opcional** | O andaime que sobe, recompensa do Dopamine Menu | Não |

A ordem põe primeiro o que não depende de servidor e o que mais conversa com o manual. A etapa D
pode vir antes de B ou C se as notificações forem prioridade.

## 8. Decisões pendentes

1. **Ordem das etapas.** Seguir A → B → C → D → E, ou puxar as notificações (D) para antes?
2. **Tom do carisma.** Acolhedor e discreto (como o manual escreve hoje), ou com mais humor e
   personalidade (um personagem que fala)?
3. **O andaime que sobe:** vale ter um elemento lúdico visual, ou só o anel da semana e o pote de
   vitórias?
4. **Visões semanal e mensal:** só reflexão (o que já aconteceu), ou também marcar compromissos em
   dias futuros?
5. **Servidor de push:** ok ter um Worker que guarda só o endereço de push e os horários, sem
   nenhum conteúdo?
