import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobDeElementos, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { paraISO } from '../../../lib/formatarData'
import { CartoesImprimiveis } from '../../../pdf/CartoesImprimiveis'
import { useConteudoImpressao } from '../../../pdf/useConteudoImpressao'
import { useIdioma } from '../../../i18n/useIdioma'
import './imprimir.css'

// Página de fallback (link direto): imprime a folha em branco com a estrutura de hoje.
export function ImprimirDiarioA5() {
	const conteudo = useConteudoImpressao(paraISO(new Date()))
	const { t } = useIdioma()
	const [gerando, setGerando] = useState(false)

	const frenteRef = useRef<HTMLDivElement>(null)
	const versoRef = useRef<HTMLDivElement>(null)

	function elementos() {
		return [frenteRef.current, versoRef.current].filter((el): el is HTMLDivElement => el !== null)
	}

	useEffect(() => {
		registrarGanchoDeTeste(() => gerarPdfBlobDeElementos(elementos()))
	}, [])

	async function baixarPdf() {
		if (!frenteRef.current || !versoRef.current) return
		setGerando(true)
		try {
			const blob = await gerarPdfBlobDeElementos(elementos())
			baixarBlob(blob, 'scaffold-planner-diario-a5.pdf')
		} finally {
			setGerando(false)
		}
	}

	return (
		<div className="pagina-preview">
			<button type="button" onClick={baixarPdf} disabled={gerando} className="botao-baixar no-print">
				{gerando ? t.impressao.gerando : t.impressao.baixarPdf}
			</button>

			<CartoesImprimiveis conteudo={conteudo} frenteRef={frenteRef} versoRef={versoRef} />
		</div>
	)
}
