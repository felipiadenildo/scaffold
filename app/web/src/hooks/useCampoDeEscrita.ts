import { useEffect, useLayoutEffect, useRef } from 'react'
import { continuarLista } from '../lib/atalhosLista'
import { CONSULTA_TELA_ESTREITA } from './useMidia'

// Suporte a `field-sizing: content` (o campo cresce com o texto só com CSS — classe .campo-cresce
// em index.css). Chrome/Android 123+, Safari/iOS 26.2+, Firefox 152+; iPhones mais antigos caem no
// ajuste por JS abaixo.
const CRESCE_SO_COM_CSS = typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content')

// Comportamento dos campos de texto livre do Planner (blocos e anotações):
// - atalhos de lista (lib/atalhosLista.ts), pelo evento `beforeinput`: o Enter dos teclados de
//   celular (Android principalmente) chega no keydown como "tecla 229", sem dizer que é Enter;
//   o beforeinput traz `inputType: 'insertLineBreak'` em qualquer teclado;
// - no celular, crescer com o texto (uma rolagem só na página, em vez de rolagem dentro do campo).
export function useCampoDeEscrita(valor: string, onChange: (texto: string) => void) {
	const ref = useRef<HTMLTextAreaElement>(null)
	const aoMudar = useRef(onChange)
	useEffect(() => {
		aoMudar.current = onChange
	})

	useEffect(() => {
		const campo = ref.current
		if (!campo) return
		function aoInserir(evento: InputEvent) {
			if (!campo || (evento.inputType !== 'insertLineBreak' && evento.inputType !== 'insertParagraph')) return
			const resultado = continuarLista(campo.value, campo.selectionStart, campo.selectionEnd)
			if (!resultado) return
			evento.preventDefault()
			aoMudar.current(resultado.texto)
			// O valor novo chega pelo React no próximo render; o cursor vai pro lugar depois dele.
			requestAnimationFrame(() => campo.setSelectionRange(resultado.cursor, resultado.cursor))
		}
		campo.addEventListener('beforeinput', aoInserir)
		return () => campo.removeEventListener('beforeinput', aoInserir)
	}, [])

	useLayoutEffect(() => {
		const campo = ref.current
		if (!campo || CRESCE_SO_COM_CSS) return
		if (!window.matchMedia(CONSULTA_TELA_ESTREITA).matches) {
			campo.style.height = ''
			return
		}
		campo.style.height = 'auto'
		campo.style.height = `${campo.scrollHeight}px`
	}, [valor])

	return ref
}
