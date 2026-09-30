import type { CSSProperties, Ref, RefObject } from 'react'
import { FrenteDiario } from '../pages/planners/FrenteDiario'
import { VersoDiario } from '../pages/planners/VersoDiario'
import { semAcaoImpressao, type ConteudoImpressao, type OpcoesImpressao } from './useConteudoImpressao'

// Largura em que a folha é montada pra virar PDF (px) e a proporção A5. A captura (html2canvas)
// fotografa o elemento nesse tamanho; a prévia da janela de impressão mostra o mesmo elemento em
// escala.
export const LARGURA_FOLHA_IMPRESSAO = 640
const ESTILO_FOLHA: CSSProperties = { width: `${LARGURA_FOLHA_IMPRESSAO}px`, aspectRatio: '148 / 210' }

// Quantas linhas em branco cada lista ganha quando a pessoa prefere escrever à mão.
const LINHAS_EM_BRANCO = 5

// A folha sai como aparece na tela (papel creme com textura, cores das barras) — a impressão
// representa o que se vê na web. data-theme="light": sempre a paleta clara, mesmo com o app no tema
// escuro. "Economizar tinta" (index.css, .tinta-economica) tira o fundo de papel e as cores das
// barras; "preto e branco" é aplicado na captura (capturarCardComoPdf) e na prévia (filtro CSS).
export function FolhaImpressao({
	conteudo,
	opcoes,
	lado,
	ref,
}: {
	conteudo: ConteudoImpressao
	opcoes: OpcoesImpressao
	lado: 'frente' | 'verso'
	ref?: Ref<HTMLDivElement>
}) {
	const { estrutura, blocos, habitos, importantes } = conteudo
	const classe =
		'folha-impressao paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-8 text-paper-ink' +
		(opcoes.economizarTinta ? ' tinta-economica' : '')

	return (
		<div ref={ref} data-theme="light" className={classe} style={ESTILO_FOLHA}>
			{lado === 'frente' ? (
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
			) : (
				<VersoDiario
					modoImpressao
					anotacoes=""
					onAnotacoesChange={semAcaoImpressao}
					habitos={{
						mostrar: estrutura.habitos,
						itens: habitos,
						marcados: {},
						onMarcadosChange: semAcaoImpressao,
						linhasEmBranco: opcoes.listas === 'linhas' ? LINHAS_EM_BRANCO : undefined,
					}}
					importantes={{
						mostrar: estrutura.importantes,
						itens: importantes,
						marcados: {},
						onMarcadosChange: semAcaoImpressao,
						linhasEmBranco: opcoes.listas === 'linhas' ? LINHAS_EM_BRANCO : undefined,
					}}
					somenteLeitura
				/>
			)}
		</div>
	)
}

// Frente e verso prontos pra virar PDF, montados fora da tela na página do Diário (e visíveis nas
// páginas /imprimir-a5 e /imprimir-a4). `display:none` não serve: o html2canvas precisa de um
// elemento com layout real (tamanho, texto posicionado) pra capturar — por isso "fora da tela" via
// position:fixed.
export function CartoesImprimiveis({
	conteudo,
	opcoes,
	frenteRef,
	versoRef,
	foraDaTela = false,
}: {
	conteudo: ConteudoImpressao
	opcoes: OpcoesImpressao
	frenteRef: RefObject<HTMLDivElement | null>
	versoRef: RefObject<HTMLDivElement | null>
	foraDaTela?: boolean
}) {
	return (
		<div
			aria-hidden={foraDaTela}
			className={foraDaTela ? undefined : 'flex flex-col items-center gap-5'}
			style={foraDaTela ? { position: 'fixed', top: 0, left: '-9999px', zIndex: -1 } : undefined}
		>
			<FolhaImpressao ref={frenteRef} conteudo={conteudo} opcoes={opcoes} lado="frente" />
			<FolhaImpressao ref={versoRef} conteudo={conteudo} opcoes={opcoes} lado="verso" />
		</div>
	)
}
