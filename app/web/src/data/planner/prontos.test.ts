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
		expect(prontos.map((p) => p.chave)).toEqual(['padrao', 'fimDeSemana', 'diaDificil', 'trabalhoEstudo'])
		expect(prontos.map((p) => p.modelo.estrutura.blocos.length)).toEqual([4, 1, 1, 3])
		expect(prontos[0].modelo.nome).toBe(t.planner.prontos.padrao.nome)
		expect(prontos[0].modelo.estrutura.blocos.map((b) => b.nome)).toEqual(t.planner.prontos.padrao.blocos)
	})

	it('padrão nos dias úteis, fim de semana no sábado e domingo', () => {
		const [padrao, fimDeSemana, diaDificil] = criarModelosProntos(pt).map((p) => p.modelo)
		expect(padrao.diasSemana).toEqual([1, 2, 3, 4, 5])
		expect(fimDeSemana.diasSemana).toEqual([0, 6])
		expect(diaDificil.diasSemana).toEqual([])
	})

	it('dia difícil só com humor e o que não pode faltar', () => {
		const { estrutura } = criarModelosProntos(pt)[2].modelo
		expect(estrutura).toMatchObject({ humor: true, sobreDia: false, habitos: false, importantes: true })
	})
})
