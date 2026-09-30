// Gera os ícones PNG do app (PWA) a partir dos SVGs em icones/. Rodar só quando o ícone mudar:
//   node scripts/gerar-icones.mjs
// Os PNGs vão pra public/ e ficam versionados.
import { copyFileSync } from 'node:fs'
import sharp from 'sharp'

const saidas = [
	{ origem: 'icones/icone.svg', destino: 'public/pwa-192.png', tamanho: 192 },
	{ origem: 'icones/icone.svg', destino: 'public/pwa-512.png', tamanho: 512 },
	{ origem: 'icones/icone-mascaravel.svg', destino: 'public/pwa-mascaravel-512.png', tamanho: 512 },
	{ origem: 'icones/icone-mascaravel.svg', destino: 'public/apple-touch-icon.png', tamanho: 180 },
]

for (const { origem, destino, tamanho } of saidas) {
	await sharp(origem, { density: 300 }).resize(tamanho, tamanho).png().toFile(destino)
	console.log('gerado', destino)
}
copyFileSync('icones/icone.svg', 'public/favicon.svg')
console.log('copiado public/favicon.svg')
