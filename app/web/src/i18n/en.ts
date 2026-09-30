import type { Dicionario } from './pt'

export const en: Dicionario = {
	app: {
		navegacaoPrincipal: 'Main navigation',
		rodapeAviso: 'Work in progress. See the',
		rodapeManual: 'full manual (in Portuguese)',
		carregandoImpressao: 'Loading print editor…',
	},
	idioma: {
		rotulo: 'Language',
	},
	tema: {
		paraEscuro: 'Switch to dark theme',
		paraClaro: 'Switch to light theme',
	},
	catalogo: {
		trilha: 'Breadcrumb',
		inicio: 'Catalog',
		descricao: 'Tools to organize your day, your money and your routine. Pick where to start.',
		prontoParaUsar: 'Ready to use',
		emDesenvolvimento: 'In development',
		emDesenvolvimentoDescricao: 'Already usable, but design and content may still change.',
		soEmPortugues: 'Only available in Portuguese for now.',
		categorias: {
			impresso: 'Printable',
			'notion-sheets': 'Notion / Sheets',
			web: 'Web',
		},
		itens: {
			planners: {
				nome: 'Planners',
				resumo:
					'Your day in blocks, front and back. Includes mood, habits and a hard-day protocol. The daily planner is ready; weekly and monthly come next.',
				acao: 'Open the Planner',
			},
			'lista-compras': {
				nome: 'Shopping List',
				resumo: 'Weekly, one-off or monthly. Pick the right kind of list for the moment.',
				acao: 'Choose a list',
			},
			'dopamine-menu': {
				nome: 'Dopamine Menu',
				resumo: 'One suggestion at a time, by category, instead of the whole list at once.',
				acao: 'Choose a category',
			},
			'meal-prep': {
				nome: 'Meal Prep',
				resumo: "Freezer stock: what's there, since when and how many portions.",
				acao: 'See stock',
			},
			'cartao-sos': {
				nome: 'SOS Card',
				resumo:
					'A card to check in hard moments, with what helps you get through without deciding in the dark. Still in development; the final design has not started.',
				acao: 'See the card',
			},
			financeiro: {
				nome: 'Finances',
				resumo: 'A spreadsheet structure to make spending visible and help with impulse control.',
				acao: 'Open spreadsheet',
			},
			viagem: {
				nome: 'Travel',
				resumo: 'Bus and flight checklists, plus an AI fact-check checklist.',
				acao: 'Open checklist',
			},
		},
	},
	planner: {
		visoes: { diario: 'Daily', semanal: 'Weekly', mensal: 'Monthly' },
		emBreve: 'Coming soon',
		ajustarLargura: 'Adjust width',
		modoVisualizacao: 'View mode',
		hoje: 'Today',
		calendario: 'Calendar',
		diaAnterior: 'Previous day',
		proximoDia: 'Next day',
		paraModoVisualizacao: 'Switch to view mode',
		paraModoEdicao: 'Switch to edit mode',
		editandoDica: 'Editing — click to only view',
		visualizandoDica: 'Viewing — click to edit',
		verVerso: 'See back',
		verFrente: 'See front',
		virarEsquerda: 'Turn page left',
		virarDireita: 'Turn page right',
		humorDoDia: 'Mood of the day',
		humores: {
			otimo: 'Great',
			bem: 'Good',
			neutro: 'Neutral',
			dificil: 'Hard',
			'muito-dificil': 'Very hard',
		},
		tituloExtraPlaceholder: '+ add a title (event, special day…)',
		escrevaAqui: 'Write here…',
		sobreODia: 'About the day:',
		sobreODiaPlaceholder: 'A summary, a win, anything you want to keep…',
		anotacoes: 'Notes',
		anotacoesPlaceholder: 'Any thought that crosses your day, jot it down here.',
		habitos: 'Habit tracker',
		importantes: "Don't skip:",
		adicionarItemPlaceholder: 'Add item…',
		adicionarItemEm: (lista: string) => `Add item to ${lista}`,
		adicionar: 'Add',
		removerItem: (item: string) => `Remove "${item}"`,
	},
	impressao: {
		imprimir: 'Print',
		gerandoPdf: 'Generating PDF…',
		gerando: 'Generating…',
		umPorFolha: '1 per sheet',
		doisPorFolha: '2 per sheet',
		baixarPdf: 'Download PDF',
		baixarPdfA4: 'Download PDF (A4, 2 planners)',
		avisoA4:
			'The sheet prints in landscape: page 1 has both fronts side by side, page 2 both backs — cut it in half and each half becomes a complete A5 planner.',
	},
}
