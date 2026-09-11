import { PageHeader } from '../components/PageHeader'

const abas = [
	{
		nome: 'Aba 1 — Visão geral do mês',
		descricao: 'Categoria, orçado, gasto até agora, saldo restante (destacado se negativo). Gráfico de barra orçado x gasto.',
	},
	{
		nome: 'Aba 2 — Orçamento fatiado por semana',
		descricao: 'Categorias variáveis (alimentação, delivery, lazer) divididas em 4 fatias semanais — um total mensal é grande demais pra gerar alerta a tempo.',
	},
	{
		nome: 'Aba 3 — Delivery / gasto por impulso',
		descricao: 'Categoria isolada, saldo visível e decrescente. Quando chega a zero, acabou — sem negociar "só dessa vez".',
	},
	{
		nome: 'Aba 4 — Congressos e viagens de trabalho',
		descricao: 'Separado do orçamento pessoal: viagem, categoria, orçado, gasto real, reembolsável.',
	},
]

export function Financeiro() {
	return (
		<div>
			<PageHeader
				titulo="Financeiro"
				categoria="notion-sheets"
				descricao="Estrutura de planilha pra visibilidade de gasto e controle de impulso — TDAH precisa ver o saldo diminuir, não só saber o número."
			/>

			<div className="space-y-3">
				{abas.map((aba) => (
					<div key={aba.nome} className="rounded-scaffold border border-border bg-bg-raised p-4">
						<h3 className="font-semibold">{aba.nome}</h3>
						<p className="mt-1 text-sm text-ink-soft">{aba.descricao}</p>
					</div>
				))}
			</div>

			<div className="mt-6 rounded-scaffold border-2 p-4" style={{ borderColor: 'var(--color-caution)' }}>
				<h3 className="font-semibold" style={{ color: 'var(--color-caution)' }}>
					Regra de ouro: cooling-off period
				</h3>
				<p className="mt-1 text-sm text-ink-soft">
					Antes de qualquer compra não planejada: espere 24 horas. Anote numa lista de "quero comprar" em vez de
					comprar na hora. Se depois de 24h ainda fizer sentido, compra.
				</p>
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-3">
				<button
					type="button"
					disabled
					title="Ainda não configurado — crie a planilha mestre e cole o link aqui"
					className="cursor-not-allowed rounded-scaffold bg-accent px-4 py-2 font-medium text-accent-ink opacity-50"
				>
					Abrir modelo no Sheets
				</button>
				<span className="text-xs text-ink-soft">Link pendente — sem planilha mestre configurada ainda.</span>
			</div>

			<p className="mt-6 text-xs text-ink-soft">
				Alternativa pronta, se a planilha manual virar fricção demais: Mobills (metas por envelope) ou Organizze
				(mais leve, controle compartilhado).
			</p>
		</div>
	)
}
