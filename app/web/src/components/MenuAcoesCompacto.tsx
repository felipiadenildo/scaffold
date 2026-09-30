import { Calendar, Check, Ellipsis, FileDown, LayoutTemplate, Moon, Rotate3d, Rows2, Sun, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from '../layout/useTema'
import { deISO, paraISO } from '../lib/formatarData'
import { classeBotaoFlutuante, classeIconeItemMenu, classeItemMenu, classePainelMenu } from './estilosMenu'
import { ItensPerfil } from './MenuPerfil'

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

	const dataRef = useRef<HTMLInputElement>(null)
	function abrirCalendario() {
		const campo = dataRef.current
		if (!campo) return
		try {
			campo.showPicker()
		} catch {
			// Navegador sem showPicker: foco + clique no campo abrem o seletor na maioria deles.
			campo.focus()
			campo.click()
		}
	}

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

				{/* Botão que abre o seletor de data nativo com showPicker() — o jeito feito pra isso
				    (Chrome/Android, Safari/iOS 16.4+). Antes era um <input type="date"> invisível por cima do
				    item, e em alguns celulares o toque não chegava nele. O campo fica no DOM (fora da vista,
				    não display:none, que impede abrir o seletor). */}
				<button type="button" onClick={abrirCalendario} className={classeItemMenu}>
					<Calendar className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.planner.escolherData}</span>
				</button>
				<input
					ref={dataRef}
					type="date"
					tabIndex={-1}
					aria-hidden="true"
					value={paraISO(data)}
					onChange={(e) => {
						if (!e.target.value) return
						executar(() => onDataChange(deISO(e.target.value)))
					}}
					className="sr-only"
				/>

				<div className="my-0.5 border-t border-border" aria-hidden="true" />

				<button type="button" onClick={() => executar(alternar)} className={classeItemMenu}>
					<IconeTema className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{tema === 'light' ? t.tema.escuro : t.tema.claro}</span>
				</button>
				<ItensPerfil aoEscolher={fechar} />

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
