import { useSyncExternalStore } from 'react'

// "Instalar app" (PWA). Dois caminhos, porque os navegadores não concordam:
// - Chrome/Edge/Android: o navegador avisa que dá pra instalar (evento `beforeinstallprompt`); o app
//   guarda o evento e, quando a pessoa toca em "Instalar app", abre a janela nativa de instalação.
// - iPhone/iPad (Safari): não existe esse evento nem botão; só dá pela mão (Compartilhar →
//   Adicionar à Tela de Início) — o app mostra esses passos numa janela.
// Os ouvintes são registrados já na carga do módulo (importado em main.tsx): o evento pode chegar
// antes de qualquer componente existir.

interface EventoInstalacao extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let eventoGuardado: EventoInstalacao | null = null
let instaladoAgora = false
const ouvintes = new Set<() => void>()
const notificar = () => ouvintes.forEach((ouvinte) => ouvinte())

if (typeof window !== 'undefined') {
	window.addEventListener('beforeinstallprompt', (evento) => {
		// Sem isso o Chrome mostra a própria faixa de instalação; o app oferece no menu, na hora certa.
		evento.preventDefault()
		eventoGuardado = evento as EventoInstalacao
		notificar()
	})
	window.addEventListener('appinstalled', () => {
		eventoGuardado = null
		instaladoAgora = true
		notificar()
	})
}

function rodandoComoApp(): boolean {
	return (
		instaladoAgora ||
		window.matchMedia('(display-mode: standalone)').matches ||
		// Safari do iPhone, aberto pela tela inicial.
		(navigator as Navigator & { standalone?: boolean }).standalone === true
	)
}

// iPad no iOS 13+ se apresenta como Mac; o toque denuncia.
function ehIos(): boolean {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
}

type Instalacao = { forma: 'nenhuma' } | { forma: 'nativa' } | { forma: 'ios' }

let ultimo: Instalacao = { forma: 'nenhuma' }
function calcular(): Instalacao {
	const forma = rodandoComoApp() ? 'nenhuma' : eventoGuardado ? 'nativa' : ehIos() ? 'ios' : 'nenhuma'
	// Mesma referência enquanto não muda (requisito do useSyncExternalStore).
	if (forma !== ultimo.forma) ultimo = { forma }
	return ultimo
}

function assinar(ouvinte: () => void) {
	ouvintes.add(ouvinte)
	return () => {
		ouvintes.delete(ouvinte)
	}
}

// forma 'nenhuma' = já instalado, ou navegador que não oferece instalação: o item some do menu.
export function useInstalacao(): Instalacao {
	return useSyncExternalStore(assinar, calcular)
}

export async function instalarNativo(): Promise<void> {
	if (!eventoGuardado) return
	const evento = eventoGuardado
	await evento.prompt()
	await evento.userChoice
	// O evento só pode ser usado uma vez.
	eventoGuardado = null
	notificar()
}
