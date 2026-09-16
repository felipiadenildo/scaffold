import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { DateNav } from '../../components/DateNav'
import { habitosPadrao, protocoloPadrao } from '../../data/planner'
import { usePlannerDia } from '../../hooks/usePlannerDia'
import { useListaTemplate, useSecoesTemplate } from '../../hooks/usePlannerTemplates'
import { paraISO } from '../../lib/formatarData'
import { FolhaFlip } from './FolhaFlip'

// Padrão oficial do Framer Motion pra carrossel/paginação direcional: entra do lado de onde
// "veio" a navegação, sai pro lado oposto — próximo dia desliza da direita, dia anterior da
// esquerda (https://www.framer.com/motion/examples/ — exemplo "Carousel/Swipe").
const variantesSlide = {
	entra: (direcao: number) => ({ x: direcao >= 0 ? 32 : -32, opacity: 0 }),
	centro: { x: 0, opacity: 1 },
	sai: (direcao: number) => ({ x: direcao >= 0 ? -32 : 32, opacity: 0 }),
}

export function PlannerDiario() {
	const [dataAtual, setDataAtual] = useState(() => new Date())
	const [direcao, setDirecao] = useState(0)
	// Ângulo de giro mora aqui (não em FolhaFlip) justamente pra sobreviver à troca de dia — trocar
	// de data continua no mesmo lado (frente/verso) em que você já estava.
	const [rotacao, setRotacao] = useState(0)
	const girar = (dir: 1 | -1) => setRotacao((r) => r + dir * 180)
	const passos = Math.round(rotacao / 180)
	const lado: 'frente' | 'verso' = ((passos % 2) + 2) % 2 === 0 ? 'frente' : 'verso'
	// Editável por padrão do presente em diante; passado nasce em modo de visualização. Em
	// qualquer um dos casos dá pra alternar manualmente (ícone no DateNav) — a exceção fica
	// registrada por data, então voltar pra um dia não mexe no padrão dos outros.
	const [excecoesModo, setExcecoesModo] = useState<Record<string, boolean>>({})
	// Largura "normal" (mesma do resto do app) ou ajustada pra usar o espaço disponível na tela —
	// a proporção A5 nunca muda, só o quanto ela escala.
	const [expandido, setExpandido] = useState(false)
	const dataISO = paraISO(dataAtual)
	const ehPassado = dataISO < paraISO(new Date())
	const modoEdicao = excecoesModo[dataISO] ?? !ehPassado
	const somenteLeitura = !modoEdicao

	function mudarData(novaData: Date) {
		setDirecao(novaData.getTime() >= dataAtual.getTime() ? 1 : -1)
		setDataAtual(novaData)
	}

	function alternarModo() {
		setExcecoesModo((prev) => ({ ...prev, [dataISO]: !modoEdicao }))
	}

	const { dia, setHumor, setSecaoValor, setSobreDia, setAnotacoes, setHabitos, setProtocolo } = usePlannerDia(dataISO)
	const { secoes, renomear } = useSecoesTemplate()
	const { itens: habitos, salvarItens: salvarHabitos } = useListaTemplate('habitos', habitosPadrao)
	const { itens: protocolo, salvarItens: salvarProtocolo } = useListaTemplate('protocolo', protocoloPadrao)

	return (
		<div>
			<DateNav data={dataAtual} onChange={mudarData} expandido={expandido} onToggleExpandido={() => setExpandido((e) => !e)} />

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
					<FolhaFlip
						expandido={expandido}
						lado={lado}
						onGirar={girar}
						data={dataAtual}
						onDataChange={mudarData}
						modoEdicao={modoEdicao}
						onToggleModo={alternarModo}
						humor={dia.humor}
						onHumorChange={setHumor}
						secoesTemplate={secoes}
						onRenomearSecao={renomear}
						valoresSecoes={dia.secoes}
						onValorSecaoChange={setSecaoValor}
						sobreDia={dia.sobreDia}
						onSobreDiaChange={setSobreDia}
						anotacoes={dia.anotacoes}
						onAnotacoesChange={setAnotacoes}
						habitos={habitos}
						onHabitosChange={salvarHabitos}
						habitosMarcados={dia.habitos}
						onHabitosMarcadosChange={setHabitos}
						protocolo={protocolo}
						onProtocoloChange={salvarProtocolo}
						protocoloMarcados={dia.protocolo}
						onProtocoloMarcadosChange={setProtocolo}
						somenteLeitura={somenteLeitura}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
