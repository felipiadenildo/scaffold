import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { PREFIXO_LOCAL, salvar } from '../data/armazenamento/armazenamento'
import { useArmazenado } from '../hooks/useArmazenado'
import { useIdioma } from '../i18n/useIdioma'

type Theme = 'light' | 'dark'

// Mesma chave lida pelo script inline do index.html (aplica o tema antes do primeiro paint, sem
// "piscar" o tema errado). Mudou aqui, muda lá.
const CHAVE_TEMA = `${PREFIXO_LOCAL}tema`

export function ThemeToggle() {
	const { t } = useIdioma()
	// Claro é o padrão do app — não segue a preferência de sistema, só a escolha explícita da pessoa.
	const theme: Theme = useArmazenado<Theme>(CHAVE_TEMA) === 'dark' ? 'dark' : 'light'

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	const proximo: Theme = theme === 'light' ? 'dark' : 'light'
	const Icone = theme === 'light' ? Moon : Sun
	const rotulo = proximo === 'dark' ? t.tema.paraEscuro : t.tema.paraClaro

	return (
		<button
			type="button"
			onClick={() => salvar(CHAVE_TEMA, proximo)}
			// aria-label + title garantem que o botão só de ícone continue compreensível.
			aria-label={rotulo}
			title={rotulo}
			className="rounded-scaffold border border-border p-2 text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
		>
			<Icone className="h-4 w-4" aria-hidden="true" />
		</button>
	)
}
