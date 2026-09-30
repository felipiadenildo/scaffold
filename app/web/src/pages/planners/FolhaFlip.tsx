import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CLASSE_LARGURA_EXPANDIDA, CLASSE_LARGURA_NORMAL } from '../../components/DateNav'
import { useIdioma } from '../../i18n/useIdioma'
import { FrenteDiario, type PropsFrenteDiario } from './FrenteDiario'
import { VersoDiario, type PropsVersoDiario } from './VersoDiario'

// Base comum às duas faces. Grain/borda/sombra são por face mesmo quando elas aparecem lado a
// lado (R3) — cada uma continua parecendo uma folha de papel própria, não a metade de uma só.
const faceClasseBase =
	// max-sm:pt-7: no celular a linha de controles (ControlesCelular) entra 16px na folha pelo topo.
	'paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-4 text-paper-ink shadow-paper transition-[filter] duration-300 max-sm:pt-7 sm:p-8'

// O breakpoint 1180px usado abaixo (classeAlturaTravada/classesGrade) vem de: espaço mínimo pra
// duas folhas A5 reais lado a lado é ~559px cada (A5 retrato a 96dpi) x2 + um respiro de ~32px
// entre elas ≈ 1150px; 1180px dá uma margem de segurança sobre essa régua (R7). Abaixo disso —
// ou fora de "ajustar largura" — o arranjo cai pra empilhado sozinho, sem precisar de estado
// extra pra isso (D9): é só uma classe CSS que deixa de bater. Escrito por extenso (não numa
// constante interpolada) porque o Tailwind só gera CSS pra classes que consegue ler no fonte.

export function FolhaFlip({
	expandido,
	modoVisualizacao,
	lado,
	onGirar,
	frente,
	verso,
}: {
	expandido: boolean
	modoVisualizacao: 'girar' | 'nao-girar'
	lado: 'frente' | 'verso'
	onGirar: (direcao: 1 | -1) => void
	frente: PropsFrenteDiario
	verso: PropsVersoDiario
}) {
	const { somenteLeitura } = frente
	const { t } = useIdioma()
	const emGirar = modoVisualizacao === 'girar'
	// Ângulo continua sendo derivado de `lado` fora daqui (em Diario.tsx) — precisa sobreviver à
	// troca de dia, então não pode reiniciar sempre que este componente remonta.
	const rotacao = lado === 'frente' ? 0 : 180
	const classeLargura = expandido ? CLASSE_LARGURA_EXPANDIDA : CLASSE_LARGURA_NORMAL

	// Referência invisível só pra medir "que altura o card teria na largura normal" — usada
	// abaixo pra travar a altura no modo girar quando "ajustar largura" está ativo. Sempre
	// montada e observada (não só quando expandido), pra já ter o valor pronto assim que
	// precisar, e reage sozinha se a janela mudar de tamanho.
	const referenciaAlturaRef = useRef<HTMLDivElement>(null)
	const [alturaNormal, setAlturaNormal] = useState<number | null>(null)

	useEffect(() => {
		const elemento = referenciaAlturaRef.current
		if (!elemento) return
		const observer = new ResizeObserver((entradas) => {
			const altura = entradas[0]?.contentRect.height
			if (altura) setAlturaNormal(altura)
		})
		observer.observe(elemento)
		return () => observer.disconnect()
	}, [])

	// Altura travada em proporção A5 (com scroll interno como válvula de segurança) nos casos em
	// que faz sentido geométrico: card único não-expandido (de sempre), ou as duas faces lado a
	// lado (onde o objetivo é justapor duas folhas A5 reais).
	const classeAlturaTravada = !expandido
		? 'sm:aspect-[148/210] sm:h-full sm:overflow-y-auto'
		: emGirar
			? 'overflow-y-auto'
			: 'min-[1180px]:aspect-[148/210] min-[1180px]:h-full min-[1180px]:overflow-y-auto'

	// "Ajustar largura" no modo girar deve mudar só a largura, suavemente — a altura fica
	// travada no valor medido pela referência acima. Sem isso, tirar o aspect-ratio (necessário
	// pra largura crescer sem virar um retângulo fora de proporção) deixava a altura pular pro
	// tamanho do conteúdo no instante da troca.
	const estiloAlturaGirar: CSSProperties = expandido && emGirar && alturaNormal ? { height: alturaNormal } : {}

	const faceClasse = faceClasseBase + ' ' + classeAlturaTravada + (somenteLeitura ? ' grayscale-[35%]' : '')

	// Grade: no modo girar as duas faces ocupam a mesma célula (a rotação 3D decide qual delas
	// aparece). Fora do girar, empilha por padrão (1 coluna) e só abre pra 2 colunas quando
	// expandido E a tela tem espaço real pra duas A5 lado a lado — mesmo breakpoint de
	// classeAlturaTravada acima, de propósito, pra as duas condições baterem sempre juntas.
	const classesGrade = emGirar
		? 'grid w-full'
		: expandido
			? 'grid w-full grid-cols-1 gap-4 min-[1180px]:grid-cols-2 min-[1180px]:gap-6'
			: 'grid w-full grid-cols-1 gap-4'

	const frenteEscondida = emGirar && lado !== 'frente'
	const versoEscondido = emGirar && lado !== 'verso'
	// Mesmo objeto pra `initial` e `animate`: numa troca de dia (que remonta este componente via
	// key lá em Diario.tsx), evita um flash de um frame na orientação padrão antes de aplicar o
	// ângulo/opacidade atuais. Sinal invertido (-rotacao) é o que faz a borda direita girar
	// visualmente pra direita — sem ele, o rotateY em 3D parecia girar pro lado errado.
	const animFrente = { rotateY: emGirar ? -rotacao : 0, opacity: frenteEscondida ? 0 : 1 }
	const animVerso = { rotateY: emGirar ? -rotacao + 180 : 0, opacity: versoEscondido ? 0 : 1 }
	const transicaoFace = {
		layout: { duration: 0.35, ease: 'easeInOut' },
		rotateY: { duration: 0.55, ease: [0.45, 0.05, 0.15, 1] },
		opacity: { duration: 0.3 },
	} as const

	return (
		// `layout` aqui (não mais uma transição CSS de max-width) é o que anima ESTE wrapper
		// crescendo/encolhendo (Ajustar largura) — unificado com o `layout` da grade e das faces
		// logo abaixo, todos coordenados pelo mesmo sistema. Antes disso, uma transição CSS de
		// max-width neste elemento brigava com o `layout` dos filhos: os dois tentavam animar a
		// mesma mudança de tamanho ao mesmo tempo, por mecanismos diferentes, e o resultado
		// visual ficava instável — exatamente o que motivou esta troca.
		<motion.div
			layout
			transition={{ layout: transicaoFace.layout }}
			className={'relative mx-auto ' + classeLargura}
			style={{ perspective: '1800px' }}
		>
			{/* Referência muda (sem afetar o layout — position:absolute) só pra medir a altura que o
			    card teria na largura normal. Ver estiloAlturaGirar acima. */}
			<div
				ref={referenciaAlturaRef}
				aria-hidden="true"
				className="invisible pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto w-full max-w-2xl sm:aspect-[148/210]"
			/>

			{/* Virar e a data do verso ficam nas barras (DateNav no PC, ControlesCelular no celular).
			    Aqui sobram só as bordas de virar página, pra quem usa mouse. */}

			{/* Bordas: cada uma sempre gira no mesmo sentido, clique atrás de clique — esquerda
			    sempre soma -1, direita sempre soma +1, sem depender de `lado`. Ficam de fora do
			    AnimatePresence de propósito: dependem de hover via CSS (opacity-0/hover:opacity-100),
			    e um `animate` do motion por cima do opacity quebraria esse hover (style inline vence
			    a regra de :hover). Só existem no modo girar — nele fazem sentido; fora dele, somem. */}
			{emGirar && (
				<button
					type="button"
					onClick={() => onGirar(-1)}
					aria-label={t.planner.virarEsquerda}
					// Invisível até o hover, então não existe no toque: lá ela só roubava os toques perto
					// da borda dos blocos (vira pelo botão "Ver verso"; deslizar troca o dia).
					className="absolute left-0 top-0 z-10 flex h-full w-5 items-center justify-start rounded-l-xl bg-linear-to-r from-paper-ink/10 to-transparent opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 pointer-coarse:hidden sm:w-7"
				>
					<ChevronLeft className="h-4 w-4 text-paper-ink/70" aria-hidden="true" />
				</button>
			)}
			{emGirar && (
				<button
					type="button"
					onClick={() => onGirar(1)}
					aria-label={t.planner.virarDireita}
					className="absolute right-0 top-0 z-10 flex h-full w-5 items-center justify-end rounded-r-xl bg-linear-to-l from-paper-ink/10 to-transparent opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 pointer-coarse:hidden sm:w-7"
				>
					<ChevronRight className="h-4 w-4 text-paper-ink/70" aria-hidden="true" />
				</button>
			)}

			{/* `layout` aqui, na grade e nas duas faces, é o que anima tanto a troca de modo (D10:
			    ao sair do girar, as faces — que ocupavam a mesma célula, sobrepostas — se separam
			    pra célula própria, "desdobrando"; ao voltar, se reaproximam) quanto o redimensiona-
			    mento puro do wrapper de fora (Ajustar largura). Mesmo sistema de animação nos três
			    níveis, de propósito — é o que evita as duas brigarem. Nada de display:none pra
			    esconder a face inativa no girar (quebraria a animação de layout) — opacity 0 +
			    pointer-events none + inert, como já era. */}
			<motion.div
				layout
				className={classesGrade}
				style={{ transformStyle: 'preserve-3d', ...estiloAlturaGirar }}
				transition={{ layout: transicaoFace.layout }}
			>
				<motion.div
					layout
					style={{
						gridArea: emGirar ? '1 / 1' : undefined,
						transformStyle: 'preserve-3d',
						pointerEvents: frenteEscondida ? 'none' : undefined,
					}}
					initial={animFrente}
					animate={animFrente}
					transition={transicaoFace}
					className={faceClasse + (emGirar ? ' [backface-visibility:hidden]' : '')}
					inert={frenteEscondida}
				>
					<FrenteDiario {...frente} />
				</motion.div>
				<motion.div
					layout
					style={{
						gridArea: emGirar ? '1 / 1' : undefined,
						transformStyle: 'preserve-3d',
						pointerEvents: versoEscondido ? 'none' : undefined,
					}}
					initial={animVerso}
					animate={animVerso}
					transition={transicaoFace}
					className={faceClasse + (emGirar ? ' [backface-visibility:hidden]' : '')}
					inert={versoEscondido}
				>
					<VersoDiario {...verso} />
				</motion.div>
			</motion.div>
		</motion.div>
	)
}
