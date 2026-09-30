import { useLayoutEffect, useRef, useState } from 'react'

// Mesmo espaçamento de .paper-lines em tokens.css (1.625rem, 16px = 1rem) — pra densidade bater
// com o digital em vez de um número de linhas fixo "no olho".
const ALTURA_LINHA_PX = 26

// Linhas de caderno pra modoImpressao — divs com borda de verdade, não o gradiente de fundo
// (.paper-lines) usado na tela. html2canvas-pro não reproduz repeating-linear-gradient (vira um
// bloco de cor sólida); borda é um recurso básico que ele desenha sem problema.
// A quantidade é medida em runtime (altura disponível ÷ altura da linha do digital), não um
// número fixo — assim a densidade acompanha o tamanho real do bloco, igual ao gradiente faria.
export function LinhasImpressao({ className = '' }: { className?: string }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [quantidade, setQuantidade] = useState<number | null>(null)

	useLayoutEffect(() => {
		if (!containerRef.current) return
		setQuantidade(Math.max(1, Math.round(containerRef.current.clientHeight / ALTURA_LINHA_PX)))
	}, [])

	return (
		<div ref={containerRef} className={'flex flex-1 flex-col ' + className}>
			{quantidade !== null &&
				// data-linha: some com "sem linhas" na impressão (index.css) — o espaço continua o mesmo.
				Array.from({ length: quantidade }).map((_, i) => <div key={i} data-linha className="flex-1 border-b border-paper-ink/20" />)}
		</div>
	)
}
