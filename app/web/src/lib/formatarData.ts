function capitalizar(texto: string): string {
	return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// `locale` vem do idioma escolhido (useIdioma) — ex.: 'pt-BR', 'en-US', 'es'.

// "Terça-feira, 15 de setembro de 2026" / "Tuesday, September 15, 2026" — pra espaço sobrando
// (desktop/tablet). A ordem das partes é a de cada idioma, decidida pelo Intl.
export function formatarDataLongaComDiaSemana(data: Date, locale: string): string {
	return capitalizar(data.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
}

// "Ter, 15/09/2026" / "Tue, 09/15/2026" — pra espaço curto (celular).
export function formatarDataCurtaComDiaSemana(data: Date, locale: string): string {
	const diaSemana = data.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')
	const dataCurta = data.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
	return `${capitalizar(diaSemana)}, ${dataCurta}`
}

export function paraISO(data: Date): string {
	const ano = data.getFullYear()
	const mes = String(data.getMonth() + 1).padStart(2, '0')
	const dia = String(data.getDate()).padStart(2, '0')
	return `${ano}-${mes}-${dia}`
}

// Inverso de paraISO: "2026-09-30" → Date local (meia-noite no fuso da pessoa, não em UTC — o que
// `new Date("2026-09-30")` faria, voltando um dia no Brasil).
export function deISO(dataISO: string): Date {
	const [ano, mes, dia] = dataISO.split('-').map(Number)
	return new Date(ano, mes - 1, dia)
}

export function ehMesmoDia(a: Date, b: Date): boolean {
	return paraISO(a) === paraISO(b)
}

export function somarDias(data: Date, dias: number): Date {
	const copia = new Date(data)
	copia.setDate(copia.getDate() + dias)
	return copia
}

