import { Link } from 'react-router-dom'
import { CategoriaBadge } from './CategoriaBadge'
import type { Categoria } from '../data/catalogo'

export function PageHeader({
	titulo,
	descricao,
	categoria,
}: {
	titulo: string
	descricao: string
	categoria: Categoria
}) {
	return (
		<div className="mb-8">
			<Link to="/" className="text-sm text-ink-soft hover:text-ink">
				← Catálogo
			</Link>
			<div className="mt-3 flex items-center gap-3">
				<h1 className="text-2xl font-bold">{titulo}</h1>
				<CategoriaBadge categoria={categoria} />
			</div>
			<p className="mt-2 max-w-2xl text-ink-soft">{descricao}</p>
		</div>
	)
}
