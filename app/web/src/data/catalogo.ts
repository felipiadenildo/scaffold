import type { Dicionario } from '../i18n/pt'

export type Categoria = 'impresso' | 'notion-sheets' | 'web'
export type StatusItem = 'pronto' | 'em-teste'

// Nome, resumo e ação de cada item moram no dicionário (t.catalogo.itens[slug]) — o slug tipado
// garante que todo item do catálogo tem texto nos três idiomas.
export interface ItemCatalogo {
	slug: keyof Dicionario['catalogo']['itens']
	categoria: Categoria
	status: StatusItem
	rota: string
}

export const categoriaCor: Record<Categoria, string> = {
	impresso: 'var(--color-cat-print)',
	'notion-sheets': 'var(--color-cat-utility)',
	web: 'var(--color-cat-web)',
}

// Fonte única da vitrine: adicionar uma solução nova é adicionar uma entrada aqui (e o texto dela
// nos dicionários), não escrever uma página de índice nova. Ver app/ORGANIZACAO.md §6.2.
export const catalogo: ItemCatalogo[] = [
	{ slug: 'planners', categoria: 'web', status: 'pronto', rota: '/planners' },
	{ slug: 'lista-compras', categoria: 'web', status: 'em-teste', rota: '/lista-compras' },
	{ slug: 'dopamine-menu', categoria: 'web', status: 'em-teste', rota: '/dopamine-menu' },
	{ slug: 'meal-prep', categoria: 'impresso', status: 'em-teste', rota: '/meal-prep' },
	{ slug: 'cartao-sos', categoria: 'web', status: 'em-teste', rota: '/cartao-sos' },
	{ slug: 'financeiro', categoria: 'notion-sheets', status: 'em-teste', rota: '/financeiro' },
	{ slug: 'viagem', categoria: 'notion-sheets', status: 'em-teste', rota: '/viagem' },
]
