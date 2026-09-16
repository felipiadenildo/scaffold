import { AnimatePresence, motion } from 'motion/react'
import { Plus, X, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

export function ChecklistEditable({
	titulo,
	icone: Icone,
	itens,
	onItensChange,
	marcados,
	onMarcadosChange,
	cor = 'var(--color-accent)',
	corFundo,
	somenteLeitura,
}: {
	titulo: string
	icone: LucideIcon
	itens: string[]
	onItensChange: (itens: string[]) => void
	marcados: Record<string, boolean>
	onMarcadosChange: (marcados: Record<string, boolean>) => void
	cor?: string
	corFundo?: string
	somenteLeitura?: boolean
}) {
	const [novoItem, setNovoItem] = useState('')

	function adicionar() {
		const label = novoItem.trim()
		if (!label || itens.includes(label)) return
		onItensChange([...itens, label])
		setNovoItem('')
	}

	function remover(label: string) {
		onItensChange(itens.filter((item) => item !== label))
		if (label in marcados) {
			const { [label]: _removido, ...resto } = marcados
			onMarcadosChange(resto)
		}
	}

	function alternarMarcado(label: string) {
		onMarcadosChange({ ...marcados, [label]: !marcados[label] })
	}

	return (
		<div className="rounded-scaffold border-2 p-4" style={{ borderColor: cor, backgroundColor: corFundo }}>
			<h3 className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: cor }}>
				<Icone className="h-4 w-4" aria-hidden="true" />
				{titulo}
			</h3>

			<ul className="mt-3 space-y-1.5">
				<AnimatePresence initial={false}>
					{itens.map((label) => {
						const marcado = !!marcados[label]
						return (
							<motion.li
								key={label}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.18 }}
								className="group flex items-center gap-2 text-sm"
							>
								<input
									type="checkbox"
									checked={marcado}
									disabled={somenteLeitura}
									onChange={() => alternarMarcado(label)}
									style={{ accentColor: cor }}
									className="h-4 w-4 shrink-0"
									aria-label={label}
								/>
								<span className="relative flex-1 py-0.5">
									<span className={marcado ? 'text-ink-soft' : undefined}>{label}</span>
									<motion.span
										aria-hidden="true"
										initial={false}
										animate={{ scaleX: marcado ? 1 : 0 }}
										transition={{ duration: 0.25, ease: 'easeOut' }}
										className="absolute left-0 top-1/2 h-px w-full origin-left bg-current"
									/>
								</span>
								{!somenteLeitura && (
									<button
										type="button"
										onClick={() => remover(label)}
										aria-label={`Remover "${label}"`}
										className="shrink-0 rounded-scaffold p-0.5 text-ink-soft opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}
							</motion.li>
						)
					})}
				</AnimatePresence>
			</ul>

			{!somenteLeitura && (
				<div className="mt-3 flex items-center gap-2">
					<input
						value={novoItem}
						onChange={(e) => setNovoItem(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								adicionar()
							}
						}}
						placeholder="Adicionar item…"
						aria-label={`Adicionar item em ${titulo}`}
						className="min-w-0 flex-1 rounded-scaffold border border-border bg-transparent px-2 py-1 text-sm outline-none placeholder:text-ink-soft"
					/>
					<button
						type="button"
						onClick={adicionar}
						aria-label="Adicionar"
						className="shrink-0 rounded-scaffold border border-border p-1.5 text-ink-soft transition-[color,box-shadow] hover:text-ink hover:shadow-raised"
					>
						<Plus className="h-3.5 w-3.5" />
					</button>
				</div>
			)}
		</div>
	)
}
