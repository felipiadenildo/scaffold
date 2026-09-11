import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { blocosDia, protocoloBaixoEsforco } from '../data/folhaA5'

export function FolhaA5Digital() {
	const [lado, setLado] = useState<'frente' | 'verso'>('frente')
	const [energia, setEnergia] = useState<'baixa' | 'media' | 'alta' | null>(null)
	const [vitoria, setVitoria] = useState('')
	const [brainDump, setBrainDump] = useState('')
	const [protocolo, setProtocolo] = useState<Record<string, boolean>>({})

	return (
		<div>
			<PageHeader
				titulo="Folha A5 — versão digital"
				categoria="web"
				descricao="Inspirada em agendas tipo Google Calendar: blocos coloridos por período, frente e verso. A versão impressa (baixável) segue o mesmo conteúdo em papel."
			/>

			<div className="mb-6 flex gap-2">
				{(['frente', 'verso'] as const).map((l) => (
					<button
						key={l}
						type="button"
						onClick={() => setLado(l)}
						className={
							'rounded-scaffold px-4 py-2 text-sm font-medium transition-colors ' +
							(lado === l ? 'bg-accent text-accent-ink' : 'border border-border text-ink-soft hover:text-ink')
						}
					>
						{l === 'frente' ? 'Frente — o dia' : 'Verso — descarga mental'}
					</button>
				))}
			</div>

			<AnimatePresence mode="wait">
				{lado === 'frente' ? (
					<motion.div key="frente" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<div className="mb-4 flex flex-wrap items-center gap-3 rounded-scaffold border border-border bg-bg-raised p-3">
							<span className="text-sm font-medium">Energia hoje:</span>
							{(['baixa', 'media', 'alta'] as const).map((e) => (
								<button
									key={e}
									type="button"
									onClick={() => setEnergia(e)}
									className={
										'rounded-full px-3 py-1 text-xs capitalize transition-colors ' +
										(energia === e ? 'bg-accent text-accent-ink' : 'border border-border text-ink-soft')
									}
								>
									{e}
								</button>
							))}
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{blocosDia.map((bloco) => (
								<div
									key={bloco.slug}
									className="rounded-scaffold border border-border p-4"
									style={{ borderLeft: `4px solid ${bloco.cor}` }}
								>
									<div className="flex items-baseline justify-between">
										<h3 className="font-semibold">{bloco.periodo}</h3>
										<span className="text-xs text-ink-soft">âncora: {bloco.ancora}</span>
									</div>
									<div className="mt-3 space-y-2">
										{bloco.campos.map((campo) => (
											<input
												key={campo}
												placeholder={campo}
												className="w-full rounded-scaffold border border-border bg-bg-raised px-2.5 py-1.5 text-sm placeholder:text-ink-soft"
											/>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="mt-4 flex items-center gap-2 rounded-scaffold border border-border bg-bg-raised p-3">
							<span className="font-medium">🏆 Vitória do dia:</span>
							<input
								value={vitoria}
								onChange={(e) => setVitoria(e.target.value)}
								className="flex-1 border-b border-dashed border-border bg-transparent px-1 text-sm outline-none"
							/>
						</div>
					</motion.div>
				) : (
					<motion.div key="verso" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<div className="rounded-scaffold border border-dashed border-border p-4">
							<h3 className="font-semibold">🧠 Caixa de entrada</h3>
							<p className="mt-1 text-xs text-ink-soft">Qualquer pensamento que atravessar o dia, anota aqui.</p>
							<textarea
								value={brainDump}
								onChange={(e) => setBrainDump(e.target.value)}
								rows={6}
								className="mt-3 w-full rounded-scaffold border border-border bg-bg-raised p-2.5 text-sm"
							/>
						</div>

						<div className="mt-4 rounded-scaffold border-2 p-4" style={{ borderColor: 'var(--color-sos)' }}>
							<h3 className="font-semibold" style={{ color: 'var(--color-sos)' }}>
								🆘 Se hoje for um dia ruim: Protocolo de Baixo Esforço
							</h3>
							<div className="mt-3 space-y-2">
								{protocoloBaixoEsforco.map((item) => (
									<label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
										<input
											type="checkbox"
											checked={!!protocolo[item]}
											onChange={() => setProtocolo((p) => ({ ...p, [item]: !p[item] }))}
										/>
										<span className={protocolo[item] ? 'text-ink-soft line-through' : ''}>{item}</span>
									</label>
								))}
							</div>
							<p className="mt-3 text-xs text-ink-soft">
								Se os 4 acima foram feitos, o dia foi um sucesso. Vire a página — amanhã é outra folha.
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<p className="mt-8 text-xs text-ink-soft">
				Nada aqui salva entre sessões ainda. A versão impressa (baixável em breve) é a que vai no fichário físico.
			</p>
		</div>
	)
}
