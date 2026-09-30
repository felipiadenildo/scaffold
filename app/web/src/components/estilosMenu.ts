// Classes compartilhadas pelos menus suspensos da barra do Planner (impressão, perfil, ⋯), pra os
// três terem exatamente o mesmo painel e os mesmos itens.

export const classePainelMenu =
	'absolute right-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded-scaffold border border-border bg-bg-raised p-2 shadow-raised'

// Cada item é um botão de verdade: borda, fundo, hover. Ícone à esquerda (use `classeIconeItemMenu`),
// rótulo no meio (flex-1) e, se houver, um detalhe curto à direita em text-ink-soft.
export const classeItemMenu =
	'group/item relative flex w-full items-center gap-2.5 rounded-scaffold border border-border bg-bg px-2.5 py-2 text-left text-xs font-medium text-ink transition-colors hover:border-ink-soft disabled:cursor-wait disabled:opacity-60'

export const classeIconeItemMenu = 'h-4 w-4 shrink-0 text-ink-soft transition-colors group-hover/item:text-ink'

// Botão redondo da barra (mesmo das ações já existentes: largura, modo, impressão, calendário).
export const classeBotaoBarra =
	'flex shrink-0 cursor-pointer list-none items-center gap-1 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden'
