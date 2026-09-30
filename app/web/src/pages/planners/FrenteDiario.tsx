import { motion } from 'motion/react'
import { DiaStepper } from '../../components/DiaStepper'
import { MoodPicker } from '../../components/MoodPicker'
import { SecaoDia, type ValorSecao } from '../../components/SecaoDia'
import type { BlocoVisual } from '../../data/planner/cores'
import type { Humor } from '../../data/planner/humor'

export interface PropsFrenteDiario {
	data: Date
	onDataChange: (data: Date) => void
	modoEdicao: boolean
	onToggleModo: () => void
	mostrarHumor: boolean
	humor: Humor | null
	onHumorChange: (humor: Humor) => void
	blocos: BlocoVisual[]
	// Renomear vale só pra este dia (a estrutura é uma cópia por dia). Sem a função, o nome fica fixo.
	onRenomearBloco?: (id: string, nome: string) => void
	valoresBlocos: Record<string, ValorSecao>
	onValorBlocoChange: (id: string, valor: ValorSecao) => void
	mostrarSobreDia: boolean
	sobreDia: string
	onSobreDiaChange: (v: string) => void
	somenteLeitura?: boolean
	modoImpressao?: boolean
}

export function FrenteDiario({
	data,
	onDataChange,
	modoEdicao,
	onToggleModo,
	mostrarHumor,
	humor,
	onHumorChange,
	blocos,
	onRenomearBloco,
	valoresBlocos,
	onValorBlocoChange,
	mostrarSobreDia,
	sobreDia,
	onSobreDiaChange,
	somenteLeitura,
	modoImpressao,
}: PropsFrenteDiario) {
	return (
		<div className="flex h-full flex-col">
			<div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 ">
				{modoImpressao ? (
					<div className="flex min-w-0 flex-1 items-baseline gap-3">
						<span className="shrink-0 text-lg font-bold">Scaffold</span>
						<div className="h-4 flex-1 border-b border-paper-ink/50" />
					</div>
				) : (
					<DiaStepper data={data} onChange={onDataChange} modoEdicao={modoEdicao} onToggleModo={onToggleModo} />
				)}
				{mostrarHumor && (
					<MoodPicker valor={humor} onChange={onHumorChange} somenteLeitura={somenteLeitura || modoImpressao} />
				)}
			</div>

			<div className="flex flex-1 flex-col gap-3">
				{blocos.map((bloco, i) => (
					<motion.div
						key={bloco.id}
						className="flex-1"
						initial={modoImpressao ? undefined : { opacity: 0, y: 8 }}
						animate={modoImpressao ? undefined : { opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05, duration: 0.25 }}
					>
						<SecaoDia
							secao={bloco}
							valor={valoresBlocos[bloco.id] ?? { tituloExtra: '', texto: '' }}
							onChange={(valor) => onValorBlocoChange(bloco.id, valor)}
							onRenomear={
								somenteLeitura || modoImpressao || !onRenomearBloco ? undefined : (nome) => onRenomearBloco(bloco.id, nome)
							}
							somenteLeitura={somenteLeitura}
							modoImpressao={modoImpressao}
						/>
					</motion.div>
				))}
			</div>

			{mostrarSobreDia && (
				<div className="mt-4 flex shrink-0 items-center gap-2 border-t border-border pt-3">
					<span className="text-sm font-medium text-paper-ink-soft">Sobre o dia:</span>
					{modoImpressao ? (
						<div className="flex-1 border-b border-dotted border-paper-ink/40" />
					) : (
						<input
							value={sobreDia}
							onChange={(e) => onSobreDiaChange(e.target.value)}
							disabled={somenteLeitura}
							placeholder="Um resumo geral, uma vitória, o que quiser guardar…"
							className="min-w-0 flex-1 border-b border-dashed border-border bg-transparent px-1 text-sm outline-none transition-colors placeholder:text-ink-soft focus:border-accent focus:border-solid"
						/>
					)}
				</div>
			)}
		</div>
	)
}
