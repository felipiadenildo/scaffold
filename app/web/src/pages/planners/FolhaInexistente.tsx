import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { CLASSE_LARGURA_EXPANDIDA, CLASSE_LARGURA_NORMAL } from '../../components/DateNav'
import { DiaStepper } from '../../components/DiaStepper'
import type { Modelo } from '../../data/planner/tipos'
import { useIdioma } from '../../i18n/useIdioma'
import { MiniaturaModelo } from './MiniaturaModelo'

export interface OpcaoModelo {
	modelo: Modelo
	descricao?: string
	recomendado?: boolean
}

// Um dia que ainda não foi criado: o contorno da folha, pontilhado e sem cor (ausência, não
// erro — nada de cara triste ou vermelho, ver PLANO-FASE-0.md), com os modelos como botões. Um
// clique cria o dia. Mesmo tamanho e largura da folha de verdade (FolhaFlip), pra trocar de um dia
// criado pra um não criado não mexer no layout.
export function FolhaInexistente({
	data,
	onDataChange,
	expandido,
	primeiraVez,
	opcoes,
	destaqueId,
	onEscolher,
}: {
	data: Date
	onDataChange: (data: Date) => void
	expandido: boolean
	primeiraVez: boolean
	opcoes: OpcaoModelo[]
	// Modelo em destaque: o recomendado na primeira vez, o do dia da semana nas outras.
	destaqueId: string | null
	onEscolher: (modelo: Modelo) => void
}) {
	const { t } = useIdioma()
	const textos = t.planner.folhaInexistente
	const classeLargura = expandido ? CLASSE_LARGURA_EXPANDIDA : CLASSE_LARGURA_NORMAL

	return (
		<div className={'mx-auto transition-[max-width] duration-300 ease-out ' + classeLargura}>
			<div
				className={
					'flex flex-col rounded-scaffold-lg border-2 border-dashed border-border p-5 sm:p-8 ' +
					(expandido ? 'min-h-[70svh]' : 'sm:aspect-[148/210]')
				}
			>
				<div className="shrink-0">
					<DiaStepper data={data} onChange={onDataChange} />
				</div>

				<div className="flex flex-1 flex-col items-center justify-center py-8">
					<p className="text-center text-sm text-ink-soft">
						{primeiraVez ? textos.primeiraVez : textos.naoExiste}
						{!primeiraVez && (
							<>
								<br />
								{textos.escolhaModelo}
							</>
						)}
					</p>

					{/* Celular: lista, miniaturas pequenas à esquerda do nome. Tela larga (sm+): grade de
					    cards, miniaturas grandes em cima e o nome embaixo. */}
					<ul className="mt-5 grid w-full max-w-sm grid-cols-1 gap-2 sm:max-w-lg sm:grid-cols-2 sm:gap-3">
						{opcoes.map(({ modelo, descricao, recomendado }, i) => {
							const destaque = modelo.id === destaqueId
							return (
								<motion.li
									key={modelo.id}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05, duration: 0.25 }}
								>
									<button
										type="button"
										onClick={() => onEscolher(modelo)}
										className={
											'flex h-full w-full items-center gap-3 rounded-scaffold border px-3 py-2.5 text-left transition-[border-color,box-shadow] hover:shadow-raised sm:flex-col sm:items-center sm:gap-2.5 sm:px-4 sm:pb-4 sm:pt-5 sm:text-center ' +
											(destaque
												? 'border-accent bg-accent text-accent-ink'
												: 'border-border bg-bg-raised text-ink hover:border-ink-soft')
										}
									>
										<MiniaturaModelo estrutura={modelo.estrutura} />
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-semibold">{modelo.nome}</span>
											{descricao && (
												<span className={'mt-0.5 block text-xs ' + (destaque ? 'text-accent-ink/85' : 'text-ink-soft')}>
													{descricao}
												</span>
											)}
										</span>
										{recomendado && (
											<span
												className={
													'shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ' +
													(destaque ? 'border-accent-ink/40 text-accent-ink' : 'border-accent/40 text-accent')
												}
											>
												{textos.recomendado}
											</span>
										)}
									</button>
								</motion.li>
							)
						})}

						{/* Última opção sempre: montar o próprio. Desativada até existir o editor (etapa 0-D). */}
						<motion.li
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: opcoes.length * 0.05, duration: 0.25 }}
						>
							<button
								type="button"
								disabled
								title={t.planner.emBreve}
								className="flex h-full w-full cursor-not-allowed items-center gap-3 rounded-scaffold border border-dashed border-border px-3 py-2.5 text-left text-ink-soft opacity-70 sm:flex-col sm:justify-center sm:gap-2.5 sm:px-4 sm:pb-4 sm:pt-5 sm:text-center"
							>
								<span className="flex h-10 w-[3.75rem] shrink-0 items-center justify-center rounded-[3px] border border-dashed border-ink-soft/50 sm:h-[5.75rem] sm:w-[8.375rem] sm:rounded-[5px]">
									<Plus className="h-3.5 w-3.5 sm:h-5 sm:w-5" aria-hidden="true" />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block text-sm font-semibold">{textos.criarProprio}</span>
									<span className="mt-0.5 block text-xs">{t.planner.emBreve}</span>
								</span>
							</button>
						</motion.li>
					</ul>
				</div>
			</div>
		</div>
	)
}
