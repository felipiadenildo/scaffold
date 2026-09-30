import { describe, expect, it } from 'vitest'
import { formatarDataCurtaComDiaSemana, formatarDataLongaComDiaSemana } from './formatarData'

const data = new Date(2026, 8, 15) // terça-feira, 15/09/2026

describe('formatação de data por idioma', () => {
	it('longa', () => {
		expect(formatarDataLongaComDiaSemana(data, 'pt-BR')).toBe('Terça-feira, 15 de setembro de 2026')
		expect(formatarDataLongaComDiaSemana(data, 'en-US')).toBe('Tuesday, September 15, 2026')
		expect(formatarDataLongaComDiaSemana(data, 'es')).toBe('Martes, 15 de septiembre de 2026')
	})

	it('curta', () => {
		expect(formatarDataCurtaComDiaSemana(data, 'pt-BR')).toBe('Ter, 15/09/2026')
		expect(formatarDataCurtaComDiaSemana(data, 'en-US')).toBe('Tue, 09/15/2026')
		expect(formatarDataCurtaComDiaSemana(data, 'es')).toBe('Mar, 15/09/2026')
	})
})
