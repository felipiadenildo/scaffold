// Gera o PDF capturando a folha de impressão montada com os mesmos componentes da tela
// (CartoesImprimiveis — visual de papel branco, sem textura nem sombra) em vez de recriar o layout
// num sistema de desenho separado. html2canvas-pro é o
// fork mantido que entende cores oklch() (o Tailwind v4 gera cor nesse formato; o html2canvas
// original, sem manutenção, não suporta e quebraria aqui).
import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

const LARGURA_A5_MM = 148
const ALTURA_A5_MM = 210
const LARGURA_A4_MM = 297
const ALTURA_A4_MM = 210
const MARGEM_MM = 5
const VAO_CORTE_MM = 8

// Largura maior que qualquer breakpoint `sm:` usado nos cards (640px) — sem isso, o html2canvas
// clona a página numa janela do tamanho da tela real do dispositivo pra fazer a captura. Num
// celular (~390px), toda classe `sm:` da árvore (grid do habit tracker, aspect-ratio, padding
// etc.) fica inativa DENTRO dessa clonagem, mesmo o card tendo largura fixa em px — `sm:` é
// media query de viewport, não do elemento. O PDF saía sem esses estilos. 1024px força a
// simulação de uma janela desktop na captura, não na tela real da pessoa.
const LARGURA_JANELA_CAPTURA = 1024

// O jsPDF grava a imagem SEM compressão por padrão — era isso que deixava o PDF com ~18 MB (a
// imagem crua da folha, pixel a pixel). 'FAST' = compressão sem perda (a mesma do PNG), rápida.
const COMPRESSAO = 'FAST'

export interface OpcoesCaptura {
	pretoEBranco?: boolean
	// Folha sem textura de papel ("economizar tinta"): fundo liso → PNG (sem perda, texto nítido).
	// Com a textura (padrão), o "ruído" do papel quase não comprime sem perda (~2 MB); JPEG em alta
	// qualidade é o formato feito pra esse tipo de imagem (~10× menor, sem diferença visível impressa).
	semTextura?: boolean
}

// Imagem da captura pronta pro jsPDF, no formato certo pra folha.
function imagemParaPdf(canvas: HTMLCanvasElement, { semTextura = false }: OpcoesCaptura) {
	return semTextura
		? { dados: canvas.toDataURL('image/png'), formato: 'PNG' as const }
		: { dados: canvas.toDataURL('image/jpeg', 0.9), formato: 'JPEG' as const }
}

// Tons de cinza pela luminância (pesos do olho humano pra R, G e B), direto nos pixels da captura —
// o html2canvas não aplica `filter: grayscale()` do CSS.
function converterParaCinza(canvas: HTMLCanvasElement) {
	const contexto = canvas.getContext('2d')
	if (!contexto) return
	const imagem = contexto.getImageData(0, 0, canvas.width, canvas.height)
	const pixels = imagem.data
	for (let i = 0; i < pixels.length; i += 4) {
		const cinza = Math.round(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114)
		pixels[i] = pixels[i + 1] = pixels[i + 2] = cinza
	}
	contexto.putImageData(imagem, 0, 0)
}

async function capturarElemento(elemento: HTMLElement, { pretoEBranco = false }: OpcoesCaptura = {}) {
	const canvas = await capturarBruto(elemento)
	if (pretoEBranco) converterParaCinza(canvas)
	return canvas
}

async function capturarBruto(elemento: HTMLElement) {
	return html2canvas(elemento, {
		scale: 2,
		// Fundo branco (não transparente): sem canal de transparência, a imagem no PDF fica bem menor.
		backgroundColor: '#ffffff',
		windowWidth: LARGURA_JANELA_CAPTURA,
		windowHeight: Math.max(window.innerHeight, elemento.scrollHeight + 200),
	})
}

// Ajusta a imagem numa caixa disponível (largura x altura), mantendo proporção, e devolve o
// tamanho final + o deslocamento pra centralizar dentro dessa caixa.
function ajustarNaCaixa(proporcaoImagem: number, larguraCaixa: number, alturaCaixa: number) {
	let largura = larguraCaixa
	let altura = largura / proporcaoImagem
	if (altura > alturaCaixa) {
		altura = alturaCaixa
		largura = altura * proporcaoImagem
	}
	return { largura, altura, offsetX: (larguraCaixa - largura) / 2, offsetY: (alturaCaixa - altura) / 2 }
}

// A5 — uma folha por página (frente, depois verso), com respiro em volta pra não ficar
// encostado na borda do papel.
export async function gerarPdfBlobDeElementos(elementos: HTMLElement[], opcoes: OpcoesCaptura = {}): Promise<Blob> {
	const doc = new jsPDF({ unit: 'mm', format: 'a5' })
	const larguraDisponivel = LARGURA_A5_MM - MARGEM_MM * 2
	const alturaDisponivel = ALTURA_A5_MM - MARGEM_MM * 2

	for (let i = 0; i < elementos.length; i++) {
		const canvas = await capturarElemento(elementos[i], opcoes)
		const { dados, formato } = imagemParaPdf(canvas, opcoes)
		if (i > 0) doc.addPage('a5', 'portrait')

		const { largura, altura, offsetX, offsetY } = ajustarNaCaixa(canvas.width / canvas.height, larguraDisponivel, alturaDisponivel)
		doc.addImage(dados, formato, MARGEM_MM + offsetX, MARGEM_MM + offsetY, largura, altura, undefined, COMPRESSAO)
	}

	return doc.output('blob')
}

// A4 deitado — 2 planners por folha: página 1 com as duas frentes lado a lado, página 2 com os
// dois versos. Corta ao meio (linha pontilhada) e cada metade vira um planner A5 completo.
export async function gerarPdfBlobA4DoisPlanners(
	elementoFrente: HTMLElement,
	elementoVerso: HTMLElement,
	opcoes: OpcoesCaptura = {},
): Promise<Blob> {
	const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' })
	const larguraColuna = (LARGURA_A4_MM - MARGEM_MM * 2 - VAO_CORTE_MM) / 2
	const alturaDisponivel = ALTURA_A4_MM - MARGEM_MM * 2

	// `apelido`: a mesma imagem entra uma vez só no arquivo e é reaproveitada nas duas metades
	// (sem ele, o jsPDF gravava a imagem duas vezes por página).
	async function desenharPar(elemento: HTMLElement, apelido: string) {
		const canvas = await capturarElemento(elemento, opcoes)
		const { dados, formato } = imagemParaPdf(canvas, opcoes)
		const { largura, altura, offsetX, offsetY } = ajustarNaCaixa(canvas.width / canvas.height, larguraColuna, alturaDisponivel)

		const y = MARGEM_MM + offsetY
		const xEsquerda = MARGEM_MM + offsetX
		const xDireita = LARGURA_A4_MM - MARGEM_MM - larguraColuna + offsetX
		doc.addImage(dados, formato, xEsquerda, y, largura, altura, apelido, COMPRESSAO)
		doc.addImage(dados, formato, xDireita, y, largura, altura, apelido, COMPRESSAO)

		// Guia de corte pontilhada no meio da folha.
		doc.setDrawColor(180, 170, 150)
		doc.setLineDashPattern([2, 2], 0)
		doc.line(LARGURA_A4_MM / 2, MARGEM_MM / 2, LARGURA_A4_MM / 2, ALTURA_A4_MM - MARGEM_MM / 2)
	}

	await desenharPar(elementoFrente, 'frente')
	doc.addPage('a4', 'landscape')
	await desenharPar(elementoVerso, 'verso')

	return doc.output('blob')
}

export function baixarBlob(blob: Blob, nomeArquivo: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = nomeArquivo
	a.click()
	URL.revokeObjectURL(url)
}

function blobParaBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const leitor = new FileReader()
		leitor.onloadend = () => {
			const resultado = leitor.result as string
			resolve(resultado.split(',')[1] ?? '')
		}
		leitor.onerror = reject
		leitor.readAsDataURL(blob)
	})
}

// Só pra validação automatizada local (script Puppeteer) recuperar os bytes do PDF sem precisar
// simular clique em link de download.
declare global {
	interface Window {
		__testarCapturaPdfBase64?: () => Promise<string>
	}
}

export function registrarGanchoDeTeste(gerar: () => Promise<Blob>) {
	window.__testarCapturaPdfBase64 = async () => blobParaBase64(await gerar())
}
