import { describe, expect, it } from 'vitest'
import { criarModelo, modeloSugerido } from './modelos'

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
