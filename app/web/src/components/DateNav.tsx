import { Calendar, ChevronDown, FileDown, FlipHorizontal2, LayoutTemplate, Maximize2, Minimize2, Trash2 } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { MenuAcoesCompacto } from './MenuAcoesCompacto'
import { MenuPerfil } from './MenuPerfil'
import { deISO, ehMesmoDia, paraISO } from '../lib/formatarData'

// Só Diário existe por enquanto — Semanal e Mensal ficam reservados aqui (desabilitados) pra já
// deixar claro que o Planner é uma família de visões, não só uma página.
// Movido de PlannersHub.tsx: a navegação contextual subiu do header pro conteúdo porque o modo
// foco (Layout.tsx) faz o header sumir por completo em /planners/*.
const visoes = [
	{ slug: 'diario', pronta: true },
	{ slug: 'semanal', pronta: false },
	{ slug: 'mensal', pronta: false },
] as const

// Classe de largura compartilhada com FolhaFlip.tsx — mesmo token (--scaffold-folha-largura-
// -expandida em tokens.css), pra barra e folha crescerem juntas sem duplicar o número em dois
// arquivos. min(100%, ...) garante respiro lateral mínimo (o px-4 do <main>) mesmo expandido.
export const CLASSE_LARGURA_NORMAL = 'max-w-2xl'
export const CLASSE_LARGURA_EXPANDIDA = 'max-w-[min(100%,var(--scaffold-folha-largura-expandida))]'

// Específico desta barra (não um seletor genérico) — só existe abaixo de sm, onde as três pills
// de visão não cabem mais e viram um <details>/<summary> no mesmo padrão visual do
// PlannerDownloadMenu. Sem "em breve" no hover (D7): toque não tem hover confiável, então a
// indisponibilidade é só a cor cinza e o cursor default.
function SeletorVisaoMobile({ visaoAtual }: { visaoAtual: (typeof visoes)[number] }) {
	const { ref: detalhesRef, fechar } = useMenuSuspenso()
	const { t } = useIdioma()

	return (
		<details ref={detalhesRef} className="group relative shrink-0">
			<summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
				{t.planner.visoes[visaoAtual.slug]}
				<ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>

			<div className="absolute left-0 z-20 mt-2 flex w-40 flex-col gap-1 rounded-scaffold border border-border bg-bg-raised p-2 shadow-raised">
				{visoes.map((v) =>
					v.pronta ? (
						<Link
							key={v.slug}
							to={`/planners/${v.slug}`}
							onClick={fechar}
							className={
								'rounded-scaffold px-2.5 py-1.5 text-sm font-medium transition-colors ' +
								(v.slug === visaoAtual.slug ? 'bg-accent text-accent-ink' : 'text-ink hover:bg-bg')
							}
						>
							{t.planner.visoes[v.slug]}
						</Link>
					) : (
						<span key={v.slug} className="cursor-default rounded-scaffold px-2.5 py-1.5 text-sm text-ink-soft/50">
							{t.planner.visoes[v.slug]}
						</span>
					),
				)}
			</div>
		</details>
	)
}

export function DateNav({
	data,
	onChange,
	expandido,
	onToggleExpandido,
	modoVisualizacao,
	onAlternarModoVisualizacao,
	onImprimir,
	baixandoPdf,
	onEditarDia,
	onExcluirDia,
}: {
	data: Date
	onChange: (data: Date) => void
	expandido: boolean
	onToggleExpandido: () => void
	modoVisualizacao: 'girar' | 'nao-girar'
	onAlternarModoVisualizacao: () => void
	// Abre a janela de impressão (escolha do modelo e do formato — DialogoImpressao).
	onImprimir: () => void
	baixandoPdf: boolean
	// Os dois só vêm quando o dia existe (não há o que editar/excluir numa folha pontilhada).
	onEditarDia?: () => void
	onExcluirDia?: () => void
}) {
	const { pathname } = useLocation()
	const { t } = useIdioma()
	const ehHoje = ehMesmoDia(data, new Date())
	const IconeAlternarLargura = expandido ? Minimize2 : Maximize2
	const emNaoGirar = modoVisualizacao === 'nao-girar'
	const visaoAtual = visoes.find((v) => pathname.startsWith(`/planners/${v.slug}`)) ?? visoes[0]

	// Largura máxima alterna junto com o modo expandido, pra barra acompanhar a folha.
	const classeLargura = expandido ? CLASSE_LARGURA_EXPANDIDA : CLASSE_LARGURA_NORMAL

	return (
		<div
			className={`mx-auto mb-4 flex items-center justify-between gap-3 transition-[max-width] duration-300 ease-out ${classeLargura}`}
		>
			{/* Navegação contextual — à esquerda. overflow-x-auto evita quebrar o layout se não
			    couber tudo numa tela estreita; rola em vez de espremer os controles à direita. */}
			<div className="flex min-w-0 items-center gap-2">
				{/* Telas sm+: pill "Scaffold | Catálogo" e as três pills de visão. overflow-x-auto
				    fica só aqui (não no wrapper de fora) — colocado lá, ele obriga o overflow-y
				    também a virar "auto" (efeito colateral do CSS quando só um eixo é definido),
				    o que cortava verticalmente o dropdown do seletor mobile ao lado. */}
				<div className="hidden shrink-0 items-center gap-2 overflow-x-auto sm:flex">
					<div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm">
						<Link to="/" className="font-bold tracking-tight">
							Scaffold
						</Link>
						<span aria-hidden="true" className="text-ink-soft/60">
							|
						</span>
						<Link to="/" className="text-ink-soft transition-colors hover:text-ink">
							{t.catalogo.inicio}
						</Link>
					</div>

					<div className="flex items-center gap-1">
						{visoes.map((v) =>
							v.pronta ? (
								<NavLink
									key={v.slug}
									to={`/planners/${v.slug}`}
									className={({ isActive }) =>
										'rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors ' +
										(isActive ? 'bg-accent text-accent-ink' : 'text-ink-soft hover:text-ink')
									}
								>
									{t.planner.visoes[v.slug]}
								</NavLink>
							) : (
								<span
									key={v.slug}
									title={t.planner.emBreve}
									className="cursor-default rounded-full px-2.5 py-1.5 text-sm text-ink-soft/50"
								>
									{t.planner.visoes[v.slug]}
								</span>
							),
						)}
					</div>
				</div>

				{/* Abaixo de sm (D7): só "Scaffold" (sem "Catálogo") + seletor no lugar das pills. */}
				<div className="flex shrink-0 items-center gap-2 sm:hidden">
					<Link to="/" className="rounded-full border border-border px-3 py-1.5 text-sm font-bold tracking-tight">
						Scaffold
					</Link>
					<SeletorVisaoMobile visaoAtual={visaoAtual} />
				</div>
			</div>

			{/* Ações da folha — à direita: largura, modo de visualização, impressão, formato do dia, excluir, hoje,
			    calendário, perfil.
			    Só ícone + tooltip (Bloco 6), exceto "Hoje": texto curto, ação contextual clara.
			    Abaixo de sm não cabem lado a lado: tudo menos "Hoje" vai pro menu ⋯ (MenuAcoesCompacto). */}
			<div className="flex shrink-0 items-center gap-2">
				<div className="hidden items-center gap-2 sm:flex">
					<button
						type="button"
						onClick={onToggleExpandido}
						aria-pressed={expandido}
						aria-label={t.planner.ajustarLargura}
						title={t.planner.ajustarLargura}
						className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
					>
						<IconeAlternarLargura className="h-3.5 w-3.5" aria-hidden="true" />
					</button>

					<button
						type="button"
						onClick={onAlternarModoVisualizacao}
						aria-pressed={emNaoGirar}
						aria-label={t.planner.modoVisualizacao}
						title={t.planner.modoVisualizacao}
						className={
							'shrink-0 rounded-full border p-1.5 transition-colors ' +
							(emNaoGirar ? 'border-accent bg-accent text-accent-ink' : 'border-border text-ink-soft hover:text-ink')
						}
					>
						<FlipHorizontal2 className="h-3.5 w-3.5" aria-hidden="true" />
					</button>

					<button
						type="button"
						onClick={onImprimir}
						aria-label={baixandoPdf ? t.impressao.gerandoPdf : t.impressao.imprimir}
						title={baixandoPdf ? t.impressao.gerandoPdf : t.impressao.imprimir}
						className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
					>
						<FileDown className={'h-3.5 w-3.5' + (baixandoPdf ? ' animate-pulse' : '')} aria-hidden="true" />
					</button>

					{onEditarDia && (
						<button
							type="button"
							onClick={onEditarDia}
							aria-label={t.planner.editorModelo.editarDia}
							title={t.planner.editorModelo.editarDia}
							className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
						>
							<LayoutTemplate className="h-3.5 w-3.5" aria-hidden="true" />
						</button>
					)}

					{onExcluirDia && (
						<button
							type="button"
							onClick={onExcluirDia}
							aria-label={t.planner.excluirDia}
							title={t.planner.excluirDia}
							className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
						>
							<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
						</button>
					)}
				</div>

				{!ehHoje && (
					<button
						type="button"
						onClick={() => onChange(new Date())}
						className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-ink-soft transition-colors hover:text-ink"
					>
						{t.planner.hoje}
					</button>
				)}

				{/*
					Exceção consciente à regra do :focus-visible global (index.css): o <input> real
					está com opacity-0, então o outline nele seria invisível. O anel de foco vai no
					<div> decorativo via `peer`, que é o que a pessoa realmente vê.
				*/}
				<div className="relative hidden h-7 w-7 shrink-0 sm:block">
					<input
						type="date"
						value={paraISO(data)}
						onChange={(e) => {
							if (e.target.value) onChange(deISO(e.target.value))
						}}
						aria-label={t.planner.calendario}
						title={t.planner.calendario}
						className="peer absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0 focus-visible:opacity-100"
					/>
					<div
						className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border border-border text-ink-soft peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2"
						aria-hidden="true"
					>
						<Calendar className="h-3.5 w-3.5" />
					</div>
				</div>

				<div className="hidden sm:block">
					<MenuPerfil />
				</div>

				<div className="sm:hidden">
					<MenuAcoesCompacto
						data={data}
						onDataChange={onChange}
						modoVisualizacao={modoVisualizacao}
						onAlternarModoVisualizacao={onAlternarModoVisualizacao}
						onImprimir={onImprimir}
						onEditarDia={onEditarDia}
						onExcluirDia={onExcluirDia}
					/>
				</div>
			</div>
		</div>
	)
}
