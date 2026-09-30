import { blocosVisuais, type BlocoVisual } from '../data/planner/cores'
import type { Estrutura, ItemLista } from '../data/planner/tipos'
import { useDia, useListaDoDia } from '../hooks/usePlanner'

export const semAcaoImpressao = () => {}

export interface ConteudoImpressao {
	estrutura: Estrutura
	blocos: BlocoVisual[]
	habitos: ItemLista[]
	importantes: ItemLista[]
}

// Estrutura e listas de um dia, pra imprimir a folha em branco daquele dia. Lido do mesmo
// armazenamento reativo que a folha usa, então o PDF nunca sai com uma lista desatualizada.
export function useConteudoImpressao(dataISO: string): ConteudoImpressao {
	const { estrutura } = useDia(dataISO)
	const { itens: habitos } = useListaDoDia('habitos', dataISO)
	const { itens: importantes } = useListaDoDia('importantes', dataISO)
	return { estrutura, blocos: blocosVisuais(estrutura.blocos), habitos, importantes }
}
