import { describe, expect, it } from 'vitest'
import { en } from '../../i18n/en'
import { es } from '../../i18n/es'
import { pt } from '../../i18n/pt'
import { criarModelosProntos } from './prontos'

describe('modelos prontos', () => {
	it.each([
		['pt', pt],
		['en', en],
		['es', es],
	])('mesma forma em %s, com os textos do idioma', (_, t) => {
		const prontos = criarModelosProntos(t)
		expect(prontos.map((p) => p.chave)).toEqual(['leve', 'padrao', 'detalhado'])
		expect(prontos.map((p) => p.modelo.estrutura.blocos.length)).toEqual([1, 4, 6])
		expect(prontos[1].modelo.nome).toBe(t.planner.prontos.padrao.nome)
		expect(prontos[1].modelo.estrutura.blocos.map((b) => b.nome)).toEqual(t.planner.sugestoesBlocos[3])
	})

	it('leve no fim de semana, padrão nos dias úteis', () => {
		const [leve, padrao, detalhado] = criarModelosProntos(pt).map((p) => p.modelo)
		expect(leve.diasSemana).toEqual([0, 6])
		expect(padrao.diasSemana).toEqual([1, 2, 3, 4, 5])
		expect(detalhado.diasSemana).toEqual([])
	})

	it('todos marcados como prontos, com as seções ligadas', () => {
		for (const { modelo } of criarModelosProntos(pt)) {
			expect(modelo.pronto).toBe(true)
			expect(modelo.estrutura).toMatchObject({ humor: true, sobreDia: true, habitos: true, importantes: true })
		}
	})

	it('a tabela de nomes tem de 1 a 6 blocos em todos os idiomas', () => {
		for (const t of [pt, en, es]) expect(t.planner.sugestoesBlocos.map((l) => l.length)).toEqual([1, 2, 3, 4, 5, 6])
	})
})
