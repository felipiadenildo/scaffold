import type { Humor } from './humor'

// Modelo de dados do Planner. Decisões em app/PLANO-FASE-0.md §1:
// - um Modelo define só a estrutura da folha;
// - um Dia só existe depois de criado e guarda a própria cópia da estrutura (editar um modelo
//   nunca mexe em dias que já existem);
// - hábitos e "não pode deixar de fazer" são listas únicas, iguais em todos os modelos, com
//   versões por data ("daquele dia em diante").

export interface Bloco {
	id: string
	nome: string
	// Nome ainda é o sugerido pelo app? Mudar o número de blocos no editor só renomeia os que a
	// pessoa não tocou.
	nomeEditado: boolean
}

export interface Estrutura {
	blocos: Bloco[]
	humor: boolean
	sobreDia: boolean
	habitos: boolean
	importantes: boolean
}

export interface Modelo {
	id: string
	nome: string
	estrutura: Estrutura
	// Dias da semana em que este modelo vem pré-selecionado. 0 = domingo (mesma convenção de Date.getDay()).
	diasSemana: number[]
	// Veio dos modelos prontos: sempre presente (pode ser editado, não excluído).
	pronto?: boolean
}

export type TipoLista = 'habitos' | 'importantes'

export interface ItemLista {
	id: string
	texto: string
}

export interface VersaoLista {
	// Data ISO (AAAA-MM-DD) a partir da qual esta versão vale.
	desde: string
	itens: ItemLista[]
}

export interface ListaVersionada {
	// Sempre ordenadas por `desde`, crescente.
	versoes: VersaoLista[]
}

export interface ConteudoBloco {
	tituloExtra: string
	texto: string
}

export interface Dia {
	data: string
	// Modelo usado pra criar o dia. Só informativo: a estrutura abaixo é uma cópia, não uma referência.
	modeloId: string | null
	estrutura: Estrutura
	humor: Humor | null
	// Chave = id do bloco.
	blocos: Record<string, ConteudoBloco>
	sobreDia: string
	anotacoes: string
	// Chave = id do item da lista. Marcação de item removido depois continua aqui, inofensiva —
	// é o que mantém o passado intacto.
	marcados: Record<TipoLista, Record<string, boolean>>
	criadoEm: string
}
