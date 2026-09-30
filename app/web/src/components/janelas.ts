import { useSyncExternalStore } from 'react'

// Janelas que podem ser abertas de vários lugares (menu do cabeçalho, barra do Planner, ⋯ do
// celular) e são mostradas por <JanelasGlobais /> em App — uma de cada vez.
export type JanelaGlobal = 'dados' | 'instalarIos'

let aberta: JanelaGlobal | null = null
const ouvintes = new Set<() => void>()
const notificar = () => ouvintes.forEach((ouvinte) => ouvinte())

export function abrirJanela(janela: JanelaGlobal): void {
	aberta = janela
	notificar()
}

export function fecharJanela(): void {
	aberta = null
	notificar()
}

function assinar(ouvinte: () => void) {
	ouvintes.add(ouvinte)
	return () => {
		ouvintes.delete(ouvinte)
	}
}

export function useJanelaAberta(): JanelaGlobal | null {
	return useSyncExternalStore(assinar, () => aberta)
}
