import { criarLista } from './listas'
import { criarModelo } from './modelos'
import type { ListaVersionada, Modelo } from './tipos'

// Conteúdo inicial do Planner. Só em português por enquanto — a etapa de idiomas (0-B) passa esses
// textos pro dicionário, e a 0-C troca a criação silenciosa por uma tela de boas-vindas onde a
// pessoa escolhe os modelos prontos.

export function modelosIniciais(): Modelo[] {
	return [criarModelo('Padrão', ['Café da manhã', 'Almoço', 'Lanche da tarde', 'Jantar'], [1, 2, 3, 4, 5])]
}

export function habitosIniciais(): ListaVersionada {
	return criarLista(['Água', 'Remédio', 'Movimento', 'Higiene', 'Refeição regular'])
}

export function importantesIniciais(): ListaVersionada {
	return criarLista([
		'Água / remédio',
		'Comer algo, mesmo que pronto',
		'Só a tarefa principal da manhã',
		'Aceitar o descanso sem se punir',
	])
}
