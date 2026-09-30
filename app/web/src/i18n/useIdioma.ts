import { PREFIXO_LOCAL, salvar } from '../data/armazenamento/armazenamento'
import { useArmazenado } from '../hooks/useArmazenado'
import { en } from './en'
import { es } from './es'
import { detectarIdioma, ehIdioma, LOCALE, type Idioma } from './idiomas'
import { pt, type Dicionario } from './pt'

// Preferência do aparelho, não dado da pessoa: não sincroniza (prefixo local).
const CHAVE_IDIOMA = `${PREFIXO_LOCAL}idioma`

const DICIONARIOS: Record<Idioma, Dicionario> = { pt, en, es }

// Calculado uma vez: enquanto a pessoa não escolher, vale o idioma do navegador.
const idiomaDoNavegador: Idioma =
	typeof navigator === 'undefined' ? 'pt' : detectarIdioma(navigator.languages?.length ? navigator.languages : [navigator.language])

export function mudarIdioma(idioma: Idioma): void {
	salvar(CHAVE_IDIOMA, idioma)
}

// Sem Provider: o idioma mora no armazenamento reativo, então qualquer componente que chame este
// hook re-renderiza quando ele muda.
export function useIdioma() {
	const salvo = useArmazenado<string>(CHAVE_IDIOMA)
	const idioma: Idioma = ehIdioma(salvo) ? salvo : idiomaDoNavegador
	return { idioma, locale: LOCALE[idioma], t: DICIONARIOS[idioma] }
}
