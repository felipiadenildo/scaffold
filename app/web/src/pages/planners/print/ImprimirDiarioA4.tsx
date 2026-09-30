import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobA4DoisPlanners, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { paraISO } from '../../../lib/formatarData'
import { CartoesImprimiveis } from '../../../pdf/CartoesImprimiveis'
import { useConteudoImpressao } from '../../../pdf/useConteudoImpressao'
import { useIdioma } from '../../../i18n/useIdioma'
import './imprimir.css'

// Página de fallback (link direto): imprime a folha em branco com a estrutura de hoje.
export function ImprimirDiarioA4() {
	const conteudo = useConteudoImpressao(paraISO(new Date()))
	const { t } = useIdioma()
	const [gerando, setGerando] = useState(false)

	const frenteRef = useRef<HTMLDivElement>(null)
	const versoRef = useRef<HTMLDivElement>(null)

	async function gerar() {
		if (!frenteRef.current || !versoRef.current) throw new Error('cards não montados')
		return gerarPdfBlobA4DoisPlanners(frenteRef.current, versoRef.current)
	}

	useEffect(() => {
		registrarGanchoDeTeste(gerar)
	}, [])

	async function baixarPdf() {
		setGerando(true)
		try {
			baixarBlob(await gerar(), 'scaffold-planner-diario-a4-2-planners.pdf')
		} finally {
			setGerando(false)
		}
	}

	return (
		<div className="pagina-preview">
			<button type="button" onClick={baixarPdf} disabled={gerando} className="botao-baixar no-print">
				{gerando ? t.impressao.gerando : t.impressao.baixarPdfA4}
			</button>
			<p className="no-print aviso-a4">{t.impressao.avisoA4}</p>

			<CartoesImprimiveis conteudo={conteudo} frenteRef={frenteRef} versoRef={versoRef} />
		</div>
	)
}
