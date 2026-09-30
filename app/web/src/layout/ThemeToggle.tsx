import { Moon, Sun } from 'lucide-react'
import { useIdioma } from '../i18n/useIdioma'
import { useTema } from './useTema'

export function ThemeToggle() {
	const { t } = useIdioma()
	const { tema, alternar } = useTema()
	const Icone = tema === 'light' ? Moon : Sun
	const rotulo = tema === 'light' ? t.tema.paraEscuro : t.tema.paraClaro

	return (
		<button
			type="button"
			onClick={alternar}
			// aria-label + title garantem que o botão só de ícone continue compreensível.
			aria-label={rotulo}
			title={rotulo}
			className="rounded-scaffold border border-border p-2 text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
		>
			<Icone className="h-4 w-4" aria-hidden="true" />
		</button>
	)
}
