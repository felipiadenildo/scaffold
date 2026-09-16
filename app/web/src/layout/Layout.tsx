import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { HeaderSlotContext } from './headerSlot'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
	const [headerExtra, setHeaderExtra] = useState<ReactNode>(null)

	return (
		<HeaderSlotContext.Provider value={setHeaderExtra}>
			<div className="flex min-h-svh flex-col bg-bg text-ink">
				<header className="border-b border-border">
					<div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
						<Link to="/" className="shrink-0 text-lg font-bold tracking-tight">
							Scaffold <span className="text-accent">app</span>
						</Link>
						{headerExtra}
						<div className="ml-auto shrink-0">
							<ThemeToggle />
						</div>
					</div>
				</header>
				<main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
					<Outlet />
				</main>
				<footer className="border-t border-border">
					<div className="mx-auto max-w-4xl px-4 py-6 text-sm text-ink-soft">
						MVP em construção —{' '}
						<a
							href="https://felipiadenildo.github.io/scaffold/"
							className="underline decoration-border underline-offset-2 hover:text-ink"
						>
							ver o manual completo
						</a>
						.
					</div>
				</footer>
			</div>
		</HeaderSlotContext.Provider>
	)
}
