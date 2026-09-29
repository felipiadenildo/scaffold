import { motion } from 'motion/react'
import { DiaStepper } from '../../components/DiaStepper'
import { MoodPicker } from '../../components/MoodPicker'
import { SecaoDia, type ValorSecao } from '../../components/SecaoDia'
import type { NivelHumor, SecaoDia as SecaoDiaTipo } from '../../data/planner'

export function FrenteDiario({
	data,
	onDataChange,
	modoEdicao,
	onToggleModo,
	humor,
	onHumorChange,
	secoesTemplate,
	onRenomearSecao,
	valoresSecoes,
	onValorSecaoChange,
	sobreDia,
	onSobreDiaChange,
	somenteLeitura,
	modoImpressao,
}: {
	data: Date
	onDataChange: (data: Date) => void
	modoEdicao: boolean
	onToggleModo: () => void
	humor: NivelHumor['slug'] | null
	onHumorChange: (humor: NivelHumor['slug']) => void
	secoesTemplate: SecaoDiaTipo[]
	onRenomearSecao: (slug: string, nome: string) => void
	valoresSecoes: Record<string, ValorSecao>
	onValorSecaoChange: (slug: string, valor: ValorSecao) => void
	sobreDia: string
	onSobreDiaChange: (v: string) => void
	somenteLeitura?: boolean
	modoImpressao?: boolean
}) {
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
				<MoodPicker valor={humor} onChange={onHumorChange} somenteLeitura={somenteLeitura || modoImpressao} />
			</div>

			<div className="flex flex-1 flex-col gap-3">
				{secoesTemplate.map((secao, i) => (
					<motion.div
						key={secao.slug}
						className="flex-1"
						initial={modoImpressao ? undefined : { opacity: 0, y: 8 }}
						animate={modoImpressao ? undefined : { opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05, duration: 0.25 }}
					>
						<SecaoDia
							secao={secao}
							valor={valoresSecoes[secao.slug] ?? { tituloExtra: '', texto: '' }}
							onChange={(valor) => onValorSecaoChange(secao.slug, valor)}
							onRenomear={somenteLeitura || modoImpressao ? undefined : (nome) => onRenomearSecao(secao.slug, nome)}
							somenteLeitura={somenteLeitura}
							modoImpressao={modoImpressao}
						/>
					</motion.div>
				))}
			</div>

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
		</div>
	)
}
