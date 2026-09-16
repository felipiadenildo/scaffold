import { habitosPadrao, protocoloPadrao, type NivelHumor, type SecaoDia as SecaoDiaTipo } from '../data/planner'
import { useListaTemplate, useSecoesTemplate } from '../hooks/usePlannerTemplates'

export const semAcaoImpressao = () => {}

// Dados compartilhados pelas páginas de impressão (A5 e A4) — os mesmos templates editáveis do
// Planner (nomes de seção, hábitos, protocolo), sempre em branco (sem valores digitados).
export function useConteudoImpressao() {
	const { secoes } = useSecoesTemplate()
	const { itens: habitos } = useListaTemplate('habitos', habitosPadrao)
	const { itens: protocolo } = useListaTemplate('protocolo', protocoloPadrao)

	const valoresSecoesVazios = Object.fromEntries(secoes.map((s: SecaoDiaTipo) => [s.slug, { tituloExtra: '', texto: '' }]))
	const humorVazio: NivelHumor['slug'] | null = null

	return { secoes, habitos, protocolo, valoresSecoesVazios, humorVazio }
}
