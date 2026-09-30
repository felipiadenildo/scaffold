import { blocosVisuais } from '../../data/planner/cores'
import type { Estrutura } from '../../data/planner/tipos'

// Desenho mínimo da folha (proporção A5), frente e verso lado a lado, pra reconhecer um modelo pela
// forma sem ler o nome — "Fim de semana" e "Dia difícil" têm a mesma frente, a diferença está no
// verso. Papel de verdade (bg-paper), pra funcionar sobre qualquer fundo de botão.
//
// 'responsivo': pequena no celular, grande na tela larga (cards da folha pontilhada).
// 'pequeno': sempre pequena (listas compactas, como a janela de impressão).
type Tamanho = 'responsivo' | 'pequeno'

const CLASSES: Record<Tamanho, { par: string; face: string; pontos: string; ponto: string; raio: string; listas: string; borda: string; anotacoes: string }> = {
	pequeno: {
		par: 'gap-1',
		face: 'h-10 w-7 gap-0.5 rounded-[3px] p-[3px]',
		pontos: 'gap-px',
		ponto: 'h-0.5 w-0.5',
		raio: 'rounded-[1px]',
		listas: 'gap-0.5',
		borda: 'border',
		anotacoes: 'px-px',
	},
	responsivo: {
		par: 'gap-1 sm:gap-1.5',
		face: 'h-10 w-7 gap-0.5 rounded-[3px] p-[3px] sm:h-[5.75rem] sm:w-16 sm:gap-1 sm:rounded-[5px] sm:p-1.5',
		pontos: 'gap-px sm:gap-0.5',
		ponto: 'h-0.5 w-0.5 sm:h-1 sm:w-1',
		raio: 'rounded-[1px] sm:rounded-[2px]',
		listas: 'gap-0.5 sm:gap-1',
		borda: 'border sm:border-[1.5px]',
		anotacoes: 'px-px sm:px-1',
	},
}

function Frente({ estrutura, c }: { estrutura: Estrutura; c: (typeof CLASSES)[Tamanho] }) {
	return (
		<span className={'flex flex-col border border-paper-ink/15 bg-paper shadow-raised ' + c.face}>
			{estrutura.humor && (
				<span className={'flex shrink-0 justify-end ' + c.pontos}>
					{[0, 1, 2, 3, 4].map((i) => (
						<span key={i} className={'block rounded-full bg-paper-ink/35 ' + c.ponto} />
					))}
				</span>
			)}
			{blocosVisuais(estrutura.blocos).map((bloco) => (
				<span
					key={bloco.id}
					className={'block flex-1 ' + c.raio}
					style={{ backgroundColor: bloco.corSuave, borderTop: `1.5px solid ${bloco.cor}` }}
				/>
			))}
			{estrutura.sobreDia && <span className="mt-px block h-px shrink-0 bg-paper-ink/40" />}
		</span>
	)
}

function Verso({ estrutura, c }: { estrutura: Estrutura; c: (typeof CLASSES)[Tamanho] }) {
	const temListas = estrutura.habitos || estrutura.importantes
	return (
		<span className={'flex flex-col border border-paper-ink/15 bg-paper shadow-raised ' + c.face}>
			{/* Anotações: área pautada que ocupa o que sobrar. */}
			<span className={'flex flex-1 flex-col justify-evenly border border-paper-ink/15 ' + c.raio + ' ' + c.anotacoes}>
				{[0, 1, 2].map((i) => (
					<span key={i} className="block h-px bg-paper-ink/20" />
				))}
			</span>
			{temListas && (
				<span className={'flex h-[35%] shrink-0 ' + c.listas}>
					{estrutura.habitos && <span className={'block flex-1 border-accent ' + c.raio + ' ' + c.borda} />}
					{estrutura.importantes && (
						<span className={'block flex-1 border-caution bg-caution-bg ' + c.raio + ' ' + c.borda} />
					)}
				</span>
			)}
		</span>
	)
}

export function MiniaturaModelo({ estrutura, tamanho = 'responsivo' }: { estrutura: Estrutura; tamanho?: Tamanho }) {
	const c = CLASSES[tamanho]
	return (
		<span aria-hidden="true" className={'flex shrink-0 ' + c.par}>
			<Frente estrutura={estrutura} c={c} />
			<Verso estrutura={estrutura} c={c} />
		</span>
	)
}
