import { useEffect, useRef, useState } from 'react'
import { baixarBlob, gerarPdfBlobA4DoisPlanners, registrarGanchoDeTeste } from '../../../pdf/capturarCardComoPdf'
import { paraISO } from '../../../lib/formatarData'
import { CartoesImprimiveis } from '../../../pdf/CartoesImprimiveis'
import { useConteudoImpressao, useOpcoesImpressao } from '../../../pdf/useConteudoImpressao'
import { useIdioma } from '../../../i18n/useIdioma'
import { useDia } from '../../../hooks/usePlanner'
import './imprimir.css'

// Página de fallback (link direto): imprime a folha em branco com a estrutura de hoje (a do dia, se
// já existe; senão a do modelo sugerido pra hoje).
export function ImprimirDiarioA4() {
	const { estrutura } = useDia(paraISO(new Date()))
	const conteudo = useConteudoImpressao(estrutura)
	const { opcoes } = useOpcoesImpressao()
	const { t } = useIdioma()
	const [gerando, setGerando] = useState(false)

	const frenteRef = useRef<HTMLDivElement>(null)
	const versoRef = useRef<HTMLDivElement>(null)

	async function gerar() {
		if (!frenteRef.current || !versoRef.current) throw new Error('cards não montados')
		return gerarPdfBlobA4DoisPlanners(frenteRef.current, versoRef.current, { pretoEBranco: opcoes.pretoEBranco, semTextura: opcoes.economizarTinta })
	}

	// A cada render: o gancho de teste sempre chama a versão atual de gerar() (com as opções atuais).
	useEffect(() => {
		registrarGanchoDeTeste(gerar)
	})

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

			<CartoesImprimiveis conteudo={conteudo} opcoes={opcoes} frenteRef={frenteRef} versoRef={versoRef} />
		</div>
	)
}
