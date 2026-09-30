import { gerarId } from '../../lib/gerarId'
import type { ItemLista, ListaVersionada, VersaoLista } from './tipos'

// Hábitos e "não pode deixar de fazer": cada mudança vale "daquele dia em diante". Funciona como
// um histórico de versões por data — o dia D mostra a última versão com `desde` <= D. Mexer na
// lista no dia D aplica a mesma operação em todas as versões a partir de D (inclusive as que já
// existiam mais à frente), e nunca nas anteriores: o passado não muda.

// Versão-base: vale pra qualquer data, inclusive dias criados antes da primeira edição.
export const DESDE_SEMPRE = '0000-01-01'

export function criarLista(textos: string[]): ListaVersionada {
	return { versoes: [{ desde: DESDE_SEMPRE, itens: textos.map((texto) => ({ id: gerarId(), texto })) }] }
}

export function resolverLista(lista: ListaVersionada, data: string): ItemLista[] {
	let itens = lista.versoes[0]?.itens ?? []
	for (const versao of lista.versoes) {
		if (versao.desde > data) break
		itens = versao.itens
	}
	return itens
}

function mesmosItens(a: ItemLista[], b: ItemLista[]): boolean {
	return a.length === b.length && a.every((item, i) => item.id === b[i].id && item.texto === b[i].texto)
}

// Versão igual à anterior não acrescenta nada — some. A primeira sempre fica.
function compactar(versoes: VersaoLista[]): VersaoLista[] {
	return versoes.filter((versao, i) => i === 0 || !mesmosItens(versao.itens, versoes[i - 1].itens))
}

function aplicarDaDataEmDiante(
	lista: ListaVersionada,
	data: string,
	operacao: (itens: ItemLista[]) => ItemLista[],
): ListaVersionada {
	const versoes = lista.versoes.some((v) => v.desde === data)
		? lista.versoes
		: [...lista.versoes, { desde: data, itens: resolverLista(lista, data) }].sort((a, b) => a.desde.localeCompare(b.desde))

	return {
		versoes: compactar(versoes.map((v) => (v.desde >= data ? { ...v, itens: operacao(v.itens) } : v))),
	}
}

function normalizar(texto: string): string {
	return texto.trim().toLocaleLowerCase()
}

export function adicionarItem(lista: ListaVersionada, data: string, texto: string): ListaVersionada {
	const limpo = texto.trim()
	if (!limpo) return lista
	const novo: ItemLista = { id: gerarId(), texto: limpo }
	// Versão futura que já tem um item com o mesmo texto não ganha um duplicado.
	return aplicarDaDataEmDiante(lista, data, (itens) =>
		itens.some((i) => normalizar(i.texto) === normalizar(limpo)) ? itens : [...itens, novo],
	)
}

export function removerItem(lista: ListaVersionada, data: string, id: string): ListaVersionada {
	return aplicarDaDataEmDiante(lista, data, (itens) => itens.filter((i) => i.id !== id))
}

export function renomearItem(lista: ListaVersionada, data: string, id: string, texto: string): ListaVersionada {
	const limpo = texto.trim()
	if (!limpo) return lista
	return aplicarDaDataEmDiante(lista, data, (itens) => itens.map((i) => (i.id === id ? { ...i, texto: limpo } : i)))
}
