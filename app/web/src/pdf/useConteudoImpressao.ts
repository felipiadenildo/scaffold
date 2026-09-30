import { useMemo } from 'react'
import { PREFIXO_LOCAL, salvar } from '../data/armazenamento/armazenamento'
import { blocosVisuais, type BlocoVisual } from '../data/planner/cores'
import { resolverLista } from '../data/planner/listas'
import { criarModelosProntos, listasSugeridas, prontoPadrao } from '../data/planner/prontos'
import type { Estrutura, ItemLista } from '../data/planner/tipos'
import { useArmazenado } from '../hooks/useArmazenado'
import { useListaDoDia, useModelos } from '../hooks/usePlanner'
import { useIdioma } from '../i18n/useIdioma'
import { paraISO } from '../lib/formatarData'

export const semAcaoImpressao = () => {}

// Escolhas da janela de impressão, lembradas neste aparelho.
export interface OpcoesImpressao {
	// Sem o fundo de papel (creme + textura) e sem as cores de fundo das barras. Desligado por padrão:
	// o padrão é a folha como aparece na tela.
	economizarTinta: boolean
	// PDF em tons de cinza (pra impressora sem cor, ou só pra economizar a tinta colorida).
	pretoEBranco: boolean
	// As duas listas saem com os itens de hoje ou com linhas em branco pra escrever à mão.
	listas: 'itens' | 'linhas'
	// Linhas de caderno nos blocos e nas anotações (sem elas: espaço livre, pra escrever solto ou desenhar).
	linhasDeCaderno: boolean
}

const CHAVE_OPCOES_IMPRESSAO = `${PREFIXO_LOCAL}impressao`
const OPCOES_PADRAO: OpcoesImpressao = { economizarTinta: false, pretoEBranco: false, listas: 'itens', linhasDeCaderno: true }

export function useOpcoesImpressao() {
	// Mescla com o padrão: opções salvas por uma versão anterior (sem algum campo) continuam válidas.
	const salvas = useArmazenado<Partial<OpcoesImpressao>>(CHAVE_OPCOES_IMPRESSAO)
	const opcoes: OpcoesImpressao = { ...OPCOES_PADRAO, ...salvas }
	return {
		opcoes,
		mudarOpcoes: (mudancas: Partial<OpcoesImpressao>) => salvar(CHAVE_OPCOES_IMPRESSAO, { ...opcoes, ...mudancas }),
	}
}

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
