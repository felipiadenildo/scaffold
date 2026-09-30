import { describe, expect, it } from 'vitest'
import { pt } from '../../i18n/pt'
import { ajustarQuantidadeBlocos, criarModelo, modeloSugerido } from './modelos'

describe('modeloSugerido', () => {
	const semana = criarModelo('Padrão', ['A'], [1, 2, 3, 4, 5])
	const fimDeSemana = criarModelo('Fim de semana', ['B'], [0, 6])
	const semDias = criarModelo('Dia difícil', ['C'], [])

	it('escolhe pelo dia da semana', () => {
		expect(modeloSugerido([semana, fimDeSemana], '2026-09-30')).toBe(semana) // quarta
		expect(modeloSugerido([semana, fimDeSemana], '2026-10-04')).toBe(fimDeSemana) // domingo
	})

	it('respeita a ordem da pessoa quando dois modelos valem pro mesmo dia', () => {
		const outroDeSemana = criarModelo('Trabalho', ['D'], [3])
		expect(modeloSugerido([outroDeSemana, semana], '2026-09-30')).toBe(outroDeSemana)
	})

	it('sem nenhum marcado pro dia, cai no primeiro da lista', () => {
		expect(modeloSugerido([semDias, semana], '2026-10-04')).toBe(semDias)
	})

	it('sem modelos, nada', () => {
		expect(modeloSugerido([], '2026-09-30')).toBeNull()
	})
})

describe('ajustarQuantidadeBlocos', () => {
	const sugestoes = pt.planner.sugestoesBlocos
	const quatro = criarModelo('Padrão', sugestoes[3], []).estrutura.blocos

	it('aumentar acrescenta no fim e renomeia pela tabela', () => {
		const seis = ajustarQuantidadeBlocos(quatro, 6, sugestoes)
		expect(seis.map((b) => b.nome)).toEqual(sugestoes[5])
		expect(seis.slice(0, 4).map((b) => b.id)).toEqual(quatro.map((b) => b.id))
	})

	it('diminuir tira do fim', () => {
		const tres = ajustarQuantidadeBlocos(quatro, 3, sugestoes)
		expect(tres.map((b) => b.nome)).toEqual(sugestoes[2])
		expect(tres.map((b) => b.id)).toEqual(quatro.slice(0, 3).map((b) => b.id))
	})

	it('não mexe no nome que a pessoa editou', () => {
		const editado = quatro.map((b, i) => (i === 0 ? { ...b, nome: 'Acordar devagar', nomeEditado: true } : b))
		expect(ajustarQuantidadeBlocos(editado, 2, sugestoes).map((b) => b.nome)).toEqual(['Acordar devagar', 'Almoço'])
	})

	it('respeita o mínimo de 1 e o máximo de 6', () => {
		expect(ajustarQuantidadeBlocos(quatro, 0, sugestoes)).toHaveLength(1)
		expect(ajustarQuantidadeBlocos(quatro, 9, sugestoes)).toHaveLength(6)
	})
})
