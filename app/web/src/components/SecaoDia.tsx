import { Pencil } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { BlocoVisual } from '../data/planner/cores'
import type { ConteudoBloco } from '../data/planner/tipos'
import { useCampoDeEscrita } from '../hooks/useCampoDeEscrita'
import { useTelaEstreita } from '../hooks/useMidia'
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
	const telaEstreita = useTelaEstreita()
	const campoRef = useCampoDeEscrita(valor.texto, (texto) => onChange({ ...valor, texto }))

	function confirmarNome() {
		const nome = rascunhoNome.trim()
		if (nome && onRenomear) onRenomear(nome)
		setEditandoNome(false)
	}

	return (
		<div
			style={{ '--secao-cor': secao.cor } as CSSProperties}
			className={
				// Impressão: contorno mais forte — o da tela, claro, sumia sobre o papel no PDF.
				'flex flex-1 flex-col overflow-hidden rounded-scaffold border ' +
				(modoImpressao ? 'border-paper-ink/30' : 'border-border/70') +
				' transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--secao-cor)]'
			}
		>
			<div
				// data-fundo: some com "Economizar tinta" na impressão (index.css).
				data-fundo
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
							// No toque não existe "passar o mouse": o lápis fica sempre à vista, discreto.
							<Pencil
								className="h-3 w-3 opacity-0 transition-opacity group-hover/nome:opacity-60 pointer-coarse:opacity-40"
								aria-hidden="true"
							/>
						)}
					</button>
				)}
				{!modoImpressao && (
					<input
						value={valor.tituloExtra}
						onChange={(e) => onChange({ ...valor, tituloExtra: e.target.value })}
						disabled={somenteLeitura}
						// No celular o texto longo ficava cortado: versão curta.
						placeholder={telaEstreita ? t.planner.tituloExtraCurto : t.planner.tituloExtraPlaceholder}
						className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft/70 disabled:placeholder:text-ink-soft/40"
					/>
				)}
			</div>
			{modoImpressao ? (
				// Mínimo menor que o da tela: até 6 blocos precisam caber numa folha A5.
				<LinhasImpressao className="min-h-12 px-3 py-2.5" />
			) : (
				<textarea
					ref={campoRef}
					value={valor.texto}
					onChange={(e) => onChange({ ...valor, texto: e.target.value })}
					disabled={somenteLeitura}
					placeholder={t.planner.escrevaAqui}
					// Celular: começa com espaço pra 2 linhas (4.5rem = 2 × 26px + o respiro de cima e de baixo) e
					// cresce com o texto (campo-cresce). PC (sm:): a folha tem altura fixa (proporção A5) e os
					// blocos esticam pra ocupá-la; o mínimo de 2 linhas só evita rolagem com 5–6 blocos.
					className="paper-lines campo-cresce block min-h-[4.5rem] w-full flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink-soft sm:min-h-12"
				/>
			)}
		</div>
	)
}
