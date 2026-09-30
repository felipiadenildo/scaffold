import { PREFIXO_DADOS, lerDocumento, listarChaves, remover, salvarDocumento, type Documento } from './armazenamento'
import { FORMATO_ATUAL } from './migracoes'

// Backup dos dados da pessoa (tudo em scaffold.dados.* — planner, modelos, listas) num arquivo
// JSON. As preferências do aparelho (scaffold.local.*: tema, idioma…) ficam de fora: são do
// aparelho, não da pessoa.

export interface Backup {
	app: 'scaffold'
	formato: number
	exportadoEm: string
	versaoApp: string
	documentos: Record<string, Documento<unknown>>
}

export type ErroBackup = 'naoEBackup' | 'formatoMaisNovo'

export function montarBackup(agora: Date = new Date(), versaoApp = ''): Backup {
	const documentos: Record<string, Documento<unknown>> = {}
	for (const chave of listarChaves(PREFIXO_DADOS).sort()) {
		const documento = lerDocumento(chave)
		if (documento) documentos[chave] = documento
	}
	return { app: 'scaffold', formato: FORMATO_ATUAL, exportadoEm: agora.toISOString(), versaoApp, documentos }
}

function ehDocumento(valor: unknown): valor is Documento<unknown> {
	return typeof valor === 'object' && valor !== null && 'atualizadoEm' in valor && 'dados' in valor
}

// Confere o arquivo antes de tocar em qualquer dado. Só aceita chaves de dados do Scaffold.
export function lerBackup(texto: string): { backup: Backup } | { erro: ErroBackup } {
	let conteudo: unknown
	try {
		conteudo = JSON.parse(texto)
	} catch {
		return { erro: 'naoEBackup' }
	}
	const b = conteudo as Partial<Backup>
	if (b?.app !== 'scaffold' || typeof b.formato !== 'number' || typeof b.documentos !== 'object' || !b.documentos) {
		return { erro: 'naoEBackup' }
	}
	// Feito por uma versão mais nova do app, com dados num formato que esta ainda não conhece.
	if (b.formato > FORMATO_ATUAL) return { erro: 'formatoMaisNovo' }
	const documentos = Object.fromEntries(
		Object.entries(b.documentos).filter(([chave, doc]) => chave.startsWith(PREFIXO_DADOS) && ehDocumento(doc)),
	)
	return { backup: { ...(b as Backup), documentos } }
}

export function resumirBackup(backup: Backup): { dias: number; modelos: number } {
	const chaves = Object.keys(backup.documentos)
	const modelos = backup.documentos[`${PREFIXO_DADOS}planner.modelos`]?.dados
	return {
		dias: chaves.filter((c) => c.startsWith(`${PREFIXO_DADOS}planner.dia.`)).length,
		modelos: Array.isArray(modelos) ? modelos.length : 0,
	}
}

// substituir: o aparelho fica exatamente com o que está no arquivo (o resto dos dados some).
// juntar: pra cada dia/modelo/lista, fica a versão alterada por último — do arquivo ou do aparelho.
// Nada do aparelho é apagado ao juntar.
export function aplicarBackup(backup: Backup, modo: 'substituir' | 'juntar'): void {
	if (modo === 'substituir') {
		for (const chave of listarChaves(PREFIXO_DADOS)) if (!(chave in backup.documentos)) remover(chave)
	}
	for (const [chave, documento] of Object.entries(backup.documentos)) {
		const atual = lerDocumento(chave)
		if (modo === 'substituir' || !atual || documento.atualizadoEm > atual.atualizadoEm) {
			salvarDocumento(chave, documento)
		}
	}
}
