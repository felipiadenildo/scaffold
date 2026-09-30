import { beforeEach, describe, expect, it } from 'vitest'
import { esquecerCache } from '../armazenamento/armazenamento'
import { criarModelo } from './modelos'
import { operacoesModelos, repositorioPlanner } from './repositorio'

beforeEach(() => {
	localStorage.clear()
	esquecerCache()
})

describe('operações de modelos', () => {
	const a = criarModelo('A', ['1'], [])
	const b = criarModelo('B', ['1'], [])
	const c = criarModelo('C', ['1'], [])
	const nomes = () => repositorioPlanner.modelos().map((m) => m.nome)

	it('adiciona no fim e atualiza no lugar', () => {
		repositorioPlanner.salvarModelos([a, b])
		operacoesModelos.adicionar(c)
		operacoesModelos.atualizar({ ...a, nome: 'A2' })
		expect(nomes()).toEqual(['A2', 'B', 'C'])
	})

	it('desfazer a remoção devolve o modelo pro mesmo lugar', () => {
		repositorioPlanner.salvarModelos([a, b, c])
		const removido = operacoesModelos.remover(b.id)
		expect(nomes()).toEqual(['A', 'C'])
		operacoesModelos.restaurar(removido!)
		expect(nomes()).toEqual(['A', 'B', 'C'])
	})
})
