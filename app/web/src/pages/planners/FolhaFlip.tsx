import { ChevronLeft, ChevronRight, FlipHorizontal2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { DiaStepper } from '../../components/DiaStepper'
import type { ValorSecao } from '../../components/SecaoDia'
import type { NivelHumor, SecaoDia as SecaoDiaTipo } from '../../data/planner'
import { FrenteDiario } from './FrenteDiario'
import { VersoDiario } from './VersoDiario'

// Proporção A5 só a partir de sm: em telas pequenas o conteúdo manda (altura automática, rolagem
// normal da página) — forçar A5 num celular estreito criaria uma caixa alta demais com scroll interno.
// Dia que não é hoje some com dessaturação — reforça visualmente o modo de visualização.
const faceClasseBase =
	'paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-5 text-paper-ink shadow-paper transition-[filter] duration-300 sm:h-full sm:overflow-y-auto sm:p-8 [backface-visibility:hidden]'

export function FolhaFlip({
	expandido,
	lado,
	onGirar,
	data,
	onDataChange,
	modoEdicao,
	onToggleModo,
	humor,
	onHumorChange,
	secoesTemplate,
	onRenomearSecao,
	valoresSecoes,
	onValorSecaoChange,
	sobreDia,
	onSobreDiaChange,
	anotacoes,
	onAnotacoesChange,
	habitos,
	onHabitosChange,
	habitosMarcados,
	onHabitosMarcadosChange,
	protocolo,
	onProtocoloChange,
	protocoloMarcados,
	onProtocoloMarcadosChange,
	somenteLeitura,
}: {
	expandido: boolean
	lado: 'frente' | 'verso'
	onGirar: (direcao: 1 | -1) => void
	data: Date
	onDataChange: (data: Date) => void
	modoEdicao: boolean
	onToggleModo: () => void
	humor: NivelHumor['slug'] | null
	onHumorChange: (humor: NivelHumor['slug']) => void
	secoesTemplate: SecaoDiaTipo[]
	onRenomearSecao: (slug: string, nome: string) => void
	valoresSecoes: Record<string, ValorSecao>
	onValorSecaoChange: (slug: string, valor: ValorSecao) => void
	sobreDia: string
	onSobreDiaChange: (v: string) => void
	anotacoes: string
	onAnotacoesChange: (v: string) => void
	habitos: string[]
	onHabitosChange: (v: string[]) => void
	habitosMarcados: Record<string, boolean>
	onHabitosMarcadosChange: (v: Record<string, boolean>) => void
	protocolo: string[]
	onProtocoloChange: (v: string[]) => void
	protocoloMarcados: Record<string, boolean>
	onProtocoloMarcadosChange: (v: Record<string, boolean>) => void
	somenteLeitura?: boolean
}) {
	// Ângulo continua sendo derivado de `lado` fora daqui (em Diario.tsx) — precisa sobreviver à
	// troca de dia, então não pode reiniciar sempre que este componente remonta.
	const rotacao = lado === 'frente' ? 0 : 180
	const faceClasse = faceClasseBase + (somenteLeitura ? ' grayscale-[35%]' : '')

	return (
		<div
			className={'relative mx-auto transition-[max-width] duration-300 ' + (expandido ? 'max-w-none' : 'max-w-2xl')}
			style={{ perspective: '1800px' }}
		>
			<button
				type="button"
				onClick={() => onGirar(1)}
				className="absolute -top-3 right-4 z-10 flex items-center gap-1.5 rounded-full border border-border bg-bg-raised px-3 py-1.5 text-xs font-medium text-ink-soft shadow-raised transition-colors hover:text-ink"
			>
				<FlipHorizontal2 className="h-3.5 w-3.5" aria-hidden="true" />
				Ver {lado === 'frente' ? 'verso' : 'frente'}
			</button>

			{/* Migra pro canto esquerdo só quando o verso está visível — na frente, o mesmo controle
			    já vive dentro da folha (ver FrenteDiario). Fade+escala sincronizados com o giro, em
			    vez de um morph literal entre as duas posições (ver nota no chat: 3D + layout animation
			    juntos é frágil). */}
			<AnimatePresence>
				{lado === 'verso' && (
					<motion.div
						key="stepper-flutuante"
						initial={{ opacity: 0, scale: 0.9, y: -4 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: -4 }}
						transition={{ duration: 0.25 }}
						className="absolute -top-3 left-4 z-10"
					>
						<DiaStepper data={data} onChange={onDataChange} modoEdicao={modoEdicao} onToggleModo={onToggleModo} tamanho="pequeno" />
					</motion.div>
				)}
			</AnimatePresence>

			<button
				type="button"
				onClick={() => onGirar(-1)}
				aria-label="Virar página pra esquerda"
				className="absolute left-0 top-0 z-10 flex h-full w-5 items-center justify-start rounded-l-xl bg-linear-to-r from-paper-ink/10 to-transparent opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:w-7"
			>
				<ChevronLeft className="h-4 w-4 text-paper-ink/70" aria-hidden="true" />
			</button>
			<button
				type="button"
				onClick={() => onGirar(1)}
				aria-label="Virar página pra direita"
				className="absolute right-0 top-0 z-10 flex h-full w-5 items-center justify-end rounded-r-xl bg-linear-to-l from-paper-ink/10 to-transparent opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:w-7"
			>
				<ChevronRight className="h-4 w-4 text-paper-ink/70" aria-hidden="true" />
			</button>

			<motion.div
				className="grid w-full sm:aspect-[148/210]"
				style={{ transformStyle: 'preserve-3d' }}
				// `initial` explícito (igual ao alvo) evita que a troca de dia — que remonta este
				// elemento via a chave lá em Diario.tsx — pisque um frame na orientação padrão (0°)
				// antes de aplicar o ângulo atual. Sem isso, mudar de data enquanto no verso mostrava
				// a frente por um instante e só depois girava.
				// Sinal invertido (-rotacao): girar(1) soma no ângulo lógico (o que `lado` usa pra saber
				// qual face mostrar), mas o sentido visual do rotateY em 3D saía trocado — clicar na
				// direita parecia girar pra esquerda. Inverte só a exibição, sem mexer em qual lado
				// fica visível.
				initial={{ rotateY: -rotacao }}
				animate={{ rotateY: -rotacao }}
				transition={{ duration: 0.55, ease: [0.45, 0.05, 0.15, 1] }}
			>
				<div className={faceClasse} style={{ gridArea: '1 / 1' }} inert={lado !== 'frente'}>
					<FrenteDiario
						data={data}
						onDataChange={onDataChange}
						modoEdicao={modoEdicao}
						onToggleModo={onToggleModo}
						humor={humor}
						onHumorChange={onHumorChange}
						secoesTemplate={secoesTemplate}
						onRenomearSecao={onRenomearSecao}
						valoresSecoes={valoresSecoes}
						onValorSecaoChange={onValorSecaoChange}
						sobreDia={sobreDia}
						onSobreDiaChange={onSobreDiaChange}
						somenteLeitura={somenteLeitura}
					/>
				</div>
				<div className={faceClasse} style={{ gridArea: '1 / 1', transform: 'rotateY(180deg)' }} inert={lado !== 'verso'}>
					<VersoDiario
						anotacoes={anotacoes}
						onAnotacoesChange={onAnotacoesChange}
						habitos={habitos}
						onHabitosChange={onHabitosChange}
						habitosMarcados={habitosMarcados}
						onHabitosMarcadosChange={onHabitosMarcadosChange}
						protocolo={protocolo}
						onProtocoloChange={onProtocoloChange}
						protocoloMarcados={protocoloMarcados}
						onProtocoloMarcadosChange={onProtocoloMarcadosChange}
						somenteLeitura={somenteLeitura}
					/>
				</div>
			</motion.div>
		</div>
	)
}
