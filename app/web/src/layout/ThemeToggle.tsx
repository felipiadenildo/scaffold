import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
	const stored = localStorage.getItem('scaffold-theme')
	if (stored === 'light' || stored === 'dark') return stored
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('scaffold-theme', theme)
	}, [theme])

	return (
		<button
			type="button"
			onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
			className="rounded-scaffold border border-border px-3 py-1.5 text-sm text-ink-soft hover:text-ink hover:border-ink-soft transition-colors"
			aria-label="Alternar tema claro/escuro"
		>
			{theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
		</button>
	)
}
