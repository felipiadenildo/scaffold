import { Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { Catalogo } from './pages/Catalogo'
import { CartaoSos } from './pages/CartaoSos'
import { DopamineMenu } from './pages/DopamineMenu'
import { Financeiro } from './pages/Financeiro'
import { FolhaA5Digital } from './pages/FolhaA5Digital'
import { MealPrep } from './pages/MealPrep'
import { ShoppingList } from './pages/ShoppingList'
import { Viagem } from './pages/Viagem'

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Catalogo />} />
				<Route path="folha-a5" element={<FolhaA5Digital />} />
				<Route path="lista-compras" element={<ShoppingList />} />
				<Route path="dopamine-menu" element={<DopamineMenu />} />
				<Route path="meal-prep" element={<MealPrep />} />
				<Route path="cartao-sos" element={<CartaoSos />} />
				<Route path="financeiro" element={<Financeiro />} />
				<Route path="viagem" element={<Viagem />} />
			</Route>
		</Routes>
	)
}

export default App
