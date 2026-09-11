import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CategoriaBadge } from '../components/CategoriaBadge'
import { catalogo } from '../data/catalogo'

export function Catalogo() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Todas as soluções, num lugar só</h1>
			<p className="mt-2 max-w-2xl text-ink-soft">
				Impresso, planilha, Notion ou app — não importa o formato por trás. Escolha uma ferramenta abaixo.
			</p>
			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{catalogo.map((item, i) => (
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
								<h2 className="font-semibold">{item.nome}</h2>
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
