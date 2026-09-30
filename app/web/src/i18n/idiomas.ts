// Idiomas da interface. Só a interface é traduzida: o que a pessoa escreve nunca é tocado, e o
// conteúdo das ferramentas em teste fica em português por enquanto (ver PLANO-FASE-0.md §1).

export const IDIOMAS = ['pt', 'en', 'es'] as const
export type Idioma = (typeof IDIOMAS)[number]

// Locale usado pelo Intl (datas). pt é pt-BR porque o público de origem é brasileiro.
export const LOCALE: Record<Idioma, string> = { pt: 'pt-BR', en: 'en-US', es: 'es' }

// Cada idioma escrito no próprio idioma — quem caiu no idioma errado reconhece o seu na lista.
export const NOME_DO_IDIOMA: Record<Idioma, string> = { pt: 'Português', en: 'English', es: 'Español' }

export function ehIdioma(valor: unknown): valor is Idioma {
	return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor)
}

// Primeiro idioma da lista de preferência do navegador que o app conhece ("es-MX" → es).
// Nenhum conhecido: português.
export function detectarIdioma(preferencias: readonly string[]): Idioma {
	for (const preferencia of preferencias) {
		const base = preferencia.toLowerCase().split('-')[0]
		if (ehIdioma(base)) return base
	}
	return 'pt'
}
