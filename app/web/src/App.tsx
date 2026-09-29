import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { Catalogo } from './pages/Catalogo'
import { CartaoSos } from './pages/CartaoSos'
import { DopamineMenu } from './pages/DopamineMenu'
import { Financeiro } from './pages/Financeiro'
import { MealPrep } from './pages/MealPrep'
import { ShoppingList } from './pages/ShoppingList'
import { Viagem } from './pages/Viagem'
import { PlannerDiario } from './pages/planners/Diario'
import { PlannersHub } from './pages/planners/PlannersHub'

// Carregadas sob demanda: puxam html2canvas-pro + jsPDF (~230kB), pesado demais pra ir no bundle
// principal só porque a rota existe — só quem realmente for imprimir baixa esse pedaço.
const ImprimirDiarioA5 = lazy(() =>
	import('./pages/planners/print/ImprimirDiarioA5').then((m) => ({ default: m.ImprimirDiarioA5 })),
)
const ImprimirDiarioA4 = lazy(() =>
	import('./pages/planners/print/ImprimirDiarioA4').then((m) => ({ default: m.ImprimirDiarioA4 })),
)

// Fallback das rotas de impressão. Sem isso, a aba nova abre em branco enquanto o
// chunk do gerador de PDF carrega, e o usuário acha que quebrou.
function CarregandoImpressao() {
	return (
		<div className="flex min-h-svh items-center justify-center p-8 text-sm text-ink-soft">
			Carregando editor de impressão…
		</div>
	)
}

function App() {
	return (
		<Routes>
			{/* Fora do Layout de propósito — é uma folha pra imprimir, sem cabeçalho/rodapé do app. */}
			<Route
				path="planners/diario/imprimir-a5"
				element={
					<Suspense fallback={<CarregandoImpressao />}>
						<ImprimirDiarioA5 />
					</Suspense>
				}
			/>
			<Route
				path="planners/diario/imprimir-a4"
				element={
					<Suspense fallback={<CarregandoImpressao />}>
						<ImprimirDiarioA4 />
					</Suspense>
				}
			/>

			<Route element={<Layout />}>
				<Route index element={<Catalogo />} />
				<Route path="planners" element={<PlannersHub />}>
					<Route index element={<Navigate to="diario" replace />} />
					<Route path="diario" element={<PlannerDiario />} />
				</Route>
				<Route path="lista-compras" element={<ShoppingList />} />
				<Route path="dopamine-menu" element={<DopamineMenu />} />
				<Route path="meal-prep" element={<MealPrep />} />
				<Route path="cartao-sos" element={<CartaoSos />} />
				<Route path="financeiro" element={<Financeiro />} />
				<Route path="viagem" element={<Viagem />} />

				{/*
					URL inválida volta pro catálogo em vez de renderizar <Outlet /> vazio.
					Se um dia houver 404 dedicado, trocar por <Route path="*" element={<NaoEncontrado />} />.
				*/}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	)
}

export default App