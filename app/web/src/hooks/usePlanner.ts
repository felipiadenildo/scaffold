import { useCallback } from 'react'
import { criarDia } from '../data/planner/dias'
import { adicionarItem, removerItem, renomearItem, resolverLista } from '../data/planner/listas'
import { modeloSugerido } from '../data/planner/modelos'
import { chavesPlanner, repositorioPlanner } from '../data/planner/repositorio'
import type { Dia, ListaVersionada, Modelo, TipoLista } from '../data/planner/tipos'
import { paraISO } from '../lib/formatarData'
import { useArmazenado } from './useArmazenado'

// Constantes (e não literais inline) pra devolver sempre a mesma referência quando não há dado.
const SEM_MODELOS: Modelo[] = []
const LISTA_VAZIA: ListaVersionada = { versoes: [] }

export function useModelos(): Modelo[] {
	return useArmazenado<Modelo[]>(chavesPlanner.modelos) ?? SEM_MODELOS
}

// `dia` null = o dia ainda não foi criado (a tela mostra a folha pontilhada com os modelos).
// `estrutura` existe mesmo assim — a do modelo sugerido pra aquela data — pra poder imprimir a folha
// em branco de um dia que ainda não existe.
export function useDia(dataISO: string) {
	const dia = useArmazenado<Dia>(chavesPlanner.dia(dataISO))
	const modelos = useModelos()
	const estrutura = dia?.estrutura ?? modeloSugerido(modelos, dataISO)?.estrutura ?? null

	// Só mexe em dia que já existe: criar é sempre uma escolha explícita (criar(), com o modelo).
	const atualizar = useCallback(
		(mudar: (dia: Dia) => Dia) => {
			const atual = repositorioPlanner.dia(dataISO)
			if (atual) repositorioPlanner.salvarDia(mudar(atual))
		},
		[dataISO],
	)

	const criar = useCallback((modelo: Modelo) => repositorioPlanner.salvarDia(criarDia(modelo, dataISO)), [dataISO])

	// Devolve o dia como estava, pra quem chamou poder oferecer "Desfazer" (restaurar = salvarDia).
	const excluir = useCallback((): Dia | null => {
		const atual = repositorioPlanner.dia(dataISO)
		if (atual) repositorioPlanner.removerDia(dataISO)
		return atual
	}, [dataISO])

	return { dia, estrutura, atualizar, criar, excluir }
}

// Itens da lista como valiam no dia `dataISO`. Editar a lista (adicionar/remover/renomear) vale
// daquele dia em diante, e só é permitido de hoje em diante — o passado fica congelado; num dia
// passado só dá pra marcar e desmarcar.
export function useListaDoDia(tipo: TipoLista, dataISO: string) {
	const lista = useArmazenado<ListaVersionada>(chavesPlanner.lista(tipo)) ?? LISTA_VAZIA
	const itens = resolverLista(lista, dataISO)
	const editavel = dataISO >= paraISO(new Date())

	// Devolve a lista como estava antes, pra quem chamou poder oferecer "Desfazer".
	function mudar(operacao: (lista: ListaVersionada) => ListaVersionada): ListaVersionada {
		const antes = repositorioPlanner.lista(tipo)
		repositorioPlanner.salvarLista(tipo, operacao(antes))
		return antes
	}

	return {
		itens,
		editavel,
		adicionar: (texto: string) => mudar((l) => adicionarItem(l, dataISO, texto)),
		remover: (id: string) => mudar((l) => removerItem(l, dataISO, id)),
		renomear: (id: string, texto: string) => mudar((l) => renomearItem(l, dataISO, id, texto)),
	}
}
