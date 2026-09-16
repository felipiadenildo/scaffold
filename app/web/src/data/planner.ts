export interface NivelHumor {
	slug: 'otimo' | 'bem' | 'neutro' | 'dificil' | 'muito-dificil'
	label: string
}

// Curvatura da "boca" do MoodIcon vai de sorriso forte a triste forte, nessa ordem.
export const humores: NivelHumor[] = [
	{ slug: 'otimo', label: 'Ótimo' },
	{ slug: 'bem', label: 'Bem' },
	{ slug: 'neutro', label: 'Neutro' },
	{ slug: 'dificil', label: 'Difícil' },
	{ slug: 'muito-dificil', label: 'Muito difícil' },
]

// Gradiente verde → dourado → terroso, distinto do vermelho reservado ao sistema de crise/SOS.
export const coresPorHumor: Record<NivelHumor['slug'], string> = {
	otimo: 'var(--color-mood-otimo)',
	bem: 'var(--color-mood-bem)',
	neutro: 'var(--color-mood-neutro)',
	dificil: 'var(--color-mood-dificil)',
	'muito-dificil': 'var(--color-mood-muito-dificil)',
}

export interface SecaoDia {
	slug: 'cafe-da-manha' | 'almoco' | 'lanche-da-tarde' | 'jantar'
	nome: string
	cor: string
	corSuave: string
}

// Nomes-padrão — editáveis via PlannerSettings, ver scaffold.planner.secoes.template.
export const secoesPadrao: SecaoDia[] = [
	{ slug: 'cafe-da-manha', nome: 'Café da manhã', cor: 'var(--color-manha)', corSuave: 'var(--color-manha-bg)' },
	{ slug: 'almoco', nome: 'Almoço', cor: 'var(--color-almoco)', corSuave: 'var(--color-almoco-bg)' },
	{ slug: 'lanche-da-tarde', nome: 'Lanche da tarde', cor: 'var(--color-lanche)', corSuave: 'var(--color-lanche-bg)' },
	{ slug: 'jantar', nome: 'Jantar', cor: 'var(--color-jantar)', corSuave: 'var(--color-jantar-bg)' },
]

export const habitosPadrao: string[] = ['Água', 'Remédio', 'Movimento', 'Higiene', 'Refeição regular']

export const protocoloPadrao: string[] = [
	'Água / remédio',
	'Comer algo, mesmo que pronto',
	'Só a tarefa principal da manhã',
	'Aceitar o descanso sem se punir',
]
