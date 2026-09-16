import { Link, NavLink, Outlet } from 'react-router-dom'
import { useHeaderSlot } from '../../layout/headerSlot'

// Só Diário existe por enquanto — Semanal e Mensal ficam reservados aqui (desabilitados) pra já
// deixar claro que o Planner é uma família de visões, não só uma página.
const visoes = [
	{ slug: 'diario', nome: 'Diário', pronta: true },
	{ slug: 'semanal', nome: 'Semanal', pronta: false },
	{ slug: 'mensal', nome: 'Mensal', pronta: false },
]

export function PlannersHub() {
	useHeaderSlot(
		<div className="flex min-w-0 items-center gap-3 overflow-x-auto">
			<Link to="/" className="shrink-0 text-sm text-ink-soft hover:text-ink">
				← Catálogo
			</Link>
			<div className="h-4 w-px shrink-0 bg-border" aria-hidden="true" />
			<div className="flex items-center gap-1">
				{visoes.map((v) =>
					v.pronta ? (
						<NavLink
							key={v.slug}
							to={v.slug}
							className={({ isActive }) =>
								'shrink-0 rounded-full px-2.5 py-1 text-sm font-medium transition-colors ' +
								(isActive ? 'bg-accent text-accent-ink' : 'text-ink-soft hover:text-ink')
							}
						>
							{v.nome}
						</NavLink>
					) : (
						<span
							key={v.slug}
							title="Em breve"
							className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm text-ink-soft/50"
						>
							{v.nome}
							<span className="text-[0.65rem]">em breve</span>
						</span>
					),
				)}
			</div>
		</div>,
	)

	return <Outlet />
}
