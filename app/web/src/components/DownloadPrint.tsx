interface Arquivo {
	label: string
	href: string
}

export function DownloadPrint({ preview, arquivos }: { preview: string; arquivos: Arquivo[] }) {
	return (
		<div className="mb-6 flex flex-col gap-4 rounded-scaffold border border-border bg-bg-raised p-4 sm:flex-row sm:items-center">
			<img
				src={preview}
				alt="Prévia do impresso"
				className="w-28 self-start rounded-scaffold border border-border sm:w-24"
			/>
			<div>
				<p className="text-sm font-medium">Pronto pra imprimir — A5, sem sangria.</p>
				<div className="mt-2 flex flex-wrap gap-2">
					{arquivos.map((a) => (
						<a
							key={a.href}
							href={a.href}
							download
							className="rounded-scaffold bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink"
						>
							{a.label}
						</a>
					))}
				</div>
			</div>
		</div>
	)
}
