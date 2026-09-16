import { Outlet } from 'react-router-dom'

// A navegação contextual (← Catálogo | Diário | Semanal | Mensal) morava aqui, injetada no
// header via useHeaderSlot. Subiu pro DateNav.tsx porque o modo foco (Layout.tsx) faz o header
// sumir por completo em /planners/* — não sobra onde injetar nada nele. Ver Bloco 3/4 das
// instruções de modo foco.
export function PlannersHub() {
	return <Outlet />
}
