---
title: Roadmap
description: O que já existe, o que está em teste, e o que vem depois, separado por trilha digital e física.
prev: false
next: false
---

Duas trilhas paralelas, não uma fila única. O que trava numa não trava a outra. O trabalho de cada trilha vive fora deste site, em pastas próprias do repositório do projeto (`prototypes/` e `producao-fisica/`, ao lado da pasta `site/`).

## Trilha digital

**Feito.** Site de referência (este site), em Astro e Starlight: capítulos do manual, templates, guia de produtos, todos versionados e com busca embutida.

**Em teste, não lançado.** Protótipos das ferramentas interativas como Claude Artifacts, documentados em `prototypes/` no repositório, para validar a ideia antes de qualquer aplicativo definitivo:

- Folha A5 online. O dia atual editável nos mesmos blocos da versão em papel, visualmente organizada, que arquiva sozinha ao fim do dia e libera uma folha nova.
- Cartão SOS navegável. Versão colorida, com poucos toques até o protocolo certo, pensada para ser usável mesmo sob estresse agudo, a mesma lógica de leitura sob pressão do [capítulo de protocolos](/manual/05-protocolos-crise-emocional/).
- Lista de compras online. Adicionar item pelo celular durante a semana, arquivar ao fechar a compra, nova lista disponível automaticamente.

Nenhuma dessas três tem link público ainda. Quando o uso real mostrar que a ideia funciona, sobe uma página própria para centralizar as ferramentas, separada deste site de referência.

**Depois.** Template Notion pronto, específico do Scaffold, para duplicar em vez de montar do zero. Viagem e financeiro já têm estrutura definida no manual, falta empacotar como template real. Migrar controle financeiro para um app pronto, se a planilha manual não pegar tração no uso real.

O formulário de [Contato](/contato/) já existe, via Web3Forms, mas precisa da chave de API configurada assim que o site tiver um destino de e-mail definitivo.

## Trilha física, ou de impressão

**Feito.** Conteúdo de todos os templates prontos em Markdown, com layout ilustrado em ASCII. Mockups em HTML para visualizar o design antes da versão definitiva, em `site/public/_mockups/`, linkados de cada página de template.

**Próximo.** Levar os mockups HTML para uma ferramenta de design de verdade, Canva ou Figma, documentado em `producao-fisica/` no repositório, para chegar numa versão realmente imprimível: tipografia final, cor de impressão, corte de cartão. Primeiro lote: Cartão SOS, em formato cartão de visita, um por cenário, e Folha A5.

**Depois.** Imprimir um lote de teste, usar por duas a três semanas, ajustar o layout a partir do uso real antes de qualquer impressão em quantidade maior.

## Por que separado assim

Testar a Folha A5 em papel não depende de nenhuma decisão sobre o site de soluções interativas, e o contrário também é verdade. Travar numa trilha não devia travar a outra.

Cada entrega listada aqui é pequena o bastante para não gerar a mesma armadilha que o próprio manual alerta: tentar tudo de uma vez trava o sistema inteiro.
