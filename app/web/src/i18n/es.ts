import type { Dicionario } from './pt'

export const es: Dicionario = {
	app: {
		navegacaoPrincipal: 'Navegación principal',
		rodapeAviso: 'Versión en construcción. Consulta el',
		rodapeManual: 'manual completo (en portugués)',
		carregandoImpressao: 'Cargando editor de impresión…',
	},
	idioma: {
		rotulo: 'Idioma',
	},
	tema: {
		paraEscuro: 'Cambiar a tema oscuro',
		paraClaro: 'Cambiar a tema claro',
	},
	catalogo: {
		trilha: 'Ruta de navegación',
		inicio: 'Catálogo',
		descricao: 'Herramientas para organizar el día, el dinero y la rutina. Elige por dónde empezar.',
		prontoParaUsar: 'Listo para usar',
		emDesenvolvimento: 'En desarrollo',
		emDesenvolvimentoDescricao: 'Ya se puede usar, pero el diseño y el contenido todavía pueden cambiar.',
		soEmPortugues: 'Por ahora solo disponible en portugués.',
		categorias: {
			impresso: 'Imprimible',
			'notion-sheets': 'Notion / Sheets',
			web: 'Web',
		},
		itens: {
			planners: {
				nome: 'Planners',
				resumo:
					'El día en bloques, anverso y reverso. Incluye estado de ánimo, hábitos y un protocolo para días difíciles. El diario ya está listo; el semanal y el mensual vienen después.',
				acao: 'Abrir el Planner',
			},
			'lista-compras': {
				nome: 'Lista de la compra',
				resumo: 'Semanal, puntual o mensual. Elige el tipo de lista adecuado para el momento.',
				acao: 'Elegir lista',
			},
			'dopamine-menu': {
				nome: 'Dopamine Menu',
				resumo: 'Una sugerencia a la vez, por categoría, en lugar de toda la lista de golpe.',
				acao: 'Elegir categoría',
			},
			'meal-prep': {
				nome: 'Meal Prep',
				resumo: 'Existencias del congelador: qué hay, desde cuándo y cuántas porciones.',
				acao: 'Ver existencias',
			},
			'cartao-sos': {
				nome: 'Tarjeta SOS',
				resumo:
					'Una tarjeta para consultar en momentos difíciles, con lo que ayuda a atravesarlos sin decidir a ciegas. Todavía en desarrollo; el diseño definitivo no ha empezado.',
				acao: 'Conocer la tarjeta',
			},
			financeiro: {
				nome: 'Finanzas',
				resumo: 'Estructura de hoja de cálculo para hacer visible el gasto y ayudar a controlar los impulsos.',
				acao: 'Abrir hoja de cálculo',
			},
			viagem: {
				nome: 'Viaje',
				resumo: 'Checklists de autobús y vuelo, más un checklist de verificación de IA.',
				acao: 'Abrir checklist',
			},
		},
	},
	planner: {
		visoes: { diario: 'Diario', semanal: 'Semanal', mensal: 'Mensual' },
		emBreve: 'Próximamente',
		ajustarLargura: 'Ajustar ancho',
		modoVisualizacao: 'Modo de visualización',
		hoje: 'Hoy',
		calendario: 'Calendario',
		diaAnterior: 'Día anterior',
		proximoDia: 'Día siguiente',
		paraModoVisualizacao: 'Cambiar a modo de visualización',
		paraModoEdicao: 'Cambiar a modo de edición',
		editandoDica: 'Editando — haz clic para solo ver',
		visualizandoDica: 'Viendo — haz clic para editar',
		verVerso: 'Ver reverso',
		verFrente: 'Ver anverso',
		virarEsquerda: 'Pasar página a la izquierda',
		virarDireita: 'Pasar página a la derecha',
		humorDoDia: 'Ánimo del día',
		humores: {
			otimo: 'Genial',
			bem: 'Bien',
			neutro: 'Neutral',
			dificil: 'Difícil',
			'muito-dificil': 'Muy difícil',
		},
		tituloExtraPlaceholder: '+ añadir título (evento, día especial…)',
		escrevaAqui: 'Escribe aquí…',
		sobreODia: 'Sobre el día:',
		sobreODiaPlaceholder: 'Un resumen, un logro, lo que quieras guardar…',
		anotacoes: 'Notas',
		anotacoesPlaceholder: 'Cualquier pensamiento que cruce tu día, anótalo aquí.',
		habitos: 'Hábitos',
		importantes: 'No puedo dejar de hacer:',
		adicionarItemPlaceholder: 'Añadir elemento…',
		adicionarItemEm: (lista: string) => `Añadir elemento a ${lista}`,
		adicionar: 'Añadir',
		removerItem: (item: string) => `Quitar "${item}"`,
	},
	impressao: {
		imprimir: 'Imprimir',
		gerandoPdf: 'Generando PDF…',
		gerando: 'Generando…',
		umPorFolha: '1 por hoja',
		doisPorFolha: '2 por hoja',
		baixarPdf: 'Descargar PDF',
		baixarPdfA4: 'Descargar PDF (A4, 2 planners)',
		avisoA4:
			'La hoja sale en horizontal: la página 1 tiene los dos anversos lado a lado y la página 2 los dos reversos — córtala por la mitad y cada mitad se convierte en un planner A5 completo.',
	},
}
