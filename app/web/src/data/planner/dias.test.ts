import { describe, expect, it } from 'vitest'
import { aplicarEstrutura, criarDia } from './dias'
import { criarModelo } from './modelos'
import type { Dia, Estrutura } from './tipos'

const modelo = criarModelo('Padrão', ['Café', 'Almoço', 'Lanche', 'Jantar'], [1, 2, 3, 4, 5])
const [cafe, almoco, lanche, jantar] = modelo.estrutura.blocos

function comTextos(textos: Record<string, string>): Dia {
	const dia = criarDia(modelo, '2026-09-30')
	for (const [id, texto] of Object.entries(textos)) dia.blocos[id] = { tituloExtra: '', texto }
	return dia
}

function semBlocos(...ids: string[]): Estrutura {
	return { ...modelo.estrutura, blocos: modelo.estrutura.blocos.filter((b) => !ids.includes(b.id)) }
}

describe('criarDia', () => {
	it('copia a estrutura do modelo em vez de referenciar', () => {
		const dia = criarDia(modelo, '2026-09-30')
		expect(dia.estrutura).toEqual(modelo.estrutura)
		expect(dia.estrutura).not.toBe(modelo.estrutura)
		dia.estrutura.blocos[0].nome = 'Mudado'
		expect(modelo.estrutura.blocos[0].nome).toBe('Café')
	})

	it('começa vazio e guarda de qual modelo veio', () => {
		const dia = criarDia(modelo, '2026-09-30')
		expect(dia).toMatchObject({ data: '2026-09-30', modeloId: modelo.id, humor: null, blocos: {}, anotacoes: '' })
	})
})

describe('aplicarEstrutura (rearranjo)', () => {
	it('texto de bloco removido vai pro bloco anterior que continua existindo', () => {
		const dia = comTextos({ [almoco.id]: 'arroz', [lanche.id]: 'fruta' })
		const novo = aplicarEstrutura(dia, semBlocos(lanche.id))
		expect(novo.blocos[almoco.id].texto).toBe('arroz\n**Lanche:** fruta')
		expect(novo.blocos[lanche.id]).toBeUndefined()
	})

	it('sem anterior, vai pro seguinte', () => {
		const dia = comTextos({ [cafe.id]: 'pão' })
		const novo = aplicarEstrutura(dia, semBlocos(cafe.id))
		expect(novo.blocos[almoco.id].texto).toBe('**Café:** pão')
	})

	it('vários removidos entram em ordem no mesmo destino', () => {
		const dia = comTextos({ [almoco.id]: 'a', [lanche.id]: 'b', [jantar.id]: 'c' })
		const novo = aplicarEstrutura(dia, semBlocos(lanche.id, jantar.id))
		expect(novo.blocos[almoco.id].texto).toBe('a\n**Lanche:** b\n**Jantar:** c')
	})

	it('leva junto o título extra do bloco', () => {
		const dia = criarDia(modelo, '2026-09-30')
		dia.blocos[jantar.id] = { tituloExtra: 'Aniversário', texto: 'bolo' }
		const novo = aplicarEstrutura(dia, semBlocos(jantar.id))
		expect(novo.blocos[lanche.id].texto).toBe('**Jantar — Aniversário:** bolo')
	})

	it('troca completa de blocos manda tudo pro primeiro bloco novo', () => {
		const outro = criarModelo('Fim de semana', ['Meu dia'], [0, 6])
		const dia = comTextos({ [cafe.id]: 'pão', [jantar.id]: 'sopa' })
		const novo = aplicarEstrutura(dia, outro.estrutura)
		const [meuDia] = outro.estrutura.blocos
		expect(novo.blocos[meuDia.id].texto).toBe('**Café:** pão\n**Jantar:** sopa')
		expect(novo.estrutura).toEqual(outro.estrutura)
	})

	it('bloco vazio removido não gera nada', () => {
		const dia = comTextos({ [almoco.id]: 'arroz', [lanche.id]: '  ' })
		const novo = aplicarEstrutura(dia, semBlocos(lanche.id))
		expect(novo.blocos[almoco.id].texto).toBe('arroz')
	})

	it('desligar seções esconde, não apaga', () => {
		const dia = { ...comTextos({}), humor: 'bem' as const, sobreDia: 'bom dia' }
		const novo = aplicarEstrutura(dia, { ...modelo.estrutura, humor: false, sobreDia: false })
		expect(novo.humor).toBe('bem')
		expect(novo.sobreDia).toBe('bom dia')
	})
})
