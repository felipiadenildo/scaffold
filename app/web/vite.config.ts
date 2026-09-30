import { execSync } from 'node:child_process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

// Versão do app: commit curto + data do build. Aparece nos detalhes da tela de erro (e, no futuro,
// no "Reportar") — pra saber em que versão um problema aconteceu.
function versaoDoApp(): string {
  let commit = 'dev'
  try {
    commit = execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    // Fora de um repositório git (ex.: build num ambiente sem histórico): fica "dev".
  }
  return `${commit} · ${new Date().toISOString().slice(0, 10)}`
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __VERSAO_APP__: JSON.stringify(versaoDoApp()),
  },
  plugins: [
    react(),
    tailwindcss(),
    // App instalável (PWA): manifesto + service worker gerado pelo Workbox.
    // - registerType 'prompt': versão nova não entra sozinha; o app avisa ("Nova versão disponível ·
    //   Atualizar") e a pessoa escolhe a hora (AtualizacaoApp.tsx) — nada de trocar a tela no meio de
    //   uma anotação.
    // - O registro é feito pelo hook do plugin (virtual:pwa-register/react), por isso injectRegister: false.
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Scaffold',
        short_name: 'Scaffold',
        description: 'Planner e ferramentas de rotina para TDAH.',
        lang: 'pt-BR',
        // Instalado, o app abre direto no Planner (uso diário); o catálogo fica no menu "Scaffold".
        start_url: '/planners/diario',
        scope: '/',
        display: 'standalone',
        // Fundo do app no tema claro (tokens.css, --scaffold-bg): tela de abertura e barra do sistema.
        background_color: '#faf8f3',
        theme_color: '#faf8f3',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-mascaravel-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // O app inteiro (código, estilos, fontes, ícones) fica guardado no aparelho: abre sem internet.
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        // Os PDFs prontos das ferramentas em teste (public/print) não entram no pacote inicial —
        // são guardados na primeira vez que alguém abre cada um.
        globIgnores: ['print/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/print/'),
            handler: 'CacheFirst',
            options: { cacheName: 'impressos', expiration: { maxEntries: 30 } },
          },
        ],
        // Rotas do app (SPA): sem internet, qualquer endereço abre o index.html guardado.
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    // Libera o acesso ao servidor de desenvolvimento pelo nome da máquina no Tailscale (*.ts.net),
    // pra testar no celular fora da rede local.
    allowedHosts: ['.ts.net'],
  },
  preview: {
    // Mesmo motivo, pro build de produção servido pelo `vite preview` (é nele que o PWA funciona).
    allowedHosts: ['.ts.net'],
  },
  test: {
    // happy-dom só pelo localStorage da camada de armazenamento; as regras do Planner são funções puras.
    environment: 'happy-dom',
  },
})
