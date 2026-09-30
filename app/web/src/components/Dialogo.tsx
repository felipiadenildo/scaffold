import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

// Janela modal do app. <dialog> nativo com showModal(): prende o foco dentro, fecha com Esc e deixa
// o resto da página inerte sem código extra. Clicar no fundo escurecido também fecha. O conteúdo
// é um cartão de papel, a mesma superfície da folha do Planner.
//
// Monta aberto: quem usa controla a existência (`{aberto && <Dialogo … />}`) e recebe `onFechar`
// sempre que ele fecha, por qualquer caminho.
export function Dialogo({
	idTitulo,
	onFechar,
	largura = 'md',
	children,
}: {
	// id do elemento que dá nome à janela (aria-labelledby).
	idTitulo: string
	onFechar: () => void
	largura?: 'sm' | 'md'
	children: ReactNode
}) {
	const ref = useRef<HTMLDialogElement>(null)

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
			className={
				'm-auto bg-transparent p-0 text-ink backdrop:bg-black/35 backdrop:backdrop-blur-[2px] ' +
				(largura === 'sm' ? 'w-[min(100%-2rem,24rem)]' : 'w-[min(100%-2rem,28rem)]')
			}
		>
			<motion.div
				initial={{ opacity: 0, y: 12, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				className="paper-grain rounded-scaffold-lg border border-border/60 bg-paper p-6 text-paper-ink shadow-paper sm:p-8"
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
