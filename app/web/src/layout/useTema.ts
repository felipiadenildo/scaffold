import { useEffect } from 'react'
import { PREFIXO_LOCAL, salvar } from '../data/armazenamento/armazenamento'
import { useArmazenado } from '../hooks/useArmazenado'

export type Tema = 'light' | 'dark'

// Mesma chave lida pelo script inline do index.html (aplica o tema antes do primeiro paint, sem
// "piscar" o tema errado). Mudou aqui, muda lá.
const CHAVE_TEMA = `${PREFIXO_LOCAL}tema`

// Fundo do app em cada tema (--scaffold-bg em tokens.css), pra barra do sistema no celular ter a
// mesma cor da página.
const COR_DA_BARRA: Record<Tema, string> = { light: '#faf8f3', dark: '#1c1815' }

// Usado pelo botão do cabeçalho e pelos menus do Planner (perfil, ⋯) — todos leem e mudam o mesmo
// valor. Claro é o padrão do app: não segue a preferência de sistema, só a escolha da pessoa.
export function useTema() {
	const tema: Tema = useArmazenado<Tema>(CHAVE_TEMA) === 'dark' ? 'dark' : 'light'

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', tema)
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COR_DA_BARRA[tema])
	}, [tema])

	return { tema, alternar: () => salvar(CHAVE_TEMA, tema === 'light' ? 'dark' : 'light') }
}
