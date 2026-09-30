import { AnimatePresence, motion } from 'motion/react'
import { Plus, X, type LucideIcon } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { ItemLista } from '../data/planner/tipos'
import { useIdioma } from '../i18n/useIdioma'

// Lista com checkbox. Marcar/desmarcar é sempre por dia; adicionar/remover item só aparece quando
// `onAdicionar`/`onRemover` vêm preenchidos — quem decide se a lista pode ser editada naquele dia
// (ex.: não pode em dias passados) é quem usa o componente.
export function ChecklistEditable({
	titulo,
	icone: Icone,
	itens,
	marcados,
	onMarcadosChange,
	onAdicionar,
	onRemover,
	cor = 'var(--color-accent)',
	corFundo,
	somenteLeitura,
}: {
	titulo: string
	icone: LucideIcon
	itens: ItemLista[]
	marcados: Record<string, boolean>
	onMarcadosChange: (marcados: Record<string, boolean>) => void
	onAdicionar?: (texto: string) => void
	onRemover?: (id: string) => void
	cor?: string
	corFundo?: string
	somenteLeitura?: boolean
}) {
	const { t } = useIdioma()
	const [novoItem, setNovoItem] = useState('')
	const podeAdicionar = !somenteLeitura && !!onAdicionar
	const podeRemover = !somenteLeitura && !!onRemover

	function adicionar() {
		const texto = novoItem.trim()
		// Duplicado (mesmo texto, sem diferenciar maiúsculas) é ignorado — a lista também se protege
		// disso (listas.ts), aqui só evita limpar o campo como se tivesse adicionado.
		if (!texto || !onAdicionar) return
		if (itens.some((i) => i.texto.toLocaleLowerCase() === texto.toLocaleLowerCase())) return
		onAdicionar(texto)
		setNovoItem('')
	}

	function alternarMarcado(id: string) {
		onMarcadosChange({ ...marcados, [id]: !marcados[id] })
	}

	return (
		<div
			className="rounded-scaffold border-2 p-4"
			style={{ borderColor: cor, backgroundColor: corFundo, '--cor-lista': cor } as CSSProperties}
		>
			<h3 className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: cor }}>
				<Icone className="h-4 w-4" aria-hidden="true" />
				{titulo}
			</h3>

			<ul className="mt-3 space-y-1.5">
				<AnimatePresence initial={false}>
					{itens.map((item) => {
						const marcado = !!marcados[item.id]
						return (
							<motion.li
								key={item.id}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.18 }}
								// Onde a linha começa e termina: fundo suave na cor da lista ao passar o mouse; no
								// toque (sem hover), uma faixa leve sempre à vista, que escurece ao tocar.
								className="group -mx-1.5 flex items-center gap-2 rounded-scaffold px-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--cor-lista)_10%,transparent)] pointer-coarse:bg-[color-mix(in_srgb,var(--cor-lista)_7%,transparent)] pointer-coarse:active:bg-[color-mix(in_srgb,var(--cor-lista)_16%,transparent)]"
							>
								{/* A linha inteira (caixinha + texto) marca e desmarca: alvo de toque grande no
								    celular, sem aumentar a caixinha. O texto do <label> é o nome acessível. */}
								<label
									className={
										'flex min-w-0 flex-1 items-center gap-2 pointer-coarse:py-1.5 ' +
										(somenteLeitura ? 'cursor-default' : 'cursor-pointer')
									}
								>
									<input
										type="checkbox"
										checked={marcado}
										disabled={somenteLeitura}
										onChange={() => alternarMarcado(item.id)}
										style={{ accentColor: cor }}
										className="h-4 w-4 shrink-0 pointer-coarse:h-5 pointer-coarse:w-5"
									/>
									<span className="relative flex-1 py-0.5">
										<span className={marcado ? 'text-ink-soft' : undefined}>{item.texto}</span>
										<motion.span
											aria-hidden="true"
											initial={false}
											animate={{ scaleX: marcado ? 1 : 0 }}
											transition={{ duration: 0.25, ease: 'easeOut' }}
											className="absolute left-0 top-1/2 h-px w-full origin-left bg-current"
										/>
									</span>
								</label>
								{podeRemover && (
									<button
										type="button"
										onClick={() => onRemover?.(item.id)}
										aria-label={t.planner.removerItem(item.texto)}
										// Sempre visível no mobile (sem hover); só esconde no desktop até o hover/foco.
										// Toque: sempre visível e com área maior (sem hover pra revelar).
										className="shrink-0 rounded-scaffold p-0.5 text-ink-soft opacity-100 transition-opacity hover:text-ink focus-visible:opacity-100 pointer-coarse:-my-1 pointer-coarse:p-2 sm:opacity-0 sm:group-hover:opacity-100 pointer-coarse:sm:opacity-100"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}
							</motion.li>
						)
					})}
				</AnimatePresence>
			</ul>

			{podeAdicionar && (
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
						placeholder={t.planner.adicionarItemPlaceholder}
						aria-label={t.planner.adicionarItemEm(titulo)}
						autoComplete="off"
						className="min-w-0 flex-1 rounded-scaffold border border-border bg-transparent px-2 py-1 text-sm outline-none placeholder:text-ink-soft pointer-coarse:py-2"
					/>
					<button
						type="button"
						onClick={adicionar}
						disabled={!novoItem.trim()}
						aria-label={t.planner.adicionar}
						className="shrink-0 rounded-scaffold border border-border p-1.5 text-ink-soft transition-[color,box-shadow] hover:text-ink hover:shadow-raised disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:p-3"
					>
						<Plus className="h-3.5 w-3.5" />
					</button>
				</div>
			)}
		</div>
	)
}