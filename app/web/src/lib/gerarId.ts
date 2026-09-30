// UUID v4. Não usa crypto.randomUUID() de propósito: ele só existe em contexto seguro (HTTPS ou
// localhost), e o app é testado no celular pelo IP da rede local (http://192.168...), onde ele é
// undefined. crypto.getRandomValues funciona em qualquer contexto.
export function gerarId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16))
	bytes[6] = (bytes[6] & 0x0f) | 0x40
	bytes[8] = (bytes[8] & 0x3f) | 0x80
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
