import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

export const HeaderSlotContext = createContext<((node: ReactNode) => void) | null>(null)

// Deixa uma página (ex. PlannersHub) colocar conteúdo no cabeçalho do app, ao lado do logo — em
// vez de duplicar uma barra de navegação própria por baixo dele.
export function useHeaderSlot(node: ReactNode) {
	const setNode = useContext(HeaderSlotContext)
	useEffect(() => {
		setNode?.(node)
		return () => setNode?.(null)
	})
}
