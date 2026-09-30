import { Pencil } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { BlocoVisual } from '../data/planner/cores'
import type { ConteudoBloco } from '../data/planner/tipos'
import { useIdioma } from '../i18n/useIdioma'
import { LinhasImpressao } from './LinhasImpressao'

export type ValorSecao = ConteudoBloco

export function SecaoDia({
	secao,
	valor,
	onChange,
	onRenomear,
	somenteLeitura,
	modoImpressao,
}: {
	secao: BlocoVisual
	valor: ValorSecao
	onChange: (valor: ValorSecao) => void
	onRenomear?: (nome: string) => void
	somenteLeitura?: boolean
	modoImpressao?: boolean
}) {
	const { t } = useIdioma()
	const [editandoNome, setEditandoNome] = useState(false)
	const [rascunhoNome, setRascunhoNome] = useState(secao.nome)

	function confirmarNome() {
		const nome = rascunhoNome.trim()
		if (nome && onRenomear) onRenomear(nome)
		setEditandoNome(false)
	}

	return (
		<div
			style={{ '--secao-cor': secao.cor } as CSSProperties}
			className="flex h-full flex-col overflow-hidden rounded-scaffold border border-border/70 transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--secao-cor)]"
		>
			<div
				className="flex shrink-0 items-center gap-2 border-b-2 px-3 py-2"
				style={{ backgroundColor: secao.corSuave, borderBottomColor: secao.cor }}
			>
				{editandoNome ? (
					<input
						autoFocus
						value={rascunhoNome}
						onChange={(e) => setRascunhoNome(e.target.value)}
						onBlur={confirmarNome}
						onKeyDown={(e) => {
							if (e.key === 'Enter') confirmarNome()
							if (e.key === 'Escape') {
								setRascunhoNome(secao.nome)
								setEditandoNome(false)
							}
						}}
						className="w-32 shrink-0 bg-transparent text-sm font-semibold outline-none"
						style={{ color: secao.cor }}
					/>
				) : (
					<button
						type="button"
						disabled={somenteLeitura || !onRenomear}
						onClick={() => {
							setRascunhoNome(secao.nome)
							setEditandoNome(true)
						}}
						className="group/nome flex shrink-0 items-center gap-1 text-sm font-semibold disabled:cursor-text"
						style={{ color: secao.cor }}
					>
						{secao.nome}
						{!somenteLeitura && onRenomear && (
							<Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover/nome:opacity-60" aria-hidden="true" />
						)}
					</button>
				)}
				{!modoImpressao && (
					<input
						value={valor.tituloExtra}
						onChange={(e) => onChange({ ...valor, tituloExtra: e.target.value })}
						disabled={somenteLeitura}
						placeholder={t.planner.tituloExtraPlaceholder}
						className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft/70 disabled:placeholder:text-ink-soft/40"
					/>
				)}
			</div>
			{modoImpressao ? (
				<LinhasImpressao className="min-h-24 px-3 py-2.5" />
			) : (
				<textarea
					value={valor.texto}
					onChange={(e) => onChange({ ...valor, texto: e.target.value })}
					disabled={somenteLeitura}
					placeholder={t.planner.escrevaAqui}
					className="paper-lines block min-h-24 w-full flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink-soft"
				/>
			)}
		</div>
	)
}
