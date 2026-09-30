import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Libera o acesso ao servidor de desenvolvimento pelo nome da máquina no Tailscale (*.ts.net),
    // pra testar no celular fora da rede local.
    allowedHosts: ['.ts.net'],
  },
  test: {
    // happy-dom só pelo localStorage da camada de armazenamento; as regras do Planner são funções puras.
    environment: 'happy-dom',
  },
})
