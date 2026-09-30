# Próximos passos — passagem da Fase 0

Documento de passagem (30/09/2026) pra continuar o trabalho numa conversa nova. As decisões da Fase 0
estão em [`PLANO-FASE-0.md`](PLANO-FASE-0.md); aqui fica o estado atual e o que vem a seguir.

**Forma de trabalho (combinada):** uma etapa por vez. Antes de começar, resumo curto do que será
feito, e só executar depois da confirmação. Ao terminar, checklist do que mudou pra conferência
manual, com o app rodando pra testar. Preservar a identidade visual atual; mudança visual só com
justificativa e referência.

---

## Estado atual

- **Fase 0 concluída** e publicada: mesclada na `main` (PR #1) com a tag **`v0.1.0`**.
- **Repositório público** com licença **AGPL-3.0** para o código; o conteúdo do manual segue em
  CC BY-NC-SA 4.0. READMEs em inglês (`README.md`), português e espanhol, com capturas geradas por
  `npm run capturas`.
- **Em produção:** https://app.myscaffold.workers.dev (PWA instalável, offline desde a primeira
  visita, aviso de versão nova). Manual: https://felipiadenildo.github.io/scaffold/
- **CI e deploy automático** (GitHub Actions): `ci.yml` roda testes, lint e build em todo push/PR
  que mexa em `app/web/`; `deploy-app.yml` publica no Cloudflare a cada push na `main` com mudança
  em `app/web/` (ou à mão, pela aba Actions). O manual só é republicado quando `manual/` muda.
- **Testes:** `npm test` (61 testes, Vitest) · `npm run lint` · `npm run build`, tudo em `app/web`.

### Como rodar, testar e publicar (em `app/web`)
- Desenvolvimento: `npx vite --port 5173 --host` → `http://zoya-srv.tailb9fb77.ts.net:5173`
  (o Vite libera `*.ts.net`). O PWA **não** funciona em HTTP.
- Build de produção local: `npm run build && npx vite preview --port 4173 --host 127.0.0.1`.
  HTTPS pelo Tailscale exige `sudo tailscale serve --bg --https=5443 http://127.0.0.1:4173`
  (as portas 443 e 8443–8449 já são de outros serviços desta máquina — não mexer).
- **Publicar:** automático no merge na `main` (secrets `CLOUDFLARE_API_TOKEN` e
  `CLOUDFLARE_ACCOUNT_ID` no GitHub). À mão, em emergência: `npm test && npm run build && set -a &&
  . ./.env && set +a && npx wrangler deploy` (token em `app/web/.env`, ver `.env.example`; nunca
  imprimir nem versionar). Depois do deploy, verificar instalação e abrir offline no endereço
  publicado.
- Processos em segundo plano (servidor de dev) caem depois de 2 horas nesta ferramenta.

---

## Decisões tomadas em 30/09/2026

- Repositório **público**, código em **AGPL-3.0-only**, manual em CC BY-NC-SA 4.0.
- Endereço gratuito do Cloudflare: subdomínio da conta `myscaffold`, Worker `app`
  (`scaffold` e `andaime` já eram de outras contas). Domínio próprio fica pra depois.
- Login (Supabase + Google) e PDF vetorial ficam pra depois.

---

## Próximos passos (nesta ordem)

### 1. Correções no celular
- **Janelas transbordando:** a prévia da impressão (2 páginas de 170px + respiro) passa da largura
  do celular. Ajustar a prévia à largura disponível e conferir todas as janelas em 360 e 390px.
- **Deslizar pra trocar de dia:** hoje gestos que começam em campo de texto são ignorados — e a
  folha é quase toda campo de texto. Permitir deslizar sobre o texto quando o campo não está em
  edição (teclado fechado), a folha acompanhar o dedo e voltar/avançar ao soltar (carrossel), e
  uma dica no primeiro acesso.

### 2. Primeiro acesso: explicar os elementos
- Evitar tour longo no começo (afasta, especialmente com TDAH). Proposta a estudar: dicas no próprio
  lugar na primeira vez que cada elemento aparece (humor, blocos, hábitos, "não pode deixar de
  fazer", imprimir, deslizar…), uma de cada vez; um "?" discreto por seção com a explicação e o
  link pro capítulo do manual; textos baseados no manual e nos estudos, nos 3 idiomas.
- Incorporar o retorno dos testadores sobre o que confunde.

### Depois
- Fase de login (Supabase + Google, opcional; ver memória do projeto e `PLANO-FASE-0.md`).
- Padronizar as janelas (disposição, botões Cancelar/Voltar/Salvar, comportamento no celular).
- PDF vetorial · horários nos blocos · editor de texto visual (Tiptap) · imprimir semana.
