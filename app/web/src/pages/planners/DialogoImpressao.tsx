import { Check, File, Files, Info, Printer } from 'lucide-react'
import { classeBotaoDialogoPrincipal, Dialogo } from '../../components/Dialogo'
import { useIdioma } from '../../i18n/useIdioma'
import type { OpcaoModelo } from './FolhaInexistente'
import { MiniaturaModelo } from './MiniaturaModelo'

// Imprimir = escolher de qual modelo sai a folha em branco, e o formato. Um aviso explica que as
// listas (hábitos e "não pode deixar de fazer") saem com os itens de hoje — é a única parte da folha
// impressa que não vem do modelo (ver useConteudoImpressao).
export function DialogoImpressao({
	opcoes,
	selecionadoId,
	onSelecionar,
	onBaixarA5,
	onBaixarA4,
	gerando,
	onFechar,
}: {
	opcoes: OpcaoModelo[]
	selecionadoId: string | null
	onSelecionar: (id: string) => void
	onBaixarA5: () => void
	onBaixarA4: () => void
	gerando: boolean
	onFechar: () => void
}) {
	const { t } = useIdioma()
	const textos = t.impressao

	return (
		<Dialogo idTitulo="imprimir-titulo" onFechar={onFechar}>
			<h2 id="imprimir-titulo" className="flex items-center gap-2 text-lg font-bold">
				<Printer className="h-5 w-5 text-paper-ink-soft" aria-hidden="true" />
				{textos.imprimirFolha}
			</h2>

			<p className="mt-4 text-sm text-paper-ink-soft">{textos.escolhaModelo}</p>
			<ul className="mt-2 flex max-h-[40svh] flex-col gap-1.5 overflow-y-auto p-0.5">
				{opcoes.map(({ modelo }) => {
					const selecionado = modelo.id === selecionadoId
					return (
						<li key={modelo.id}>
							<button
								type="button"
								aria-pressed={selecionado}
								onClick={() => onSelecionar(modelo.id)}
								className={
									'flex w-full items-center gap-3 rounded-scaffold border px-3 py-2 text-left transition-colors ' +
									(selecionado
										? 'border-accent bg-accent/10 ring-1 ring-accent'
										: 'border-paper-ink/15 hover:border-paper-ink/35')
								}
							>
								<MiniaturaModelo estrutura={modelo.estrutura} tamanho="pequeno" />
								<span className="flex-1 text-sm font-semibold">{modelo.nome}</span>
								{selecionado && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
							</button>
						</li>
					)
				})}
			</ul>

			<p className="mt-4 flex gap-2 rounded-scaffold border border-paper-ink/15 p-3 text-xs leading-relaxed text-paper-ink-soft">
				<Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
				{textos.avisoListas}
			</p>

			<p className="mt-5 text-sm text-paper-ink-soft">{gerando ? textos.gerandoPdf : textos.formato}</p>
			<div className="mt-2 grid grid-cols-2 gap-2">
				<button
					type="button"
					onClick={onBaixarA5}
					disabled={gerando || !selecionadoId}
					className={classeBotaoDialogoPrincipal + ' flex flex-col items-center gap-0.5 disabled:cursor-wait disabled:opacity-60'}
				>
					<span className="flex items-center gap-1.5">
						<File className="h-4 w-4" aria-hidden="true" />
						A5
					</span>
					<span className="text-xs font-normal opacity-85">{textos.umPorFolha}</span>
				</button>
				<button
					type="button"
					onClick={onBaixarA4}
					disabled={gerando || !selecionadoId}
					className={classeBotaoDialogoPrincipal + ' flex flex-col items-center gap-0.5 disabled:cursor-wait disabled:opacity-60'}
				>
					<span className="flex items-center gap-1.5">
						<Files className="h-4 w-4" aria-hidden="true" />
						A4
					</span>
					<span className="text-xs font-normal opacity-85">{textos.doisPorFolha}</span>
				</button>
			</div>
		</Dialogo>
	)
}
