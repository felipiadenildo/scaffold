import { animate, AnimatePresence, motion, useMotionValue } from 'motion/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mostrarAviso } from '../../components/avisos'
import { DateNav } from '../../components/DateNav'
import { PREFIXO_LOCAL, salvar } from '../../data/armazenamento/armazenamento'
import { blocosVisuais } from '../../data/planner/cores'
import { aplicarEstrutura } from '../../data/planner/dias'
import { modeloSugerido } from '../../data/planner/modelos'
import { criarModelosProntos, listasSugeridas, prontoPadrao } from '../../data/planner/prontos'
import { iniciarPlanner, operacoesModelos, repositorioPlanner } from '../../data/planner/repositorio'
import type { Modelo, TipoLista } from '../../data/planner/tipos'
import { useArmazenado } from '../../hooks/useArmazenado'
import { useDeslizarHorizontal } from '../../hooks/useDeslizarHorizontal'
import { useMidia, useTelaEstreita } from '../../hooks/useMidia'
import { useDia, useListaDoDia, useModelos } from '../../hooks/usePlanner'
import { useIdioma } from '../../i18n/useIdioma'
import { gerarId } from '../../lib/gerarId'
import { deISO, paraISO, somarDias } from '../../lib/formatarData'
import { CartoesImprimiveis } from '../../pdf/CartoesImprimiveis'
import { useConteudoImpressao, useOpcoesImpressao } from '../../pdf/useConteudoImpressao'
import { BoasVindasPlanner } from './BoasVindasPlanner'
import { ConfirmarExclusaoDia } from './ConfirmarExclusaoDia'
import { DialogoImpressao } from './DialogoImpressao'
import { DialogoModelo, type AlvoEdicao, type ResultadoEdicao } from './DialogoModelo'
import { FolhaFlip } from './FolhaFlip'
import { FolhaInexistente, type OpcaoModelo } from './FolhaInexistente'
import type { PropsListaVerso } from './VersoDiario'

// Mensagem de boas-vindas já vista neste aparelho. Local (não sincroniza) de propósito: é sobre a
// primeira vez neste navegador, e ela só aparece enquanto não existe nenhum modelo mesmo.
const CHAVE_BOAS_VINDAS = `${PREFIXO_LOCAL}planner.boasVindasVista`

// Padrão oficial do Framer Motion pra carrossel/paginação direcional: entra do lado de onde
// "veio" a navegação, sai pro lado oposto — próximo dia desliza da direita, dia anterior da
// esquerda (https://www.framer.com/motion/examples/ — exemplo "Carousel/Swipe"). Quando a troca
// veio de deslizar o dedo, a folha antiga já saiu da tela arrastada: some na hora, sem animar.
interface TrocaDeDia {
	direcao: number
	arrastando: boolean
}
const variantesSlide = {
	entra: ({ direcao }: TrocaDeDia) => ({ x: direcao >= 0 ? 32 : -32, opacity: 0 }),
	centro: { x: 0, opacity: 1 },
	sai: ({ direcao, arrastando }: TrocaDeDia) =>
		arrastando ? { opacity: 0, transition: { duration: 0 } } : { x: direcao >= 0 ? -32 : 32, opacity: 0 },
}

// Dica de deslizar pra trocar de dia, mostrada em aparelhos de toque até a pessoa deslizar uma vez
// ou tocar em "Entendi". Local, como a de boas-vindas.
const CHAVE_DICA_DESLIZAR = `${PREFIXO_LOCAL}planner.dicaDeslizarVista`

// Preferências de visualização deste aparelho (lembradas entre visitas): largura ajustada e
// girar / frente e verso juntos.
const CHAVE_VISUALIZACAO = `${PREFIXO_LOCAL}planner.visualizacao`
interface PreferenciasVisualizacao {
	expandido: boolean
	modo: 'girar' | 'nao-girar'
}

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
	// Sem escolha salva: no celular, frente e verso empilhados (rolar passa da frente pro verso, e o
	// deslizar pro lado fica só pra trocar de dia); no PC, a folha que vira.
	const telaEstreita = useTelaEstreita()
	const visualizacao = useArmazenado<PreferenciasVisualizacao>(CHAVE_VISUALIZACAO) ?? {
		expandido: false,
		modo: telaEstreita ? 'nao-girar' : 'girar',
	}
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
			onRemover: lista.editavel
				? (id) => {
						const antes = lista.remover(id)
						mostrarAviso({
							texto: t.planner.itemRemovido,
							acao: { rotulo: t.app.desfazer, executar: () => repositorioPlanner.salvarLista(tipo, antes) },
						})
					}
				: undefined,
		}
	}

	// Primeira vez = nenhum modelo ainda: a folha pontilhada oferece os modelos prontos (no idioma
	// atual). Depois, os modelos da pessoa, na ordem dela.
	const primeiraVez = modelos.length === 0
	const boasVindasVista = useArmazenado<boolean>(CHAVE_BOAS_VINDAS) === true

	const toque = useMidia('(pointer: coarse)')
	const dicaDeslizarVista = useArmazenado<boolean>(CHAVE_DICA_DESLIZAR) === true
	const existeDia = !!dia
	useEffect(() => {
		if (!toque || !existeDia || dicaDeslizarVista) return
		mostrarAviso({
			texto: t.planner.dicaDeslizar,
			acao: { rotulo: t.planner.dicaDeslizarOk, executar: () => salvar(CHAVE_DICA_DESLIZAR, true) },
		})
	}, [toque, existeDia, dicaDeslizarVista, t])
	const prontos = useMemo(() => criarModelosProntos(t), [t])
	const opcoes: OpcaoModelo[] = primeiraVez
		? prontos.map((p) => ({ modelo: p.modelo, descricao: p.descricao, recomendado: p.chave === 'padrao' }))
		: modelos.map((modelo) => ({ modelo }))
	const destaqueId = primeiraVez ? prontoPadrao(prontos).modelo.id : (modeloSugerido(modelos, dataISO)?.id ?? null)

	// Cria o dia com o modelo. Na primeira vez, antes grava a lista de modelos da pessoa: os prontos
	// sempre entram, e um modelo montado por ela (se for o caso) vem na frente.
	function escolherModelo(modelo: Modelo, montadoPelaPessoa = false) {
		if (primeiraVez) {
			const lista = prontos.map((p) => p.modelo)
			iniciarPlanner(montadoPelaPessoa ? [modelo, ...lista] : lista, modelo, listasSugeridas(t), dataISO)
			// A partir de agora há dados de verdade: pede ao navegador pra não apagá-los quando faltar
			// espaço (o Safari chega a limpar sites não abertos por 7 dias). Sem resposta visível: o
			// navegador decide sozinho, e app instalado costuma ganhar.
			void navigator.storage?.persist?.()
		} else {
			if (montadoPelaPessoa) operacoesModelos.adicionar(modelo)
			criar(modelo)
		}
		// Criar um dia no passado é querer escrever nele: já abre em modo edição.
		if (ehPassado) setExcecoesModo((prev) => ({ ...prev, [dataISO]: true }))
	}

	// Janela de modelo (DialogoModelo): criar um modelo, editar um modelo ou editar o formato do dia.
	const [editando, setEditando] = useState<AlvoEdicao | null>(null)

	function salvarEdicao({ nome, estrutura, diasSemana, modeloId }: ResultadoEdicao) {
		if (!editando) return
		if (editando.tipo === 'novo') {
			// Criado a partir da folha pontilhada: já cria o dia com ele.
			escolherModelo({ id: gerarId(), nome, estrutura, diasSemana }, true)
		} else if (editando.tipo === 'modelo') {
			operacoesModelos.atualizar({ ...editando.modelo, nome, estrutura, diasSemana })
		} else {
			// Só este dia; texto de bloco removido vai pro vizinho (aplicarEstrutura).
			atualizar((d) => ({ ...aplicarEstrutura(d, estrutura), modeloId }))
		}
		setEditando(null)
	}

	function excluirModelo() {
		if (editando?.tipo !== 'modelo') return
		const removido = operacoesModelos.remover(editando.modelo.id)
		setEditando(null)
		if (!removido) return
		mostrarAviso({
			texto: t.planner.editorModelo.modeloExcluido,
			acao: { rotulo: t.app.desfazer, executar: () => operacoesModelos.restaurar(removido) },
		})
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
	// pra esquerda, o próximo; pra direita, o anterior. A folha acompanha o dedo; ao soltar, sai da
	// tela e o novo dia entra, ou volta pro lugar se o gesto foi curto.
	const areaFolhaRef = useRef<HTMLDivElement>(null)
	const arrasto = useMotionValue(0)
	const [arrastando, setArrastando] = useState(false)
	function trocarArrastando(passo: 1 | -1) {
		salvar(CHAVE_DICA_DESLIZAR, true)
		const largura = areaFolhaRef.current?.offsetWidth ?? window.innerWidth
		animate(arrasto, -passo * largura, { duration: 0.18, ease: 'easeIn' }).then(() => {
			setArrastando(true)
			mudarData(somarDias(dataAtual, passo))
		})
	}
	useDeslizarHorizontal(areaFolhaRef, {
		onArrastar: (dx) => arrasto.set(dx),
		onCancelar: () => animate(arrasto, 0, { type: 'spring', stiffness: 500, damping: 40 }),
		onEsquerda: () => trocarArrastando(1),
		onDireita: () => trocarArrastando(-1),
	})
	// A folha antiga saiu (sem animar, ver variantesSlide): volta o arrasto pro lugar antes do novo
	// dia entrar.
	function aoSairFolha() {
		if (!arrastando) return
		arrasto.jump(0)
		setArrastando(false)
	}

	// Imprimir: a janela (DialogoImpressao) escolhe o modelo — por padrão o deste dia, ou o em
	// destaque se o dia não existe. `null` = ainda não mexeu na escolha desde que abriu.
	const [imprimindo, setImprimindo] = useState(false)
	const [modeloImpressaoId, setModeloImpressaoId] = useState<string | null>(null)
	const modeloDoDia = dia?.modeloId && opcoes.some((o) => o.modelo.id === dia.modeloId) ? dia.modeloId : null
	const idImpressao = modeloImpressaoId ?? modeloDoDia ?? destaqueId
	const conteudoImpressao = useConteudoImpressao(opcoes.find((o) => o.modelo.id === idImpressao)?.modelo.estrutura ?? null)
	const { opcoes: opcoesImpressao, mudarOpcoes: mudarOpcoesImpressao } = useOpcoesImpressao()

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

	// "Não cabe": a folha montada pra captura cresce além da proporção A5 quando as listas são longas
	// demais (o PDF então sai reduzido pra caber na página). Medido na folha real, depois do render.
	const [naoCabe, setNaoCabe] = useState(false)
	useLayoutEffect(() => {
		if (!imprimindo) return
		const quadro = requestAnimationFrame(() => {
			const passou = [frenteImpressaoRef.current, versoImpressaoRef.current].some(
				(folha) => folha && folha.offsetHeight > (folha.offsetWidth * 210) / 148 + 1,
			)
			setNaoCabe(passou)
		})
		return () => cancelAnimationFrame(quadro)
	})

	async function baixarA5() {
		if (!frenteImpressaoRef.current || !versoImpressaoRef.current) return
		setGerandoPdf(true)
		try {
			// Import dinâmico: html2canvas-pro + jsPDF só entram no bundle quando alguém realmente
			// clica em baixar, não sempre que a página do Diário monta (ver App.tsx, mesma lógica
			// de code-splitting das rotas /imprimir-a5 e /imprimir-a4).
			const { gerarPdfBlobDeElementos, baixarBlob } = await import('../../pdf/capturarCardComoPdf')
			const blob = await gerarPdfBlobDeElementos([frenteImpressaoRef.current, versoImpressaoRef.current], {
				pretoEBranco: opcoesImpressao.pretoEBranco,
				semTextura: opcoesImpressao.economizarTinta,
			})
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
			const blob = await gerarPdfBlobA4DoisPlanners(frenteImpressaoRef.current, versoImpressaoRef.current, {
				pretoEBranco: opcoesImpressao.pretoEBranco,
				semTextura: opcoesImpressao.economizarTinta,
			})
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
				opcoes={opcoesImpressao}
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
				lado={lado}
				// Virar só existe com o dia criado e no modo "virar a folha".
				onGirar={dia && modoVisualizacao === 'girar' ? () => girar(lado === 'frente' ? 1 : -1) : undefined}
				modoEdicao={modoEdicao}
				onToggleModo={alternarModo}
				onEditarDia={dia ? () => setEditando({ tipo: 'dia', dia }) : undefined}
				onExcluirDia={dia ? () => setConfirmandoExclusao(true) : undefined}
			/>

			{/* overflow-x-clip: a folha arrastada pra fora da tela não cria rolagem pro lado. A margem
			    negativa (compensada pelo padding) deixa a sombra da folha fora do corte. */}
			<div className="-mx-3 overflow-x-clip px-3">
				<motion.div ref={areaFolhaRef} style={{ x: arrasto }}>
					<AnimatePresence mode="wait" custom={{ direcao, arrastando }} initial={false} onExitComplete={aoSairFolha}>
						<motion.div
							key={dataISO}
							custom={{ direcao, arrastando }}
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
									onEscolher={(modelo) => escolherModelo(modelo)}
									onEditar={primeiraVez ? undefined : (modelo) => setEditando({ tipo: 'modelo', modelo })}
									onCriarModelo={() => setEditando({ tipo: 'novo' })}
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</div>

			{editando && (
				<DialogoModelo
					alvo={editando}
					modelos={modelos}
					// Prontos ficam sempre (podem ser editados, não excluídos); e nunca o último modelo.
					podeExcluir={editando.tipo === 'modelo' && !editando.modelo.pronto && modelos.length > 1}
					onSalvar={salvarEdicao}
					onExcluir={excluirModelo}
					onFechar={() => setEditando(null)}
				/>
			)}
			{imprimindo && (
				<DialogoImpressao
					opcoes={opcoes}
					selecionadoId={idImpressao}
					onSelecionar={setModeloImpressaoId}
					conteudo={conteudoImpressao}
					opcoesImpressao={opcoesImpressao}
					onMudarOpcoes={mudarOpcoesImpressao}
					naoCabe={naoCabe}
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
