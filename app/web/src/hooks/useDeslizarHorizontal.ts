import { useEffect, useRef, type RefObject } from 'react'

// Deslizar o dedo pro lado (só toque — mouse nunca dispara), como num carrossel: enquanto o dedo
// anda, `onArrastar(dx)` informa o deslocamento pra folha acompanhar; ao soltar, decide entre
// trocar (onEsquerda/onDireita) ou voltar pro lugar (onCancelar).
//
// O gesto só vira "deslize" depois de andar DISTANCIA_TRAVA com mais movimento na horizontal do
// que na vertical; se começou vertical, é rolagem e o gesto é abandonado. Troca ao soltar se andou
// ao menos uma fração da largura, ou se foi um movimento rápido.
//
// Pode começar em cima do texto (a folha é quase toda campo de texto), só não enquanto um campo
// está em edição (teclado aberto: ali o dedo seleciona e move o cursor). Também não conta colado na
// borda da tela (gesto de "voltar" do sistema).
const DISTANCIA_TRAVA = 10
const PROPORCAO_TRAVA = 1.2
const FRACAO_LARGURA = 0.25
const DISTANCIA_MAX = 120
const DISTANCIA_MIN_RAPIDO = 40
const VELOCIDADE_MIN = 0.5 // px/ms
const MARGEM_BORDA = 24
const CAMPOS_DE_EDICAO = 'input:not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'

function editando(): boolean {
	return !!document.activeElement?.matches(CAMPOS_DE_EDICAO)
}

export interface CallbacksDeslizar {
	onEsquerda: () => void
	onDireita: () => void
	onArrastar?: (dx: number) => void
	onCancelar?: () => void
}

export function useDeslizarHorizontal(ref: RefObject<HTMLElement | null>, callbacks: CallbacksDeslizar) {
	// Callbacks mais recentes sem re-registrar os ouvintes a cada render.
	const atuais = useRef(callbacks)
	useEffect(() => {
		atuais.current = callbacks
	})

	useEffect(() => {
		const elemento = ref.current
		if (!elemento) return
		let inicio: { x: number; y: number; t: number } | null = null
		let horizontal = false

		// Eventos de toque (não pointer events): o navegador não os cancela quando assume a rolagem
		// vertical, então não é preciso mexer em touch-action (que desligaria o zoom).
		function aoTocar(evento: TouchEvent) {
			const toque = evento.touches[0]
			const naBorda = toque.clientX < MARGEM_BORDA || toque.clientX > window.innerWidth - MARGEM_BORDA
			horizontal = false
			inicio =
				evento.touches.length === 1 && !naBorda && !editando()
					? { x: toque.clientX, y: toque.clientY, t: evento.timeStamp }
					: null
		}

		function aoMover(evento: TouchEvent) {
			if (!inicio) return
			if (evento.touches.length !== 1) {
				cancelar()
				return
			}
			const toque = evento.touches[0]
			const dx = toque.clientX - inicio.x
			const dy = toque.clientY - inicio.y
			if (!horizontal) {
				if (Math.hypot(dx, dy) < DISTANCIA_TRAVA) return
				if (Math.abs(dx) < Math.abs(dy) * PROPORCAO_TRAVA) {
					inicio = null // é rolagem
					return
				}
				horizontal = true
			}
			// Travado na horizontal: a página não rola junto enquanto a folha acompanha o dedo.
			if (evento.cancelable) evento.preventDefault()
			atuais.current.onArrastar?.(dx)
		}

		function aoSoltar(evento: TouchEvent) {
			if (!inicio || !horizontal) {
				inicio = null
				return
			}
			const dx = evento.changedTouches[0].clientX - inicio.x
			const velocidade = Math.abs(dx) / Math.max(1, evento.timeStamp - inicio.t)
			inicio = null
			horizontal = false
			const longe = Math.abs(dx) >= Math.min(DISTANCIA_MAX, window.innerWidth * FRACAO_LARGURA)
			const rapido = velocidade >= VELOCIDADE_MIN && Math.abs(dx) >= DISTANCIA_MIN_RAPIDO
			if (!longe && !rapido) atuais.current.onCancelar?.()
			else if (dx < 0) atuais.current.onEsquerda()
			else atuais.current.onDireita()
		}

		function cancelar() {
			if (horizontal) atuais.current.onCancelar?.()
			inicio = null
			horizontal = false
		}

		elemento.addEventListener('touchstart', aoTocar, { passive: true })
		elemento.addEventListener('touchmove', aoMover, { passive: false })
		elemento.addEventListener('touchend', aoSoltar, { passive: true })
		elemento.addEventListener('touchcancel', cancelar, { passive: true })
		return () => {
			elemento.removeEventListener('touchstart', aoTocar)
			elemento.removeEventListener('touchmove', aoMover)
			elemento.removeEventListener('touchend', aoSoltar)
			elemento.removeEventListener('touchcancel', cancelar)
		}
	}, [ref])
}
