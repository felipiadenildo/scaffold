import { Download, Share, SquarePlus, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { aplicarBackup, lerBackup, montarBackup, resumirBackup, type Backup } from '../data/armazenamento/backup'
import { useIdioma } from '../i18n/useIdioma'
import { paraISO } from '../lib/formatarData'
import { mostrarAviso } from './avisos'
import { classeBotaoDialogoPrincipal, classeBotaoDialogoSecundario, Dialogo } from './Dialogo'
import { fecharJanela, useJanelaAberta } from './janelas'

function baixarArquivo(conteudo: string, nome: string) {
	const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }))
	const a = document.createElement('a')
	a.href = url
	a.download = nome
	a.click()
	URL.revokeObjectURL(url)
}

// Exportar e importar (backup). Importar mostra o que tem no arquivo antes de mexer em qualquer
// dado, e só então oferece Juntar ou Substituir (lógica em data/armazenamento/backup.ts).
function DialogoSeusDados() {
	const { t } = useIdioma()
	const textos = t.app.dados
	const entradaRef = useRef<HTMLInputElement>(null)
	const [lido, setLido] = useState<Backup | null>(null)
	const [erro, setErro] = useState<string | null>(null)

	function exportar() {
		baixarArquivo(JSON.stringify(montarBackup(new Date(), __VERSAO_APP__), null, 1), `scaffold-backup-${paraISO(new Date())}.json`)
		mostrarAviso({ texto: textos.exportado })
	}

	async function escolherArquivo(arquivo: File | undefined) {
		if (!arquivo) return
		const resultado = lerBackup(await arquivo.text())
		if ('erro' in resultado) {
			setLido(null)
			setErro(resultado.erro === 'formatoMaisNovo' ? textos.erroFormato : textos.erroNaoEBackup)
			return
		}
		setErro(null)
		setLido(resultado.backup)
	}

	function aplicar(modo: 'juntar' | 'substituir') {
		if (!lido) return
		aplicarBackup(lido, modo)
		fecharJanela()
		mostrarAviso({ texto: textos.importado })
	}

	const classeAcao =
		'flex w-full items-start gap-3 rounded-scaffold border border-paper-ink/20 px-3 py-2.5 text-left transition-colors hover:border-paper-ink/45'

	return (
		<Dialogo idTitulo="dados-titulo" onFechar={fecharJanela}>
			<h2 id="dados-titulo" className="text-lg font-bold">
				{textos.titulo}
			</h2>
			<p className="mt-2 text-sm text-paper-ink-soft">{textos.explicacao}</p>

			<div className="mt-5 flex flex-col gap-2">
				<button type="button" onClick={exportar} className={classeAcao}>
					<Download className="mt-0.5 h-4 w-4 shrink-0 text-paper-ink-soft" aria-hidden="true" />
					<span>
						<span className="block text-sm font-semibold">{textos.exportar}</span>
						<span className="block text-xs text-paper-ink-soft">{textos.exportarDica}</span>
					</span>
				</button>

				<button type="button" onClick={() => entradaRef.current?.click()} className={classeAcao}>
					<Upload className="mt-0.5 h-4 w-4 shrink-0 text-paper-ink-soft" aria-hidden="true" />
					<span>
						<span className="block text-sm font-semibold">{textos.importar}</span>
						<span className="block text-xs text-paper-ink-soft">{textos.importarDica}</span>
					</span>
				</button>
				<input
					ref={entradaRef}
					type="file"
					accept="application/json,.json"
					className="hidden"
					onChange={(e) => {
						void escolherArquivo(e.target.files?.[0])
						// Permite escolher o mesmo arquivo de novo.
						e.target.value = ''
					}}
				/>
			</div>

			{erro && (
				<p role="alert" className="mt-4 rounded-scaffold border border-caution/40 bg-caution-bg p-3 text-sm">
					{erro}
				</p>
			)}

			{lido && (
				<div className="mt-4 rounded-scaffold border border-paper-ink/15 p-3">
					<p className="text-sm font-medium">{textos.resumo(resumirBackup(lido).dias, resumirBackup(lido).modelos)}</p>
					<div className="mt-3 grid gap-2 sm:grid-cols-2">
						<button type="button" onClick={() => aplicar('juntar')} className={classeBotaoDialogoPrincipal + ' text-left'}>
							{textos.juntar}
							<span className="block text-xs font-normal opacity-85">{textos.juntarDica}</span>
						</button>
						<button type="button" onClick={() => aplicar('substituir')} className={classeBotaoDialogoSecundario + ' text-left'}>
							{textos.substituir}
							<span className="block text-xs font-normal text-paper-ink-soft">{textos.substituirDica}</span>
						</button>
					</div>
				</div>
			)}

			<form method="dialog" className="mt-6 flex justify-end">
				<button type="submit" className={classeBotaoDialogoSecundario}>
					{t.app.cancelar}
				</button>
			</form>
		</Dialogo>
	)
}

// iPhone/iPad não têm botão de instalar: os passos, com os ícones que a pessoa vai procurar no Safari.
function DialogoInstalarIos() {
	const { t } = useIdioma()
	const textos = t.app.instalarIos
	const icones = [Share, SquarePlus, null]

	return (
		<Dialogo idTitulo="instalar-titulo" onFechar={fecharJanela} largura="sm">
			<h2 id="instalar-titulo" className="text-lg font-bold">
				{textos.titulo}
			</h2>
			<ol className="mt-4 flex flex-col gap-3">
				{textos.passos.map((passo, i) => {
					const Icone = icones[i]
					return (
						<li key={passo} className="flex items-start gap-3 text-sm">
							<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-paper-ink/20 text-xs font-semibold">
								{Icone ? <Icone className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
							</span>
							<span className="pt-1">{passo}</span>
						</li>
					)
				})}
			</ol>
			<form method="dialog" className="mt-6">
				<button type="submit" autoFocus className={classeBotaoDialogoPrincipal + ' w-full'}>
					{textos.ok}
				</button>
			</form>
		</Dialogo>
	)
}

export function JanelasGlobais() {
	const aberta = useJanelaAberta()
	if (aberta === 'dados') return <DialogoSeusDados />
	if (aberta === 'instalarIos') return <DialogoInstalarIos />
	return null
}
