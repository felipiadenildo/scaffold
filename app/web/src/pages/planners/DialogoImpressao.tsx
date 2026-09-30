import { Check, File, Files, Info, Printer, TriangleAlert } from 'lucide-react'
import { classeBotaoDialogoPrincipal, Dialogo } from '../../components/Dialogo'
import { useIdioma } from '../../i18n/useIdioma'
import type { ConteudoImpressao, OpcoesImpressao } from '../../pdf/useConteudoImpressao'
import type { OpcaoModelo } from './FolhaInexistente'
import { MiniaturaModelo } from './MiniaturaModelo'
import { PreviaImpressao } from './PreviaImpressao'

// Imprimir = escolher de qual modelo sai a folha em branco, ajustar as opções vendo a prévia, e
// baixar em A5 ou A4. As listas (hábitos e "não pode deixar de fazer") saem com os itens de hoje
// ou com linhas em branco — a única parte da folha que não vem do modelo (useConteudoImpressao).
//
// Tamanho fixo: nada aparece ou some ao mexer nas opções — a prévia tem página de tamanho fixo, as
// opções ficam sempre à vista (desativadas quando não se aplicam) e o aviso ocupa um espaço
// reservado, trocando só o texto.
// Tela larga: à esquerda o modelo, as opções e o aviso; à direita a prévia e o download.
export function DialogoImpressao({
	opcoes,
	selecionadoId,
	onSelecionar,
	conteudo,
	opcoesImpressao,
	onMudarOpcoes,
	naoCabe,
	onBaixarA5,
	onBaixarA4,
	gerando,
	onFechar,
}: {
	opcoes: OpcaoModelo[]
	selecionadoId: string | null
	onSelecionar: (id: string) => void
	conteudo: ConteudoImpressao
	opcoesImpressao: OpcoesImpressao
	onMudarOpcoes: (mudancas: Partial<OpcoesImpressao>) => void
	// A folha passou do tamanho A5 (listas longas demais): o PDF sai reduzido.
	naoCabe: boolean
	onBaixarA5: () => void
	onBaixarA4: () => void
	gerando: boolean
	onFechar: () => void
}) {
	const { t } = useIdioma()
	const textos = t.impressao
	const { estrutura } = conteudo
	const temListas = estrutura.habitos || estrutura.importantes
	const classeBotaoFormato =
		classeBotaoDialogoPrincipal + ' flex flex-col items-center gap-0.5 disabled:cursor-wait disabled:opacity-60'
	const classeOpcao = 'flex cursor-pointer items-center gap-2 text-sm'

	return (
		<Dialogo idTitulo="imprimir-titulo" onFechar={onFechar} largura="lg">
			<h2 id="imprimir-titulo" className="flex items-center gap-2 text-lg font-bold">
				<Printer className="h-5 w-5 text-paper-ink-soft" aria-hidden="true" />
				{textos.imprimirFolha}
			</h2>

			{/* Celular: a prévia vem primeiro (ordem do HTML), depois modelo/opções/aviso, depois download. */}
			<div className="grid gap-x-8 sm:grid-cols-2 sm:grid-rows-[auto_1fr]">
				<div className="mt-4 sm:col-start-2 sm:row-start-1">
					<p className="mb-2 text-sm text-paper-ink-soft">{textos.previa}</p>
					<PreviaImpressao conteudo={conteudo} opcoes={opcoesImpressao} />
				</div>

				<div className="sm:col-start-1 sm:row-span-2 sm:row-start-1">
					<p className="mt-4 text-sm text-paper-ink-soft">{textos.escolhaModelo}</p>
					<ul className="mt-2 flex max-h-[40svh] flex-col gap-1.5 overflow-y-auto p-0.5">
						{opcoes.map(({ modelo }) => {
							const selecionado = modelo.id === selecionadoId
							return (
								<li key={modelo.id}>
									<button
										type="button"
										aria-pressed={selecionado}
										// Foco inicial no modelo já escolhido (não no primeiro da lista).
										autoFocus={selecionado}
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

					<h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-paper-ink-soft">{textos.opcoes}</h3>
					<div className="mt-2 flex flex-col gap-2.5">
						<label className={classeOpcao}>
							<input
								type="checkbox"
								checked={opcoesImpressao.economizarTinta}
								onChange={() => onMudarOpcoes({ economizarTinta: !opcoesImpressao.economizarTinta })}
								className="h-4 w-4 shrink-0 accent-accent"
							/>
							<span>
								{textos.economizarTinta}
								<span className="block text-xs text-paper-ink-soft">{textos.economizarTintaDica}</span>
							</span>
						</label>
						<label className={classeOpcao}>
							<input
								type="checkbox"
								checked={opcoesImpressao.pretoEBranco}
								onChange={() => onMudarOpcoes({ pretoEBranco: !opcoesImpressao.pretoEBranco })}
								className="h-4 w-4 shrink-0 accent-accent"
							/>
							{textos.pretoEBranco}
						</label>

						<label className={classeOpcao}>
							<input
								type="checkbox"
								checked={opcoesImpressao.linhasDeCaderno}
								onChange={() => onMudarOpcoes({ linhasDeCaderno: !opcoesImpressao.linhasDeCaderno })}
								className="h-4 w-4 shrink-0 accent-accent"
							/>
							{textos.linhasDeCaderno}
						</label>
						{/* Uma escolha só pras duas listas; desativada se o modelo não tem listas. */}
						<label className={classeOpcao + (temListas ? '' : ' cursor-not-allowed opacity-50')}>
							<input
								type="checkbox"
								disabled={!temListas}
								checked={opcoesImpressao.listas === 'linhas'}
								onChange={() => onMudarOpcoes({ listas: opcoesImpressao.listas === 'linhas' ? 'itens' : 'linhas' })}
								className="h-4 w-4 shrink-0 accent-accent"
							/>
							{textos.linhasNasListas}
						</label>
					</div>

					{/* Espaço reservado (min-h): troca só o texto — o aviso de "não cabe" tem prioridade. */}
					<p
						role={naoCabe ? 'status' : undefined}
						className={
							'mt-3 flex min-h-[7rem] gap-2 rounded-scaffold border p-3 text-xs leading-relaxed ' +
							(naoCabe
								? 'border-caution/40 bg-caution-bg text-paper-ink'
								: 'border-paper-ink/15 text-paper-ink-soft')
						}
					>
						{naoCabe ? (
							<TriangleAlert className="mt-px h-4 w-4 shrink-0 text-caution" aria-hidden="true" />
						) : (
							<Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
						)}
						{naoCabe ? textos.naoCabe : opcoesImpressao.listas === 'linhas' ? textos.avisoLinhas : textos.avisoListas}
					</p>
				</div>

				<div className="sm:col-start-2 sm:row-start-2">
					<p className="mt-4 text-sm text-paper-ink-soft">{gerando ? textos.gerandoPdf : textos.formato}</p>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<button type="button" onClick={onBaixarA5} disabled={gerando || !selecionadoId} className={classeBotaoFormato}>
							<span className="flex items-center gap-1.5">
								<File className="h-4 w-4" aria-hidden="true" />
								A5
							</span>
							<span className="text-xs font-normal opacity-85">{textos.umPorFolha}</span>
						</button>
						<button type="button" onClick={onBaixarA4} disabled={gerando || !selecionadoId} className={classeBotaoFormato}>
							<span className="flex items-center gap-1.5">
								<Files className="h-4 w-4" aria-hidden="true" />
								A4
							</span>
							<span className="text-xs font-normal opacity-85">{textos.doisPorFolha}</span>
						</button>
					</div>
				</div>
			</div>
		</Dialogo>
	)
}
