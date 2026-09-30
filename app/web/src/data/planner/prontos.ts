import type { Dicionario } from '../../i18n/pt'
import { criarLista } from './listas'
import { criarModelo } from './modelos'
import type { ListaVersionada, Modelo } from './tipos'

// Modelos oferecidos desde a primeira vez (PLANO-FASE-0.md §1) e sempre presentes na lista da
// pessoa: podem ser editados, não excluídos. Os textos vêm do dicionário do idioma atual; copiados,
// passam a ser dela — trocar de idioma depois não traduz o que já foi copiado.
// Em ordem de quantidade de blocos: 1, 4, 6.
export type ChaveModeloPronto = keyof Dicionario['planner']['prontos']

export interface ModeloPronto {
	chave: ChaveModeloPronto
	descricao: string
	modelo: Modelo
}

const SEG_A_SEX = [1, 2, 3, 4, 5]
const SAB_E_DOM = [0, 6]

export function criarModelosProntos(t: Dicionario): ModeloPronto[] {
	const { prontos, sugestoesBlocos } = t.planner
	const pronto = (chave: ChaveModeloPronto, blocos: number, diasSemana: number[]): ModeloPronto => ({
		chave,
		descricao: prontos[chave].descricao,
		modelo: { ...criarModelo(prontos[chave].nome, sugestoesBlocos[blocos - 1], diasSemana), pronto: true },
	})
	return [pronto('leve', 1, SAB_E_DOM), pronto('padrao', 4, SEG_A_SEX), pronto('detalhado', 6, [])]
}

// O recomendado na primeira vez e o que se imprime antes de haver qualquer modelo.
export function prontoPadrao(prontos: ModeloPronto[]): ModeloPronto {
	return prontos.find((p) => p.chave === 'padrao') ?? prontos[0]
}

export function listasSugeridas(t: Dicionario): { habitos: ListaVersionada; importantes: ListaVersionada } {
	return {
		habitos: criarLista(t.planner.itensSugeridos.habitos),
		importantes: criarLista(t.planner.itensSugeridos.importantes),
	}
}
