import { ArrowRight, Info, Minus, Plus, Scissors, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { classeBotaoDialogoPrincipal, classeBotaoDialogoSecundario, Dialogo } from '../../components/Dialogo'
import { blocosVisuais } from '../../data/planner/cores'
import { destinosDoTexto } from '../../data/planner/dias'
import { ajustarQuantidadeBlocos, criarEstrutura, MAX_BLOCOS, MIN_BLOCOS } from '../../data/planner/modelos'
import type { Dia, Estrutura, Modelo } from '../../data/planner/tipos'
import { useIdioma } from '../../i18n/useIdioma'
import { MiniaturaModelo } from './MiniaturaModelo'

// O que a janela está editando. A mesma janela serve pros três casos (decisão: sem página de
// editor — PLANO-FASE-0.md); muda só o que aparece e o que acontece ao salvar.
export type AlvoEdicao = { tipo: 'novo' } | { tipo: 'modelo'; modelo: Modelo } | { tipo: 'dia'; dia: Dia }

export interface ResultadoEdicao {
	nome: string
	estrutura: Estrutura
	diasSemana: number[]
	// Só no dia: modelo usado como atalho ("Usar o formato de"), pra registrar de onde veio.
	modeloId: string | null
}

// Domingo, 4 de janeiro de 2026 — base pra pegar o nome de cada dia da semana no idioma atual.
const DOMINGO_DE_REFERENCIA = new Date(2026, 0, 4)

export function DialogoModelo({
	alvo,
	modelos,
	podeExcluir,
	onSalvar,
	onExcluir,
	onFechar,
}: {
	alvo: AlvoEdicao
	// Pros atalhos "Usar o formato de" (só ao editar um dia).
	modelos: Modelo[]
	podeExcluir: boolean
	onSalvar: (resultado: ResultadoEdicao) => void
	onExcluir: () => void
	onFechar: () => void
}) {
	const { t, locale } = useIdioma()
	const textos = t.planner.editorModelo
	const sugestoes = t.planner.sugestoesBlocos

	// Rascunho: nada é gravado até Salvar. Cancelar/Esc/clicar fora descarta.
	const [nome, setNome] = useState(alvo.tipo === 'modelo' ? alvo.modelo.nome : '')
	const [estrutura, setEstrutura] = useState<Estrutura>(() => {
		if (alvo.tipo === 'modelo') return structuredClone(alvo.modelo.estrutura)
		if (alvo.tipo === 'dia') return structuredClone(alvo.dia.estrutura)
		return criarEstrutura(sugestoes[3])
	})
	const [diasSemana, setDiasSemana] = useState<number[]>(alvo.tipo === 'modelo' ? alvo.modelo.diasSemana : [])
	const [modeloId, setModeloId] = useState<string | null>(alvo.tipo === 'dia' ? alvo.dia.modeloId : null)

	const ehDia = alvo.tipo === 'dia'
	const titulo = alvo.tipo === 'novo' ? textos.novo : alvo.tipo === 'modelo' ? textos.editar(alvo.modelo.nome) : textos.editarDia
	const blocos = blocosVisuais(estrutura.blocos)
	const movimentos = useMemo(() => (alvo.tipo === 'dia' ? destinosDoTexto(alvo.dia, estrutura) : []), [alvo, estrutura])
	const nomesDiasSemana = useMemo(
		() =>
			Array.from({ length: 7 }, (_, i) => {
				const data = new Date(DOMINGO_DE_REFERENCIA)
				data.setDate(data.getDate() + i)
				return {
					curto: data.toLocaleDateString(locale, { weekday: 'narrow' }),
					longo: data.toLocaleDateString(locale, { weekday: 'long' }),
				}
			}),
		[locale],
	)

	function mudarQuantidade(delta: number) {
		setEstrutura((e) => ({ ...e, blocos: ajustarQuantidadeBlocos(e.blocos, e.blocos.length + delta, sugestoes) }))
	}

	function renomearBloco(id: string, novoNome: string) {
		setEstrutura((e) => ({
			...e,
			blocos: e.blocos.map((b) => (b.id === id ? { ...b, nome: novoNome, nomeEditado: true } : b)),
		}))
	}

	function alternar(secao: 'humor' | 'sobreDia' | 'habitos' | 'importantes') {
		setEstrutura((e) => ({ ...e, [secao]: !e[secao] }))
	}

	function usarFormatoDe(modelo: Modelo) {
		setEstrutura(structuredClone(modelo.estrutura))
		setModeloId(modelo.id)
	}

	function salvar() {
		// Nome de bloco apagado volta pro sugerido daquela posição.
		const final: Estrutura = {
			...estrutura,
			blocos: estrutura.blocos.map((b, i) =>
				b.nome.trim() ? { ...b, nome: b.nome.trim() } : { ...b, nome: sugestoes[estrutura.blocos.length - 1][i], nomeEditado: false },
			),
		}
		onSalvar({ nome: nome.trim() || textos.novo, estrutura: final, diasSemana, modeloId })
	}

	const classeSecao = 'mt-5 text-xs font-semibold uppercase tracking-wide text-paper-ink-soft'
	const classeOpcao = 'flex cursor-pointer items-center gap-2 text-sm'

	return (
		<Dialogo idTitulo="modelo-titulo" onFechar={onFechar}>
			<h2 id="modelo-titulo" className="flex items-center gap-2 text-lg font-bold">
				<Scissors className="h-5 w-5 shrink-0 text-paper-ink-soft" aria-hidden="true" />
				<span className="min-w-0 truncate">{titulo}</span>
			</h2>

			{ehDia && modelos.length > 0 && (
				<div className="mt-4">
					<p className="text-sm text-paper-ink-soft">{textos.usarFormatoDe}</p>
					<div className="mt-2 flex flex-wrap gap-1.5">
						{modelos.map((modelo) => (
							<button
								key={modelo.id}
								type="button"
								onClick={() => usarFormatoDe(modelo)}
								className="rounded-full border border-paper-ink/20 px-3 py-1 text-xs font-medium transition-colors hover:border-paper-ink/45"
							>
								{modelo.nome}
							</button>
						))}
					</div>
				</div>
			)}

			{!ehDia && (
				<label className="mt-4 block">
					<span className="text-sm text-paper-ink-soft">{textos.nome}</span>
					<input
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						placeholder={textos.nomePlaceholder}
						className="mt-1 w-full rounded-scaffold border border-paper-ink/20 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-paper-ink-soft/70 focus:border-accent"
					/>
				</label>
			)}

			{/* Prévia ao vivo: o formato da folha muda a cada escolha. Moldura tracejada = "em edição". */}
			<div className="mt-5 flex justify-center rounded-scaffold border border-dashed border-paper-ink/25 py-4">
				<MiniaturaModelo estrutura={estrutura} />
			</div>

			<h3 className={classeSecao}>{textos.frente}</h3>
			<div className="mt-2 flex items-center justify-between gap-3">
				<span className="text-sm">{textos.blocos}</span>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => mudarQuantidade(-1)}
						disabled={estrutura.blocos.length <= MIN_BLOCOS}
						aria-label={textos.menosBloco}
						title={textos.menosBloco}
						className="rounded-full border border-paper-ink/20 p-1.5 transition-colors hover:border-paper-ink/45 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<Minus className="h-3.5 w-3.5" aria-hidden="true" />
					</button>
					<span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
						{estrutura.blocos.length}
					</span>
					<button
						type="button"
						onClick={() => mudarQuantidade(1)}
						disabled={estrutura.blocos.length >= MAX_BLOCOS}
						aria-label={textos.maisBloco}
						title={textos.maisBloco}
						className="rounded-full border border-paper-ink/20 p-1.5 transition-colors hover:border-paper-ink/45 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<Plus className="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				</div>
			</div>
			<ul className="mt-2 flex flex-col gap-1.5">
				{blocos.map((bloco, i) => (
					<li key={bloco.id}>
						<input
							value={bloco.nome}
							onChange={(e) => renomearBloco(bloco.id, e.target.value)}
							aria-label={textos.nomeBloco(i + 1)}
							placeholder={sugestoes[blocos.length - 1][i]}
							// Mesmo par de cores do cabeçalho do bloco na folha (fundo suave + friso).
							style={{ backgroundColor: bloco.corSuave, borderLeftColor: bloco.cor }}
							className="w-full rounded-scaffold border-l-4 px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-accent"
						/>
					</li>
				))}
			</ul>
			<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
				<label className={classeOpcao}>
					<input type="checkbox" checked={estrutura.humor} onChange={() => alternar('humor')} className="h-4 w-4 accent-accent" />
					{textos.humor}
				</label>
				<label className={classeOpcao}>
					<input type="checkbox" checked={estrutura.sobreDia} onChange={() => alternar('sobreDia')} className="h-4 w-4 accent-accent" />
					{textos.sobreODia}
				</label>
			</div>

			<h3 className={classeSecao}>{textos.verso}</h3>
			<div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
				<label className={classeOpcao}>
					<input type="checkbox" checked={estrutura.habitos} onChange={() => alternar('habitos')} className="h-4 w-4 accent-accent" />
					{textos.habitos}
				</label>
				<label className={classeOpcao}>
					<input
						type="checkbox"
						checked={estrutura.importantes}
						onChange={() => alternar('importantes')}
						className="h-4 w-4 accent-accent"
					/>
					{textos.importantes}
				</label>
			</div>
			<p className="mt-2 text-xs text-paper-ink-soft">{textos.avisoItens}</p>

			{!ehDia && (
				<>
					<h3 className={classeSecao}>{textos.diasSemana}</h3>
					<div className="mt-2 flex gap-1.5">
						{nomesDiasSemana.map(({ curto, longo }, dia) => {
							const ativo = diasSemana.includes(dia)
							return (
								<button
									key={dia}
									type="button"
									aria-pressed={ativo}
									aria-label={longo}
									title={longo}
									onClick={() =>
										setDiasSemana((atual) => (ativo ? atual.filter((d) => d !== dia) : [...atual, dia].sort((a, b) => a - b)))
									}
									className={
										'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold uppercase transition-colors ' +
										(ativo ? 'border-accent bg-accent text-accent-ink' : 'border-paper-ink/20 hover:border-paper-ink/45')
									}
								>
									{curto}
								</button>
							)
						})}
					</div>
				</>
			)}

			{(alvo.tipo === 'modelo' || ehDia) && (
				<div className="mt-5 flex flex-col gap-1.5 rounded-scaffold border border-paper-ink/15 p-3 text-xs leading-relaxed text-paper-ink-soft">
					<p className="flex gap-2">
						<Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
						{ehDia ? textos.avisoDia : textos.avisoModelo}
					</p>
					{movimentos.map(({ de, para }) => (
						<p key={de.id} className="flex gap-2 font-medium text-paper-ink">
							<ArrowRight className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
							{textos.textoVaiPara(de.nome, para.nome)}
						</p>
					))}
				</div>
			)}

			<div className="mt-6 flex flex-wrap items-center justify-between gap-2">
				{podeExcluir ? (
					<button
						type="button"
						onClick={onExcluir}
						className="flex items-center gap-1.5 rounded-scaffold px-2 py-2 text-sm text-paper-ink-soft transition-colors hover:text-paper-ink"
					>
						<Trash2 className="h-4 w-4" aria-hidden="true" />
						{textos.excluir}
					</button>
				) : (
					<span />
				)}
				<form method="dialog" className="flex gap-2">
					<button type="submit" className={classeBotaoDialogoSecundario}>
						{t.app.cancelar}
					</button>
					<button type="button" onClick={salvar} className={classeBotaoDialogoPrincipal}>
						{textos.salvar}
					</button>
				</form>
			</div>
		</Dialogo>
	)
}
