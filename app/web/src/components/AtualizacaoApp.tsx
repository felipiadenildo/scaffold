import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useIdioma } from '../i18n/useIdioma'
import { mostrarAviso } from './avisos'

// Registra o service worker (app instalável/offline) e, quando há uma versão nova já baixada,
// avisa — sem trocar a tela sozinho no meio de uma anotação. O aviso fica até a pessoa tocar em
// "Atualizar" (recarrega na versão nova). Ver registerType 'prompt' em vite.config.ts.
export function AtualizacaoApp() {
	const { t } = useIdioma()
	const {
		needRefresh: [temVersaoNova],
		updateServiceWorker,
	} = useRegisterSW()

	useEffect(() => {
		if (!temVersaoNova) return
		mostrarAviso({
			texto: t.app.novaVersao,
			acao: { rotulo: t.app.atualizar, executar: () => void updateServiceWorker(true) },
			persistente: true,
		})
	}, [temVersaoNova, t, updateServiceWorker])

	return null
}
