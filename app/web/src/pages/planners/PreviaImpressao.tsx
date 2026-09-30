import { useEffect, useRef, useState } from 'react'
import { FolhaImpressao, LARGURA_FOLHA_IMPRESSAO } from '../../pdf/CartoesImprimiveis'
import type { ConteudoImpressao, OpcoesImpressao } from '../../pdf/useConteudoImpressao'

// Cada face é mostrada sobre uma página A5 branca (o papel que vai na impressora), com a mesma
// margem de 5 mm do PDF (capturarCardComoPdf) — é o que sai de verdade. Página de tamanho fixo: a
// janela não muda de tamanho ao trocar de opção.
const LARGURA_PAGINA = 170
const ALTURA_PAGINA = LARGURA_PAGINA * (210 / 148)
const MARGEM = LARGURA_PAGINA * (5 / 148)
const ALTURA_A5_FOLHA = LARGURA_FOLHA_IMPRESSAO * (210 / 148)

function Previa({ conteudo, opcoes, lado }: { conteudo: ConteudoImpressao; opcoes: OpcoesImpressao; lado: 'frente' | 'verso' }) {
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
	const escala = Math.min((LARGURA_PAGINA - MARGEM * 2) / LARGURA_FOLHA_IMPRESSAO, (ALTURA_PAGINA - MARGEM * 2) / altura)
	const esquerda = (LARGURA_PAGINA - LARGURA_FOLHA_IMPRESSAO * escala) / 2
	const topo = (ALTURA_PAGINA - altura * escala) / 2

	return (
		<div
			className="relative shrink-0 overflow-hidden rounded-[2px] bg-white shadow-raised ring-1 ring-black/5"
			style={{ width: LARGURA_PAGINA, height: ALTURA_PAGINA }}
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
	return (
		<div aria-hidden="true" className="flex items-start justify-center gap-3">
			<Previa conteudo={conteudo} opcoes={opcoes} lado="frente" />
			<Previa conteudo={conteudo} opcoes={opcoes} lado="verso" />
		</div>
	)
}
