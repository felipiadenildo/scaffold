export type Categoria = 'impresso' | 'notion-sheets' | 'web'
export type StatusItem = 'pronto' | 'em-teste'

export interface ItemCatalogo {
	slug: string
	nome: string
	categoria: Categoria
	status: StatusItem
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
//
// Convenção de `acaoPrincipal`: sempre "verbo + objeto concreto", descrevendo o que
// o clique faz. Evitar estados ("Em breve") misturados com ações, e evitar repetir
// o mesmo verbo genérico em itens diferentes quando o destino é outro.
export const catalogo: ItemCatalogo[] = [
	{
		slug: 'planners',
		nome: 'Planners',
		categoria: 'web',
		status: 'pronto',
		resumo: 'O dia em blocos por período, frente e verso. Tem humor, hábitos e protocolo de dia difícil. O diário já está pronto, e semanal e mensal vêm depois.',
		rota: '/planners',
		acaoPrincipal: 'Abrir o Planner',
	},
	{
		slug: 'lista-compras',
		nome: 'Lista de Compras',
		categoria: 'web',
		status: 'em-teste',
		resumo: 'Semanal, pontual ou mensal. Escolha o tipo de lista certo pro momento.',
		rota: '/lista-compras',
		acaoPrincipal: 'Escolher lista',
	},
	{
		slug: 'dopamine-menu',
		nome: 'Dopamine Menu',
		categoria: 'web',
		status: 'em-teste',
		resumo: 'Uma sugestão por vez, por categoria, em vez da lista inteira de uma vez.',
		rota: '/dopamine-menu',
		acaoPrincipal: 'Escolher categoria',
	},
	{
		slug: 'meal-prep',
		nome: 'Meal Prep',
		categoria: 'impresso',
		status: 'em-teste',
		resumo: 'Estoque do freezer: o que tem, desde quando e quantas porções.',
		rota: '/meal-prep',
		acaoPrincipal: 'Ver estoque',
	},
	{
		slug: 'cartao-sos',
		nome: 'Cartão SOS',
		categoria: 'web',
		status: 'em-teste',
		resumo: 'Um cartão pra consultar em momentos difíceis, com o que ajuda a atravessar sem decidir no escuro. Ainda em desenvolvimento, o design definitivo não começou.',
		rota: '/cartao-sos',
		// "Em breve" misturava estado com ação. Aqui o clique leva pra uma tela do cartão,
		// então o texto descreve essa ação.
		acaoPrincipal: 'Conhecer o cartão',
	},
	{
		slug: 'financeiro',
		nome: 'Financeiro',
		categoria: 'notion-sheets',
		status: 'em-teste',
		resumo: 'Estrutura de planilha pra dar visibilidade ao gasto e ajudar no controle de impulso.',
		rota: '/financeiro',
		// Antes repetia "Ver modelo" com o item de baixo. Agora diz o que o clique abre.
		acaoPrincipal: 'Abrir planilha',
	},
	{
		slug: 'viagem',
		nome: 'Viagem',
		categoria: 'notion-sheets',
		status: 'em-teste',
		resumo: 'Checklists de ônibus e voo, mais um checklist de verificação de IA.',
		rota: '/viagem',
		acaoPrincipal: 'Abrir checklist',
	},
]