import { ChevronLeft, ChevronRight, Eye, Pencil } from 'lucide-react'
import { useIdioma } from '../i18n/useIdioma'
import { ehMesmoDia, formatarDataCurtaComDiaSemana, formatarDataLongaComDiaSemana, somarDias } from '../lib/formatarData'

export function DiaStepper({
	data,
	onChange,
	modoEdicao,
	onToggleModo,
	tamanho = 'normal',
}: {
	data: Date
	onChange: (data: Date) => void
	modoEdicao: boolean
	onToggleModo: () => void
	tamanho?: 'normal' | 'pequeno'
}) {
	const { t, locale } = useIdioma()
	const ehHoje = ehMesmoDia(data, new Date())
	const rotuloModo = modoEdicao ? t.planner.paraModoVisualizacao : t.planner.paraModoEdicao
	const dicaModo = modoEdicao ? t.planner.editandoDica : t.planner.visualizandoDica
	const IconeModo = modoEdicao ? Eye : Pencil
	const pequeno = tamanho === 'pequeno'

	if (pequeno) {
		const botaoSeta = 'shrink-0 rounded-full p-1 text-ink-soft transition-colors hover:text-ink'
		// Mesma família visual do botão "Ver verso": pílula única, texto pequeno, discreta.
		return (
			<div className="flex items-center gap-0.5 rounded-full border border-border bg-bg-raised py-1 pl-1 pr-2 text-xs font-medium text-ink-soft shadow-raised">
				<button type="button" onClick={() => onChange(somarDias(data, -1))} aria-label={t.planner.diaAnterior} className={botaoSeta}>
					<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
				</button>
				<span className="font-mono">{formatarDataCurtaComDiaSemana(data, locale)}</span>
				<button
					type="button"
					onClick={onToggleModo}
					aria-label={rotuloModo}
					title={dicaModo}
					className="rounded-full p-0.5 hover:text-ink"
				>
					<IconeModo className="h-3 w-3" aria-hidden="true" />
				</button>
				<button type="button" onClick={() => onChange(somarDias(data, 1))} aria-label={t.planner.proximoDia} className={botaoSeta}>
					<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
				</button>
			</div>
		)
	}

	// Dentro da folha, sem pílula colorida — texto direto sobre o papel (tipografia, não widget de
	// app). "Hoje" fica marcado pela cor da tinta + um friso embaixo, o mesmo motivo já usado no
	// cabeçalho das seções, em vez de um fundo sólido chapado por cima do papel.
	const botaoSetaPapel =
		'shrink-0 rounded-full p-1 text-paper-ink-soft transition-colors hover:bg-black/5 hover:text-paper-ink'

	return (
		<div className="flex items-center gap-1">
			<button type="button" onClick={() => onChange(somarDias(data, -1))} aria-label={t.planner.diaAnterior} className={botaoSetaPapel}>
				<ChevronLeft className="h-4 w-4" aria-hidden="true" />
			</button>

			<div className={'flex items-center gap-1 border-b-2 pb-0.5 ' + (ehHoje ? 'border-accent' : 'border-transparent')}>
				<span className={'hidden text-base font-semibold sm:inline ' + (ehHoje ? 'text-accent' : '')}>
					{formatarDataLongaComDiaSemana(data, locale)}
				</span>
				<span className={'font-mono text-base font-semibold sm:hidden ' + (ehHoje ? 'text-accent' : '')}>
					{formatarDataCurtaComDiaSemana(data, locale)}
				</span>
				<button
					type="button"
					onClick={onToggleModo}
					aria-label={rotuloModo}
					title={dicaModo}
					className="flex h-6 w-6 items-center justify-center rounded-full text-paper-ink-soft transition-colors hover:bg-black/5 hover:text-paper-ink"
				>
					<IconeModo className="h-3.5 w-3.5" aria-hidden="true" />
				</button>
			</div>

			<button type="button" onClick={() => onChange(somarDias(data, 1))} aria-label={t.planner.proximoDia} className={botaoSetaPapel}>
				<ChevronRight className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}
