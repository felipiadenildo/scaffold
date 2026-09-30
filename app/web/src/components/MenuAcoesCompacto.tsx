import { Calendar, Check, Ellipsis, FileDown, LayoutTemplate, Moon, Rotate3d, Rows2, Sun, Trash2 } from 'lucide-react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from '../layout/useTema'
import { deISO, paraISO } from '../lib/formatarData'
import { classeBotaoFlutuante, classeIconeItemMenu, classeItemMenu, classePainelMenu } from './estilosMenu'

// Abaixo de sm, as ações da barra do Planner não cabem lado a lado: viram este único ⋯, na linha
// de controles do celular (ControlesCelular). Mesmo painel e itens dos outros menus da barra.
// "Ajustar largura" não entra: em tela estreita não tem efeito.
export interface PropsMenuAcoesCompacto {
	data: Date
	onDataChange: (data: Date) => void
	modoVisualizacao: 'girar' | 'nao-girar'
	onAlternarModoVisualizacao: () => void
	onImprimir: () => void
	onEditarDia?: () => void
	onExcluirDia?: () => void
}

export function MenuAcoesCompacto({
	data,
	onDataChange,
	modoVisualizacao,
	onAlternarModoVisualizacao,
	onImprimir,
	onEditarDia,
	onExcluirDia,
}: PropsMenuAcoesCompacto) {
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
			<summary aria-label={t.planner.maisAcoes} title={t.planner.maisAcoes} className={classeBotaoFlutuante}>
				<Ellipsis className="h-3.5 w-3.5" aria-hidden="true" />
			</summary>

			<div className={classePainelMenu}>
				{/* Os dois modos como opções explícitas (o ✓ marca o atual), em vez de um liga/desliga
				    com nome genérico — no toque não há dica ao passar o mouse pra explicar. */}
				{(
					[
						{ modo: 'girar', Icone: Rotate3d, rotulo: t.planner.modoGirar },
						{ modo: 'nao-girar', Icone: Rows2, rotulo: t.planner.modoEmpilhado },
					] as const
				).map(({ modo, Icone, rotulo }) => (
					<button
						key={modo}
						type="button"
						aria-pressed={modoVisualizacao === modo}
						onClick={() => executar(() => modoVisualizacao !== modo && onAlternarModoVisualizacao())}
						className={classeItemMenu}
					>
						<Icone className={classeIconeItemMenu} aria-hidden="true" />
						<span className="flex-1">{rotulo}</span>
						{modoVisualizacao === modo && <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
					</button>
				))}

				<div className="my-0.5 border-t border-border" aria-hidden="true" />

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
