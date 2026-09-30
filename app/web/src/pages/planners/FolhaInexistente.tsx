import { motion } from 'motion/react'
import { Pencil, Plus } from 'lucide-react'
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
	onEditar,
	onCriarModelo,
}: {
	data: Date
	onDataChange: (data: Date) => void
	expandido: boolean
	primeiraVez: boolean
	opcoes: OpcaoModelo[]
	// Modelo em destaque: o recomendado na primeira vez, o do dia da semana nas outras.
	destaqueId: string | null
	onEscolher: (modelo: Modelo) => void
	// ✎ em cada card. Ausente na primeira vez (os prontos ainda não são da pessoa pra editar).
	onEditar?: (modelo: Modelo) => void
	onCriarModelo: () => void
}) {
	const { t } = useIdioma()
	const textos = t.planner.folhaInexistente
	const classeLargura = expandido ? CLASSE_LARGURA_EXPANDIDA : CLASSE_LARGURA_NORMAL

	return (
		<div className={'mx-auto transition-[max-width] duration-300 ease-out ' + classeLargura}>
			<div
				className={
					// max-sm:pt-8: espaço pra linha de controles do celular, que entra na folha pelo topo.
					'flex flex-col rounded-scaffold-lg border-2 border-dashed border-border p-5 max-sm:pt-8 sm:p-8 ' +
					(expandido ? 'min-h-[70svh]' : 'sm:aspect-[148/210]')
				}
			>
				{/* @container: o formato da data (DiaStepper) segue a largura da folha. */}
				<div className="@container shrink-0">
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
									className="relative"
								>
									<button
										type="button"
										onClick={() => onEscolher(modelo)}
										className={
											'flex h-full w-full items-center gap-3 rounded-scaffold border px-3 py-2.5 text-left transition-[border-color,box-shadow] hover:shadow-raised sm:flex-col sm:items-center sm:gap-2.5 sm:px-4 sm:pb-4 sm:pt-5 sm:text-center ' +
											(onEditar ? 'pr-11 sm:pr-4 ' : '') +
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
									{/* Irmão do card (não dentro: botão dentro de botão não é permitido). Celular: à
									    direita, no meio da linha; tela larga: no canto de cima. */}
									{onEditar && (
										<button
											type="button"
											onClick={() => onEditar(modelo)}
											aria-label={t.planner.editorModelo.editar(modelo.nome)}
											title={t.planner.editorModelo.editar(modelo.nome)}
											className={
												'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors sm:top-2 sm:translate-y-0 ' +
												(destaque ? 'text-accent-ink/80 hover:bg-black/10 hover:text-accent-ink' : 'text-ink-soft hover:bg-bg hover:text-ink')
											}
										>
											<Pencil className="h-3.5 w-3.5" aria-hidden="true" />
										</button>
									)}
								</motion.li>
							)
						})}

						{/* Última opção sempre: montar o próprio (abre a janela de modelo). */}
						<motion.li
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: opcoes.length * 0.05, duration: 0.25 }}
						>
							<button
								type="button"
								onClick={onCriarModelo}
								className="flex h-full w-full items-center gap-3 rounded-scaffold border border-dashed border-border px-3 py-2.5 text-left text-ink-soft transition-colors hover:border-ink-soft hover:text-ink sm:flex-col sm:justify-center sm:gap-2.5 sm:px-4 sm:pb-4 sm:pt-5 sm:text-center"
							>
								<span className="flex h-10 w-[3.75rem] shrink-0 items-center justify-center rounded-[3px] border border-dashed border-ink-soft/50 sm:h-[5.75rem] sm:w-[8.375rem] sm:rounded-[5px]">
									<Plus className="h-3.5 w-3.5 sm:h-5 sm:w-5" aria-hidden="true" />
								</span>
								<span className="min-w-0 flex-1 text-sm font-semibold">{textos.criarProprio}</span>
							</button>
						</motion.li>
					</ul>
				</div>
			</div>
		</div>
	)
}
