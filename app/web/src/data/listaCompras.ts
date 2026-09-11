export interface TipoLista {
	slug: string
	nome: string
	quando: string
	itens: string[]
}

// Rascunho inicial dos 3 tipos de lista mencionados pelo usuário. Semanal segue
// o "conteúdo sugerido" já validado em lista-compras.md; Pontual e Mensal são
// primeiro rascunho, a ajustar com uso real.
export const tiposLista: TipoLista[] = [
	{
		slug: 'semanal',
		nome: 'Semanal',
		quando: 'a compra de rotina da semana',
		itens: [
			'Proteína de preparo rápido ou zero (ovo, iogurte, castanha, queijo)',
			'Carboidrato de preparo rápido (pão, fruta fácil de descascar, barra de cereal)',
			'Pro meal prep do fim de semana: proteína pra congelar, arroz ou macarrão, vegetal que aguenta congelar',
			'Básicos de casa: água, café, o que estiver acabando de higiene',
		],
	},
	{
		slug: 'pontual',
		nome: 'Pontual',
		quando: 'refeição de agora, decisão rápida no mercado',
		itens: ['O que falta pra uma refeição específica de hoje — preencher na hora'],
	},
	{
		slug: 'mensal',
		nome: 'Mensal',
		quando: 'compra grande, itens que duram',
		itens: ['Itens de limpeza e higiene em maior quantidade', 'Despensa: arroz, feijão, óleo, tempero'],
	},
]
