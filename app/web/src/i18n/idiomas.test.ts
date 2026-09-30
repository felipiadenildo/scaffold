import { describe, expect, it } from 'vitest'
import { detectarIdioma } from './idiomas'

describe('detectarIdioma', () => {
	it('usa o primeiro idioma conhecido da lista do navegador', () => {
		expect(detectarIdioma(['es-MX', 'en-US'])).toBe('es')
		expect(detectarIdioma(['fr-FR', 'en-GB', 'pt-BR'])).toBe('en')
		expect(detectarIdioma(['PT-br'])).toBe('pt')
	})

	it('sem nenhum conhecido, português', () => {
		expect(detectarIdioma(['fr', 'de'])).toBe('pt')
		expect(detectarIdioma([])).toBe('pt')
	})
})
