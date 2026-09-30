import { useCallback, useSyncExternalStore } from 'react'

// Resultado de uma media query, atualizado quando ela muda (girar o celular, redimensionar).
export function useMidia(consulta: string): boolean {
	const assinar = useCallback(
		(ouvinte: () => void) => {
			const lista = window.matchMedia(consulta)
			lista.addEventListener('change', ouvinte)
			return () => lista.removeEventListener('change', ouvinte)
		},
		[consulta],
	)
	return useSyncExternalStore(assinar, () => window.matchMedia(consulta).matches)
}

// Mesmo corte do `sm` do Tailwind (640px): abaixo dele o app está em "modo celular".
export const CONSULTA_TELA_ESTREITA = '(max-width: 639.98px)'

export function useTelaEstreita(): boolean {
	return useMidia(CONSULTA_TELA_ESTREITA)
}
