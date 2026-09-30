import { PREFIXO_DADOS, ler, salvar } from '../armazenamento/armazenamento'
import { habitosIniciais, importantesIniciais, modelosIniciais } from './padroes'
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
}

// TEMPORÁRIO (até a etapa 0-C): cria o modelo "Padrão" e as duas listas na primeira vez, sem
// perguntar nada, pra o Planner continuar abrindo como antes. A 0-C troca isso pela tela de
// boas-vindas com os modelos prontos.
export function semearPlannerSeVazio(): void {
	if (repositorioPlanner.modelos().length === 0) repositorioPlanner.salvarModelos(modelosIniciais())
	if (repositorioPlanner.lista('habitos').versoes.length === 0) repositorioPlanner.salvarLista('habitos', habitosIniciais())
	if (repositorioPlanner.lista('importantes').versoes.length === 0)
		repositorioPlanner.salvarLista('importantes', importantesIniciais())
}
