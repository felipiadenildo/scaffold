import { useSyncExternalStore } from 'react'

// Aviso curto no rodapé da tela, com uma ação opcional — o padrão do Gmail ("Conversa movida para
// a lixeira · Desfazer"). Um por vez: um aviso novo substitui o anterior. Chamável de qualquer
// lugar (mostrarAviso), exibido por <Avisos /> montado uma vez em App.

export interface Aviso {
	id: number
	texto: string
	acao?: { rotulo: string; executar: () => void }
	// Fica na tela até a pessoa agir (ex.: "Nova versão disponível · Atualizar"), sem sumir sozinho.
	persistente?: boolean
}

let atual: Aviso | null = null
let proximoId = 1
const ouvintes = new Set<() => void>()

function notificar() {
	ouvintes.forEach((ouvinte) => ouvinte())
}

export function mostrarAviso(aviso: Omit<Aviso, 'id'>): void {
	atual = { ...aviso, id: proximoId++ }
	notificar()
}

export function fecharAviso(id: number): void {
	if (atual?.id !== id) return
	atual = null
	notificar()
}

function assinar(ouvinte: () => void) {
	ouvintes.add(ouvinte)
	return () => {
		ouvintes.delete(ouvinte)
	}
}

export function useAvisoAtual(): Aviso | null {
	return useSyncExternalStore(assinar, () => atual)
}
