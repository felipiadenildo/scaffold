import type { Bloco } from './tipos'

// Cor do bloco vem da posição, não é guardada: reordenar ou mudar a quantidade de blocos nunca
// deixa dois vizinhos com a mesma cor. Uma cor por posição, até o máximo de 6 blocos (tokens.css).
const PALETA = [
	{ cor: 'var(--color-manha)', corSuave: 'var(--color-manha-bg)' },
	{ cor: 'var(--color-almoco)', corSuave: 'var(--color-almoco-bg)' },
	{ cor: 'var(--color-lanche)', corSuave: 'var(--color-lanche-bg)' },
	{ cor: 'var(--color-jantar)', corSuave: 'var(--color-jantar-bg)' },
	{ cor: 'var(--color-bloco5)', corSuave: 'var(--color-bloco5-bg)' },
	{ cor: 'var(--color-bloco6)', corSuave: 'var(--color-bloco6-bg)' },
]

export interface BlocoVisual extends Bloco {
	cor: string
	corSuave: string
}

export function blocosVisuais(blocos: Bloco[]): BlocoVisual[] {
	return blocos.map((bloco, i) => ({ ...bloco, ...PALETA[i % PALETA.length] }))
}
