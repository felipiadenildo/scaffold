import { Anchor, ListChecks, NotebookPen } from 'lucide-react'
import { ChecklistEditable } from '../../components/ChecklistEditable'
import { LinhasImpressao } from '../../components/LinhasImpressao'

export function VersoDiario({
	anotacoes,
	onAnotacoesChange,
	habitos,
	onHabitosChange,
	habitosMarcados,
	onHabitosMarcadosChange,
	protocolo,
	onProtocoloChange,
	protocoloMarcados,
	onProtocoloMarcadosChange,
	somenteLeitura,
	modoImpressao,
}: {
	anotacoes: string
	onAnotacoesChange: (v: string) => void
	habitos: string[]
	onHabitosChange: (v: string[]) => void
	habitosMarcados: Record<string, boolean>
	onHabitosMarcadosChange: (v: Record<string, boolean>) => void
	protocolo: string[]
	onProtocoloChange: (v: string[]) => void
	protocoloMarcados: Record<string, boolean>
	onProtocoloMarcadosChange: (v: Record<string, boolean>) => void
	somenteLeitura?: boolean
	modoImpressao?: boolean
}) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-1 flex-col rounded-scaffold border border-border p-4">
				<h3 className="flex items-center gap-1.5 text-sm font-semibold text-paper-ink-soft">
					<NotebookPen className="h-4 w-4" aria-hidden="true" />
					Anotações
				</h3>
				{modoImpressao ? (
					<LinhasImpressao className="mt-2 min-h-24 px-0.5" />
				) : (
					<textarea
						value={anotacoes}
						onChange={(e) => onAnotacoesChange(e.target.value)}
						disabled={somenteLeitura}
						placeholder="Qualquer pensamento que atravessar o dia, anota aqui."
						className="paper-lines mt-2 min-h-24 w-full flex-1 resize-none bg-transparent px-0.5 text-sm outline-none placeholder:text-ink-soft"
					/>
				)}
			</div>

			<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
				<ChecklistEditable
					titulo="Habit tracker"
					icone={ListChecks}
					itens={habitos}
					onItensChange={onHabitosChange}
					marcados={habitosMarcados}
					onMarcadosChange={onHabitosMarcadosChange}
					cor="var(--color-accent)"
					somenteLeitura={somenteLeitura}
				/>
				<ChecklistEditable
					titulo="Não pode deixar de fazer:"
					icone={Anchor}
					itens={protocolo}
					onItensChange={onProtocoloChange}
					marcados={protocoloMarcados}
					onMarcadosChange={onProtocoloMarcadosChange}
					cor="var(--color-caution)"
					corFundo="var(--color-caution-bg)"
					somenteLeitura={somenteLeitura}
				/>
			</div>
		</div>
	)
}
