import { categoriaCor, categoriaLabel, type Categoria } from '../data/catalogo'

export function CategoriaBadge({ categoria }: { categoria: Categoria }) {
	return (
		<span
			className="rounded-full px-2.5 py-0.5 text-xs font-medium"
			style={{
				color: categoriaCor[categoria],
				backgroundColor: 'color-mix(in srgb, ' + categoriaCor[categoria] + ' 15%, transparent)',
			}}
		>
			{categoriaLabel[categoria]}
		</span>
	)
}
