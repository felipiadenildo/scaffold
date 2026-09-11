import { PageHeader } from '../components/PageHeader'

export function CartaoSos() {
	return (
		<div>
			<PageHeader
				titulo="Cartão SOS"
				categoria="web"
				descricao="Cinco cartões de crise, um por cenário — ainda em pesquisa de design."
			/>
			<div className="rounded-scaffold border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--color-sos)' }}>
				<p className="font-medium" style={{ color: 'var(--color-sos)' }}>
					Em construção
				</p>
				<p className="mt-2 text-sm text-ink-soft">
					Navegação inicial, flip 3D, frente direta / verso detalhado — o design definitivo entra numa etapa
					futura, quando essa parte for especificada.
				</p>
			</div>
			<p className="mt-6 text-sm text-ink-soft">
				Até lá, o guia de protocolos de crise completo está no{' '}
				<a
					href="https://felipiadenildo.github.io/scaffold/manual/05-protocolos-crise-emocional/"
					className="underline decoration-border underline-offset-2 hover:text-ink"
				>
					manual
				</a>
				.
			</p>
		</div>
	)
}
