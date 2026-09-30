import { useCallback } from 'react'
import { criarDia } from '../data/planner/dias'
import { adicionarItem, removerItem, renomearItem, resolverLista } from '../data/planner/listas'
import { modeloSugerido } from '../data/planner/modelos'
import { chavesPlanner, repositorioPlanner } from '../data/planner/repositorio'
import type { Dia, Estrutura, ListaVersionada, Modelo, TipoLista } from '../data/planner/tipos'
import { paraISO } from '../lib/formatarData'
import { useArmazenado } from './useArmazenado'

// Constantes (e não literais inline) pra devolver sempre a mesma referência quando não há dado.
const SEM_MODELOS: Modelo[] = []
const LISTA_VAZIA: ListaVersionada = { versoes: [] }
const ESTRUTURA_VAZIA: Estrutura = { blocos: [], humor: false, sobreDia: false, habitos: false, importantes: false }

export function useModelos(): Modelo[] {
	return useArmazenado<Modelo[]>(chavesPlanner.modelos) ?? SEM_MODELOS
}

function criarDiaComModeloSugerido(dataISO: string): Dia | null {
	const modelo = modeloSugerido(repositorioPlanner.modelos(), dataISO)
	return modelo ? criarDia(modelo, dataISO) : null
}

export function useDia(dataISO: string) {
	const dia = useArmazenado<Dia>(chavesPlanner.dia(dataISO))
	const modelos = useModelos()

	// TEMPORÁRIO (até a etapa 0-C): um dia que ainda não existe aparece com a estrutura do modelo
	// sugerido e é criado de verdade na primeira edição. Na 0-C ele passa a aparecer como folha
	// pontilhada, com os modelos pra escolher.
	const estrutura = dia?.estrutura ?? modeloSugerido(modelos, dataISO)?.estrutura ?? ESTRUTURA_VAZIA

	const atualizar = useCallback(
		(mudar: (dia: Dia) => Dia) => {
			const atual = repositorioPlanner.dia(dataISO) ?? criarDiaComModeloSugerido(dataISO)
			if (atual) repositorioPlanner.salvarDia(mudar(atual))
		},
		[dataISO],
	)

	return { dia, estrutura, atualizar }
}

// Itens da lista como valiam no dia `dataISO`. Editar a lista (adicionar/remover/renomear) vale
// daquele dia em diante, e só é permitido de hoje em diante — o passado fica congelado; num dia
// passado só dá pra marcar e desmarcar.
export function useListaDoDia(tipo: TipoLista, dataISO: string) {
	const lista = useArmazenado<ListaVersionada>(chavesPlanner.lista(tipo)) ?? LISTA_VAZIA
	const itens = resolverLista(lista, dataISO)
	const editavel = dataISO >= paraISO(new Date())

	function mudar(operacao: (lista: ListaVersionada) => ListaVersionada) {
		repositorioPlanner.salvarLista(tipo, operacao(repositorioPlanner.lista(tipo)))
	}

	return {
		itens,
		editavel,
		adicionar: (texto: string) => mudar((l) => adicionarItem(l, dataISO, texto)),
		remover: (id: string) => mudar((l) => removerItem(l, dataISO, id)),
		renomear: (id: string, texto: string) => mudar((l) => renomearItem(l, dataISO, id, texto)),
	}
}
