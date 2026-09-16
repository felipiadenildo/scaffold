// Valida a geração dos PDFs do Planner (A5 e A4) localmente, sem tocar em nada do Cloudflare.
// Usa puppeteer-core + o Chrome já instalado na máquina pra chamar o mesmo gancho de captura
// (html2canvas-pro + jsPDF) que os botões "Baixar PDF" das páginas usam — só recupera os bytes em
// vez de simular um clique de download.
//
// Uso: npm run dev (num terminal) + node scripts/testar-impressao-a5.mjs (em outro)

import puppeteer from 'puppeteer-core'
import { existsSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CAMINHOS_CHROME = [
	'/usr/bin/google-chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const executablePath = process.env.CHROME_PATH ?? CAMINHOS_CHROME.find((p) => existsSync(p))
if (!executablePath) {
	console.error('Não achei um Chrome instalado. Defina CHROME_PATH=/caminho/do/chrome e rode de novo.')
	process.exit(1)
}

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173'

async function gerar(browser, caminho, nomeSaida) {
	const page = await browser.newPage()
	await page.setViewport({ width: 900, height: 1400 })
	await page.goto(`${URL_BASE}${caminho}`, { waitUntil: 'networkidle0' })
	await page.evaluateHandle('document.fonts.ready')
	await new Promise((r) => setTimeout(r, 300))

	const base64 = await page.evaluate(() => window.__testarCapturaPdfBase64())
	const saida = join(tmpdir(), nomeSaida)
	writeFileSync(saida, Buffer.from(base64, 'base64'))
	console.log('PDF gerado em:', saida)
	await page.close()
}

const browser = await puppeteer.launch({ executablePath, headless: true })
try {
	await gerar(browser, '/planners/diario/imprimir-a5', 'planner-diario-a5-teste.pdf')
	await gerar(browser, '/planners/diario/imprimir-a4', 'planner-diario-a4-teste.pdf')
} finally {
	await browser.close()
}
