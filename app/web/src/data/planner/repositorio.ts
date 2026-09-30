import { PREFIXO_DADOS, ler, remover, salvar } from '../armazenamento/armazenamento'
import { criarDia } from './dias'
import type { Dia, ListaVersionada, Modelo, TipoLista } from './tipos'

// Onde cada pedaço do Planner mora no armazenamento. Um documento por dia (e não um documento com
// todos os dias) pra que a sincronização futura envie só o que mudou.
export const chavesPlanner = {
	modelos: `${PREFIXO_DADOS}planner.modelos`,
	lista: (tipo: TipoLista) => `${PREFIXO_DADOS}planner.lista.${tipo}`,
	dia: (dataISO: string) => `${PREFIXO_DADOS}planner.dia.${dataISO}`,
}

export const repositorioPlanner = {
	modelos: (): Modelo[] => ler<Modelo[]>(chavesPlanner.modelos) ?? [],
	salvarModelos: (modelos: Modelo[]) => salvar(chavesPlanner.modelos, modelos),

	lista: (tipo: TipoLista): ListaVersionada => ler<ListaVersionada>(chavesPlanner.lista(tipo)) ?? { versoes: [] },
	salvarLista: (tipo: TipoLista, lista: ListaVersionada) => salvar(chavesPlanner.lista(tipo), lista),

	dia: (dataISO: string): Dia | null => ler<Dia>(chavesPlanner.dia(dataISO)),
	salvarDia: (dia: Dia) => salvar(chavesPlanner.dia(dia.data), dia),
	// Na fase de login, excluir vai precisar deixar um registro de exclusão (lápide) pra sincronização
	// saber que o dia sumiu de propósito — hoje basta apagar a chave.
	removerDia: (dataISO: string) => remover(chavesPlanner.dia(dataISO)),
}

// Primeira vez: a pessoa escolheu um dos modelos prontos. Todos viram dela (na ordem oferecida),
// as listas ganham os itens sugeridos — só se ainda estiverem vazias, pra nunca sobrescrever — e o
// dia é criado com o escolhido.
export function iniciarPlanner(
	modelos: Modelo[],
	escolhido: Modelo,
	listas: Record<TipoLista, ListaVersionada>,
	dataISO: string,
): void {
	repositorioPlanner.salvarModelos(modelos)
	for (const tipo of ['habitos', 'importantes'] as const) {
		if (repositorioPlanner.lista(tipo).versoes.length === 0) repositorioPlanner.salvarLista(tipo, listas[tipo])
	}
	repositorioPlanner.salvarDia(criarDia(escolhido, dataISO))
}
