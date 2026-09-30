import { describe, expect, it } from 'vitest'
import { continuarLista } from './atalhosLista'

// Cursor no fim do texto, sem seleção.
const noFim = (texto: string) => continuarLista(texto, texto.length, texto.length)

describe('continuarLista', () => {
	it('continua marcadores de lista', () => {
		expect(noFim('- pão')).toEqual({ texto: '- pão\n- ', cursor: 8 })
		expect(noFim('• fruta')?.texto).toBe('• fruta\n• ')
		expect(noFim('* chá')?.texto).toBe('* chá\n* ')
	})

	it('numera a próxima linha', () => {
		expect(noFim('1. acordar')?.texto).toBe('1. acordar\n2. ')
		expect(noFim('9) tomar remédio')?.texto).toBe('9) tomar remédio\n10) ')
	})

	it('mantém o recuo', () => {
		expect(noFim('Compras\n  - leite')?.texto).toBe('Compras\n  - leite\n  - ')
	})

	it('Enter numa linha só com o marcador encerra a lista', () => {
		expect(noFim('- pão\n- ')).toEqual({ texto: '- pão\n', cursor: 6 })
		expect(noFim('1. a\n2. ')?.texto).toBe('1. a\n')
	})

	it('no meio da linha, quebra ali e continua a lista', () => {
		const texto = '- pão fruta'
		expect(continuarLista(texto, 5, 5)).toEqual({ texto: '- pão\n-  fruta', cursor: 8 })
	})

	it('Enter normal fora de lista, antes do marcador ou com seleção', () => {
		expect(noFim('Tomar café')).toBeNull()
		expect(noFim('-sem espaço')).toBeNull()
		expect(continuarLista('- pão', 0, 0)).toBeNull()
		expect(continuarLista('- pão', 2, 5)).toBeNull()
	})

	it('só olha a linha do cursor', () => {
		const texto = '- pão\nTexto solto'
		expect(noFim(texto)).toBeNull()
		expect(continuarLista(texto, 5, 5)?.texto).toBe('- pão\n- \nTexto solto')
	})
})
