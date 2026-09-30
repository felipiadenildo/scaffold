import { beforeEach, describe, expect, it } from 'vitest'
import { esquecerCache, ler, salvar } from './armazenamento'
import { aplicarBackup, lerBackup, montarBackup, resumirBackup } from './backup'

const antes = new Date('2026-09-01T10:00:00Z')
const depois = new Date('2026-09-20T10:00:00Z')

beforeEach(() => {
	localStorage.clear()
	esquecerCache()
})

describe('backup', () => {
	it('exporta só os dados da pessoa, não as preferências do aparelho', () => {
		salvar('scaffold.dados.planner.dia.2026-09-01', { texto: 'a' })
		salvar('scaffold.local.tema', 'dark')
		const backup = montarBackup(depois, 'abc')
		expect(Object.keys(backup.documentos)).toEqual(['scaffold.dados.planner.dia.2026-09-01'])
		expect(backup).toMatchObject({ app: 'scaffold', versaoApp: 'abc' })
	})

	it('recusa o que não é backup do Scaffold e ignora chaves estranhas', () => {
		expect(lerBackup('não é json')).toEqual({ erro: 'naoEBackup' })
		expect(lerBackup(JSON.stringify({ app: 'outro' }))).toEqual({ erro: 'naoEBackup' })
		expect(lerBackup(JSON.stringify({ app: 'scaffold', formato: 999, documentos: {} }))).toEqual({ erro: 'formatoMaisNovo' })
		const lido = lerBackup(
			JSON.stringify({
				app: 'scaffold',
				formato: 2,
				documentos: {
					'scaffold.dados.x': { atualizadoEm: 'a', dados: 1 },
					'scaffold.local.tema': { atualizadoEm: 'a', dados: 'dark' },
					'outra.coisa': { atualizadoEm: 'a', dados: 1 },
				},
			}),
		)
		expect('backup' in lido && Object.keys(lido.backup.documentos)).toEqual(['scaffold.dados.x'])
	})

	it('resume dias e modelos', () => {
		salvar('scaffold.dados.planner.dia.2026-09-01', {})
		salvar('scaffold.dados.planner.dia.2026-09-02', {})
		salvar('scaffold.dados.planner.modelos', [{}, {}, {}])
		expect(resumirBackup(montarBackup())).toEqual({ dias: 2, modelos: 3 })
	})

	it('juntar: fica a versão alterada por último, e nada do aparelho é apagado', () => {
		salvar('scaffold.dados.planner.dia.2026-09-01', 'aparelho-novo', depois)
		salvar('scaffold.dados.planner.dia.2026-09-02', 'aparelho-velho', antes)
		salvar('scaffold.dados.planner.dia.2026-09-03', 'só no aparelho', antes)
		const backup = {
			...montarBackup(),
			documentos: {
				'scaffold.dados.planner.dia.2026-09-01': { atualizadoEm: antes.toISOString(), dados: 'arquivo-velho' },
				'scaffold.dados.planner.dia.2026-09-02': { atualizadoEm: depois.toISOString(), dados: 'arquivo-novo' },
				'scaffold.dados.planner.dia.2026-09-04': { atualizadoEm: antes.toISOString(), dados: 'só no arquivo' },
			},
		}
		aplicarBackup(backup, 'juntar')
		expect(ler('scaffold.dados.planner.dia.2026-09-01')).toBe('aparelho-novo')
		expect(ler('scaffold.dados.planner.dia.2026-09-02')).toBe('arquivo-novo')
		expect(ler('scaffold.dados.planner.dia.2026-09-03')).toBe('só no aparelho')
		expect(ler('scaffold.dados.planner.dia.2026-09-04')).toBe('só no arquivo')
	})

	it('substituir: o aparelho fica igual ao arquivo', () => {
		salvar('scaffold.dados.planner.dia.2026-09-03', 'só no aparelho')
		salvar('scaffold.local.tema', 'dark')
		const backup = {
			...montarBackup(),
			documentos: { 'scaffold.dados.planner.dia.2026-09-04': { atualizadoEm: antes.toISOString(), dados: 'do arquivo' } },
		}
		aplicarBackup(backup, 'substituir')
		expect(ler('scaffold.dados.planner.dia.2026-09-03')).toBeNull()
		expect(ler('scaffold.dados.planner.dia.2026-09-04')).toBe('do arquivo')
		// Preferências do aparelho não são dados da pessoa: ficam.
		expect(ler('scaffold.local.tema')).toBe('dark')
	})
})
