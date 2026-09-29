import { categoriaCor, categoriaLabel, type Categoria } from '../data/catalogo'

export function CategoriaBadge({
	categoria,
	tamanho = 'md',
}: {
	categoria: Categoria
	// 'md' é o padrão atual (usado no PageHeader). 'sm' serve pra cards compactos.
	tamanho?: 'sm' | 'md'
}) {
	const cor = categoriaCor[categoria]

	// Classes variam por tamanho. Mantidas num mapa pra não espalhar if/else no JSX.
	const classesTamanho =
		tamanho === 'sm'
			? 'px-2 py-0.5 text-[0.65rem]'
			: 'px-2.5 py-1 text-xs'

	return (
		<span
			// leading-none + padding vertical fixo garantem altura previsível,
			// independente da fonte do sistema. whitespace-nowrap evita que
			// "Notion / Sheets" quebre em duas linhas em telas estreitas.
			className={`inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap ${classesTamanho}`}
			style={{
				color: cor,
				// Mistura com o fundo da página (não com transparente) pra o badge
				// ter a mesma aparência sobre paper, bg-raised ou qualquer outro fundo.
				backgroundColor: `color-mix(in srgb, ${cor} 12%, var(--color-bg))`,
				// Borda sutil ancora o badge visualmente sem competir com o texto.
				border: `1px solid color-mix(in srgb, ${cor} 25%, transparent)`,
			}}
		>
			{categoriaLabel[categoria]}
		</span>
	)
}