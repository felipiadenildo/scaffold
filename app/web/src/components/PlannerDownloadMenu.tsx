import { ChevronDown, Download } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Dropdown de impressão específico do Planner — diferente do DownloadPrint genérico (usado pelos
// itens "em desenvolvimento e testes"), porque aqui as opções são formato (A5 solo / A4 com 2
// planners), não uma lista simples de arquivos.
export function PlannerDownloadMenu() {
	const detalhesRef = useRef<HTMLDetailsElement>(null)

	useEffect(() => {
		// <details> nativo não fecha sozinho ao clicar fora — só ao clicar de novo no <summary>.
		function aoClicarFora(evento: MouseEvent) {
			if (detalhesRef.current && !detalhesRef.current.contains(evento.target as Node)) {
				detalhesRef.current.open = false
			}
		}
		document.addEventListener('mousedown', aoClicarFora)
		return () => document.removeEventListener('mousedown', aoClicarFora)
	}, [])

	return (
		<details ref={detalhesRef} className="group relative shrink-0">
			<summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
				<Download className="h-3.5 w-3.5" aria-hidden="true" />
				Imprimir
				<ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>

			<div className="absolute right-0 z-20 mt-2 w-72 rounded-scaffold border border-border bg-bg-raised p-3 shadow-raised">
				<p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">A5 — um planner por folha</p>
				<a
					href="/planners/diario/imprimir-a5"
					target="_blank"
					rel="noopener"
					className="mt-1.5 inline-block rounded-scaffold border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-ink-soft"
				>
					Abrir pra baixar o PDF
				</a>
				<p className="mt-1 text-[0.7rem] text-ink-soft">
					Abre numa aba nova com a folha (frente e verso) pronta — o botão "Baixar PDF" lá gera o arquivo na
					hora, direto do que está na tela.
				</p>

				<p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">A4 — 2 planners por folha</p>
				<a
					href="/planners/diario/imprimir-a4"
					target="_blank"
					rel="noopener"
					className="mt-1.5 inline-block rounded-scaffold border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-ink-soft"
				>
					Abrir pra baixar o PDF
				</a>
				<p className="mt-1 text-[0.7rem] text-ink-soft">Folha deitada — corta ao meio e cada lado vira um planner A5 completo.</p>
			</div>
		</details>
	)
}
