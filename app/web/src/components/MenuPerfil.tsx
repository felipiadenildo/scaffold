import { CircleUserRound, DatabaseBackup, MonitorSmartphone, Moon, Sun } from 'lucide-react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from '../layout/useTema'
import { instalarNativo, useInstalacao } from '../lib/instalacao'
import { classeBotaoBarra, classeIconeItemMenu, classeItemMenu, classePainelMenu } from './estilosMenu'
import { abrirJanela } from './janelas'

// Itens de "perfil" que valem em qualquer menu (este, e o ⋯ do celular): seus dados (backup) e
// instalar o app — este só aparece quando o navegador oferece instalação e o app ainda não está
// instalado. A conta entra aqui na fase de login (PLANO-FASE-0.md).
export function ItensPerfil({ aoEscolher }: { aoEscolher: () => void }) {
	const { t } = useIdioma()
	const instalacao = useInstalacao()

	return (
		<>
			<button
				type="button"
				onClick={() => {
					aoEscolher()
					abrirJanela('dados')
				}}
				className={classeItemMenu}
			>
				<DatabaseBackup className={classeIconeItemMenu} aria-hidden="true" />
				<span className="flex-1">{t.app.seusDados}</span>
			</button>
			{instalacao.forma !== 'nenhuma' && (
				<button
					type="button"
					onClick={() => {
						aoEscolher()
						if (instalacao.forma === 'nativa') void instalarNativo()
						else abrirJanela('instalarIos')
					}}
					className={classeItemMenu}
				>
					<MonitorSmartphone className={classeIconeItemMenu} aria-hidden="true" />
					<span className="flex-1">{t.app.instalarApp}</span>
				</button>
			)}
		</>
	)
}

// Perfil. Dois lugares:
// - 'barra': modo foco do Planner, ao lado do calendário (botão redondo). Inclui o tema, porque o
//   cabeçalho com o botão de tema some no modo foco.
// - 'cabecalho': telas gerais, depois do tema (botão no estilo do ThemeToggle).
export function MenuPerfil({ local = 'barra' }: { local?: 'barra' | 'cabecalho' }) {
	const { ref, fechar } = useMenuSuspenso()
	const { t } = useIdioma()
	const { tema, alternar } = useTema()
	const IconeTema = tema === 'light' ? Moon : Sun
	const noCabecalho = local === 'cabecalho'

	return (
		<details ref={ref} className="group relative shrink-0">
			<summary
				aria-label={t.planner.perfil}
				title={t.planner.perfil}
				className={
					noCabecalho
						? 'flex cursor-pointer list-none items-center rounded-scaffold border border-border p-2 text-ink-soft transition-colors hover:border-ink-soft hover:text-ink group-open:border-ink-soft group-open:text-ink [&::-webkit-details-marker]:hidden'
						: classeBotaoBarra
				}
			>
				<CircleUserRound className={noCabecalho ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
			</summary>

			<div className={classePainelMenu}>
				{!noCabecalho && (
					<>
						<button
							type="button"
							onClick={() => {
								alternar()
								fechar()
							}}
							className={classeItemMenu}
						>
							<IconeTema className={classeIconeItemMenu} aria-hidden="true" />
							<span className="flex-1">{tema === 'light' ? t.tema.escuro : t.tema.claro}</span>
						</button>
						<div className="my-0.5 border-t border-border" aria-hidden="true" />
					</>
				)}
				<ItensPerfil aoEscolher={fechar} />
			</div>
		</details>
	)
}
