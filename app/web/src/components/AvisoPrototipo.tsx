import { useIdioma } from '../i18n/useIdioma'

// Faixa fixa no topo de todas as telas: o app é um protótipo de conceito, sem validação, e o projeto
// está pausado (30/09/2026). Não fecha de propósito, pra ninguém perder tempo usando de verdade.
export function AvisoPrototipo() {
	const { t } = useIdioma()
	return (
		<div role="note" className="sticky top-0 z-40 bg-ink px-4 py-2 text-center text-xs leading-snug text-bg print:hidden sm:text-sm">
			<strong className="font-semibold">{t.app.prototipo.titulo}</strong> {t.app.prototipo.texto}
		</div>
	)
}
