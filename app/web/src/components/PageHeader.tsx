import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CategoriaBadge } from './CategoriaBadge'
import type { Categoria } from '../data/catalogo'

export function PageHeader({
	titulo,
	descricao,
	categoria,
	acao,
}: {
	titulo: string
	descricao: string
	categoria: Categoria
	// Ação opcional alinhada à direita do título. Se não vier, nada é renderizado.
	acao?: ReactNode
}) {
	return (
		// <header> é o cabeçalho da página. mb-10 dá respiro maior do que o mb-8 anterior
		// pra separar visualmente a barra superior do conteúdo.
		<header className="mb-10">
			{/*
				Breadcrumb: a página atual não é link (é onde o usuário já está).
				O separador é aria-hidden pra não ser lido como "barra".
			*/}
			<nav aria-label="Trilha de navegação" className="flex items-center gap-1.5 text-xs">
				<Link
					to="/"
					className="rounded text-ink-soft transition-colors hover:text-ink focus-visible:text-ink"
				>
					Catálogo
				</Link>
				<span aria-hidden="true" className="text-ink-soft/60">
					/
				</span>
				<span className="font-medium text-ink">{titulo}</span>
			</nav>

			{/*
				Linha principal: título + badge à esquerda, ação opcional à direita.
				flex-wrap garante que em telas estreitas a ação caia pra linha de baixo
				em vez de espremer o título.
			*/}
			<div className="mt-4 flex flex-wrap items-start justify-between gap-3">
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
					<CategoriaBadge categoria={categoria} />
				</div>
				{acao && <div className="shrink-0">{acao}</div>}
			</div>

			{/* Descrição logo abaixo, mais apagada que o título, com largura legível. */}
			<p className="mt-2 max-w-2xl text-sm text-ink-soft">{descricao}</p>
		</header>
	)
}