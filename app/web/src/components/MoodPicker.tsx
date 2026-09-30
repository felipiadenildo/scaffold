import { motion } from 'motion/react'
import { coresPorHumor, humores, type Humor } from '../data/planner/humor'
import { useIdioma } from '../i18n/useIdioma'
import { MoodIcon } from './MoodIcon'

export function MoodPicker({
	valor,
	onChange,
	somenteLeitura,
	className = '',
	tamanhoFixo = false,
}: {
	valor: Humor | null
	onChange: (slug: Humor) => void
	somenteLeitura?: boolean
	className?: string
	// Folha de impressão: sempre o tamanho da tela larga, em qualquer aparelho.
	tamanhoFixo?: boolean
}) {
	const { t } = useIdioma()

	return (
		// Celular: menores (28px) pra dividir a linha com a data, alinhados à direita.
		<div
			className={'flex items-center gap-1.5 ' + (tamanhoFixo ? '' : 'max-sm:gap-1 ') + className}
			role="radiogroup"
			aria-label={t.planner.humorDoDia}
		>
			{humores.map((humor) => {
				const ativo = valor === humor.slug
				return (
					<motion.button
						key={humor.slug}
						type="button"
						role="radio"
						aria-checked={ativo}
						aria-label={t.planner.humores[humor.slug]}
						title={t.planner.humores[humor.slug]}
						disabled={somenteLeitura}
						onClick={() => onChange(humor.slug)}
						whileHover={somenteLeitura ? undefined : { scale: 1.08, y: -2 }}
						whileTap={somenteLeitura ? undefined : { scale: 0.94, y: 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 18 }}
						style={ativo ? { borderColor: coresPorHumor[humor.slug], backgroundColor: coresPorHumor[humor.slug] } : undefined}
						className={
							'flex h-9 w-9 items-center justify-center rounded-full border transition-[color,box-shadow] duration-150 disabled:cursor-default ' +
							(tamanhoFixo ? '' : 'max-sm:h-7 max-sm:w-7 ') +
							(ativo
								? 'text-mood-ink shadow-raised'
								: 'border-border text-ink-soft hover:border-ink-soft hover:text-ink hover:shadow-raised')
						}
					>
						<MoodIcon slug={humor.slug} className={'h-5 w-5' + (tamanhoFixo ? '' : ' max-sm:h-4 max-sm:w-4')} />
					</motion.button>
				)
			})}
		</div>
	)
}
