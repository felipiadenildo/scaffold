import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useIdioma } from '../i18n/useIdioma'
import { fecharAviso, useAvisoAtual } from './avisos'

// Tempo na tela. Pausa enquanto o mouse ou o foco estão no aviso (WCAG 2.2.1: dá tempo de ler e
// de alcançar o "Desfazer" pelo teclado).
const DURACAO_MS = 6000

export function Avisos() {
	const aviso = useAvisoAtual()
	const { t } = useIdioma()
	const [pausado, setPausado] = useState(false)

	useEffect(() => {
		if (!aviso || pausado || aviso.persistente) return
		const temporizador = setTimeout(() => fecharAviso(aviso.id), DURACAO_MS)
		return () => clearTimeout(temporizador)
	}, [aviso, pausado])

	return (
		// Invertido em relação ao tema (tinta de fundo, fundo de texto), como os snackbars em geral:
		// destaca do conteúdo nos dois temas sem cor nova. Acima da área segura do celular.
		<div
			className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
			style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
			role="status"
			aria-live="polite"
		>
			<AnimatePresence>
				{aviso && (
					<motion.div
						key={aviso.id}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 16 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						onMouseEnter={() => setPausado(true)}
						onMouseLeave={() => setPausado(false)}
						onFocus={() => setPausado(true)}
						onBlur={() => setPausado(false)}
						className="pointer-events-auto flex max-w-md items-center gap-3 rounded-scaffold bg-ink py-2 pl-4 pr-2 text-sm text-bg shadow-paper"
					>
						<span className="flex-1">{aviso.texto}</span>
						{aviso.acao && (
							<button
								type="button"
								onClick={() => {
									aviso.acao?.executar()
									fecharAviso(aviso.id)
								}}
								className="shrink-0 rounded-scaffold px-2 py-1 font-semibold underline decoration-bg/40 underline-offset-2 hover:decoration-bg"
							>
								{aviso.acao.rotulo}
							</button>
						)}
						<button
							type="button"
							onClick={() => fecharAviso(aviso.id)}
							aria-label={t.app.fecharAviso}
							className="shrink-0 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
						>
							<X className="h-3.5 w-3.5" aria-hidden="true" />
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
