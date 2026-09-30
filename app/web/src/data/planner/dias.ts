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

export interface DestinoTexto {
	// Bloco que deixa de existir, com texto.
	de: { id: string; nome: string }
	// Bloco que recebe o texto.
	para: { id: string; nome: string }
}

// Pra onde vai o texto de cada bloco que deixa de existir: o bloco anterior que continua existindo,
// ou o seguinte se não houver anterior, ou o primeiro da estrutura nova. Bloco vazio não aparece.
// Usado pelo rearranjo (aplicarEstrutura) e pela janela de edição, pra avisar antes de salvar.
export function destinosDoTexto(dia: Dia, nova: Estrutura): DestinoTexto[] {
	const idsNovos = new Set(nova.blocos.map((b) => b.id))
	const nomeNovo = new Map(nova.blocos.map((b) => [b.id, b.nome]))
	const antigos = dia.estrutura.blocos
	const destinos: DestinoTexto[] = []

	antigos.forEach((bloco, i) => {
		if (idsNovos.has(bloco.id) || !temConteudo(dia.blocos[bloco.id])) return
		const anterior = antigos.slice(0, i).reverse().find((b) => idsNovos.has(b.id))
		const seguinte = antigos.slice(i + 1).find((b) => idsNovos.has(b.id))
		const destino = anterior?.id ?? seguinte?.id ?? nova.blocos[0]?.id
		if (!destino) return
		destinos.push({ de: { id: bloco.id, nome: bloco.nome }, para: { id: destino, nome: nomeNovo.get(destino) ?? '' } })
	})
	return destinos
}

// Troca a estrutura de um dia (edição do dia ou troca de modelo) sem perder texto: o conteúdo de
// um bloco que deixou de existir vai pro destino calculado em destinosDoTexto, no formato
// "**Nome:** texto". O `**` é Markdown de propósito — hoje aparece como texto legível e vira
// negrito quando o editor visual chegar (ver PLANO-FASE-0.md).
// Humor, "sobre o dia" e marcações ficam guardados mesmo se a seção for desligada: desligar é
// esconder, não apagar.
export function aplicarEstrutura(dia: Dia, nova: Estrutura): Dia {
	const blocos: Record<string, ConteudoBloco> = {}
	for (const bloco of nova.blocos) if (dia.blocos[bloco.id]) blocos[bloco.id] = dia.blocos[bloco.id]

	for (const { de, para } of destinosDoTexto(dia, nova)) {
		const conteudo = dia.blocos[de.id]
		const titulo = conteudo.tituloExtra.trim()
		const rotulo = titulo ? `${de.nome} — ${titulo}` : de.nome
		const trecho = `**${rotulo}:** ${conteudo.texto.trim()}`.trimEnd()
		const alvo = blocos[para.id] ?? conteudoVazio()
		blocos[para.id] = { ...alvo, texto: alvo.texto.trim() ? `${alvo.texto.trimEnd()}\n${trecho}` : trecho }
	}

	return { ...dia, estrutura: structuredClone(nova), blocos }
}
