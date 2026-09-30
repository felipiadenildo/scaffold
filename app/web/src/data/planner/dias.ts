import type { ConteudoBloco, Dia, Estrutura, Modelo } from './tipos'

export function conteudoVazio(): ConteudoBloco {
	return { tituloExtra: '', texto: '' }
}

export function criarDia(modelo: Modelo, data: string, agora: Date = new Date()): Dia {
	return {
		data,
		modeloId: modelo.id,
		estrutura: structuredClone(modelo.estrutura),
		humor: null,
		blocos: {},
		sobreDia: '',
		anotacoes: '',
		marcados: { habitos: {}, importantes: {} },
		criadoEm: agora.toISOString(),
	}
}

function temConteudo(conteudo: ConteudoBloco | undefined): conteudo is ConteudoBloco {
	return !!conteudo && (conteudo.texto.trim() !== '' || conteudo.tituloExtra.trim() !== '')
}

// Troca a estrutura de um dia (edição do dia ou troca de modelo) sem perder texto: o conteúdo de
// um bloco que deixou de existir vai pro bloco anterior que continua existindo (ou o seguinte, se
// não houver anterior), no formato "**Nome:** texto". O `**` é Markdown de propósito — hoje aparece
// como texto legível e vira negrito quando o editor visual chegar (ver PLANO-FASE-0.md).
// Humor, "sobre o dia" e marcações ficam guardados mesmo se a seção for desligada: desligar é
// esconder, não apagar.
export function aplicarEstrutura(dia: Dia, nova: Estrutura): Dia {
	const idsNovos = new Set(nova.blocos.map((b) => b.id))
	const antigos = dia.estrutura.blocos

	const blocos: Record<string, ConteudoBloco> = {}
	for (const id of idsNovos) if (dia.blocos[id]) blocos[id] = dia.blocos[id]

	antigos.forEach((bloco, i) => {
		if (idsNovos.has(bloco.id)) return
		const conteudo = dia.blocos[bloco.id]
		if (!temConteudo(conteudo)) return

		const anterior = antigos.slice(0, i).reverse().find((b) => idsNovos.has(b.id))
		const seguinte = antigos.slice(i + 1).find((b) => idsNovos.has(b.id))
		const destino = anterior?.id ?? seguinte?.id ?? nova.blocos[0]?.id
		if (!destino) return

		const titulo = conteudo.tituloExtra.trim()
		const rotulo = titulo ? `${bloco.nome} — ${titulo}` : bloco.nome
		const trecho = `**${rotulo}:** ${conteudo.texto.trim()}`.trimEnd()
		const alvo = blocos[destino] ?? conteudoVazio()
		blocos[destino] = { ...alvo, texto: alvo.texto.trim() ? `${alvo.texto.trimEnd()}\n${trecho}` : trecho }
	})

	return { ...dia, estrutura: structuredClone(nova), blocos }
}
