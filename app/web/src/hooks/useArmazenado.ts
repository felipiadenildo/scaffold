import { useCallback, useSyncExternalStore } from 'react'
import { assinar, ler } from '../data/armazenamento/armazenamento'

// Lê uma chave do armazenamento e re-renderiza quando ela muda — venha a mudança deste
// componente, de outro, ou de outra aba. Todos os componentes que leem a mesma chave recebem o
// mesmo objeto.
export function useArmazenado<T>(chave: string): T | null {
	const assinarChave = useCallback((ouvinte: () => void) => assinar(chave, ouvinte), [chave])
	return useSyncExternalStore(assinarChave, () => ler<T>(chave))
}
