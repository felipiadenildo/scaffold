import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTelaEstreita } from '../hooks/useMidia'

// Janela modal do app. <dialog> nativo com showModal(): prende o foco dentro, fecha com Esc e deixa
// o resto da página inerte sem código extra. Clicar no fundo escurecido também fecha. O conteúdo
// é um cartão de papel, a mesma superfície da folha do Planner.
// No celular vira um painel que sobe de baixo (padrão de "bottom sheet" do Material e do iOS): os
// botões ficam no alcance do polegar, e o cartão respeita a barra de gestos.
//
// Monta aberto: quem usa controla a existência (`{aberto && <Dialogo … />}`) e recebe `onFechar`
// sempre que ele fecha, por qualquer caminho.
const LARGURAS = {
	sm: 'w-[min(100%-2rem,24rem)]',
	md: 'w-[min(100%-2rem,28rem)]',
	lg: 'w-[min(100%-2rem,52rem)]',
}

export function Dialogo({
	idTitulo,
	onFechar,
	largura = 'md',
	children,
}: {
	// id do elemento que dá nome à janela (aria-labelledby).
	idTitulo: string
	onFechar: () => void
	// lg: janelas com duas colunas na tela larga (modelo, impressão) — sem rolagem no PC.
	largura?: 'sm' | 'md' | 'lg'
	children: ReactNode
}) {
	const ref = useRef<HTMLDialogElement>(null)
	const telaEstreita = useTelaEstreita()

	useEffect(() => {
		const dialogo = ref.current
		if (dialogo && !dialogo.open) dialogo.showModal()
	}, [])

	return (
		<dialog
			ref={ref}
			onClose={onFechar}
			// Clique no fundo (fora do cartão) cai no próprio <dialog>.
			onClick={(evento) => {
				if (evento.target === ref.current) ref.current.close()
			}}
			aria-labelledby={idTitulo}
			// overflow-visible + max-h-none: quem rola é o cartão, nunca o <dialog>. O navegador dá ao
			// <dialog> modal overflow:auto e uma altura máxima, e a animação de entrada (o cartão começa
			// deslocado) conta como conteúdo a mais — aparecia uma barra de rolagem até ela terminar.
			className={
				'm-auto max-h-none overflow-visible bg-transparent p-0 text-ink backdrop:bg-black/35 backdrop:backdrop-blur-[2px] max-sm:mb-0 max-sm:w-full max-sm:max-w-full ' +
				LARGURAS[largura]
			}
		>
			<motion.div
				initial={telaEstreita ? { opacity: 0, y: 48 } : { opacity: 0, y: 12, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				// Rola por dentro quando não cabe (celular em pé, janelas longas como a de modelo).
				className="paper-grain max-h-[calc(100svh-2rem)] overflow-y-auto rounded-scaffold-lg border border-border/60 bg-paper p-6 text-paper-ink shadow-paper max-sm:max-h-[calc(100svh-1rem)] max-sm:rounded-b-none max-sm:border-b-0 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8"
			>
				{children}
			</motion.div>
		</dialog>
	)
}

// Botões de rodapé das janelas. `form method="dialog"` fecha o <dialog> sozinho ao clicar.
export const classeBotaoDialogo =
	'rounded-scaffold px-4 py-2.5 text-sm font-semibold transition-[box-shadow,border-color] hover:shadow-raised'
export const classeBotaoDialogoPrincipal = classeBotaoDialogo + ' bg-accent text-accent-ink'
export const classeBotaoDialogoSecundario =
	classeBotaoDialogo + ' border border-paper-ink/20 text-paper-ink hover:border-paper-ink/40'
