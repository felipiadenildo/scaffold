import { Files, LayoutTemplate, PencilLine, Printer } from 'lucide-react'
import { classeBotaoDialogoPrincipal, Dialogo } from '../../components/Dialogo'
import { useIdioma } from '../../i18n/useIdioma'

// Um ícone por item da explicação, na mesma ordem de t.planner.boasVindas.itens.
const ICONES = [Files, LayoutTemplate, PencilLine, Printer]

// Mensagem da primeira vez no Planner, por cima da tela. Fechar (pelo botão, Esc ou clicando fora)
// revela a folha pontilhada com os modelos prontos.
export function BoasVindasPlanner({ onFechar }: { onFechar: () => void }) {
	const { t } = useIdioma()
	const textos = t.planner.boasVindas

	return (
		<Dialogo idTitulo="boas-vindas-titulo" onFechar={onFechar}>
			<h2 id="boas-vindas-titulo" className="text-xl font-bold">
				{textos.titulo}
			</h2>

			<ul className="mt-5 flex flex-col gap-3.5">
				{textos.itens.map((texto, i) => {
					const Icone = ICONES[i]
					return (
						<li key={texto} className="flex items-start gap-3 text-sm">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper-ink/15 text-paper-ink-soft">
								<Icone className="h-4 w-4" aria-hidden="true" />
							</span>
							<span className="pt-1.5">{texto}</span>
						</li>
					)
				})}
			</ul>

			<form method="dialog" className="mt-7">
				<button type="submit" autoFocus className={classeBotaoDialogoPrincipal + ' w-full'}>
					{textos.comecar}
				</button>
			</form>
		</Dialogo>
	)
}
