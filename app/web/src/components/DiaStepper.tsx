import { ChevronLeft, ChevronRight, Eye, Pencil } from 'lucide-react'
import { useIdioma } from '../i18n/useIdioma'
import {
	ehMesmoDia,
	formatarDataCurtaComDiaSemana,
	formatarDataCurtissima,
	formatarDataLongaComDiaSemana,
	formatarDiaMes,
	somarDias,
} from '../lib/formatarData'

export function DiaStepper({
	data,
	onChange,
	modoEdicao,
	onToggleModo,
	tamanho = 'normal',
	plano = false,
}: {
	data: Date
	onChange: (data: Date) => void
	// Sem os dois (dia que ainda não existe), o botão de alternar editar/visualizar não aparece.
	modoEdicao?: boolean
	onToggleModo?: () => void
	tamanho?: 'normal' | 'pequeno'
	// Pequeno sem a sombra de "flutuante" — pra quando fica dentro da barra do PC, junto dos botões.
	plano?: boolean
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
			<div
				className={
					'flex shrink-0 items-center gap-0.5 rounded-full border border-border py-1 pl-1 pr-2 text-xs font-medium text-ink-soft ' +
					(plano ? '' : 'bg-bg-raised shadow-raised')
				}
			>
				<button type="button" onClick={() => onChange(somarDias(data, -1))} aria-label={t.planner.diaAnterior} className={botaoSeta}>
					<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
				</button>
				{/* Celular: sem o ano (e, abaixo de 375px, sem o dia da semana), pra caber na linha de
				    controles do topo. Nunca quebra em duas linhas. */}
				<span className="whitespace-nowrap font-mono sm:hidden">
					<span className="max-[374px]:hidden">{formatarDataCurtissima(data, locale)}</span>
					<span className="hidden max-[374px]:inline">{formatarDiaMes(data, locale)}</span>
				</span>
				<span className="hidden whitespace-nowrap font-mono sm:inline">{formatarDataCurtaComDiaSemana(data, locale)}</span>
				{onToggleModo && (
					<button
						type="button"
						onClick={onToggleModo}
						aria-label={rotuloModo}
						title={dicaModo}
						className="rounded-full p-0.5 hover:text-ink"
					>
						<IconeModo className="h-3 w-3" aria-hidden="true" />
					</button>
				)}
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
				{/* O formato acompanha a largura da FOLHA (container query — a folha tem `@container`),
				    não a da tela: a data divide a linha com o humor, e a folha pode estar estreita mesmo
				    numa tela grande (frente e verso lado a lado). Nunca quebra em duas linhas.
				    ≥ 37.5rem: por extenso · ≥ 27rem: "Ter, 30/09/2026" · ≥ 20rem: "Ter, 30/09" · menor: "30/09". */}
				<span className={'whitespace-nowrap font-semibold ' + (ehHoje ? 'text-accent' : '')}>
					<span className="hidden text-base @min-[37.5rem]:inline">{formatarDataLongaComDiaSemana(data, locale)}</span>
					<span className="hidden font-mono text-base @min-[27rem]:inline @min-[37.5rem]:hidden">
						{formatarDataCurtaComDiaSemana(data, locale)}
					</span>
					<span className="hidden font-mono text-sm @min-[20rem]:inline @min-[27rem]:hidden">
						{formatarDataCurtissima(data, locale)}
					</span>
					<span className="font-mono text-sm @min-[20rem]:hidden">{formatarDiaMes(data, locale)}</span>
				</span>
				{onToggleModo && (
					<button
						type="button"
						onClick={onToggleModo}
						aria-label={rotuloModo}
						title={dicaModo}
						className="flex h-6 w-6 items-center justify-center rounded-full text-paper-ink-soft transition-colors hover:bg-black/5 hover:text-paper-ink"
					>
						<IconeModo className="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				)}
			</div>

			<button type="button" onClick={() => onChange(somarDias(data, 1))} aria-label={t.planner.proximoDia} className={botaoSetaPapel}>
				<ChevronRight className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}
