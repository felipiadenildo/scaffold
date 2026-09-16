import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

// Sem consumidor desde que a navegação contextual do Planner subiu do header pro DateNav.tsx
// (o modo foco em Layout.tsx faz o header sumir por completo em /planners/*, então não sobra
// onde esse slot apareceria). Não removido nesta rodada — remover quando houver confirmação de
// que nenhuma outra tela vai precisar injetar conteúdo no header.
export const HeaderSlotContext = createContext<((node: ReactNode) => void) | null>(null)

// Deixa uma página (ex. PlannersHub) colocar conteúdo no cabeçalho do app, ao lado do logo — em
// vez de duplicar uma barra de navegação própria por baixo dele.
//
// Contrato: o `node` precisa ser estável entre renders (memoizado ou definido fora do render),
// senão o efeito abaixo re-executa a cada render e o header perde/recupera o conteúdo em loop.
export function useHeaderSlot(node: ReactNode) {
	const setNode = useContext(HeaderSlotContext)

	useEffect(() => {
		setNode?.(node)
		// Cleanup limpa o slot quando a página desmonta. `setNode` entra nas deps porque
		// é o valor que o efeito consome; ele é estável (vem de useState no Layout).
		return () => setNode?.(null)
	}, [node, setNode])
}