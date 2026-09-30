import { CircleUserRound, Moon, Sun } from 'lucide-react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from '../layout/useTema'
import { classeBotaoBarra, classeIconeItemMenu, classeItemMenu, classePainelMenu } from './estilosMenu'

// Perfil no modo foco do Planner, ao lado do calendário. Por enquanto só o essencial pra quem está
// dentro da folha (o tema — o cabeçalho com o botão próprio some no modo foco). A conta entra aqui
// na fase de login (PLANO-FASE-0.md).
export function MenuPerfil() {
	const { ref, fechar } = useMenuSuspenso()
	const { t } = useIdioma()
	const { tema, alternar } = useTema()
	const IconeTema = tema === 'light' ? Moon : Sun

	return (
		<details ref={ref} className="group relative shrink-0">
			<summary aria-label={t.planner.perfil} title={t.planner.perfil} className={classeBotaoBarra}>
				<CircleUserRound className="h-3.5 w-3.5" aria-hidden="true" />
			</summary>

			<div className={classePainelMenu}>
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
			</div>
		</details>
	)
}
