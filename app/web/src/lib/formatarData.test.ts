import { describe, expect, it } from 'vitest'
import {
	deISO,
	formatarDataCurtaComDiaSemana,
	formatarDataCurtissima,
	formatarDataLongaComDiaSemana,
	paraISO,
} from './formatarData'

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

	it('curtíssima, sem o ano', () => {
		expect(formatarDataCurtissima(data, 'pt-BR')).toBe('Ter, 15/09')
		expect(formatarDataCurtissima(data, 'en-US')).toBe('Tue, 09/15')
	})
})

describe('deISO', () => {
	it('é o inverso de paraISO, no fuso local', () => {
		expect(paraISO(deISO('2026-09-30'))).toBe('2026-09-30')
		expect(deISO('2026-01-01').getDate()).toBe(1)
	})
})
