import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mostrarAviso } from '../../components/avisos'
import { DateNav } from '../../components/DateNav'
import { PREFIXO_LOCAL, salvar } from '../../data/armazenamento/armazenamento'
import { blocosVisuais } from '../../data/planner/cores'
import { modeloSugerido } from '../../data/planner/modelos'
import { criarModelosProntos, listasSugeridas } from '../../data/planner/prontos'
import { iniciarPlanner, repositorioPlanner } from '../../data/planner/repositorio'
import type { Modelo, TipoLista } from '../../data/planner/tipos'
import { useArmazenado } from '../../hooks/useArmazenado'
import { useDeslizarHorizontal } from '../../hooks/useDeslizarHorizontal'
import { useDia, useListaDoDia, useModelos } from '../../hooks/usePlanner'
import { useIdioma } from '../../i18n/useIdioma'
import { deISO, paraISO, somarDias } from '../../lib/formatarData'
import { CartoesImprimiveis } from '../../pdf/CartoesImprimiveis'
import { useConteudoImpressao } from '../../pdf/useConteudoImpressao'
import { BoasVindasPlanner } from './BoasVindasPlanner'
import { ConfirmarExclusaoDia } from './ConfirmarExclusaoDia'
import { DialogoImpressao } from './DialogoImpressao'
import { FolhaFlip } from './FolhaFlip'
import { FolhaInexistente, type OpcaoModelo } from './FolhaInexistente'
import type { PropsListaVerso } from './VersoDiario'

// Mensagem de boas-vindas já vista neste aparelho. Local (não sincroniza) de propósito: é sobre a
// primeira vez neste navegador, e ela só aparece enquanto não existe nenhum modelo mesmo.
const CHAVE_BOAS_VINDAS = `${PREFIXO_LOCAL}planner.boasVindasVista`

// Padrão oficial do Framer Motion pra carrossel/paginação direcional: entra do lado de onde
// "veio" a navegação, sai pro lado oposto — próximo dia desliza da direita, dia anterior da
// esquerda (https://www.framer.com/motion/examples/ — exemplo "Carousel/Swipe").
const variantesSlide = {
	entra: (direcao: number) => ({ x: direcao >= 0 ? 32 : -32, opacity: 0 }),
	centro: { x: 0, opacity: 1 },
	sai: (direcao: number) => ({ x: direcao >= 0 ? -32 : 32, opacity: 0 }),
}

// Preferências de visualização deste aparelho (lembradas entre visitas): largura ajustada e
// girar / frente e verso juntos.
const CHAVE_VISUALIZACAO = `${PREFIXO_LOCAL}planner.visualizacao`
interface PreferenciasVisualizacao {
	expandido: boolean
	modo: 'girar' | 'nao-girar'
}
const VISUALIZACAO_PADRAO: PreferenciasVisualizacao = { expandido: false, modo: 'girar' }

// `?dia=` só vale se for uma data de verdade no formato do app — qualquer outra coisa cai em hoje.
function dataDaUrl(valor: string | null): string | null {
	if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null
	return paraISO(deISO(valor)) === valor ? valor : null
}

function ladoDaRotacao(rotacao: number): 'frente' | 'verso' {
	return ((Math.round(rotacao / 180) % 2) + 2) % 2 === 0 ? 'frente' : 'verso'
}

export function PlannerDiario() {
	// Dia e lado (frente/verso) moram na URL (?dia=AAAA-MM-DD&lado=verso): recarregar a página volta
	// pro mesmo lugar, e o link funciona. Sem `?dia=` (vindo do catálogo), abre hoje. A URL é
	// substituída, não empilhada — "voltar" do navegador sai do Planner em vez de refazer dia a dia.
	const [parametros, setParametros] = useSearchParams()
	function atualizarUrl(mudancas: Record<string, string | null>) {
		setParametros(
			(atuais) => {
				const proximos = new URLSearchParams(atuais)
				for (const [chave, valor] of Object.entries(mudancas)) {
					if (valor === null) proximos.delete(chave)
					else proximos.set(chave, valor)
				}
				return proximos
			},
			{ replace: true },
		)
	}

	const dataISO = dataDaUrl(parametros.get('dia')) ?? paraISO(new Date())
	const dataAtual = useMemo(() => deISO(dataISO), [dataISO])
	const [direcao, setDirecao] = useState(0)
	// Ângulo de giro mora aqui (não em FolhaFlip) justamente pra sobreviver à troca de dia — trocar
	// de data continua no mesmo lado (frente/verso) em que você já estava. Acumula (não fica só em
	// 0/180) porque a direção do giro visual depende disso.
	const [rotacao, setRotacao] = useState(() => (parametros.get('lado') === 'verso' ? 180 : 0))
	const lado = ladoDaRotacao(rotacao)
	function girar(dir: 1 | -1) {
		const proxima = rotacao + dir * 180
		setRotacao(proxima)
		atualizarUrl({ lado: ladoDaRotacao(proxima) === 'verso' ? 'verso' : null })
	}
	// Editável por padrão do presente em diante; passado nasce em modo de visualização. Em
	// qualquer um dos casos dá pra alternar manualmente (ícone no DateNav) — a exceção fica
	// registrada por data, então voltar pra um dia não mexe no padrão dos outros.
	const [excecoesModo, setExcecoesModo] = useState<Record<string, boolean>>({})
	// `expandido`: largura "normal" (mesma do resto do app) ou ajustada pra usar o espaço disponível
	// na tela — a proporção A5 nunca muda, só o quanto ela escala.
	// `modo`: 'girar' (padrão) é o card que vira; 'nao-girar' mostra as duas faces ao mesmo tempo — o
	// arranjo dentro dele (lado a lado ou empilhado) não é estado, é derivado em FolhaFlip a partir
	// de `expandido` e do espaço disponível na tela.
	const visualizacao = useArmazenado<PreferenciasVisualizacao>(CHAVE_VISUALIZACAO) ?? VISUALIZACAO_PADRAO
	const { expandido, modo: modoVisualizacao } = visualizacao
	function mudarVisualizacao(mudancas: Partial<PreferenciasVisualizacao>) {
		salvar(CHAVE_VISUALIZACAO, { ...visualizacao, ...mudancas })
	}
	const ehPassado = dataISO < paraISO(new Date())
	const modoEdicao = excecoesModo[dataISO] ?? !ehPassado
	const somenteLeitura = !modoEdicao

	function mudarData(novaData: Date) {
		setDirecao(novaData.getTime() >= dataAtual.getTime() ? 1 : -1)
		atualizarUrl({ dia: paraISO(novaData) })
	}

	function alternarModo() {
		setExcecoesModo((prev) => ({ ...prev, [dataISO]: !modoEdicao }))
	}

	function alternarModoVisualizacao() {
		mudarVisualizacao({ modo: modoVisualizacao === 'girar' ? 'nao-girar' : 'girar' })
	}

	const { t } = useIdioma()
	const modelos = useModelos()
	const { dia, atualizar, criar, excluir } = useDia(dataISO)
	const habitos = useListaDoDia('habitos', dataISO)
	const importantes = useListaDoDia('importantes', dataISO)

	function propsLista(tipo: TipoLista, lista: typeof habitos, mostrar: boolean): PropsListaVerso {
		return {
			mostrar,
			itens: lista.itens,
			marcados: dia?.marcados[tipo] ?? {},
			onMarcadosChange: (marcados) => atualizar((d) => ({ ...d, marcados: { ...d.marcados, [tipo]: marcados } })),
			// Lista travada em dias passados: só marcar/desmarcar (ver useListaDoDia).
			onAdicionar: lista.editavel ? lista.adicionar : undefined,
			onRemover: lista.editavel ? lista.remover : undefined,
		}
	}

	// Primeira vez = nenhum modelo ainda: a folha pontilhada oferece os modelos prontos (no idioma
	// atual). Depois, os modelos da pessoa, na ordem dela.
	const primeiraVez = modelos.length === 0
	const boasVindasVista = useArmazenado<boolean>(CHAVE_BOAS_VINDAS) === true
	const prontos = useMemo(() => criarModelosProntos(t), [t])
	const opcoes: OpcaoModelo[] = primeiraVez
		? prontos.map((p) => ({ modelo: p.modelo, descricao: p.descricao, recomendado: p.chave === 'padrao' }))
		: modelos.map((modelo) => ({ modelo }))
	const destaqueId = primeiraVez ? prontos[0].modelo.id : (modeloSugerido(modelos, dataISO)?.id ?? null)

	function escolherModelo(modelo: Modelo) {
		if (primeiraVez) iniciarPlanner(prontos.map((p) => p.modelo), modelo, listasSugeridas(t), dataISO)
		else criar(modelo)
		// Criar um dia no passado é querer escrever nele: já abre em modo edição.
		if (ehPassado) setExcecoesModo((prev) => ({ ...prev, [dataISO]: true }))
	}

	// Excluir o dia: confirmação antes, "Desfazer" depois (restaura o dia exatamente como estava).
	const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
	function excluirDia() {
		const removido = excluir()
		if (!removido) return
		mostrarAviso({
			texto: t.planner.diaExcluido,
			acao: { rotulo: t.app.desfazer, executar: () => repositorioPlanner.salvarDia(removido) },
		})
	}

	// Deslizar o dedo pro lado na área da folha troca de dia (como virar a página de um caderno):
	// pra esquerda, o próximo; pra direita, o anterior.
	const areaFolhaRef = useRef<HTMLDivElement>(null)
	useDeslizarHorizontal(areaFolhaRef, {
		onEsquerda: () => mudarData(somarDias(dataAtual, 1)),
		onDireita: () => mudarData(somarDias(dataAtual, -1)),
	})

	// Imprimir: a janela (DialogoImpressao) escolhe o modelo — por padrão o deste dia, ou o em
	// destaque se o dia não existe. `null` = ainda não mexeu na escolha desde que abriu.
	const [imprimindo, setImprimindo] = useState(false)
	const [modeloImpressaoId, setModeloImpressaoId] = useState<string | null>(null)
	const modeloDoDia = dia?.modeloId && opcoes.some((o) => o.modelo.id === dia.modeloId) ? dia.modeloId : null
	const idImpressao = modeloImpressaoId ?? modeloDoDia ?? destaqueId
	const conteudoImpressao = useConteudoImpressao(opcoes.find((o) => o.modelo.id === idImpressao)?.modelo.estrutura ?? null)

	function abrirImpressao() {
		setModeloImpressaoId(null)
		setImprimindo(true)
	}

	// Frente/verso "limpos" (sem placeholder) do modelo escolhido, sempre montados fora da tela,
	// prontos pra virar PDF na hora. Mesmo componente das páginas /imprimir-a5 e /imprimir-a4
	// (CartoesImprimiveis), só que oculto aqui.
	const [gerandoPdf, setGerandoPdf] = useState(false)
	const frenteImpressaoRef = useRef<HTMLDivElement>(null)
	const versoImpressaoRef = useRef<HTMLDivElement>(null)

	async function baixarA5() {
		if (!frenteImpressaoRef.current || !versoImpressaoRef.current) return
		setGerandoPdf(true)
		try {
			// Import dinâmico: html2canvas-pro + jsPDF só entram no bundle quando alguém realmente
			// clica em baixar, não sempre que a página do Diário monta (ver App.tsx, mesma lógica
			// de code-splitting das rotas /imprimir-a5 e /imprimir-a4).
			const { gerarPdfBlobDeElementos, baixarBlob } = await import('../../pdf/capturarCardComoPdf')
			const blob = await gerarPdfBlobDeElementos([frenteImpressaoRef.current, versoImpressaoRef.current])
			baixarBlob(blob, 'scaffold-planner-diario-a5.pdf')
			setImprimindo(false)
		} finally {
			setGerandoPdf(false)
		}
	}

	async function baixarA4() {
		if (!frenteImpressaoRef.current || !versoImpressaoRef.current) return
		setGerandoPdf(true)
		try {
			const { gerarPdfBlobA4DoisPlanners, baixarBlob } = await import('../../pdf/capturarCardComoPdf')
			const blob = await gerarPdfBlobA4DoisPlanners(frenteImpressaoRef.current, versoImpressaoRef.current)
			baixarBlob(blob, 'scaffold-planner-diario-a4-2-planners.pdf')
			setImprimindo(false)
		} finally {
			setGerandoPdf(false)
		}
	}

	return (
		<div>
			<CartoesImprimiveis
				conteudo={conteudoImpressao}
				frenteRef={frenteImpressaoRef}
				versoRef={versoImpressaoRef}
				foraDaTela
			/>

			<DateNav
				data={dataAtual}
				onChange={mudarData}
				expandido={expandido}
				onToggleExpandido={() => mudarVisualizacao({ expandido: !expandido })}
				modoVisualizacao={modoVisualizacao}
				onAlternarModoVisualizacao={alternarModoVisualizacao}
				onImprimir={abrirImpressao}
				baixandoPdf={gerandoPdf}
				onExcluirDia={dia ? () => setConfirmandoExclusao(true) : undefined}
			/>

			<div ref={areaFolhaRef}>
				<AnimatePresence mode="wait" custom={direcao} initial={false}>
					<motion.div
						key={dataISO}
						custom={direcao}
						variants={variantesSlide}
						initial="entra"
						animate="centro"
						exit="sai"
						transition={{ duration: 0.2, ease: 'easeOut' }}
					>
						{dia ? (
							<FolhaFlip
								expandido={expandido}
								modoVisualizacao={modoVisualizacao}
								lado={lado}
								onGirar={girar}
								frente={{
									data: dataAtual,
									onDataChange: mudarData,
									modoEdicao,
									onToggleModo: alternarModo,
									mostrarHumor: dia.estrutura.humor,
									humor: dia.humor,
									onHumorChange: (humor) => atualizar((d) => ({ ...d, humor })),
									blocos: blocosVisuais(dia.estrutura.blocos),
									// Renomear um bloco aqui vale só pra este dia — cada dia tem a própria estrutura.
									onRenomearBloco: (id, nome) =>
										atualizar((d) => ({
											...d,
											estrutura: {
												...d.estrutura,
												blocos: d.estrutura.blocos.map((b) => (b.id === id ? { ...b, nome, nomeEditado: true } : b)),
											},
										})),
									valoresBlocos: dia.blocos,
									onValorBlocoChange: (id, valor) => atualizar((d) => ({ ...d, blocos: { ...d.blocos, [id]: valor } })),
									mostrarSobreDia: dia.estrutura.sobreDia,
									sobreDia: dia.sobreDia,
									onSobreDiaChange: (sobreDia) => atualizar((d) => ({ ...d, sobreDia })),
									somenteLeitura,
								}}
								verso={{
									anotacoes: dia.anotacoes,
									onAnotacoesChange: (anotacoes) => atualizar((d) => ({ ...d, anotacoes })),
									habitos: propsLista('habitos', habitos, dia.estrutura.habitos),
									importantes: propsLista('importantes', importantes, dia.estrutura.importantes),
									somenteLeitura,
								}}
							/>
						) : (
							<FolhaInexistente
								data={dataAtual}
								onDataChange={mudarData}
								expandido={expandido}
								primeiraVez={primeiraVez}
								opcoes={opcoes}
								destaqueId={destaqueId}
								onEscolher={escolherModelo}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			{imprimindo && (
				<DialogoImpressao
					opcoes={opcoes}
					selecionadoId={idImpressao}
					onSelecionar={setModeloImpressaoId}
					onBaixarA5={baixarA5}
					onBaixarA4={baixarA4}
					gerando={gerandoPdf}
					onFechar={() => setImprimindo(false)}
				/>
			)}
			{confirmandoExclusao && (
				<ConfirmarExclusaoDia onConfirmar={excluirDia} onFechar={() => setConfirmandoExclusao(false)} />
			)}
			{primeiraVez && !boasVindasVista && <BoasVindasPlanner onFechar={() => salvar(CHAVE_BOAS_VINDAS, true)} />}
		</div>
	)
}
