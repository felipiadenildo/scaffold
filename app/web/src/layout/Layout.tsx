import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { HeaderSlotContext } from './headerSlot'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
	const [headerExtra, setHeaderExtra] = useState<ReactNode>(null)
	const { pathname } = useLocation()

	// "Modo foco": mais espaço, menos ruído visual, pra quando a pessoa está dentro de uma
	// solução (não navegando o catálogo). Derivado da rota, não de estado — sem isso, tem que
	// lembrar de desligar ao sair da página. Só /planners/* por enquanto; generalizar pra um
	// mapa de rotas quando existir um segundo caso de verdade, não antes.
	//
	// No modo foco o <header> some por completo (não só encolhe) — a navegação contextual subiu
	// pro conteúdo, acima da folha (ver DateNav.tsx), então o header não tem mais nada pra mostrar.
	const emFoco = pathname.startsWith('/planners/')

	return (
		<HeaderSlotContext.Provider value={setHeaderExtra}>
			<div className="flex min-h-svh flex-col bg-bg text-ink">
				{!emFoco && (
					<header className="border-b border-border">
						{/*
							Três zonas: logo (fixo) | slot (flexível, truncável) | toggle (fixo).
							`min-w-0` no slot é o que permite `truncate` funcionar dentro de flex;
							sem ele, o conteúdo do slot estoura e empurra o toggle.
						*/}
						<div className="mx-auto flex h-header max-w-4xl items-center gap-4 px-4">
							<nav aria-label="Navegação principal" className="shrink-0">
								<Link to="/" className="rounded text-lg font-bold tracking-tight">
									Scaffold <span className="text-accent">app</span>
								</Link>
							</nav>

							{/*
								Slot de página (breadcrumb, abas locais, etc). Vazio por padrão.
								O breadcrumb principal do catálogo mora dentro do PageHeader, no
								conteúdo — não aqui. Este slot é pra navegação secundária.
								Sem consumidor no momento — ver comentário em headerSlot.tsx.
							*/}
							<div className="min-w-0 flex-1 truncate">{headerExtra}</div>

							<div className="shrink-0">
								<ThemeToggle />
							</div>
						</div>
					</header>
				)}

				<main
					className={
						'mx-auto w-full flex-1 px-4 transition-[max-width] duration-300 ease-out ' +
						(emFoco ? 'max-w-none py-4' : 'max-w-4xl py-6 sm:py-8')
					}
				>
					<Outlet />
				</main>

				{/* Ocultação por renderização condicional, não por classe — senão o footer
				    continua no DOM e leitor de tela ainda o anuncia. */}
				{!emFoco && (
					<footer className="border-t border-border">
						<div className="mx-auto max-w-4xl px-4 py-6 text-sm text-ink-soft">
							Versão em construção. Consulte o{' '}
							<a
								href="https://felipiadenildo.github.io/scaffold/"
								className="rounded underline decoration-border underline-offset-2 hover:text-ink"
							>
								manual completo
							</a>
							.
						</div>
					</footer>
				)}
			</div>
		</HeaderSlotContext.Provider>
	)
}
