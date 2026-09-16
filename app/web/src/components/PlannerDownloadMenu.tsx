import { ChevronDown, File, Files, FileDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Dropdown de impressão específico do Planner — diferente do DownloadPrint genérico (usado pelos
// itens "em desenvolvimento e testes"), porque aqui as opções são formato (A5 solo / A4 com 2
// planners), não uma lista simples de arquivos.
// Gera e baixa o PDF direto (sem navegar pra /imprimir-a5 ou /imprimir-a4) — essas páginas
// continuam existindo, só que como fallback, pra quem abrir o link direto.
export function PlannerDownloadMenu({
	onBaixarA5,
	onBaixarA4,
	baixando,
}: {
	onBaixarA5: () => void
	onBaixarA4: () => void
	baixando: boolean
}) {
	const detalhesRef = useRef<HTMLDetailsElement>(null)

	function fecharEBaixar(baixar: () => void) {
		if (detalhesRef.current) detalhesRef.current.open = false
		baixar()
	}

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
				aria-label={baixando ? 'Gerando PDF…' : 'Imprimir'}
				title={baixando ? 'Gerando PDF…' : 'Imprimir'}
				className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-border p-1.5 text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden aria-disabled:cursor-wait aria-disabled:opacity-60"
				aria-disabled={baixando}
			>
				<FileDown className={'h-3.5 w-3.5' + (baixando ? ' animate-pulse' : '')} aria-hidden="true" />
				<ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>

			<div className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded-scaffold border border-border bg-bg-raised p-2 shadow-raised">
				{/*
					Cada item é um botão de verdade: borda, fundo no hover e transição.
					O ícone à esquerda representa o formato da folha (única vs dupla),
					o rótulo principal fica no meio e o detalhe curto à direita. Gera e baixa na
					hora — nada de navegar pra outra página só pra clicar em "Baixar PDF" de novo lá.
				*/}
				<button
					type="button"
					disabled={baixando}
					onClick={() => fecharEBaixar(onBaixarA5)}
					className="group/item flex items-center gap-2.5 rounded-scaffold border border-border bg-bg px-2.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink-soft hover:bg-bg-sunken disabled:cursor-wait disabled:opacity-60"
				>
					<File
						className="h-4 w-4 shrink-0 text-ink-soft transition-colors group-hover/item:text-ink"
						aria-hidden="true"
					/>
					<span className="flex-1 text-left">A5</span>
					<span className="text-ink-soft">1 por folha</span>
				</button>

				<button
					type="button"
					disabled={baixando}
					onClick={() => fecharEBaixar(onBaixarA4)}
					className="group/item flex items-center gap-2.5 rounded-scaffold border border-border bg-bg px-2.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink-soft hover:bg-bg-sunken disabled:cursor-wait disabled:opacity-60"
				>
					<Files
						className="h-4 w-4 shrink-0 text-ink-soft transition-colors group-hover/item:text-ink"
						aria-hidden="true"
					/>
					<span className="flex-1 text-left">A4</span>
					<span className="text-ink-soft">2 por folha</span>
				</button>
			</div>
		</details>
	)
}