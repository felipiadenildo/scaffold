import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
	const stored = localStorage.getItem('scaffold-theme')
	if (stored === 'light' || stored === 'dark') return stored
	// Claro é o padrão do app — não segue a preferência de sistema, só a escolha explícita
	// da pessoa. O flash de tema errado no primeiro paint é evitado por um script inline
	// no index.html (ver comentário lá).
	return 'light'
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('scaffold-theme', theme)
	}, [theme])

	const proximo: Theme = theme === 'light' ? 'dark' : 'light'
	const Icone = theme === 'light' ? Moon : Sun
	const rotulo = proximo === 'dark' ? 'Mudar para tema escuro' : 'Mudar para tema claro'

	return (
		<button
			type="button"
			onClick={() => setTheme(proximo)}
			// aria-label + title garantem que o botão só de ícone continue compreensível.
			aria-label={rotulo}
			title={rotulo}
			className="rounded-scaffold border border-border p-2 text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
		>
			<Icone className="h-4 w-4" aria-hidden="true" />
		</button>
	)
}