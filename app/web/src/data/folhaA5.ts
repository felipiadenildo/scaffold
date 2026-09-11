export interface BlocoDia {
	slug: string
	periodo: string
	ancora: string
	cor: string
	campos: string[]
}

// Conteúdo de manual/src/content/docs/templates/folha-a5.md.
export const blocosDia: BlocoDia[] = [
	{
		slug: 'manha',
		periodo: '🌅 Manhã',
		ancora: 'café da manhã',
		cor: '#f4b942',
		campos: ['Ritual de partida (água + remédio/café + roupa)', 'Tarefa principal', 'Apoio'],
	},
	{
		slug: 'tarde-1',
		periodo: '☀️ Tarde 1',
		ancora: 'almoço + pausa',
		cor: '#5fb3d9',
		campos: ['Retorno calmo (5 min sem tela)', 'Tarefa de foco', 'Apoio / operacional'],
	},
	{
		slug: 'tarde-2',
		periodo: '🌤️ Tarde 2',
		ancora: 'lanche / movimento',
		cor: '#f2935c',
		campos: ['Pausa ativa (alongar / caminhar)', 'Tarefa de conclusão', 'Despejo de pendências rápidas'],
	},
	{
		slug: 'noite',
		periodo: '🌙 Noite',
		ancora: 'jantar',
		cor: '#8f7fd9',
		campos: ['Desaceleração e lazer sem culpa', 'Pouso do dia: mesa limpa + folha de amanhã pronta'],
	},
]

export const protocoloBaixoEsforco = [
	'Água / remédio',
	'Comer algo, mesmo que pronto',
	'Só a Tarefa Principal da manhã',
	'Aceitar o descanso sem se punir',
]
