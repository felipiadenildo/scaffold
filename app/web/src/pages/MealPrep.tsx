import { useState } from 'react'
import { DownloadPrint } from '../components/DownloadPrint'
import { PageHeader } from '../components/PageHeader'

interface ItemFreezer {
	id: string
	prato: string
	data: string
	porcoes: string
}

const itensIniciais: ItemFreezer[] = [{ id: crypto.randomUUID(), prato: '', data: '', porcoes: '' }]

export function MealPrep() {
	const [itens, setItens] = useState<ItemFreezer[]>(itensIniciais)

	function atualizar(id: string, campo: keyof Omit<ItemFreezer, 'id'>, valor: string) {
		setItens((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)))
	}

	function adicionarLinha() {
		setItens((prev) => [...prev, { id: crypto.randomUUID(), prato: '', data: '', porcoes: '' }])
	}

	function removerLinha(id: string) {
		setItens((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev))
	}

	return (
		<div>
			<PageHeader
				titulo="Meal Prep"
				categoria="impresso"
				descricao="Estoque do freezer: o que tem, desde quando, quantas porções — pra identificar sem abrir cada pote. Guardar na altura dos olhos, não no fundo."
			/>

			<DownloadPrint
				preview="/print/meal-prep/preview.png"
				arquivos={[{ label: 'Baixar folha de estoque (PDF)', href: '/print/meal-prep/meal-prep.pdf' }]}
			/>

			<div
				className="overflow-hidden rounded-scaffold border border-border"
				style={{ borderTop: '4px solid #5fb3d9' }}
			>
				<div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-border bg-bg-raised p-3 text-xs font-medium text-ink-soft">
					<span>Prato</span>
					<span>Data</span>
					<span>Porções</span>
					<span />
				</div>
				{itens.map((item) => (
					<div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border p-3 last:border-b-0">
						<input
							value={item.prato}
							onChange={(e) => atualizar(item.id, 'prato', e.target.value)}
							placeholder="ex: Frango com brócolis 🍗🥦"
							className="rounded-scaffold border border-border bg-bg px-2 py-1.5 text-sm"
						/>
						<input
							type="date"
							value={item.data}
							onChange={(e) => atualizar(item.id, 'data', e.target.value)}
							className="rounded-scaffold border border-border bg-bg px-2 py-1.5 text-sm"
						/>
						<input
							value={item.porcoes}
							onChange={(e) => atualizar(item.id, 'porcoes', e.target.value)}
							placeholder="3"
							className="w-16 rounded-scaffold border border-border bg-bg px-2 py-1.5 text-sm"
						/>
						<button
							type="button"
							onClick={() => removerLinha(item.id)}
							className="text-ink-soft hover:text-sos"
							aria-label="Remover linha"
						>
							✕
						</button>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={adicionarLinha}
				className="mt-3 rounded-scaffold border border-border px-3 py-1.5 text-sm text-ink-soft hover:text-ink"
			>
				+ Adicionar item
			</button>

			<p className="mt-8 text-xs text-ink-soft">
				Regra: toda vez que cozinhar algo, dobre a receita e congele metade. Itens pra repor entram na Lista de
				Compras da semana.
			</p>
		</div>
	)
}
