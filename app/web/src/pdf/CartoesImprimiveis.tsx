import type { RefObject } from 'react'
import { FrenteDiario } from '../pages/planners/FrenteDiario'
import { VersoDiario } from '../pages/planners/VersoDiario'
import { semAcaoImpressao, type ConteudoImpressao } from './useConteudoImpressao'

// Mesma classe do card usado na tela (ver faceClasseBase em FolhaFlip.tsx) — o PDF é uma captura
// desse elemento exatamente como ele aparece (cantos, sombra, textura), só sem placeholder.
const CLASSE_CARD =
	'folha-imprimir paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-8 text-paper-ink shadow-paper'

// Frente e verso do Planner prontos pra virar PDF (somenteLeitura, sem placeholder), extraído das
// páginas /imprimir-a5 e /imprimir-a4 pra também poder ficar montado (fora da tela) direto na
// página do Diário — assim o download não precisa mais navegar pra outro lugar. `display:none`
// não serve aqui: o html2canvas precisa de um elemento com layout real (tamanho, texto
// posicionado) pra capturar; por isso "fora da tela" via position:fixed, não display:none.
export function CartoesImprimiveis({
	conteudo,
	frenteRef,
	versoRef,
	foraDaTela = false,
}: {
	conteudo: ConteudoImpressao
	frenteRef: RefObject<HTMLDivElement | null>
	versoRef: RefObject<HTMLDivElement | null>
	foraDaTela?: boolean
}) {
	const { estrutura, blocos, habitos, importantes } = conteudo

	return (
		<div aria-hidden={foraDaTela} style={foraDaTela ? { position: 'fixed', top: 0, left: '-9999px', zIndex: -1 } : undefined}>
			<div ref={frenteRef} className={CLASSE_CARD} style={{ width: '640px', aspectRatio: '148 / 210' }}>
				<FrenteDiario
					modoImpressao
					data={new Date()}
					onDataChange={semAcaoImpressao}
					modoEdicao={false}
					onToggleModo={semAcaoImpressao}
					mostrarHumor={estrutura.humor}
					humor={null}
					onHumorChange={semAcaoImpressao}
					blocos={blocos}
					valoresBlocos={{}}
					onValorBlocoChange={semAcaoImpressao}
					mostrarSobreDia={estrutura.sobreDia}
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
					habitos={{ mostrar: estrutura.habitos, itens: habitos, marcados: {}, onMarcadosChange: semAcaoImpressao }}
					importantes={{
						mostrar: estrutura.importantes,
						itens: importantes,
						marcados: {},
						onMarcadosChange: semAcaoImpressao,
					}}
					somenteLeitura
				/>
			</div>
		</div>
	)
}
