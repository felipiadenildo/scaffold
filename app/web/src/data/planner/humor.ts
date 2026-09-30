// Nome de cada humor vem do dicionário (t.planner.humores).
export interface NivelHumor {
	slug: 'otimo' | 'bem' | 'neutro' | 'dificil' | 'muito-dificil'
}

export type Humor = NivelHumor['slug']

// Curvatura da "boca" do MoodIcon vai de sorriso forte a triste forte, nessa ordem.
export const humores: NivelHumor[] = [
	{ slug: 'otimo' },
	{ slug: 'bem' },
	{ slug: 'neutro' },
	{ slug: 'dificil' },
	{ slug: 'muito-dificil' },
]

// Gradiente verde → dourado → terroso, distinto do vermelho reservado ao sistema de crise/SOS.
export const coresPorHumor: Record<Humor, string> = {
	otimo: 'var(--color-mood-otimo)',
	bem: 'var(--color-mood-bem)',
	neutro: 'var(--color-mood-neutro)',
	dificil: 'var(--color-mood-dificil)',
	'muito-dificil': 'var(--color-mood-muito-dificil)',
}
