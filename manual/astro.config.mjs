// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://felipiadenildo.github.io',
	base: '/scaffold',
	// Nenhum bloco de código real existe no conteúdo, só ASCII art. Sem isso,
	// o Shiki do próprio Astro (independente do Expressive Code) ainda aplica
	// uma cor de fundo fixa de tema escuro no <pre>, quebrando o modo claro.
	markdown: {
		syntaxHighlight: false,
	},
	integrations: [
		starlight({
			title: 'Scaffold',
			description: 'Manual de referência sobre rotina e ambiente para TDAH.',
			defaultLocale: 'pt-BR',
			locales: {
				root: { label: 'Português', lang: 'pt-BR' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/felipiadenildo/scaffold' },
			],
			// Documentação viva: qualquer página pode ser editada direto no GitHub,
			// e a data de última revisão fica visível para quem lê.
			editLink: {
				baseUrl: 'https://github.com/felipiadenildo/scaffold/edit/main/',
			},
			lastUpdated: true,
			// Nenhum bloco de código real existe no conteúdo (só ASCII art sem
			// linguagem declarada nos templates para impressão). A moldura de
			// editor + botão "copiar" do Expressive Code não faz sentido aí e
			// contraria o princípio de zero elementos decorativos flutuantes.
			expressiveCode: false,
			customCss: [
				'./src/styles/tokens.css',
				'./src/styles/base.css',
				'./src/styles/starlight-overrides.css',
			],
			components: {
				// Substitui o dropdown de 3 opções do Starlight por um botão único
				// de sol/lua (ver comentário em ThemeToggle.astro).
				ThemeSelect: './src/components/ThemeToggle.astro',
				// O rodapé institucional entra dentro do ".main-pane" (via
				// TwoColumnContent), como irmão do artigo, pra herdar a mesma
				// largura responsiva dele — inclusive quando o índice à
				// direita aparece e reserva espaço. Ver TwoColumnContent.astro.
				TwoColumnContent: './src/components/TwoColumnContent.astro',
			},
			sidebar: [
				{
					label: 'Manual',
					items: [
						{ label: '01. Fundamentos', slug: 'manual/01-fundamentos' },
						{ label: '02. Ambientes Físicos', slug: 'manual/02-ambientes-fisicos' },
						{ label: '03. Sistema Analógico', slug: 'manual/03-sistema-analogico' },
						{ label: '04. Sistema Digital', slug: 'manual/04-sistema-digital' },
						{ label: '05. Protocolos de Crise Emocional', slug: 'manual/05-protocolos-crise-emocional' },
						{ label: '06. Rotinas do Dia a Dia', slug: 'manual/06-rotinas-dia-a-dia' },
						{ label: '07. Saúde, Corpo e Ciclo', slug: 'manual/07-saude-corpo-e-ciclo' },
						{ label: '08. Planejamento Médio/Longo Prazo', slug: 'manual/08-planejamento-medio-longo-prazo' },
						{ label: '09. Relações e Comunicação', slug: 'manual/09-relacoes-e-comunicacao' },
						{ label: '10. Automação e Distrações', slug: 'manual/10-automacao-e-distracoes' },
						{ label: '11. O Papel de Quem Ajuda', slug: 'manual/11-papel-de-quem-ajuda' },
						{ label: '12. Quando Buscar Ajuda Profissional', slug: 'manual/12-quando-buscar-ajuda-profissional' },
					],
				},
				{
					label: 'Templates prontos',
					items: [
						{
							label: 'Cartão SOS',
							slug: 'templates/cartao-sos',
							badge: { text: 'SOS', variant: 'danger' },
						},
						{ label: 'Folha A5', slug: 'templates/folha-a5' },
						{ label: 'Lista de Compras', slug: 'templates/lista-compras' },
						{ label: 'Meal Prep', slug: 'templates/meal-prep' },
						{ label: 'Viagem', slug: 'templates/viagem' },
						{ label: 'Financeiro', slug: 'templates/financeiro' },
						{ label: 'Dopamine Menu', slug: 'templates/dopamine-menu' },
					],
				},
				{ label: 'Guia de Produtos', link: '/produtos/guia-de-produtos/' },
				{
					label: 'Implementação',
					items: [
						{ label: 'Checklist de Implementação', slug: 'implementacao/checklist-implementacao' },
						{ label: 'Registro de Revisão', slug: 'implementacao/registro-de-revisao' },
						{ label: 'Roadmap', slug: 'implementacao/roadmap' },
					],
				},
				{ label: 'Resumo', link: '/resumo/' },
				{ label: 'Glossário', link: '/glossario/' },
			],
		}),
	],
});
