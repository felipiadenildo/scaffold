import { beforeEach, describe, expect, it, vi } from 'vitest'
import { assinar, assinarTudo, esquecerCache, ler, lerDocumento, listarChaves, remover, salvar } from './armazenamento'
import { FORMATO_ATUAL, migrarArmazenamento } from './migracoes'

beforeEach(() => {
	localStorage.clear()
	esquecerCache()
})

describe('armazenamento', () => {
	it('salva como documento com carimbo de atualização', () => {
		salvar('scaffold.dados.x', { a: 1 }, new Date('2026-09-30T12:00:00Z'))
		expect(JSON.parse(localStorage.getItem('scaffold.dados.x')!)).toEqual({
			atualizadoEm: '2026-09-30T12:00:00.000Z',
			dados: { a: 1 },
		})
		expect(lerDocumento('scaffold.dados.x')?.atualizadoEm).toBe('2026-09-30T12:00:00.000Z')
	})

	it('devolve a mesma referência enquanto a chave não muda', () => {
		salvar('scaffold.dados.x', { a: 1 })
		expect(ler('scaffold.dados.x')).toBe(ler('scaffold.dados.x'))
	})

	it('avisa só quem assinou a chave que mudou, e o ouvinte geral', () => {
		const daChave = vi.fn()
		const deOutra = vi.fn()
		const geral = vi.fn()
		assinar('scaffold.dados.x', daChave)
		assinar('scaffold.dados.y', deOutra)
		const cancelar = assinarTudo(geral)

		salvar('scaffold.dados.x', 1)
		expect(daChave).toHaveBeenCalledTimes(1)
		expect(deOutra).not.toHaveBeenCalled()
		expect(geral).toHaveBeenCalledWith('scaffold.dados.x')

		cancelar()
		remover('scaffold.dados.x')
		expect(daChave).toHaveBeenCalledTimes(2)
		expect(geral).toHaveBeenCalledTimes(1)
		expect(ler('scaffold.dados.x')).toBeNull()
	})

	it('JSON corrompido é tratado como ausente', () => {
		localStorage.setItem('scaffold.dados.x', '{quebrado')
		expect(ler('scaffold.dados.x')).toBeNull()
	})

	it('lista chaves por prefixo', () => {
		salvar('scaffold.dados.a', 1)
		salvar('scaffold.local.b', 2)
		expect(listarChaves('scaffold.dados.')).toEqual(['scaffold.dados.a'])
	})
})

describe('migrações', () => {
	it('descarta o formato 1 do protótipo e marca o formato atual', () => {
		localStorage.setItem('scaffold.planner.dia.2026-09-01', '{}')
		localStorage.setItem('scaffold.planner.habitos.template', '[]')
		localStorage.setItem('scaffold-theme', 'dark')
		migrarArmazenamento()
		expect(localStorage.getItem('scaffold.planner.dia.2026-09-01')).toBeNull()
		expect(localStorage.getItem('scaffold.planner.habitos.template')).toBeNull()
		expect(localStorage.getItem('scaffold-theme')).toBe('dark')
		expect(localStorage.getItem('scaffold.formato')).toBe(String(FORMATO_ATUAL))
	})

	it('não mexe em nada quando já está no formato atual', () => {
		localStorage.setItem('scaffold.formato', String(FORMATO_ATUAL))
		salvar('scaffold.dados.planner.modelos', [])
		migrarArmazenamento()
		expect(ler('scaffold.dados.planner.modelos')).toEqual([])
	})
})
