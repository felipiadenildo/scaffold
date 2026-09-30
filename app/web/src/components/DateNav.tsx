import { Calendar, FileDown, LayoutTemplate, Maximize2, Minimize2, Rotate3d, Rows2, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useIdioma } from '../i18n/useIdioma'
import { ControlesCelular, MenuScaffold } from './ControlesCelular'
import { DiaStepper } from './DiaStepper'
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
	lado,
	onGirar,
	modoEdicao,
	onToggleModo,
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
	// Virar a folha (só com o dia criado e no modo "virar a folha") e, no verso — que não tem
	// cabeçalho —, a data na barra.
	lado: 'frente' | 'verso'
	onGirar?: () => void
	modoEdicao: boolean
	onToggleModo: () => void
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
		<>
			<ControlesCelular
				visaoAtual={visaoAtual.slug}
				data={data}
				onChange={onChange}
				lado={lado}
				onGirar={onGirar}
				modoVisualizacao={modoVisualizacao}
				onAlternarModoVisualizacao={onAlternarModoVisualizacao}
				onImprimir={onImprimir}
				onEditarDia={onEditarDia}
				onExcluirDia={onExcluirDia}
			/>

			{/* Tela larga (sm+). No celular, a linha acima (ControlesCelular). */}
			<div
				className={`mx-auto mb-4 hidden items-center justify-between gap-3 transition-[max-width] duration-300 ease-out sm:flex ${classeLargura}`}
			>
				{/* Esquerda: "Scaffold | visão" (menu com catálogo e visões) e, no verso, a data. */}
				<div className="flex min-w-0 items-center gap-2">
					<MenuScaffold visaoAtual={visaoAtual.slug} naBarra />
					{onGirar && lado === 'verso' && (
						<DiaStepper data={data} onChange={onChange} modoEdicao={modoEdicao} onToggleModo={onToggleModo} tamanho="pequeno" plano />
					)}
				</div>

				{/* Ações da folha — à direita: largura, modo de visualização, impressão, formato do dia, excluir, hoje,
				    calendário, perfil.
				    Só ícone + tooltip (Bloco 6), exceto "Hoje": texto curto, ação contextual clara.
				    Abaixo de sm: ControlesCelular (menu ⋯). */}
				<div className="flex shrink-0 items-center gap-2">
					<div className="flex items-center gap-2">
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
							<Rows2 className="h-3.5 w-3.5" aria-hidden="true" />
						</button>

						{onGirar && (
							<button
								type="button"
								onClick={onGirar}
								aria-label={lado === 'frente' ? t.planner.verVerso : t.planner.verFrente}
								title={lado === 'frente' ? t.planner.verVerso : t.planner.verFrente}
								className="shrink-0 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink"
							>
								<Rotate3d className="h-3.5 w-3.5" aria-hidden="true" />
							</button>
						)}

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
					<div className="relative h-7 w-7 shrink-0">
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

					<MenuPerfil />
				</div>
			</div>
		</>
	)
}
