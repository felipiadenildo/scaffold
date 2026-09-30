import { Calendar, Check, Ellipsis, FileDown, FlipHorizontal2, LayoutTemplate, Moon, Sun, Trash2 } from 'lucide-react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from '../layout/useTema'
import { deISO, paraISO } from '../lib/formatarData'
import { classeBotaoBarra, classeIconeItemMenu, classeItemMenu, classePainelMenu } from './estilosMenu'

// Abaixo de sm, as ações da barra do Planner não cabem lado a lado: viram este único ⋯ ("Hoje"
// fica de fora, é a ação mais usada quando se está em outro dia). Mesmo painel e itens dos
// outros menus da barra. "Ajustar largura" não entra: em tela estreita não tem efeito.
export function MenuAcoesCompacto({
	data,
	onDataChange,
	modoVisualizacao,
	onAlternarModoVisualizacao,
	onImprimir,
	onEditarDia,
	onExcluirDia,
}: {
	data: Date
	onDataChange: (data: Date) => void
	modoVisualizacao: 'girar' | 'nao-girar'
	onAlternarModoVisualizacao: () => void
	onImprimir: () => void
	onEditarDia?: () => void
	onExcluirDia?: () => void
}) {
	const { ref, fechar } = useMenuSuspenso()
	const { t } = useIdioma()
	const { tema, alternar } = useTema()
	const IconeTema = tema === 'light' ? Moon : Sun

	function executar(acao: () => void) {
		fechar()
		acao()
	}

	return (
		<details ref={ref} className="group relative shrink-0">
			<summary aria-label={t.planner.maisAcoes} title={t.planner.maisAcoes} className={classeBotaoBarra}>
				<Ellipsis className="h-3.5 w-3.5" aria-hidden="true" />
			</summary>

			<div className={classePainelMenu}>
				<button
					type="button"
					aria-pressed={modoVisualizacao === 'nao-girar'}
					onClick={() => executar(onAlternarModoVisualizacao)}
					className={classeItemMenu}
				>
					<FlipHorizontal2 className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.planner.modoVisualizacao}</span>
					{modoVisualizacao === 'nao-girar' && <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
				</button>

				<button type="button" onClick={() => executar(onImprimir)} className={classeItemMenu}>
					<FileDown className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.impressao.imprimir}</span>
				</button>

				{onEditarDia && (
					<button type="button" onClick={() => executar(onEditarDia)} className={classeItemMenu}>
						<LayoutTemplate className={classeIconeItemMenu} aria-hidden="true" />
						<span className="flex-1">{t.planner.editorModelo.editarDia}</span>
					</button>
				)}

				{/* Mesmo truque do calendário da barra: o <input type="date"> real cobre o item, invisível,
				    e é ele que recebe o toque — assim abre o seletor nativo do celular. */}
				<label className={classeItemMenu + ' cursor-pointer'}>
					<Calendar className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.planner.escolherData}</span>
					<input
						type="date"
						value={paraISO(data)}
						onChange={(e) => {
							if (!e.target.value) return
							executar(() => onDataChange(deISO(e.target.value)))
						}}
						aria-label={t.planner.escolherData}
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
				</label>

				<div className="my-0.5 border-t border-border" aria-hidden="true" />

				<button type="button" onClick={() => executar(alternar)} className={classeItemMenu}>
					<IconeTema className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{tema === 'light' ? t.tema.escuro : t.tema.claro}</span>
				</button>

				{onExcluirDia && (
					<>
						<div className="my-0.5 border-t border-border" aria-hidden="true" />
						<button type="button" onClick={() => executar(onExcluirDia)} className={classeItemMenu}>
							<Trash2 className={classeIconeItemMenu} aria-hidden="true" />
							<span className="flex-1">{t.planner.excluirDia}</span>
						</button>
					</>
				)}
			</div>
		</details>
	)
}
