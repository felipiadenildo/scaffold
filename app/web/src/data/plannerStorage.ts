// Única camada que sabe onde os dados do Planner realmente moram. Hoje é localStorage; quando
// existir conta de usuário, só este arquivo muda (localStorage -> chamada de API por usuário) —
// os hooks e componentes que o consomem não precisam saber a diferença.

import type { NivelHumor } from './planner'

export interface ValorSecaoArmazenado {
	tituloExtra: string
	texto: string
}

export interface DiaPlannerArmazenado {
	humor: NivelHumor['slug'] | null
	secoes: Record<string, ValorSecaoArmazenado>
	sobreDia: string
	anotacoes: string
	habitos: Record<string, boolean>
	protocolo: Record<string, boolean>
}

export type ChaveTemplate = 'secoes' | 'habitos' | 'protocolo'

const PREFIXO_DIA = 'scaffold.planner.dia.'
const CHAVES_TEMPLATE: Record<ChaveTemplate, string> = {
	secoes: 'scaffold.planner.secoes.template',
	habitos: 'scaffold.planner.habitos.template',
	protocolo: 'scaffold.planner.protocolo.template',
}

function ler<T>(chave: string): T | null {
	try {
		const bruto = localStorage.getItem(chave)
		return bruto ? (JSON.parse(bruto) as T) : null
	} catch {
		return null
	}
}

function salvar(chave: string, valor: unknown): void {
	try {
		localStorage.setItem(chave, JSON.stringify(valor))
	} catch {
		// localStorage indisponível (modo privado, quota cheia) — segue sem persistir; é só o
		// armazenamento local de hoje, não a fonte de verdade definitiva.
	}
}

export const plannerStorage = {
	getDia(dataISO: string): DiaPlannerArmazenado | null {
		return ler<DiaPlannerArmazenado>(PREFIXO_DIA + dataISO)
	},
	setDia(dataISO: string, valor: DiaPlannerArmazenado): void {
		salvar(PREFIXO_DIA + dataISO, valor)
	},
	getTemplate<T>(chave: ChaveTemplate): T | null {
		return ler<T>(CHAVES_TEMPLATE[chave])
	},
	setTemplate(chave: ChaveTemplate, valor: unknown): void {
		salvar(CHAVES_TEMPLATE[chave], valor)
	},
}
