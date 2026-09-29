import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CategoriaBadge } from '../components/CategoriaBadge'
import { catalogo } from '../data/catalogo'

export function Catalogo() {
	const destaques = catalogo.filter((item) => item.status === 'pronto')
	const emTeste = catalogo.filter((item) => item.status === 'em-teste')

	return (
		<div>
			<h1 className="text-2xl font-bold">Scaffold</h1>
			<p className="mt-2 max-w-2xl text-ink-soft">
				Ferramentas para organizar o dia, o dinheiro e a rotina. Escolha por onde começar.
			</p>

			<div className="mt-8 flex flex-col gap-4">
				{destaques.map((item) => (
					<motion.div key={item.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
						<Link
							to={item.rota}
							className="paper-grain block rounded-scaffold-lg border border-border bg-paper p-6 text-paper-ink shadow-paper transition-shadow hover:shadow-lg"
						>
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-ink">Pronto para usar</span>
								<CategoriaBadge categoria={item.categoria} />
							</div>
							<h2 className="mt-3 text-xl font-bold">{item.nome}</h2>
							<p className="mt-1.5 max-w-xl text-sm text-paper-ink-soft">{item.resumo}</p>
							<span className="mt-4 inline-block text-sm font-medium text-accent">{item.acaoPrincipal} →</span>
						</Link>
					</motion.div>
				))}
			</div>

			<h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink-soft">Em desenvolvimento</h2>
			<p className="mt-1 max-w-2xl text-sm text-ink-soft">
				Já dá pra usar, mas o design e o conteúdo ainda podem mudar.
			</p>
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{emTeste.map((item, i) => (
					<motion.div
						key={item.slug}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.04, duration: 0.25 }}
					>
						<Link
							to={item.rota}
							className="block h-full rounded-scaffold border border-border bg-bg-raised p-4 transition-colors hover:border-ink-soft"
						>
							<div className="flex items-start justify-between gap-2">
								<h3 className="font-semibold">{item.nome}</h3>
								<CategoriaBadge categoria={item.categoria} />
							</div>
							<p className="mt-2 text-sm text-ink-soft">{item.resumo}</p>
							<span className="mt-3 inline-block text-sm text-accent">{item.acaoPrincipal} →</span>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	)
}