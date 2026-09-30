import type { Dicionario } from '../../i18n/pt'
import { criarLista } from './listas'
import { criarModelo } from './modelos'
import type { ListaVersionada, Modelo } from './tipos'

// Modelos oferecidos na primeira vez (PLANO-FASE-0.md §1). Os textos vêm do dicionário do idioma
// atual; escolhido um, os quatro são copiados pra pessoa e passam a ser dela — trocar de idioma
// depois não traduz o que já foi copiado.
export type ChaveModeloPronto = keyof Dicionario['planner']['prontos']

export interface ModeloPronto {
	chave: ChaveModeloPronto
	descricao: string
	modelo: Modelo
}

const SEG_A_SEX = [1, 2, 3, 4, 5]
const SAB_E_DOM = [0, 6]

export function criarModelosProntos(t: Dicionario): ModeloPronto[] {
	const { padrao, fimDeSemana, diaDificil, trabalhoEstudo } = t.planner.prontos
	return [
		{ chave: 'padrao', descricao: padrao.descricao, modelo: criarModelo(padrao.nome, padrao.blocos, SEG_A_SEX) },
		{
			chave: 'fimDeSemana',
			descricao: fimDeSemana.descricao,
			modelo: criarModelo(fimDeSemana.nome, fimDeSemana.blocos, SAB_E_DOM, { importantes: false }),
		},
		{
			chave: 'diaDificil',
			descricao: diaDificil.descricao,
			// Dia ruim pede menos: nada de hábitos pra cobrar nem resumo pra escrever, só o essencial.
			modelo: criarModelo(diaDificil.nome, diaDificil.blocos, [], { sobreDia: false, habitos: false }),
		},
		{
			chave: 'trabalhoEstudo',
			descricao: trabalhoEstudo.descricao,
			modelo: criarModelo(trabalhoEstudo.nome, trabalhoEstudo.blocos, []),
		},
	]
}

export function listasSugeridas(t: Dicionario): { habitos: ListaVersionada; importantes: ListaVersionada } {
	return {
		habitos: criarLista(t.planner.itensSugeridos.habitos),
		importantes: criarLista(t.planner.itensSugeridos.importantes),
	}
}
