import { gerarId } from '../../lib/gerarId'
import type { Bloco, Estrutura, Modelo } from './tipos'

type OpcoesEstrutura = Partial<Omit<Estrutura, 'blocos'>>

export function criarEstrutura(nomesBlocos: string[], opcoes: OpcoesEstrutura = {}): Estrutura {
	return {
		blocos: nomesBlocos.map((nome) => ({ id: gerarId(), nome, nomeEditado: false })),
		humor: true,
		sobreDia: true,
		habitos: true,
		importantes: true,
		...opcoes,
	}
}

export function criarModelo(nome: string, nomesBlocos: string[], diasSemana: number[], opcoes?: OpcoesEstrutura): Modelo {
	return { id: gerarId(), nome, estrutura: criarEstrutura(nomesBlocos, opcoes), diasSemana }
}

function diaDaSemana(dataISO: string): number {
	const [ano, mes, dia] = dataISO.split('-').map(Number)
	return new Date(ano, mes - 1, dia).getDay()
}

// Modelo que vem pré-selecionado pra criar um dia: o primeiro (na ordem da pessoa) marcado pra
// aquele dia da semana; sem nenhum marcado, o primeiro da lista.
export function modeloSugerido(modelos: Modelo[], dataISO: string): Modelo | null {
	const semana = diaDaSemana(dataISO)
	return modelos.find((m) => m.diasSemana.includes(semana)) ?? modelos[0] ?? null
}

export const MIN_BLOCOS = 1
export const MAX_BLOCOS = 6

// Muda a quantidade de blocos pelo fim da lista (tirar remove o último; pôr acrescenta no fim) e
// renomeia pelos nomes sugeridos pra nova quantidade — só os blocos que a pessoa não renomeou.
// `sugestoes[n - 1]` = nomes pra n blocos (t.planner.sugestoesBlocos).
export function ajustarQuantidadeBlocos(blocos: Bloco[], quantidade: number, sugestoes: string[][]): Bloco[] {
	const n = Math.min(MAX_BLOCOS, Math.max(MIN_BLOCOS, quantidade))
	const nomes = sugestoes[n - 1] ?? []
	return Array.from({ length: n }, (_, i) => {
		const existente = blocos[i]
		const sugerido = nomes[i] ?? ''
		if (!existente) return { id: gerarId(), nome: sugerido, nomeEditado: false }
		return existente.nomeEditado ? existente : { ...existente, nome: sugerido }
	})
}
