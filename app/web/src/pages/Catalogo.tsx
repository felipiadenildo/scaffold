import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CategoriaBadge } from '../components/CategoriaBadge'
import { catalogo } from '../data/catalogo'
import { useIdioma } from '../i18n/useIdioma'

export function Catalogo() {
	const { idioma, t } = useIdioma()
	// Ferramentas em teste ainda não foram traduzidas (PLANO-FASE-0.md §1): fora do português, avisa.
	const soEmPortugues = idioma !== 'pt'
	const destaques = catalogo.filter((item) => item.status === 'pronto')
	const emTeste = catalogo.filter((item) => item.status === 'em-teste')

	return (
		<div>
			<h1 className="text-2xl font-bold">Scaffold</h1>
			<p className="mt-2 max-w-2xl text-ink-soft">{t.catalogo.descricao}</p>

			<div className="mt-8 flex flex-col gap-4">
				{destaques.map((item) => (
					<motion.div key={item.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
						<Link
							to={item.rota}
							className="paper-grain block rounded-scaffold-lg border border-border bg-paper p-6 text-paper-ink shadow-paper transition-shadow hover:shadow-lg"
						>
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-ink">
									{t.catalogo.prontoParaUsar}
								</span>
								<CategoriaBadge categoria={item.categoria} />
							</div>
							<h2 className="mt-3 text-xl font-bold">{t.catalogo.itens[item.slug].nome}</h2>
							<p className="mt-1.5 max-w-xl text-sm text-paper-ink-soft">{t.catalogo.itens[item.slug].resumo}</p>
							<span className="mt-4 inline-block text-sm font-medium text-accent">
								{t.catalogo.itens[item.slug].acao} →
							</span>
						</Link>
					</motion.div>
				))}
			</div>

			<h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink-soft">
				{t.catalogo.emDesenvolvimento}
			</h2>
			<p className="mt-1 max-w-2xl text-sm text-ink-soft">
				{t.catalogo.emDesenvolvimentoDescricao}
				{soEmPortugues && ` ${t.catalogo.soEmPortugues}`}
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
								<h3 className="font-semibold">{t.catalogo.itens[item.slug].nome}</h3>
								<div className="flex shrink-0 items-center gap-1.5">
									{soEmPortugues && (
										<span
											lang="pt"
											title={t.catalogo.soEmPortugues}
											className="rounded-full border border-border px-2 py-1 text-xs font-medium leading-none text-ink-soft"
										>
											PT
										</span>
									)}
									<CategoriaBadge categoria={item.categoria} />
								</div>
							</div>
							<p className="mt-2 text-sm text-ink-soft">{t.catalogo.itens[item.slug].resumo}</p>
							<span className="mt-3 inline-block text-sm text-accent">{t.catalogo.itens[item.slug].acao} →</span>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	)
}