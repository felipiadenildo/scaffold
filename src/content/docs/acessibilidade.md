---
title: Acessibilidade
description: O que este site já faz por acessibilidade, e o que ainda falta.
prev: false
next: false
---

Um manual para TDAH que não é fácil de ler falha no próprio propósito. Este documento diz o que já foi feito e o que ainda não foi, com honestidade.

## O que já está implementado

**Tipografia.** O corpo do texto usa Atkinson Hyperlegible, desenhada para distinguir caracteres facilmente confundidos (I maiúsculo, l minúsculo, o número 1; o número 0 e a letra O). A linha de texto tem espaçamento maior que o padrão de navegador, e o comprimento de linha é limitado a cerca de 72 caracteres, faixa recomendada para reduzir o esforço de encontrar a próxima linha ao ler.

**Cor.** Nenhuma informação depende só de cor. Os blocos de destaque (contexto, dica, atenção, protocolo de crise) usam cor mais rótulo em texto, nunca cor isolada.

**Navegação.** A barra lateral fica visível por padrão em qualquer página, sem precisar abrir menu. O Cartão SOS tem link fixo no topo dessa barra, destacado, sem exigir navegação por capítulo.

**Movimento.** Toda transição e animação do site respeita a preferência de sistema por movimento reduzido (`prefers-reduced-motion`). Quem tem essa preferência ativada no navegador não vê nenhuma transição de tema ou ícone.

**Teclado e leitor de tela.** O site é construído sobre o Starlight, framework de documentação com suporte nativo a navegação por teclado e marcação semântica adequada para leitor de tela.

## O que ainda não foi verificado a fundo

Este site não passou por uma auditoria formal com leitor de tela real nem por teste com usuário neurodivergente fora do caso que originou o projeto. Contraste de cor em modo escuro foi ajustado visualmente, não medido com ferramenta de contraste em todas as combinações.

## Encontrou um problema?

Se alguma parte do site for difícil de usar por qualquer motivo relacionado a acessibilidade, isso é exatamente o tipo de retorno que mais importa para este projeto. Use a página de [Contato](/contato/).
