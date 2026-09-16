import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobDeElementos, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { semAcaoImpressao, useConteudoImpressao } from '../../../pdf/useConteudoImpressao'
import { FrenteDiario } from '../FrenteDiario'
import { VersoDiario } from '../VersoDiario'
import './imprimir.css'

// Mesma classe do card usado na tela (ver faceClasseBase em FolhaFlip.tsx) — o PDF é uma captura
// desse elemento exatamente como ele aparece (cantos, sombra, textura), só sem placeholder.
const CLASSE_CARD =
	'folha-imprimir paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-8 text-paper-ink shadow-paper'

export function ImprimirDiarioA5() {
	const { secoes, habitos, protocolo, valoresSecoesVazios, humorVazio } = useConteudoImpressao()
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
				{gerando ? 'Gerando…' : 'Baixar PDF'}
			</button>

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
