export interface CategoriaDopamina {
	slug: string
	nome: string
	esforco: string
	sugestoes: string[]
}

// Conteúdo-base de manual/src/content/docs/templates/dopamine-menu.md.
// Editável em tela (estado local) — vira persistente quando o backend entrar.
export const categoriasDopamina: CategoriaDopamina[] = [
	{
		slug: 'entradas',
		nome: 'Entradas',
		esforco: 'rápidas, até 5 minutos',
		sugestoes: [
			'Ouvir uma música favorita',
			'Esticar o corpo',
			'Tomar um copo de água gelada',
			'Mandar uma mensagem engraçada pra alguém',
		],
	},
	{
		slug: 'acompanhamentos',
		nome: 'Acompanhamentos',
		esforco: 'pra fazer durante uma tarefa chata',
		sugestoes: ['Podcast ou playlist enquanto lava louça', 'Chá ou café enquanto revisa planilha'],
	},
	{
		slug: 'pratos-principais',
		nome: 'Pratos principais',
		esforco: 'satisfação ao fim do dia, mais tempo',
		sugestoes: ['Um episódio de série', 'Um banho mais longo', 'Um capítulo de um livro que gosta'],
	},
	{
		slug: 'sobremesas',
		nome: 'Sobremesas',
		esforco: 'fácil de exagerar, vale definir um limite',
		sugestoes: ['Rede social por tempo definido, com timer visual', 'Um doce específico', 'Jogo no celular'],
	},
	{
		slug: 'especiais',
		nome: 'Especiais',
		esforco: 'raras, exigem planejamento prévio',
		sugestoes: ['Um passeio combinado com antecedência', 'Uma compra pequena planejada', 'Um dia de descanso total'],
	},
]
