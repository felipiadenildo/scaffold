import { gerarId } from '../../lib/gerarId'
import type { Estrutura, Modelo } from './tipos'

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
