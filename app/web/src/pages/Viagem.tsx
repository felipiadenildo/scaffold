import { PageHeader } from '../components/PageHeader'

const checklists = [
	{
		nome: 'Ônibus intermunicipal',
		itens: [
			'Passagem comprada e confirmada',
			'Documento separado, não no fundo da mala',
			'Horário de embarque anotado com 30 min de margem',
			'Ponto de encontro conferido no mapa',
			'Bagagem de mão: carregador, água, lanche, Cartão SOS',
		],
	},
	{
		nome: 'Voo doméstico',
		itens: [
			'Passagem confirmada',
			'Check-in online feito assim que abrir (24–48h antes)',
			'Franquia de bagagem conferida',
			'Documento separado',
			'Chegada ao aeroporto: 1h30–2h antes (nacional)',
		],
	},
]

export function Viagem() {
	return (
		<div>
			<PageHeader
				titulo="Viagem"
				categoria="notion-sheets"
				descricao="Checklists de ônibus e voo, mais checklist de verificação de IA — pra duplicar a cada viagem nova, nunca planejar do zero."
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{checklists.map((c) => (
					<div key={c.nome} className="rounded-scaffold border border-border bg-bg-raised p-4">
						<h3 className="font-semibold">{c.nome}</h3>
						<ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
							{c.itens.map((item) => (
								<li key={item} className="flex gap-2">
									<span>·</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="mt-6 rounded-scaffold border-2 p-4" style={{ borderColor: 'var(--color-sos)' }}>
				<h3 className="font-semibold" style={{ color: 'var(--color-sos)' }}>
					Regra fixa: IA planeja, humano confere
				</h3>
				<p className="mt-1 text-sm text-ink-soft">
					~90% dos itinerários gerados por IA têm pelo menos um erro. Nunca reserve nada só com base na resposta da
					IA — confira data, endereço e preço na fonte oficial antes de qualquer reserva.
				</p>
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-3">
				<button
					type="button"
					disabled
					title="Modelo mestre no Notion ainda não criado"
					className="cursor-not-allowed rounded-scaffold bg-accent px-4 py-2 font-medium text-accent-ink opacity-50"
				>
					Duplicar no Notion
				</button>
				<span className="text-xs text-ink-soft">Link pendente — confirmar antes de criar o modelo mestre.</span>
			</div>
		</div>
	)
}
