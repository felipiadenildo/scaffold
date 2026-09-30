// Gera as capturas de tela e o GIF usados nos READMEs (docs/screenshots/). Preenche um dia de
// exemplo pela própria interface (como uma pessoa faria), então as imagens sempre refletem o app de
// verdade. As capturas são em português; os READMEs em inglês e espanhol usam as mesmas.
//
// Uso: npm run dev (num terminal) + npm run capturas (em outro). Precisa de um Chrome/Chromium
// (CHROME_PATH, ou os caminhos comuns) e do ImageMagick (`magick`) pra montar os GIFs.

import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pt as dic } from '../src/i18n/pt.ts'

const CAMINHOS_CHROME = [
	'/usr/bin/google-chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	join(homedir(), '.cache/ms-playwright/chromium-1243/chrome-linux64/chrome'),
]
const executablePath = process.env.CHROME_PATH ?? CAMINHOS_CHROME.find((p) => existsSync(p))
if (!executablePath) {
	console.error('Não achei um Chrome instalado. Defina CHROME_PATH=/caminho/do/chrome e rode de novo.')
	process.exit(1)
}

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173'
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const SAIDA = join(RAIZ, 'docs/screenshots')

// O dia de exemplo: realista, curto, no tom do manual.
const EXEMPLO = {
	tituloExtra: 'Consulta 10h',
	blocos: [
		'Remédio com o café.\nSeparar a roupa de amanhã e deixar na cadeira.',
		'Terminar o relatório (só a parte 1).\nLigar pro dentista.',
		'Caminhada de 15 min.\nResponder os 3 e-mails que importam.',
		'Janta pronta do freezer.\nCelular longe da cama.',
	],
	sobreDia: 'Terminei a parte 1 do relatório sem adiar!',
	anotacoes: 'Ideia: deixar a garrafa de água na mesa, à vista.',
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

// Só elementos visíveis: a folha tem cópias escondidas (a da impressão, fora da tela, com
// aria-hidden) com os mesmos rótulos.
async function visiveis(page, seletor) {
	const todos = await page.$$(seletor)
	const resultado = []
	for (const el of todos) {
		const escondido = await el.evaluate((e) => !!e.closest('[aria-hidden="true"]'))
		if (!escondido && (await el.isVisible())) resultado.push(el)
	}
	return resultado
}

async function clicarBotao(page, texto) {
	const [el] = await visiveis(page, `xpath/.//button[contains(normalize-space(.), ${JSON.stringify(texto)})]`)
	if (!el) throw new Error(`Botão não encontrado: ${texto}`)
	await el.evaluate((e) => e.click())
	await esperar(600)
}

async function clicarRotulo(page, rotulo) {
	const [el] = await visiveis(page, `button[aria-label=${JSON.stringify(rotulo)}]`)
	if (!el) throw new Error(`Botão não encontrado (aria-label): ${rotulo}`)
	await el.evaluate((e) => e.click())
	await esperar(600)
}

async function escrever(page, seletor, texto, indice = 0) {
	const campos = await visiveis(page, seletor)
	const campo = campos[indice]
	if (!campo) throw new Error(`Campo não encontrado: ${seletor} [${indice}]`)
	await campo.click()
	await campo.type(texto)
}

// Captura quadros enquanto `acao` roda e monta um GIF com o ImageMagick.
async function gravarGif(page, arquivo, acao, { largura = 720, fps = 12 } = {}) {
	const pasta = mkdtempSync(join(tmpdir(), 'scaffold-gif-'))
	let n = 0
	let gravando = true
	const loop = (async () => {
		while (gravando) {
			await page.screenshot({ path: join(pasta, `q${String(n++).padStart(4, '0')}.png`) })
			await esperar(1000 / fps / 2)
		}
	})()
	await acao()
	gravando = false
	await loop
	execFileSync('magick', [
		'-delay', String(Math.round(100 / fps)),
		'-loop', '0',
		join(pasta, 'q*.png'),
		'-resize', `${largura}x`,
		'-dither', 'None',
		'-colors', '128',
		'-layers', 'OptimizeFrame',
		arquivo,
	])
	rmSync(pasta, { recursive: true, force: true })
}

async function capturar(browser) {
	const { tituloExtra, blocos, sobreDia, anotacoes } = EXEMPLO
	mkdirSync(SAIDA, { recursive: true })
	const arquivo = (nome) => join(SAIDA, nome)
	const page = await browser.newPage()

	// 1. Catálogo
	await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 })
	await page.goto(`${URL_BASE}/`, { waitUntil: 'networkidle0' })
	await page.evaluateHandle('document.fonts.ready')
	await esperar(500)
	await page.screenshot({ path: arquivo('catalogo.webp'), type: 'webp', quality: 85 })

	// 2. Primeiro acesso: escolha do modelo
	await page.goto(`${URL_BASE}/planners/diario`, { waitUntil: 'networkidle0' })
	await esperar(800)
	await clicarBotao(page, dic.planner.boasVindas.comecar)
	await page.screenshot({ path: arquivo('modelos.webp'), type: 'webp', quality: 85 })
	await clicarBotao(page, dic.planner.folhaInexistente.recomendado)

	// 3. Preenche o dia pela interface: frente…
	await esperar(1000)
	await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
	await escrever(page, `input[placeholder=${JSON.stringify(dic.planner.tituloExtraPlaceholder)}]`, tituloExtra, 1)
	for (const [i, texto] of blocos.entries()) {
		await escrever(page, `textarea[placeholder=${JSON.stringify(dic.planner.escrevaAqui)}]`, texto, i)
	}
	await escrever(page, `input[placeholder=${JSON.stringify(dic.planner.sobreODiaPlaceholder)}]`, sobreDia)
	await page.evaluate(() => document.activeElement?.blur())
	await clicarRotulo(page, dic.planner.humores.bem)
	// …e verso
	await clicarRotulo(page, dic.planner.verVerso)
	await esperar(800)
	await escrever(page, `textarea[placeholder=${JSON.stringify(dic.planner.anotacoesPlaceholder)}]`, anotacoes)
	await page.evaluate(() => document.activeElement?.blur())
	const caixas = await visiveis(page, 'input[type="checkbox"]')
	for (const i of [0, 1, 3, 5, 6]) await caixas[i]?.evaluate((e) => e.click())
	await clicarRotulo(page, dic.planner.verFrente)

	// 4. Folha que vira (GIF): frente → verso → frente
	await page.evaluate(() => window.scrollTo(0, 0))
	await esperar(800)
	await gravarGif(page, arquivo('virar-folha.gif'), async () => {
		await esperar(900)
		await clicarRotulo(page, dic.planner.verVerso)
		await esperar(1800)
		await clicarRotulo(page, dic.planner.verFrente)
		await esperar(1500)
	})

	// 5. Frente e verso lado a lado, claro e escuro
	await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 })
	await clicarRotulo(page, dic.planner.modoVisualizacao)
	await clicarRotulo(page, dic.planner.ajustarLargura)
	await page.evaluate(() => window.scrollTo(0, 0))
	await esperar(800)
	await page.screenshot({ path: arquivo('planner.webp'), type: 'webp', quality: 85, fullPage: true })
	await clicarRotulo(page, dic.tema.paraEscuro).catch(() => clicarBotao(page, dic.tema.escuro))
	await esperar(600)
	await page.screenshot({ path: arquivo('planner-escuro.webp'), type: 'webp', quality: 85, fullPage: true })
	await clicarRotulo(page, dic.tema.paraClaro).catch(() => clicarBotao(page, dic.tema.claro))

	// 6. Impressão
	await clicarRotulo(page, dic.impressao.imprimir)
	await esperar(1500)
	await page.screenshot({ path: arquivo('impressao.webp'), type: 'webp', quality: 85 })
	await page.keyboard.press('Escape')

	// 7. Celular
	await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
	await page.reload({ waitUntil: 'networkidle0' })
	await esperar(800)
	await page.screenshot({ path: arquivo('celular.webp'), type: 'webp', quality: 85 })

	await page.close()
	console.log(`✓ capturas em ${SAIDA}`)
}

const browser = await puppeteer.launch({ executablePath, headless: true })
try {
	await capturar(browser)
} finally {
	await browser.close()
}
