import { useCallback, useEffect, useRef } from 'react'

// Comportamento comum dos menus feitos com <details>/<summary> (padrão do app: abre/fecha sem
// estado React e é acessível de graça). O <details> nativo só fecha clicando de novo no
// <summary>; isto acrescenta fechar ao clicar fora e com Esc (devolvendo o foco ao botão).
export function useMenuSuspenso() {
	const ref = useRef<HTMLDetailsElement>(null)

	const fechar = useCallback(() => {
		if (ref.current) ref.current.open = false
	}, [])

	useEffect(() => {
		function aoClicarFora(evento: MouseEvent) {
			if (ref.current?.open && !ref.current.contains(evento.target as Node)) fechar()
		}
		function aoTeclar(evento: KeyboardEvent) {
			if (evento.key !== 'Escape' || !ref.current?.open) return
			fechar()
			ref.current.querySelector('summary')?.focus()
		}
		document.addEventListener('mousedown', aoClicarFora)
		document.addEventListener('keydown', aoTeclar)
		return () => {
			document.removeEventListener('mousedown', aoClicarFora)
			document.removeEventListener('keydown', aoTeclar)
		}
	}, [fechar])

	return { ref, fechar }
}
