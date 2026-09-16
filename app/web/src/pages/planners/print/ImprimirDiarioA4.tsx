import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobA4DoisPlanners, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { CartoesImprimiveis } from '../../../pdf/CartoesImprimiveis'
import './imprimir.css'

export function ImprimirDiarioA4() {
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
				{gerando ? 'Gerando…' : 'Baixar PDF (A4, 2 planners)'}
			</button>
			<p className="no-print aviso-a4">
				A folha sai deitada: a página 1 tem as duas frentes lado a lado, a página 2 os dois versos — corte ao
				meio e cada metade vira um planner A5 completo.
			</p>

			<CartoesImprimiveis frenteRef={frenteRef} versoRef={versoRef} />
		</div>
	)
}
