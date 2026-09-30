// Única porta de entrada para o localStorage. Tudo o que o app guarda passa por aqui, por dois
// motivos:
//
// 1. Cache em memória + ouvintes por chave: vários componentes lendo a mesma chave recebem sempre
//    o mesmo objeto e são avisados juntos quando ela muda (ver useArmazenado). Antes, cada hook
//    guardava uma cópia própria em useState — foi isso que deixava o PDF com a lista antiga.
// 2. Cada valor é salvo como um Documento com `atualizadoEm`. É o carimbo que a sincronização com
//    a nuvem (fase de login) vai usar pra decidir qual versão vence.
//
// Convenção de chaves:
//   scaffold.dados.*  → dados da pessoa (planner, listas…). É o que sobe pra nuvem com login.
//   scaffold.local.*  → preferências deste aparelho (tema, largura da folha…). Nunca sincroniza.
//   scaffold.formato  → versão do formato de armazenamento (ver migracoes.ts). Valor cru, sem Documento.

export const PREFIXO_DADOS = 'scaffold.dados.'
export const PREFIXO_LOCAL = 'scaffold.local.'

export interface Documento<T> {
	atualizadoEm: string
	dados: T
}

type Ouvinte = () => void

const cache = new Map<string, Documento<unknown> | null>()
const ouvintesPorChave = new Map<string, Set<Ouvinte>>()
const ouvintesGerais = new Set<(chave: string) => void>()

function lerDoDisco(chave: string): Documento<unknown> | null {
	try {
		const bruto = localStorage.getItem(chave)
		return bruto ? (JSON.parse(bruto) as Documento<unknown>) : null
	} catch {
		// Indisponível (modo privado, bloqueado) ou JSON corrompido: trata como ausente.
		return null
	}
}

function notificar(chave: string) {
	ouvintesPorChave.get(chave)?.forEach((ouvinte) => ouvinte())
	ouvintesGerais.forEach((ouvinte) => ouvinte(chave))
}

export function lerDocumento<T>(chave: string): Documento<T> | null {
	if (!cache.has(chave)) cache.set(chave, lerDoDisco(chave))
	return cache.get(chave) as Documento<T> | null
}

// Devolve sempre a mesma referência enquanto a chave não mudar — requisito do
// useSyncExternalStore (senão ele re-renderiza em loop).
export function ler<T>(chave: string): T | null {
	return lerDocumento<T>(chave)?.dados ?? null
}

export function salvar<T>(chave: string, dados: T, agora: Date = new Date()): void {
	const documento: Documento<T> = { atualizadoEm: agora.toISOString(), dados }
	cache.set(chave, documento)
	try {
		localStorage.setItem(chave, JSON.stringify(documento))
	} catch {
		// Quota cheia ou storage bloqueado: o valor continua valendo na memória até recarregar.
	}
	notificar(chave)
}

// Grava um documento como veio (com o `atualizadoEm` original) — pra importar um backup sem
// "rejuvenescer" os dados: a data da última alteração de verdade é o que decide o "Juntar".
export function salvarDocumento<T>(chave: string, documento: Documento<T>): void {
	cache.set(chave, documento)
	try {
		localStorage.setItem(chave, JSON.stringify(documento))
	} catch {
		// idem salvar()
	}
	notificar(chave)
}

export function remover(chave: string): void {
	cache.set(chave, null)
	try {
		localStorage.removeItem(chave)
	} catch {
		// idem salvar()
	}
	notificar(chave)
}

export function listarChaves(prefixo: string): string[] {
	try {
		return Object.keys(localStorage).filter((chave) => chave.startsWith(prefixo))
	} catch {
		return []
	}
}

export function assinar(chave: string, ouvinte: Ouvinte): () => void {
	let ouvintes = ouvintesPorChave.get(chave)
	if (!ouvintes) {
		ouvintes = new Set()
		ouvintesPorChave.set(chave, ouvintes)
	}
	ouvintes.add(ouvinte)
	return () => {
		ouvintes.delete(ouvinte)
	}
}

// Avisado a cada mudança, de qualquer chave. Sem uso ainda — é o gancho pra fila de envio da
// sincronização (fase de login) e pra exportar/importar.
export function assinarTudo(ouvinte: (chave: string) => void): () => void {
	ouvintesGerais.add(ouvinte)
	return () => {
		ouvintesGerais.delete(ouvinte)
	}
}

// Descarta o cache e força reler do disco. Usado quando o localStorage muda por fora (outra aba,
// importação) e nos testes.
export function esquecerCache(chave?: string): void {
	if (chave === undefined) cache.clear()
	else cache.delete(chave)
}

// Mudança feita em outra aba do mesmo app: o navegador dispara `storage` só nas outras abas.
// Com isso, o Planner aberto em duas abas fica em dia sozinho.
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (evento) => {
		if (evento.key === null) {
			// localStorage.clear() em outra aba
			const chaves = [...cache.keys()]
			cache.clear()
			chaves.forEach(notificar)
			return
		}
		if (!evento.key.startsWith('scaffold.')) return
		cache.delete(evento.key)
		notificar(evento.key)
	})
}
