import { useState } from 'react'
import { plannerStorage, type DiaPlannerArmazenado, type ValorSecaoArmazenado } from '../data/plannerStorage'
import { secoesPadrao, type NivelHumor } from '../data/planner'

function diaVazio(): DiaPlannerArmazenado {
	return {
		humor: null,
		secoes: Object.fromEntries(secoesPadrao.map((s) => [s.slug, { tituloExtra: '', texto: '' }])),
		sobreDia: '',
		anotacoes: '',
		habitos: {},
		protocolo: {},
	}
}

// Estado do dia é lido/gravado no plannerStorage por data ISO — trocar de dia troca o registro
// inteiro; cada campo editado grava de volta imediatamente (sem passo explícito de "salvar").
export function usePlannerDia(dataISO: string) {
	const [dataCarregada, setDataCarregada] = useState(dataISO)
	const [dia, setDia] = useState<DiaPlannerArmazenado>(() => plannerStorage.getDia(dataISO) ?? diaVazio())

	// Ajuste durante a renderização (não em efeito): trocar a data é uma mudança de identidade,
	// não uma sincronização com sistema externo — recarregar aqui evita o repaint extra de um efeito.
	if (dataISO !== dataCarregada) {
		setDataCarregada(dataISO)
		setDia(plannerStorage.getDia(dataISO) ?? diaVazio())
	}

	function persistir(proximo: DiaPlannerArmazenado) {
		plannerStorage.setDia(dataISO, proximo)
		return proximo
	}

	return {
		dia,
		setHumor: (humor: NivelHumor['slug'] | null) => setDia((prev) => persistir({ ...prev, humor })),
		setSecaoValor: (slug: string, valor: ValorSecaoArmazenado) =>
			setDia((prev) => persistir({ ...prev, secoes: { ...prev.secoes, [slug]: valor } })),
		setSobreDia: (sobreDia: string) => setDia((prev) => persistir({ ...prev, sobreDia })),
		setAnotacoes: (anotacoes: string) => setDia((prev) => persistir({ ...prev, anotacoes })),
		setHabitos: (habitos: Record<string, boolean>) => setDia((prev) => persistir({ ...prev, habitos })),
		setProtocolo: (protocolo: Record<string, boolean>) => setDia((prev) => persistir({ ...prev, protocolo })),
	}
}
