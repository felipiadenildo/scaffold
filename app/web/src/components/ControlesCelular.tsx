import { Calendar1, CalendarDays, CalendarRange, ChevronDown, LayoutGrid, Rotate3d } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { ehMesmoDia } from '../lib/formatarData'
import { DiaStepper } from './DiaStepper'
import {
	classeBotaoFlutuante,
	classeIconeItemMenu,
	classeItemMenu,
	classePainelMenuEsquerda,
	classePilulaFlutuante,
} from './estilosMenu'
import { MenuAcoesCompacto, type PropsMenuAcoesCompacto } from './MenuAcoesCompacto'

export type SlugVisao = 'diario' | 'semanal' | 'mensal'

// Ícone de cada visão do Planner: um dia (o "1"), um intervalo (semana) e a grade (mês).
const ICONE_VISAO = { diario: Calendar1, semanal: CalendarRange, mensal: CalendarDays } as const

const VISOES: { slug: SlugVisao; pronta: boolean }[] = [
	{ slug: 'diario', pronta: true },
	{ slug: 'semanal', pronta: false },
	{ slug: 'mensal', pronta: false },
]

// "Scaffold | ícone da visão": um botão só, que abre o catálogo e as visões (dia, semana, mês).
// Celular: pílula flutuante, só o ícone. Tela larga (`naBarra`): pílula da barra, ícone + nome.
export function MenuScaffold({ visaoAtual, naBarra = false }: { visaoAtual: SlugVisao; naBarra?: boolean }) {
	const { ref, fechar } = useMenuSuspenso()
	const { t } = useIdioma()
	const IconeAtual = ICONE_VISAO[visaoAtual]

	return (
		<details ref={ref} className="group relative shrink-0">
			<summary
				className={
					naBarra
						? 'flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden'
						: classePilulaFlutuante
				}
				aria-label={`Scaffold — ${t.planner.visoes[visaoAtual]}`}
			>
				<span className="font-bold tracking-tight text-ink">Scaffold</span>
				<span aria-hidden="true" className="text-ink-soft/60">
					|
				</span>
				<IconeAtual className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
				{naBarra && (
					<>
						<span className="font-medium text-ink">{t.planner.visoes[visaoAtual]}</span>
						<ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
					</>
				)}
			</summary>

			<div className={classePainelMenuEsquerda}>
				<Link to="/" onClick={fechar} className={classeItemMenu}>
					<LayoutGrid className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.catalogo.inicio}</span>
				</Link>
				<div className="my-0.5 border-t border-border" aria-hidden="true" />
				{VISOES.map(({ slug, pronta }) => {
					const Icone = ICONE_VISAO[slug]
					const ativa = slug === visaoAtual
					return pronta ? (
						<Link
							key={slug}
							to={`/planners/${slug}`}
							onClick={fechar}
							aria-current={ativa ? 'page' : undefined}
							className={classeItemMenu + (ativa ? ' border-accent' : '')}
						>
							<Icone className={ativa ? 'h-4 w-4 shrink-0 text-accent' : classeIconeItemMenu} aria-hidden="true" />
							<span className="flex-1">{t.planner.visoes[slug]}</span>
						</Link>
					) : (
						// Sem hover no toque: a indisponibilidade é o cinza + "em breve" escrito.
						<span key={slug} className={classeItemMenu + ' cursor-default opacity-50 hover:border-border'}>
							<Icone className={classeIconeItemMenu} aria-hidden="true" />
							<span className="flex-1">{t.planner.visoes[slug]}</span>
							<span className="text-ink-soft">{t.planner.emBreve}</span>
						</span>
					)
				})}
			</div>
		</details>
	)
}

// Linha de controles do Planner no celular: pílulas que flutuam sobre a borda de cima da folha (na
// altura do antigo botão "Ver verso"), rolando junto com a página.
//   esquerda: Scaffold | visão · data (só no verso, que não tem cabeçalho) · Hoje
//   direita:  virar a folha · ⋯
export function ControlesCelular({
	visaoAtual,
	data,
	onChange,
	lado,
	onGirar,
	...menu
}: {
	visaoAtual: SlugVisao
	data: Date
	onChange: (data: Date) => void
	lado: 'frente' | 'verso'
	// Só vem quando dá pra virar (dia criado, modo "virar a folha").
	onGirar?: () => void
} & Omit<PropsMenuAcoesCompacto, 'data' | 'onDataChange'>) {
	const { t } = useIdioma()
	const ehHoje = ehMesmoDia(data, new Date())
	const noVerso = !!onGirar && lado === 'verso'
	const rotuloGirar = lado === 'frente' ? t.planner.verVerso : t.planner.verFrente

	return (
		// -mb-4: a linha entra 16px na folha logo abaixo — as pílulas ficam "montadas" na borda dela.
		<div className="relative z-20 -mb-4 flex items-center justify-between gap-1.5 sm:hidden">
			<div className="flex min-w-0 items-center gap-1.5">
				<MenuScaffold visaoAtual={visaoAtual} />
				{/* Sem o 👁 de editar/visualizar aqui (não cabe; ele fica no cabeçalho da frente). */}
				{noVerso && <DiaStepper data={data} onChange={onChange} tamanho="pequeno" />}
				{!ehHoje && (
					<button type="button" onClick={() => onChange(new Date())} className={classePilulaFlutuante}>
						{t.planner.hoje}
					</button>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-1.5">
				{onGirar && (
					<button type="button" onClick={onGirar} aria-label={rotuloGirar} title={rotuloGirar} className={classeBotaoFlutuante}>
						<Rotate3d className="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				)}
				<MenuAcoesCompacto data={data} onDataChange={onChange} {...menu} />
			</div>
		</div>
	)
}
