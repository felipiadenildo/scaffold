import { useEffect, useRef, type RefObject } from 'react'

// Deslizar o dedo pro lado (só toque — mouse nunca dispara). Gesto simples: só decide no fim, sem a
// folha acompanhar o dedo; o retorno visual é a animação de troca de dia que já existe.
//
// Conta como deslize: andou ao menos DISTANCIA_MIN na horizontal, bem mais na horizontal do que na
// vertical (rolar a página continua sendo rolar) e rápido. Não conta se começou num campo de texto
// (selecionar/escrever) ou colado na borda da tela (gesto de "voltar" do sistema).
const DISTANCIA_MIN = 60
const PROPORCAO_MIN = 1.5
const DURACAO_MAX_MS = 700
const MARGEM_BORDA = 24
const ALVOS_IGNORADOS = 'input, textarea, select, [contenteditable="true"]'

export function useDeslizarHorizontal(
	ref: RefObject<HTMLElement | null>,
	{ onEsquerda, onDireita }: { onEsquerda: () => void; onDireita: () => void },
) {
	// Callbacks mais recentes sem re-registrar os ouvintes a cada render.
	const callbacks = useRef({ onEsquerda, onDireita })
	useEffect(() => {
		callbacks.current = { onEsquerda, onDireita }
	})

	useEffect(() => {
		const elemento = ref.current
		if (!elemento) return
		let inicio: { x: number; y: number; t: number } | null = null

		// Eventos de toque (não pointer events): o navegador não os cancela quando assume a rolagem
		// vertical, então não é preciso mexer em touch-action (que desligaria o zoom).
		function aoTocar(evento: TouchEvent) {
			const toque = evento.touches[0]
			const alvo = evento.target as Element | null
			const naBorda = toque.clientX < MARGEM_BORDA || toque.clientX > window.innerWidth - MARGEM_BORDA
			inicio =
				evento.touches.length === 1 && !naBorda && !alvo?.closest(ALVOS_IGNORADOS)
					? { x: toque.clientX, y: toque.clientY, t: evento.timeStamp }
					: null
		}

		function aoSoltar(evento: TouchEvent) {
			if (!inicio) return
			const toque = evento.changedTouches[0]
			const dx = toque.clientX - inicio.x
			const dy = toque.clientY - inicio.y
			const rapido = evento.timeStamp - inicio.t <= DURACAO_MAX_MS
			inicio = null
			if (!rapido || Math.abs(dx) < DISTANCIA_MIN || Math.abs(dx) < Math.abs(dy) * PROPORCAO_MIN) return
			if (dx < 0) callbacks.current.onEsquerda()
			else callbacks.current.onDireita()
		}

		elemento.addEventListener('touchstart', aoTocar, { passive: true })
		elemento.addEventListener('touchend', aoSoltar, { passive: true })
		return () => {
			elemento.removeEventListener('touchstart', aoTocar)
			elemento.removeEventListener('touchend', aoSoltar)
		}
	}, [ref])
}
