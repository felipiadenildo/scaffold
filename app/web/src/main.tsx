import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { migrarArmazenamento } from './data/armazenamento/migracoes'
// Efeito na carga: começa a ouvir o "dá pra instalar" do navegador antes de qualquer tela existir.
import './lib/instalacao'

// Antes do primeiro render: nenhum componente pode ler dados num formato antigo.
migrarArmazenamento()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
