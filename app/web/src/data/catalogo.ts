export type Categoria = 'impresso' | 'notion-sheets' | 'web'

export interface ItemCatalogo {
	slug: string
	nome: string
	categoria: Categoria
	resumo: string
	rota: string
	acaoPrincipal: string
}

export const categoriaLabel: Record<Categoria, string> = {
	impresso: 'Impresso',
	'notion-sheets': 'Notion / Sheets',
	web: 'Web',
}

export const categoriaCor: Record<Categoria, string> = {
	impresso: 'var(--color-cat-print)',
	'notion-sheets': 'var(--color-cat-utility)',
	web: 'var(--color-cat-web)',
}

// Fonte única da vitrine: adicionar uma solução nova é adicionar uma entrada aqui,
// não escrever uma página de índice nova. Ver app/ORGANIZACAO.md §6.2.
export const catalogo: ItemCatalogo[] = [
	{
		slug: 'folha-a5',
		nome: 'Folha A5',
		categoria: 'impresso',
		resumo: 'O dia em blocos por período, frente e verso. Uma versão digital também está disponível.',
		rota: '/folha-a5',
		acaoPrincipal: 'Ver versão digital',
	},
	{
		slug: 'lista-compras',
		nome: 'Lista de Compras',
		categoria: 'web',
		resumo: 'Semanal, pontual ou mensal — escolha o tipo de lista certo pro momento.',
		rota: '/lista-compras',
		acaoPrincipal: 'Escolher lista',
	},
	{
		slug: 'dopamine-menu',
		nome: 'Dopamine Menu',
		categoria: 'web',
		resumo: 'Uma sugestão por vez, por categoria — não a lista inteira de uma vez.',
		rota: '/dopamine-menu',
		acaoPrincipal: 'Escolher categoria',
	},
	{
		slug: 'meal-prep',
		nome: 'Meal Prep',
		categoria: 'impresso',
		resumo: 'Estoque do freezer: o que tem, desde quando, quantas porções.',
		rota: '/meal-prep',
		acaoPrincipal: 'Ver estoque',
	},
	{
		slug: 'cartao-sos',
		nome: 'Cartão SOS',
		categoria: 'web',
		resumo: 'Em desenvolvimento — design definitivo ainda não iniciado.',
		rota: '/cartao-sos',
		acaoPrincipal: 'Em breve',
	},
	{
		slug: 'financeiro',
		nome: 'Financeiro',
		categoria: 'notion-sheets',
		resumo: 'Estrutura de planilha pra visibilidade de gasto e controle de impulso.',
		rota: '/financeiro',
		acaoPrincipal: 'Ver modelo',
	},
	{
		slug: 'viagem',
		nome: 'Viagem',
		categoria: 'notion-sheets',
		resumo: 'Checklists de ônibus e voo, mais checklist de verificação de IA.',
		rota: '/viagem',
		acaoPrincipal: 'Ver modelo',
	},
]
