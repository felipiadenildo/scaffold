import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { useIdioma } from '../i18n/useIdioma'
import { classeBotaoDialogoPrincipal, classeBotaoDialogoSecundario } from './Dialogo'

// Tela quando algo quebra, em vez da página em branco. "Copiar detalhes" junta o que é preciso pra
// investigar (versão do app, página, navegador, erro) — pra mandar junto com o relato.
function TelaDeErro({ erro, pilhaComponentes }: { erro: Error; pilhaComponentes: string }) {
	const { t } = useIdioma()
	const textos = t.app.erro
	const [copiado, setCopiado] = useState(false)
	const detalhes = [
		`Scaffold ${__VERSAO_APP__}`,
		`${location.pathname}${location.search}`,
		navigator.userAgent,
		new Date().toISOString(),
		'',
		`${erro.name}: ${erro.message}`,
		erro.stack ?? '',
		pilhaComponentes,
	].join('\n')

	async function copiar() {
		try {
			await navigator.clipboard.writeText(detalhes)
			setCopiado(true)
		} catch {
			// Sem acesso à área de transferência (ex.: página sem HTTPS): a pessoa copia do quadro abaixo.
		}
	}

	return (
		<div className="flex min-h-svh items-center justify-center bg-bg p-4 text-ink">
			<div className="paper-grain w-full max-w-md rounded-scaffold-lg border border-border/60 bg-paper p-6 text-paper-ink shadow-paper sm:p-8">
				<h1 className="flex items-center gap-2 text-lg font-bold">
					<TriangleAlert className="h-5 w-5 text-caution" aria-hidden="true" />
					{textos.titulo}
				</h1>
				<p className="mt-2 text-sm text-paper-ink-soft">{textos.texto}</p>

				<div className="mt-6 flex flex-wrap gap-2">
					<button type="button" onClick={() => location.reload()} className={classeBotaoDialogoPrincipal}>
						{textos.recarregar}
					</button>
					<a href="/" className={classeBotaoDialogoSecundario}>
						{textos.inicio}
					</a>
					<button type="button" onClick={() => void copiar()} className={classeBotaoDialogoSecundario}>
						{copiado ? textos.copiado : textos.copiar}
					</button>
				</div>

				<details className="mt-5 text-xs">
					<summary className="cursor-pointer text-paper-ink-soft">{textos.detalhes}</summary>
					<pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-scaffold border border-paper-ink/15 p-2 font-mono">
						{detalhes}
					</pre>
				</details>
			</div>
		</div>
	)
}

// Limite de erro do React (só existe como componente de classe). Captura erros de renderização
// de tudo que está dentro dele e mostra a TelaDeErro no lugar.
export class LimiteDeErro extends Component<{ children: ReactNode }, { erro: Error | null; pilhaComponentes: string }> {
	state = { erro: null, pilhaComponentes: '' }

	static getDerivedStateFromError(erro: Error) {
		return { erro }
	}

	componentDidCatch(_erro: Error, info: ErrorInfo) {
		this.setState({ pilhaComponentes: info.componentStack ?? '' })
	}

	render() {
		const { erro, pilhaComponentes } = this.state
		return erro ? <TelaDeErro erro={erro} pilhaComponentes={pilhaComponentes} /> : this.props.children
	}
}
