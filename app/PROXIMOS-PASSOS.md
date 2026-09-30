# Próximos passos — passagem da Fase 0

Documento de passagem (30/09/2026) pra continuar o trabalho numa conversa nova. As decisões da Fase 0
estão em [`PLANO-FASE-0.md`](PLANO-FASE-0.md); aqui fica o estado atual e o que vem a seguir.

**Forma de trabalho (combinada):** uma etapa por vez. Antes de começar, resumo curto do que será
feito, e só executar depois da confirmação. Ao terminar, checklist do que mudou pra conferência
manual, com o app rodando pra testar. Preservar a identidade visual atual; mudança visual só com
justificativa e referência.

---

## Estado atual

- **Fase 0 concluída** (etapas 0-A a 0-G) na branch **`fase-0`**, só local: **não enviada pro
  GitHub** e **não mesclada na `main`** (motivo: o repositório é público — ver decisão 1 abaixo).
- **Em produção** (versão `43c7f40`): https://scaffold-app.scaffold-app.workers.dev — PWA
  instalável (verificado com `Page.getInstallabilityErrors` do Chrome), offline desde a primeira
  visita, aviso de versão nova.
- **Testes:** `npm test` (61 testes, Vitest) · `npm run lint` · `npm run build` — tudo em `app/web`.

### Como rodar, testar e publicar (em `app/web`)
- Desenvolvimento: `npx vite --port 5173 --host` → `http://zoya-srv.tailb9fb77.ts.net:5173`
  (o Vite libera `*.ts.net`). O PWA **não** funciona em HTTP.
- Build de produção local: `npm run build && npx vite preview --port 4173 --host 127.0.0.1`.
  HTTPS pelo Tailscale exige `sudo tailscale serve --bg --https=5443 http://127.0.0.1:4173`
  (as portas 443 e 8443–8449 já são de outros serviços desta máquina — não mexer).
- **Publicar:** `npm test && npm run build && set -a && . ./.env && set +a && npx wrangler deploy`.
  O token (`CLOUDFLARE_API_TOKEN`, modelo "Edit Cloudflare Workers") está em `app/web/.env`
  (permissão 600, no `.gitignore`) — nunca imprimir nem versionar. Depois do deploy, verificar
  instalação e abrir offline no endereço publicado.
- Processos em segundo plano (servidor de dev) caem depois de 2 horas nesta ferramenta.

---

## Decisões pendentes (antes de executar os próximos passos)

1. **Privacidade do código.** O repositório `felipiadenildo/scaffold` é **público** e a `main` já
   tem o app na versão MVP. Opções discutidas:
   - **A (recomendado):** manter o monorepo, **tornar privado** e mover o deploy do manual do
     GitHub Pages (que no plano grátis exige repositório público) pro Cloudflare, na mesma conta
     do app. O site do manual continua público; muda a URL (atualizar o link no rodapé do app).
   - **B:** separar — manual num repositório público (dá pra extrair com histórico via
     `git subtree split --prefix=manual`), app num privado. Faz sentido se o manual for aberto a
     contribuições.
   - Só depois disso: push da `fase-0` e merge na `main`.
2. **Licença do código** (hoje não tem; o conteúdo do manual é CC BY-NC-SA 4.0): proprietária,
   AGPL-3.0 ou MIT.

---

## Próximos passos (nesta ordem)

### 1. Correções no celular
- **Janelas transbordando:** a prévia da impressão (2 páginas de 170px + respiro) passa da largura
  do celular. Ajustar a prévia à largura disponível e conferir todas as janelas em 360 e 390px.
- **Deslizar pra trocar de dia:** hoje gestos que começam em campo de texto são ignorados — e a
  folha é quase toda campo de texto. Permitir deslizar sobre o texto quando o campo não está em
  edição (teclado fechado), a folha acompanhar o dedo e voltar/avançar ao soltar (carrossel), e
  uma dica no primeiro acesso.

### 2. Arrumação de "produto" + deploy automático
- Resolver a decisão 1 (privacidade) e a 2 (licença).
- `README.md` da raiz (cita `reference/` e o nome de uma cliente, pasta que nem está no repo) e
  `app/web/README.md` (diz "sem persistência, sem login") desatualizados; `ORGANIZACAO.md` com
  decisões antigas (Astro no app).
- `.env.example`, CHANGELOG e versão marcada (ex.: `v0.1.0`).
- CI no GitHub Actions: testes + lint + build em todo push/PR.
- **Deploy automático:** push na `main` com mudança em `app/web/` → testes → build → `wrangler
  deploy`. Precisa do token como *secret* do GitHub (`CLOUDFLARE_API_TOKEN`).
- Push da `fase-0` e merge na `main`.

### 3. Primeiro acesso: explicar os elementos
- Evitar tour longo no começo (afasta, especialmente com TDAH). Proposta a estudar: dicas no próprio
  lugar na primeira vez que cada elemento aparece (humor, blocos, hábitos, "não pode deixar de
  fazer", imprimir, deslizar…), uma de cada vez; um "?" discreto por seção com a explicação e o
  link pro capítulo do manual; textos baseados no manual e nos estudos, nos 3 idiomas.
- Incorporar o retorno dos testadores sobre o que confunde.

### Depois
- Fase de login (Supabase + Google, opcional; ver memória do projeto e `PLANO-FASE-0.md`).
- Padronizar as janelas (disposição, botões Cancelar/Voltar/Salvar, comportamento no celular).
- PDF vetorial · horários nos blocos · editor de texto visual (Tiptap) · imprimir semana.
