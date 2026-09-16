import { ChevronDown, File, Files, FileDown } from 'lucide-react'
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
			<summary
				aria-label="Imprimir"
				title="Imprimir"
				className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden"
			>
				<FileDown className="h-3.5 w-3.5" aria-hidden="true" />
				<ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>

			<div className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded-scaffold border border-border bg-bg-raised p-2 shadow-raised">
				{/*
					Cada item é um botão de verdade: borda, fundo no hover e transição.
					O ícone à esquerda representa o formato da folha (única vs dupla),
					o rótulo principal fica no meio e o detalhe curto à direita.
				*/}
				<a
					href="/planners/diario/imprimir-a5"
					target="_blank"
					rel="noopener"
					className="group/item flex items-center gap-2.5 rounded-scaffold border border-border bg-bg px-2.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink-soft hover:bg-bg-sunken"
				>
					<File
						className="h-4 w-4 shrink-0 text-ink-soft transition-colors group-hover/item:text-ink"
						aria-hidden="true"
					/>
					<span className="flex-1">A5</span>
					<span className="text-ink-soft">1 por folha</span>
				</a>

				<a
					href="/planners/diario/imprimir-a4"
					target="_blank"
					rel="noopener"
					className="group/item flex items-center gap-2.5 rounded-scaffold border border-border bg-bg px-2.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink-soft hover:bg-bg-sunken"
				>
					<Files
						className="h-4 w-4 shrink-0 text-ink-soft transition-colors group-hover/item:text-ink"
						aria-hidden="true"
					/>
					<span className="flex-1">A4</span>
					<span className="text-ink-soft">2 por folha</span>
				</a>
			</div>
		</details>
	)
}