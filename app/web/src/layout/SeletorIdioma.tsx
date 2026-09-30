import { Check, Globe } from 'lucide-react'
import { useMenuSuspenso } from '../hooks/useMenuSuspenso'
import { IDIOMAS, NOME_DO_IDIOMA } from '../i18n/idiomas'
import { mudarIdioma, useIdioma } from '../i18n/useIdioma'

// Botão do cabeçalho, na mesma família do ThemeToggle (borda, p-2, ícone 16px). A sigla ao lado do
// globo é de propósito: quem caiu num idioma que não lê precisa achar este botão sem ler nada.
// O painel segue o do seletor de visão do Planner (DateNav): bg-raised, item ativo em accent.
export function SeletorIdioma() {
	const { ref, fechar } = useMenuSuspenso()
	const { idioma, t } = useIdioma()

	return (
		<details ref={ref} className="group relative">
			<summary
				aria-label={t.idioma.rotulo}
				title={t.idioma.rotulo}
				className="flex cursor-pointer list-none items-center gap-1.5 rounded-scaffold border border-border p-2 text-ink-soft transition-colors hover:border-ink-soft hover:text-ink group-open:border-ink-soft group-open:text-ink [&::-webkit-details-marker]:hidden"
			>
				<Globe className="h-4 w-4" aria-hidden="true" />
				<span className="text-xs font-medium uppercase leading-4">{idioma}</span>
			</summary>

			<div className="absolute right-0 z-20 mt-2 flex w-40 flex-col gap-1 rounded-scaffold border border-border bg-bg-raised p-2 shadow-raised">
				{IDIOMAS.map((opcao) => {
					const ativo = opcao === idioma
					return (
						<button
							key={opcao}
							type="button"
							lang={opcao}
							aria-current={ativo ? 'true' : undefined}
							onClick={() => {
								mudarIdioma(opcao)
								fechar()
							}}
							className={
								'flex items-center justify-between rounded-scaffold px-2.5 py-1.5 text-left text-sm font-medium transition-colors ' +
								(ativo ? 'bg-accent text-accent-ink' : 'text-ink hover:bg-bg')
							}
						>
							{NOME_DO_IDIOMA[opcao]}
							{ativo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
						</button>
					)
				})}
			</div>
		</details>
	)
}
