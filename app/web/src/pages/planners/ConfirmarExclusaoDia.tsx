import { Trash2 } from 'lucide-react'
import { classeBotaoDialogo, classeBotaoDialogoSecundario, Dialogo } from '../../components/Dialogo'
import { useIdioma } from '../../i18n/useIdioma'

// Confirmação antes de excluir um dia (depois ainda vem o "Desfazer" no aviso — duas redes de
// segurança pra uma ação que apaga o que a pessoa escreveu). Cancelar tem o foco inicial: um Enter
// apressado não apaga nada. O botão de excluir usa a tinta do papel, não vermelho: o vermelho do
// app é reservado ao sistema de crise/SOS (tokens.css).
export function ConfirmarExclusaoDia({ onConfirmar, onFechar }: { onConfirmar: () => void; onFechar: () => void }) {
	const { t } = useIdioma()
	const textos = t.planner.confirmarExclusao

	return (
		<Dialogo idTitulo="excluir-dia-titulo" onFechar={onFechar} largura="sm">
			<h2 id="excluir-dia-titulo" className="flex items-center gap-2 text-lg font-bold">
				<Trash2 className="h-5 w-5 text-paper-ink-soft" aria-hidden="true" />
				{textos.titulo}
			</h2>
			<p className="mt-3 text-sm text-paper-ink-soft">{textos.texto}</p>

			<form method="dialog" className="mt-6 flex justify-end gap-2">
				<button type="submit" autoFocus className={classeBotaoDialogoSecundario}>
					{t.app.cancelar}
				</button>
				<button type="submit" onClick={onConfirmar} className={classeBotaoDialogo + ' bg-paper-ink text-paper'}>
					{textos.confirmar}
				</button>
			</form>
		</Dialogo>
	)
}
