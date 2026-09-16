import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobA4DoisPlanners, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { semAcaoImpressao, useConteudoImpressao } from '../../../pdf/useConteudoImpressao'
import { FrenteDiario } from '../FrenteDiario'
import { VersoDiario } from '../VersoDiario'
import './imprimir.css'

// Mesma classe do card da tela — só uma cópia de cada lado é renderizada aqui; o PDF desenha essa
// mesma captura duas vezes lado a lado na folha A4 (ver gerarPdfBlobA4DoisPlanners).
const CLASSE_CARD =
	'folha-imprimir paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-8 text-paper-ink shadow-paper'

export function ImprimirDiarioA4() {
	const { secoes, habitos, protocolo, valoresSecoesVazios, humorVazio } = useConteudoImpressao()
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

			<div ref={frenteRef} className={CLASSE_CARD} style={{ width: '640px', aspectRatio: '148 / 210' }}>
				<FrenteDiario
					modoImpressao
					data={new Date()}
					onDataChange={semAcaoImpressao}
					modoEdicao={false}
					onToggleModo={semAcaoImpressao}
					humor={humorVazio}
					onHumorChange={semAcaoImpressao}
					secoesTemplate={secoes}
					onRenomearSecao={semAcaoImpressao}
					valoresSecoes={valoresSecoesVazios}
					onValorSecaoChange={semAcaoImpressao}
					sobreDia=""
					onSobreDiaChange={semAcaoImpressao}
					somenteLeitura
				/>
			</div>

			<div ref={versoRef} className={CLASSE_CARD} style={{ width: '640px', aspectRatio: '148 / 210' }}>
				<VersoDiario
					modoImpressao
					anotacoes=""
					onAnotacoesChange={semAcaoImpressao}
					habitos={habitos}
					onHabitosChange={semAcaoImpressao}
					habitosMarcados={{}}
					onHabitosMarcadosChange={semAcaoImpressao}
					protocolo={protocolo}
					onProtocoloChange={semAcaoImpressao}
					protocoloMarcados={{}}
					onProtocoloMarcadosChange={semAcaoImpressao}
					somenteLeitura
				/>
			</div>
		</div>
	)
}
