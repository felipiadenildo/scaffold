import { useEffect, useRef, useState } from 'react'
import { FolhaImpressao, LARGURA_FOLHA_IMPRESSAO } from '../../pdf/CartoesImprimiveis'
import type { ConteudoImpressao, OpcoesImpressao } from '../../pdf/useConteudoImpressao'

// Cada face é mostrada sobre uma página A5 branca (o papel que vai na impressora), com a mesma
// margem de 5 mm do PDF (capturarCardComoPdf) — é o que sai de verdade. Página de tamanho fixo (a
// janela não muda de tamanho ao trocar de opção), só menor quando as duas não cabem lado a lado
// (celular estreito).
const LARGURA_PAGINA_MAXIMA = 170
const ESPACO_ENTRE_PAGINAS = 12
const ALTURA_A5_FOLHA = LARGURA_FOLHA_IMPRESSAO * (210 / 148)

function Previa({
	conteudo,
	opcoes,
	lado,
	largura,
}: {
	conteudo: ConteudoImpressao
	opcoes: OpcoesImpressao
	lado: 'frente' | 'verso'
	largura: number
}) {
	const alturaPagina = largura * (210 / 148)
	const margem = largura * (5 / 148)
	const folhaRef = useRef<HTMLDivElement>(null)
	// Altura real da folha: passa da proporção A5 quando não cabe tudo — aí ela é reduzida pra
	// caber na página, exatamente como no PDF.
	const [altura, setAltura] = useState(ALTURA_A5_FOLHA)

	useEffect(() => {
		const folha = folhaRef.current
		if (!folha) return
		const observador = new ResizeObserver(() => setAltura(folha.offsetHeight))
		observador.observe(folha)
		return () => observador.disconnect()
	}, [])

	// Escala por transform, não `zoom`: `zoom` mudaria as medidas lidas por dentro (LinhasImpressao
	// conta quantas linhas cabem pela altura) e a prévia sairia diferente do PDF.
	const escala = Math.min((largura - margem * 2) / LARGURA_FOLHA_IMPRESSAO, (alturaPagina - margem * 2) / altura)
	const esquerda = (largura - LARGURA_FOLHA_IMPRESSAO * escala) / 2
	const topo = (alturaPagina - altura * escala) / 2

	return (
		<div
			className="relative shrink-0 overflow-hidden rounded-[2px] bg-white shadow-raised ring-1 ring-black/5"
			style={{ width: largura, height: alturaPagina }}
		>
			<div
				className="absolute"
				style={{
					left: esquerda,
					top: topo,
					transform: `scale(${escala})`,
					transformOrigin: 'top left',
					// Preto e branco na prévia; no PDF, a conversão é feita nos pixels (capturarCardComoPdf).
					filter: opcoes.pretoEBranco ? 'grayscale(1)' : undefined,
				}}
			>
				<FolhaImpressao ref={folhaRef} conteudo={conteudo} opcoes={opcoes} lado={lado} />
			</div>
		</div>
	)
}

// Frente e verso como vão sair no PDF, atualizando a cada escolha da janela de impressão.
export function PreviaImpressao({ conteudo, opcoes }: { conteudo: ConteudoImpressao; opcoes: OpcoesImpressao }) {
	const ref = useRef<HTMLDivElement>(null)
	const [largura, setLargura] = useState(LARGURA_PAGINA_MAXIMA)

	useEffect(() => {
		const caixa = ref.current
		if (!caixa) return
		const observador = new ResizeObserver(() => {
			const cabe = Math.floor((caixa.clientWidth - ESPACO_ENTRE_PAGINAS) / 2)
			setLargura(Math.max(0, Math.min(LARGURA_PAGINA_MAXIMA, cabe)))
		})
		observador.observe(caixa)
		return () => observador.disconnect()
	}, [])

	return (
		<div ref={ref} aria-hidden="true" className="flex min-w-0 items-start justify-center" style={{ gap: ESPACO_ENTRE_PAGINAS }}>
			<Previa conteudo={conteudo} opcoes={opcoes} lado="frente" largura={largura} />
			<Previa conteudo={conteudo} opcoes={opcoes} lado="verso" largura={largura} />
		</div>
	)
}
