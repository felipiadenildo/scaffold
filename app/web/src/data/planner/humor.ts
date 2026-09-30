export interface NivelHumor {
	slug: 'otimo' | 'bem' | 'neutro' | 'dificil' | 'muito-dificil'
	label: string
}

export type Humor = NivelHumor['slug']

// Curvatura da "boca" do MoodIcon vai de sorriso forte a triste forte, nessa ordem.
export const humores: NivelHumor[] = [
	{ slug: 'otimo', label: 'Ótimo' },
	{ slug: 'bem', label: 'Bem' },
	{ slug: 'neutro', label: 'Neutro' },
	{ slug: 'dificil', label: 'Difícil' },
	{ slug: 'muito-dificil', label: 'Muito difícil' },
]

// Gradiente verde → dourado → terroso, distinto do vermelho reservado ao sistema de crise/SOS.
export const coresPorHumor: Record<Humor, string> = {
	otimo: 'var(--color-mood-otimo)',
	bem: 'var(--color-mood-bem)',
	neutro: 'var(--color-mood-neutro)',
	dificil: 'var(--color-mood-dificil)',
	'muito-dificil': 'var(--color-mood-muito-dificil)',
}
