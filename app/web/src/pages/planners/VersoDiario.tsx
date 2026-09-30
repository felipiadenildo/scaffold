import { Anchor, ListChecks, NotebookPen } from 'lucide-react'
import { ChecklistEditable } from '../../components/ChecklistEditable'
import { LinhasImpressao } from '../../components/LinhasImpressao'
import type { ItemLista } from '../../data/planner/tipos'
import { useCampoDeEscrita } from '../../hooks/useCampoDeEscrita'
import { useIdioma } from '../../i18n/useIdioma'

// Uma lista do verso (hábitos ou "não pode deixar de fazer"). `onAdicionar`/`onRemover` ausentes =
// lista travada naquele dia (dias passados), só marcar/desmarcar.
export interface PropsListaVerso {
	mostrar: boolean
	itens: ItemLista[]
	marcados: Record<string, boolean>
	onMarcadosChange: (v: Record<string, boolean>) => void
	onAdicionar?: (texto: string) => void
	onRemover?: (id: string) => void
	// Só na impressão: no lugar dos itens, esta quantidade de linhas em branco pra escrever à mão.
	linhasEmBranco?: number
}

export interface PropsVersoDiario {
	anotacoes: string
	onAnotacoesChange: (v: string) => void
	habitos: PropsListaVerso
	importantes: PropsListaVerso
	somenteLeitura?: boolean
	modoImpressao?: boolean
}

export function VersoDiario({
	anotacoes,
	onAnotacoesChange,
	habitos,
	importantes,
	somenteLeitura,
	modoImpressao,
}: PropsVersoDiario) {
	const { t } = useIdioma()
	const anotacoesRef = useCampoDeEscrita(anotacoes, onAnotacoesChange)
	const duasListas = habitos.mostrar && importantes.mostrar

	return (
		// Impressão: min-h-full (não h-full) — ver FrenteDiario.
		<div className={'flex flex-col ' + (modoImpressao ? 'min-h-full' : 'h-full')}>
			<div className="flex flex-1 flex-col rounded-scaffold border border-border p-4">
				<h3 className="flex items-center gap-1.5 text-sm font-semibold text-paper-ink-soft">
					<NotebookPen className="h-4 w-4" aria-hidden="true" />
					{t.planner.anotacoes}
				</h3>
				{modoImpressao ? (
					<LinhasImpressao className="mt-2 min-h-24 px-0.5" />
				) : (
					<textarea
						ref={anotacoesRef}
						value={anotacoes}
						onChange={(e) => onAnotacoesChange(e.target.value)}
						disabled={somenteLeitura}
						placeholder={t.planner.anotacoesPlaceholder}
						// No celular começa maior (é o espaço livre do verso) e cresce com o texto.
						className="paper-lines campo-cresce mt-2 min-h-24 w-full flex-1 resize-none bg-transparent px-0.5 text-sm outline-none placeholder:text-ink-soft max-sm:min-h-40"
					/>
				)}
			</div>

			{(habitos.mostrar || importantes.mostrar) && (
				<div className={'mt-4 grid grid-cols-1 gap-3' + (duasListas ? ' sm:grid-cols-2' : '')}>
					{habitos.mostrar && (
						<ChecklistEditable
							titulo={t.planner.habitos}
							icone={ListChecks}
							itens={habitos.itens}
							marcados={habitos.marcados}
							onMarcadosChange={habitos.onMarcadosChange}
							onAdicionar={habitos.onAdicionar}
							onRemover={habitos.onRemover}
							linhasEmBranco={habitos.linhasEmBranco}
							cor="var(--color-accent)"
							somenteLeitura={somenteLeitura}
						/>
					)}
					{importantes.mostrar && (
						<ChecklistEditable
							titulo={t.planner.importantes}
							icone={Anchor}
							itens={importantes.itens}
							marcados={importantes.marcados}
							onMarcadosChange={importantes.onMarcadosChange}
							onAdicionar={importantes.onAdicionar}
							onRemover={importantes.onRemover}
							linhasEmBranco={importantes.linhasEmBranco}
							cor="var(--color-caution)"
							corFundo="var(--color-caution-bg)"
							somenteLeitura={somenteLeitura}
						/>
					)}
				</div>
			)}
		</div>
	)
}
