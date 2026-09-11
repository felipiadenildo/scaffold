import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { categoriasDopamina } from '../data/dopamineMenu'

function sortearIndice(tamanho: number, evitar: number) {
	if (tamanho <= 1) return 0
	let i = Math.floor(Math.random() * tamanho)
	while (i === evitar) i = Math.floor(Math.random() * tamanho)
	return i
}

export function DopamineMenu() {
	const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
	const [indice, setIndice] = useState(0)
	const [extras, setExtras] = useState<Record<string, string[]>>({})
	const [novoItem, setNovoItem] = useState('')

	const categoria = categoriasDopamina.find((c) => c.slug === categoriaAtiva)
	const sugestoes = useMemo(
		() => (categoria ? [...categoria.sugestoes, ...(extras[categoria.slug] ?? [])] : []),
		[categoria, extras],
	)

	function escolherCategoria(slug: string) {
		setCategoriaAtiva(slug)
		setIndice(0)
	}

	function outraSugestao() {
		setIndice((i) => sortearIndice(sugestoes.length, i))
	}

	function adicionarItem() {
		if (!categoria || !novoItem.trim()) return
		setExtras((prev) => ({
			...prev,
			[categoria.slug]: [...(prev[categoria.slug] ?? []), novoItem.trim()],
		}))
		setNovoItem('')
	}

	return (
		<div>
			<PageHeader
				titulo="Dopamine Menu"
				categoria="web"
				descricao="A tela toda de opções recria a mesma paralisia de escolha que o menu tenta resolver. Escolha uma categoria e receba uma sugestão por vez."
			/>

			{!categoria ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{categoriasDopamina.map((c) => (
						<button
							key={c.slug}
							type="button"
							onClick={() => escolherCategoria(c.slug)}
							className="rounded-scaffold border border-border bg-bg-raised p-4 text-left transition-colors hover:border-accent"
						>
							<div className="font-semibold">{c.nome}</div>
							<div className="mt-1 text-xs text-ink-soft">{c.esforco}</div>
						</button>
					))}
				</div>
			) : (
				<div>
					<button type="button" onClick={() => setCategoriaAtiva(null)} className="text-sm text-ink-soft hover:text-ink">
						← Trocar categoria
					</button>

					<div className="mt-4 min-h-32 rounded-scaffold border border-border bg-bg-raised p-6">
						<AnimatePresence mode="wait">
							<motion.p
								key={indice + sugestoes[indice]}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								transition={{ duration: 0.18 }}
								className="text-xl font-medium"
							>
								{sugestoes[indice]}
							</motion.p>
						</AnimatePresence>
					</div>

					<button
						type="button"
						onClick={outraSugestao}
						className="mt-4 rounded-scaffold bg-accent px-4 py-2 font-medium text-accent-ink"
					>
						Outra sugestão
					</button>

					<div className="mt-8 flex gap-2">
						<input
							value={novoItem}
							onChange={(e) => setNovoItem(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
							placeholder={`Adicionar opção em "${categoria.nome}"`}
							className="flex-1 rounded-scaffold border border-border bg-bg px-3 py-2 text-sm"
						/>
						<button
							type="button"
							onClick={adicionarItem}
							className="rounded-scaffold border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink"
						>
							Adicionar
						</button>
					</div>
					<p className="mt-2 text-xs text-ink-soft">
						Fica só nesta sessão por enquanto — salvar de verdade entra quando o backend existir.
					</p>
				</div>
			)}
		</div>
	)
}
