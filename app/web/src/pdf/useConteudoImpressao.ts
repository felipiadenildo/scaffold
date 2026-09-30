import { useMemo } from 'react'
import { blocosVisuais, type BlocoVisual } from '../data/planner/cores'
import { resolverLista } from '../data/planner/listas'
import { criarModelosProntos, listasSugeridas, prontoPadrao } from '../data/planner/prontos'
import type { Estrutura, ItemLista } from '../data/planner/tipos'
import { useListaDoDia, useModelos } from '../hooks/usePlanner'
import { useIdioma } from '../i18n/useIdioma'
import { paraISO } from '../lib/formatarData'

export const semAcaoImpressao = () => {}

export interface ConteudoImpressao {
	estrutura: Estrutura
	blocos: BlocoVisual[]
	habitos: ItemLista[]
	importantes: ItemLista[]
}

// Folha em branco de um modelo, pra imprimir. As listas (hábitos e "não pode deixar de fazer")
// saem sempre como estão HOJE — é o que o aviso da janela de impressão explica; pra mudar o que
// sai impresso, a pessoa edita as listas na folha de hoje. Lido do mesmo armazenamento reativo da
// folha, então nunca sai desatualizado.
// Sem nenhum modelo ainda (primeira vez): o Padrão dos prontos com os itens sugeridos — o que a
// pessoa teria ao escolher o Padrão.
export function useConteudoImpressao(estrutura: Estrutura | null): ConteudoImpressao {
	const { t } = useIdioma()
	const hoje = paraISO(new Date())
	const primeiraVez = useModelos().length === 0
	const { itens: habitosHoje } = useListaDoDia('habitos', hoje)
	const { itens: importantesHoje } = useListaDoDia('importantes', hoje)

	const sugerido = useMemo(() => {
		const listas = listasSugeridas(t)
		return {
			estrutura: prontoPadrao(criarModelosProntos(t)).modelo.estrutura,
			habitos: resolverLista(listas.habitos, hoje),
			importantes: resolverLista(listas.importantes, hoje),
		}
	}, [t, hoje])

	const final = estrutura ?? sugerido.estrutura
	return {
		estrutura: final,
		blocos: blocosVisuais(final.blocos),
		habitos: primeiraVez ? sugerido.habitos : habitosHoje,
		importantes: primeiraVez ? sugerido.importantes : importantesHoje,
	}
}
