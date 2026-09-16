import { useState } from 'react'
import { plannerStorage } from '../data/plannerStorage'
import { secoesPadrao, type SecaoDia } from '../data/planner'

// Nomes das 4 seções — editáveis, mas a lista de seções em si (quantas/quais slugs existem) é
// fixa por enquanto; só o rótulo muda.
export function useSecoesTemplate() {
	const [secoes, setSecoes] = useState<SecaoDia[]>(() => plannerStorage.getTemplate<SecaoDia[]>('secoes') ?? secoesPadrao)

	function renomear(slug: string, nome: string) {
		setSecoes((prev) => {
			const proximo = prev.map((s) => (s.slug === slug ? { ...s, nome } : s))
			plannerStorage.setTemplate('secoes', proximo)
			return proximo
		})
	}

	return { secoes, renomear }
}

// Habit tracker e protocolo de dia ruim usam o mesmo formato de template (lista de rótulos),
// então compartilham este hook — só a chave de armazenamento e a lista padrão mudam.
export function useListaTemplate(chave: 'habitos' | 'protocolo', padrao: string[]) {
	const [itens, setItens] = useState<string[]>(() => plannerStorage.getTemplate<string[]>(chave) ?? padrao)

	function salvarItens(proximo: string[]) {
		setItens(proximo)
		plannerStorage.setTemplate(chave, proximo)
	}

	return { itens, salvarItens }
}
