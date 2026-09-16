function capitalizar(texto: string): string {
	return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function formatarDataLonga(data: Date): string {
	return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatarDataCurta(data: Date): string {
	return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// "Terça-feira, 15 de setembro de 2026" — pra espaço sobrando (desktop/tablet).
export function formatarDataLongaComDiaSemana(data: Date): string {
	const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' })
	return `${capitalizar(diaSemana)}, ${formatarDataLonga(data)}`
}

// "Ter, 15/09/2026" — pra espaço curto (celular).
export function formatarDataCurtaComDiaSemana(data: Date): string {
	const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
	return `${capitalizar(diaSemana)}, ${formatarDataCurta(data)}`
}

export function paraISO(data: Date): string {
	const ano = data.getFullYear()
	const mes = String(data.getMonth() + 1).padStart(2, '0')
	const dia = String(data.getDate()).padStart(2, '0')
	return `${ano}-${mes}-${dia}`
}

export function ehMesmoDia(a: Date, b: Date): boolean {
	return paraISO(a) === paraISO(b)
}

export function somarDias(data: Date, dias: number): Date {
	const copia = new Date(data)
	copia.setDate(copia.getDate() + dias)
	return copia
}

