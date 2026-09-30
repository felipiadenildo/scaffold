// Dicionário de referência. en.ts e es.ts são tipados com `Dicionario` (o tipo deste objeto):
// chave faltando ou sobrando em qualquer um dos dois é erro de compilação.
export const pt = {
	app: {
		navegacaoPrincipal: 'Navegação principal',
		rodapeAviso: 'Versão em construção. Consulte o',
		rodapeManual: 'manual completo',
		carregandoImpressao: 'Carregando editor de impressão…',
	},
	idioma: {
		rotulo: 'Idioma',
	},
	tema: {
		paraEscuro: 'Mudar para tema escuro',
		paraClaro: 'Mudar para tema claro',
	},
	catalogo: {
		trilha: 'Trilha de navegação',
		inicio: 'Catálogo',
		descricao: 'Ferramentas para organizar o dia, o dinheiro e a rotina. Escolha por onde começar.',
		prontoParaUsar: 'Pronto para usar',
		emDesenvolvimento: 'Em desenvolvimento',
		emDesenvolvimentoDescricao: 'Já dá pra usar, mas o design e o conteúdo ainda podem mudar.',
		soEmPortugues: 'Disponível só em português por enquanto.',
		categorias: {
			impresso: 'Impresso',
			'notion-sheets': 'Notion / Sheets',
			web: 'Web',
		},
		// Convenção de `acao`: sempre "verbo + objeto concreto", descrevendo o que o clique faz.
		itens: {
			planners: {
				nome: 'Planners',
				resumo:
					'O dia em blocos por período, frente e verso. Tem humor, hábitos e protocolo de dia difícil. O diário já está pronto, e semanal e mensal vêm depois.',
				acao: 'Abrir o Planner',
			},
			'lista-compras': {
				nome: 'Lista de Compras',
				resumo: 'Semanal, pontual ou mensal. Escolha o tipo de lista certo pro momento.',
				acao: 'Escolher lista',
			},
			'dopamine-menu': {
				nome: 'Dopamine Menu',
				resumo: 'Uma sugestão por vez, por categoria, em vez da lista inteira de uma vez.',
				acao: 'Escolher categoria',
			},
			'meal-prep': {
				nome: 'Meal Prep',
				resumo: 'Estoque do freezer: o que tem, desde quando e quantas porções.',
				acao: 'Ver estoque',
			},
			'cartao-sos': {
				nome: 'Cartão SOS',
				resumo:
					'Um cartão pra consultar em momentos difíceis, com o que ajuda a atravessar sem decidir no escuro. Ainda em desenvolvimento, o design definitivo não começou.',
				acao: 'Conhecer o cartão',
			},
			financeiro: {
				nome: 'Financeiro',
				resumo: 'Estrutura de planilha pra dar visibilidade ao gasto e ajudar no controle de impulso.',
				acao: 'Abrir planilha',
			},
			viagem: {
				nome: 'Viagem',
				resumo: 'Checklists de ônibus e voo, mais um checklist de verificação de IA.',
				acao: 'Abrir checklist',
			},
		},
	},
	planner: {
		visoes: { diario: 'Diário', semanal: 'Semanal', mensal: 'Mensal' },
		emBreve: 'Em breve',
		ajustarLargura: 'Ajustar largura',
		modoVisualizacao: 'Modo de visualização',
		hoje: 'Hoje',
		calendario: 'Calendário',
		diaAnterior: 'Dia anterior',
		proximoDia: 'Próximo dia',
		paraModoVisualizacao: 'Mudar para modo de visualização',
		paraModoEdicao: 'Mudar para modo de edição',
		editandoDica: 'Editando — clique pra só visualizar',
		visualizandoDica: 'Visualizando — clique pra editar',
		verVerso: 'Ver verso',
		verFrente: 'Ver frente',
		virarEsquerda: 'Virar página pra esquerda',
		virarDireita: 'Virar página pra direita',
		humorDoDia: 'Humor do dia',
		humores: {
			otimo: 'Ótimo',
			bem: 'Bem',
			neutro: 'Neutro',
			dificil: 'Difícil',
			'muito-dificil': 'Muito difícil',
		},
		tituloExtraPlaceholder: '+ adicionar título (evento, dia especial…)',
		escrevaAqui: 'Escreva aqui…',
		sobreODia: 'Sobre o dia:',
		sobreODiaPlaceholder: 'Um resumo geral, uma vitória, o que quiser guardar…',
		anotacoes: 'Anotações',
		anotacoesPlaceholder: 'Qualquer pensamento que atravessar o dia, anota aqui.',
		habitos: 'Habit tracker',
		importantes: 'Não pode deixar de fazer:',
		adicionarItemPlaceholder: 'Adicionar item…',
		adicionarItemEm: (lista: string) => `Adicionar item em ${lista}`,
		adicionar: 'Adicionar',
		removerItem: (item: string) => `Remover "${item}"`,
	},
	impressao: {
		imprimir: 'Imprimir',
		gerandoPdf: 'Gerando PDF…',
		gerando: 'Gerando…',
		umPorFolha: '1 por folha',
		doisPorFolha: '2 por folha',
		baixarPdf: 'Baixar PDF',
		baixarPdfA4: 'Baixar PDF (A4, 2 planners)',
		avisoA4:
			'A folha sai deitada: a página 1 tem as duas frentes lado a lado, a página 2 os dois versos — corte ao meio e cada metade vira um planner A5 completo.',
	},
}

export type Dicionario = typeof pt
