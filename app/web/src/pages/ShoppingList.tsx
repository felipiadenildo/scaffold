import { motion } from 'motion/react'
import { useState } from 'react'
import { DownloadPrint } from '../components/DownloadPrint'
import { PageHeader } from '../components/PageHeader'
import { tiposLista } from '../data/listaCompras'

export function ShoppingList() {
	const [tipoAtivo, setTipoAtivo] = useState<string | null>(null)
	const [marcados, setMarcados] = useState<Record<string, boolean>>({})

	const tipo = tiposLista.find((t) => t.slug === tipoAtivo)

	function alternarItem(item: string) {
		setMarcados((prev) => ({ ...prev, [item]: !prev[item] }))
	}

	return (
		<div>
			<PageHeader
				titulo="Lista de Compras"
				categoria="web"
				descricao="Semanal, pontual ou mensal — cada momento pede uma lista diferente, não a mesma lista genérica sempre."
			/>

			<DownloadPrint
				preview="/print/shopping-list/preview.png"
				arquivos={[{ label: 'Baixar folha da semana (PDF)', href: '/print/shopping-list/lista-compras.pdf' }]}
			/>

			{!tipo ? (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{tiposLista.map((t) => (
						<button
							key={t.slug}
							type="button"
							onClick={() => setTipoAtivo(t.slug)}
							className="rounded-scaffold border border-border bg-bg-raised p-4 text-left transition-colors hover:border-accent"
						>
							<div className="font-semibold">{t.nome}</div>
							<div className="mt-1 text-xs text-ink-soft">{t.quando}</div>
						</button>
					))}
				</div>
			) : (
				<div>
					<button type="button" onClick={() => setTipoAtivo(null)} className="text-sm text-ink-soft hover:text-ink">
						← Trocar tipo de lista
					</button>
					<h2 className="mt-3 font-semibold">{tipo.nome}</h2>
					<ul className="mt-3 space-y-2">
						{tipo.itens.map((item) => (
							<motion.li key={item} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
								<label className="flex cursor-pointer items-start gap-3 rounded-scaffold border border-border bg-bg-raised p-3 text-sm">
									<input
										type="checkbox"
										checked={!!marcados[item]}
										onChange={() => alternarItem(item)}
										className="mt-0.5"
									/>
									<span className={marcados[item] ? 'text-ink-soft line-through' : ''}>{item}</span>
								</label>
							</motion.li>
						))}
					</ul>
					<p className="mt-6 text-xs text-ink-soft">
						Próximos passos (não construídos ainda): leitura do QR code do mercado pra montar a lista, upload de
						notinha, detecção automática de qual tipo de lista você mais usa em cada dia.
					</p>
				</div>
			)}
		</div>
	)
}
