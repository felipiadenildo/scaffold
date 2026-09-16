import { Calendar, Maximize2, Minimize2 } from 'lucide-react'
import { PlannerDownloadMenu } from './PlannerDownloadMenu'
import { ehMesmoDia, paraISO } from '../lib/formatarData'

// O passo-a-passo de dia (setas + chip) mudou de lugar — mora dentro da folha na frente e
// flutua no canto esquerdo no verso (ver DiaStepper, usado em FrenteDiario/FolhaFlip). Esta barra
// externa ficou só com as ações que não dependem de qual lado da folha está visível — e é a única
// coisa entre a barra superior (breadcrumb + abas) e a folha.
export function DateNav({
	data,
	onChange,
	expandido,
	onToggleExpandido,
}: {
	data: Date
	onChange: (data: Date) => void
	expandido: boolean
	onToggleExpandido: () => void
}) {
	const ehHoje = ehMesmoDia(data, new Date())
	const IconeLargura = expandido ? Minimize2 : Maximize2

	return (
		<div className={'mx-auto mb-4 flex items-center justify-end gap-2 transition-[max-width] duration-300 ' + (expandido ? 'max-w-none' : 'max-w-2xl')}>
			<button
				type="button"
				onClick={onToggleExpandido}
				aria-label={expandido ? 'Voltar ao tamanho normal' : 'Ajustar à largura disponível'}
				title={expandido ? 'Voltar ao tamanho normal' : 'Ajustar à largura disponível'}
				className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
			>
				<IconeLargura className="h-3.5 w-3.5" aria-hidden="true" />
			</button>

			<PlannerDownloadMenu />

			{!ehHoje && (
				<button
					type="button"
					onClick={() => onChange(new Date())}
					className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-ink-soft transition-colors hover:text-ink"
				>
					Hoje
				</button>
			)}

			<div className="relative h-7 w-7 shrink-0">
				<input
					type="date"
					value={paraISO(data)}
					onChange={(e) => {
						if (!e.target.value) return
						const [ano, mes, dia] = e.target.value.split('-').map(Number)
						onChange(new Date(ano, mes - 1, dia))
					}}
					aria-label="Escolher uma data"
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border border-border text-ink-soft">
					<Calendar className="h-3.5 w-3.5" aria-hidden="true" />
				</div>
			</div>
		</div>
	)
}
