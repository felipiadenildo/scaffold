// Atalhos de lista nos campos de texto livre (blocos e anotações), no espírito do Notion e do
// Google Docs, mas em texto simples: Enter numa linha que começa com "- ", "• ", "* " ou "1. "
// continua a lista na linha de baixo; Enter numa linha só com o marcador encerra a lista.
//
// Função pura: recebe o texto e a seleção, devolve o texto e o cursor novos — ou null quando o
// Enter deve seguir o comportamento normal.

const MARCADOR = /^(\s*)([-•*]|\d+[.)])\s/

export interface ResultadoAtalho {
	texto: string
	cursor: number
}

export function continuarLista(texto: string, inicioSelecao: number, fimSelecao: number): ResultadoAtalho | null {
	if (inicioSelecao !== fimSelecao) return null
	const cursor = inicioSelecao
	const inicioLinha = texto.lastIndexOf('\n', cursor - 1) + 1
	const fimLinhaBruto = texto.indexOf('\n', cursor)
	const fimLinha = fimLinhaBruto === -1 ? texto.length : fimLinhaBruto
	const linha = texto.slice(inicioLinha, fimLinha)

	const marcador = MARCADOR.exec(linha)
	if (!marcador) return null
	const [inteiro, recuo, simbolo] = marcador
	// Cursor antes do fim do marcador (ex.: no começo da linha): Enter normal.
	if (cursor - inicioLinha < inteiro.length) return null

	// Linha só com o marcador: encerra a lista, apagando o marcador.
	if (linha.slice(inteiro.length).trim() === '') {
		return { texto: texto.slice(0, inicioLinha) + texto.slice(fimLinha), cursor: inicioLinha }
	}

	const numero = /^\d+/.exec(simbolo)
	const proximo = numero ? `${Number(numero[0]) + 1}${simbolo.slice(numero[0].length)}` : simbolo
	const insercao = `\n${recuo}${proximo} `
	return {
		texto: texto.slice(0, cursor) + insercao + texto.slice(cursor),
		cursor: cursor + insercao.length,
	}
}
