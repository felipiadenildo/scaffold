import { describe, expect, it } from 'vitest'
import { DESDE_SEMPRE, adicionarItem, criarLista, removerItem, renomearItem, resolverLista } from './listas'

const textos = (itens: { texto: string }[]) => itens.map((i) => i.texto)

describe('listas versionadas', () => {
	const base = criarLista(['Água', 'Remédio'])

	it('lista nova vale pra qualquer data', () => {
		expect(base.versoes).toHaveLength(1)
		expect(base.versoes[0].desde).toBe(DESDE_SEMPRE)
		expect(textos(resolverLista(base, '1999-01-01'))).toEqual(['Água', 'Remédio'])
		expect(textos(resolverLista(base, '2099-12-31'))).toEqual(['Água', 'Remédio'])
	})

	it('adicionar vale daquele dia em diante e não muda o passado', () => {
		const lista = adicionarItem(base, '2026-09-30', 'Leitura')
		expect(textos(resolverLista(lista, '2026-09-29'))).toEqual(['Água', 'Remédio'])
		expect(textos(resolverLista(lista, '2026-09-30'))).toEqual(['Água', 'Remédio', 'Leitura'])
		expect(textos(resolverLista(lista, '2026-10-15'))).toEqual(['Água', 'Remédio', 'Leitura'])
	})

	it('remover vale daquele dia em diante e não muda o passado', () => {
		const agua = base.versoes[0].itens[0]
		const lista = removerItem(base, '2026-09-30', agua.id)
		expect(textos(resolverLista(lista, '2026-09-29'))).toEqual(['Água', 'Remédio'])
		expect(textos(resolverLista(lista, '2026-09-30'))).toEqual(['Remédio'])
	})

	it('renomear mantém o id (as marcações continuam valendo)', () => {
		const agua = base.versoes[0].itens[0]
		const lista = renomearItem(base, '2026-09-30', agua.id, '2L de água')
		const hoje = resolverLista(lista, '2026-09-30')
		expect(hoje[0]).toEqual({ id: agua.id, texto: '2L de água' })
		expect(resolverLista(lista, '2026-09-29')[0].texto).toBe('Água')
	})

	it('mudança num dia alcança versões que já existiam mais à frente', () => {
		const comConsultaAmanha = adicionarItem(base, '2026-10-01', 'Consulta')
		const lista = adicionarItem(comConsultaAmanha, '2026-09-30', 'Leitura')
		expect(textos(resolverLista(lista, '2026-09-30'))).toEqual(['Água', 'Remédio', 'Leitura'])
		expect(textos(resolverLista(lista, '2026-10-01'))).toEqual(['Água', 'Remédio', 'Consulta', 'Leitura'])
	})

	it('várias edições no mesmo dia viram uma versão só', () => {
		let lista = adicionarItem(base, '2026-09-30', 'Leitura')
		lista = adicionarItem(lista, '2026-09-30', 'Sono')
		expect(lista.versoes.map((v) => v.desde)).toEqual([DESDE_SEMPRE, '2026-09-30'])
	})

	it('edição que desfaz a anterior não deixa versão sobrando', () => {
		const comLeitura = adicionarItem(base, '2026-09-30', 'Leitura')
		const leitura = resolverLista(comLeitura, '2026-09-30')[2]
		const lista = removerItem(comLeitura, '2026-09-30', leitura.id)
		expect(lista.versoes).toHaveLength(1)
	})

	it('ignora texto vazio e duplicado (sem diferenciar maiúsculas)', () => {
		expect(adicionarItem(base, '2026-09-30', '   ')).toBe(base)
		expect(adicionarItem(base, '2026-09-30', ' água ').versoes).toHaveLength(1)
		expect(renomearItem(base, '2026-09-30', base.versoes[0].itens[0].id, '')).toBe(base)
	})

	it('lista sem versões resolve vazia', () => {
		expect(resolverLista({ versoes: [] }, '2026-09-30')).toEqual([])
	})
})
