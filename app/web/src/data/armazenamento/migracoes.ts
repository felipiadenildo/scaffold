import { esquecerCache } from './armazenamento'

// Versão do formato do que está salvo no aparelho. Sobe sempre que a forma dos dados muda de um
// jeito que o código novo não sabe ler; cada subida ganha uma migração abaixo. Roda uma vez, em
// main.tsx, antes do primeiro render.
const CHAVE_FORMATO = 'scaffold.formato'
export const FORMATO_ATUAL = 2

const migracoes: Record<number, () => void> = {
	// 1 → 2: o formato 1 (chaves scaffold.planner.*, itens identificados pelo texto) era do protótipo,
	// sem ninguém usando de verdade — descartado em vez de convertido (decisão em app/PLANO-FASE-0.md).
	2: () => {
		Object.keys(localStorage)
			.filter((chave) => chave.startsWith('scaffold.planner.'))
			.forEach((chave) => localStorage.removeItem(chave))
	},
}

export function migrarArmazenamento(): void {
	try {
		const salvo = Number(localStorage.getItem(CHAVE_FORMATO) ?? '1')
		const atual = Number.isFinite(salvo) ? salvo : 1
		for (let versao = atual + 1; versao <= FORMATO_ATUAL; versao++) migracoes[versao]?.()
		if (atual !== FORMATO_ATUAL) localStorage.setItem(CHAVE_FORMATO, String(FORMATO_ATUAL))
	} catch {
		// localStorage indisponível: nada a migrar.
	}
	esquecerCache()
}
