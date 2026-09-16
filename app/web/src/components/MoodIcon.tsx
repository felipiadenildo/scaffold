import type { NivelHumor } from '../data/planner'

// Curvatura da boca: quanto maior o valor, mais funda a curva (sorriso); quanto menor, mais arqueada pra cima (triste).
const curvaturaPorHumor: Record<NivelHumor['slug'], number> = {
	otimo: 19,
	bem: 16.5,
	neutro: 14.5,
	dificil: 12.5,
	'muito-dificil': 10,
}

export function MoodIcon({ slug, className }: { slug: NivelHumor['slug']; className?: string }) {
	const controlY = curvaturaPorHumor[slug]
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
			<circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
			<path d={`M8 14.5 Q12 ${controlY} 16 14.5`} />
		</svg>
	)
}
