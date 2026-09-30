<div align="center">

<img src="app/web/icones/icone.svg" alt="Ícono de Scaffold" width="88" />

# Scaffold

**Rutina y entorno para el TDAH, en papel y en pantalla.**

Un manual de referencia y una app que lleva el manual a la práctica, para quienes tienen el diagnóstico y para quienes los acompañan.

[**Abrir la app**](https://app.myscaffold.workers.dev) · [**Leer el manual**](https://felipiadenildo.github.io/scaffold/) (en portugués) · [Enviar sugerencias](#contacto)

[English](README.md) · [Português](README.pt-BR.md) · **Español**

[![CI](https://github.com/felipiadenildo/scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/felipiadenildo/scaffold/actions/workflows/ci.yml)
[![Licencia: AGPL-3.0](https://img.shields.io/badge/licencia-AGPL--3.0-2f6b5f)](LICENSE)
[![Contenido: CC BY-NC-SA 4.0](https://img.shields.io/badge/contenido-CC%20BY--NC--SA%204.0-8a6d3b)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)
![PWA](https://img.shields.io/badge/PWA-offline-5a4fcf)
![Idiomas](https://img.shields.io/badge/idiomas-pt%20%7C%20en%20%7C%20es-555)

<br />

<img src="docs/screenshots/planner.webp" alt="Planificador diario de Scaffold con el anverso y el reverso de la hoja lado a lado" width="880" />

</div>

> [!WARNING]
> **Prototipo de concepto, proyecto en pausa.** La app es una prueba de concepto, no ha sido validada y no es para uso real. El desarrollo está en pausa y el proyecto quizá vuelva en el futuro con una versión mejor y más adecuada. El manual sigue disponible como material de referencia.

## Índice

- [Acerca de](#acerca-de)
- [La app](#la-app)
- [El manual](#el-manual)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Principios](#principios)
- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Ejecutar en local](#ejecutar-en-local)
- [Próximos pasos](#próximos-pasos)
- [Cómo contribuir](#cómo-contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Acerca de

*Scaffold* significa andamio en inglés: la estructura que sostiene la obra hasta que se mantiene en pie por sí sola. El proyecto cumple ese papel en la rutina de quienes viven con TDAH. No intenta cambiar a la persona. Organiza el entorno, el papel y la pantalla para que el día dependa menos de la memoria y de la fuerza de voluntad.

Son dos partes que se complementan:

| | Qué es | Dónde está |
|---|---|---|
| **Manual** | Explica el porqué y cómo pensar cada solución, con fuentes verificadas | [felipiadenildo.github.io/scaffold](https://felipiadenildo.github.io/scaffold/) |
| **App** | Pone las soluciones en uso, en el móvil, en el ordenador o impresas | [app.myscaffold.workers.dev](https://app.myscaffold.workers.dev) |

Las capturas muestran la app en portugués. La app también está disponible en español e inglés.

## La app

### Planificador diario

El centro de la app. Cada día es una hoja de papel con anverso y reverso.

- **Bloques por momento del día**, marcados por las comidas, con espacio para un título extra (una cita, un evento).
- **Estado de ánimo del día** en cinco niveles.
- **Habit tracker** y **"No puedo dejar de hacer"**, lo mínimo que sostiene un día difícil.
- **Sobre el día** y **Notas** para lo que vaya surgiendo.
- **Plantillas** listas (Ligero, Estándar y Detallado) o creadas por ti, sugeridas en los días de la semana que elijas.
- **Impresión** de hojas en blanco en A5 o A4 (dos planificadores por hoja), con opciones para ahorrar tinta.

<p align="center">
  <img src="docs/screenshots/virar-folha.gif" alt="La hoja del planificador girando del anverso al reverso" width="720" />
</p>

### También en la app

- **Funciona sin internet** y se puede instalar como app (PWA), en el móvil o en el ordenador.
- **Tus datos se quedan en tu dispositivo.** No hace falta cuenta. Puedes descargar una copia y llevarla a otro dispositivo.
- **Tres idiomas** (portugués, inglés y español) y **tema claro y oscuro**.
- Fuente [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/), diseñada para facilitar la lectura.

### En desarrollo

Lista de la compra, Dopamine Menu, Meal Prep y Tarjeta SOS ya se pueden usar en la app, pero el diseño y el contenido todavía van a cambiar. Finanzas (hoja de cálculo) y Viaje (checklists en Notion) están descritos en el manual.

## El manual

Doce capítulos sobre rutina y entorno, escritos en portugués, con plantillas y una guía de productos:

1. Fundamentos
2. Entornos físicos
3. Sistema analógico
4. Sistema digital
5. Protocolos de crisis emocional
6. Rutinas del día a día
7. Salud, cuerpo y ciclo
8. Planificación a medio y largo plazo
9. Relaciones y comunicación
10. Automatización y distracciones
11. El papel de quien acompaña
12. Cuándo buscar ayuda profesional

[Leer el manual](https://felipiadenildo.github.io/scaffold/)

> Scaffold es material de apoyo y no sustituye el acompañamiento profesional. Si estás en crisis, llama al número de emergencias o a una línea de ayuda de tu país.

## Capturas de pantalla

<table>
  <tr>
    <td width="22%" align="center" valign="middle">
      <img src="docs/screenshots/celular.webp" alt="Planificador en el móvil" width="160" /><br />
      <sub>En el móvil</sub>
    </td>
    <td width="39%" align="center" valign="middle">
      <img src="docs/screenshots/planner-escuro.webp" alt="Planificador en tema oscuro" width="360" /><br />
      <sub>Tema oscuro</sub>
    </td>
    <td width="39%" align="center" valign="middle">
      <img src="docs/screenshots/impressao.webp" alt="Ventana de impresión con vista previa" width="360" /><br />
      <sub>Impresión con vista previa</sub>
    </td>
  </tr>
</table>

## Principios

- **Menos fricción, más uso.** Cada pantalla pide las mínimas decisiones posibles. Lo que no ayuda en el día a día se queda fuera.
- **Papel y pantalla valen lo mismo.** Todo lo que existe en la app se puede imprimir.
- **Privacidad por defecto.** Sin cuenta, sin rastreo, sin servidor guardando lo que escribes.
- **Accesibilidad.** Fuente legible, contraste en los dos temas, navegación por teclado y lector de pantalla.
- **Basado en fuentes.** La app sigue el manual, y el manual cita de dónde sale cada idea.

## Tecnologías

| Parte | Tecnologías |
|---|---|
| App | React 19, TypeScript, Vite, Tailwind CSS 4, Motion, React Router |
| Sin conexión e instalación | vite-plugin-pwa (Workbox) |
| PDF | jsPDF y html2canvas-pro |
| Pruebas y calidad | Vitest, happy-dom, oxlint |
| Manual | Astro y Starlight |
| Alojamiento | Cloudflare Workers (app) y GitHub Pages (manual) |

## Estructura del repositorio

```
scaffold/
├── app/
│   ├── web/        código de la app (React + Vite)
│   └── print/      plantillas para imprimir
├── manual/         sitio del manual (Astro + Starlight)
└── docs/           imágenes usadas en este README
```

## Ejecutar en local

Necesitas [Node.js](https://nodejs.org/) 22 o más reciente.

```bash
git clone https://github.com/felipiadenildo/scaffold.git
cd scaffold/app/web
npm install
npm run dev        # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta las pruebas (Vitest) |
| `npm run lint` | Revisa el código (oxlint) |
| `npm run build` | Comprueba los tipos y genera la versión de producción en `dist/` |
| `npm run capturas` | Genera las imágenes de este README (con `npm run dev` en marcha) |

Para el manual:

```bash
cd scaffold/manual
npm install
npm run dev        # http://localhost:4321/scaffold
```

## Próximos pasos

- [ ] Mejoras en el móvil (ventanas en pantallas estrechas y deslizar para cambiar de día)
- [ ] Consejos en el primer uso, explicando cada parte de la hoja
- [ ] Planificador semanal y mensual
- [ ] Inicio de sesión opcional para sincronizar entre dispositivos
- [ ] PDF vectorial, con texto nítido y archivos más ligeros

## Cómo contribuir

Las sugerencias, experiencias de uso y correcciones son muy bienvenidas, sobre todo de quienes viven con TDAH o acompañan a alguien que vive con él.

- **¿Encontraste un problema o tienes una idea?** Abre un [issue](https://github.com/felipiadenildo/scaffold/issues).
- **¿Quieres trabajar en el código?** Haz un fork, crea una rama y abre un pull request explicando qué cambió y por qué. Antes de enviarlo, ejecuta `npm test`, `npm run lint` y `npm run build` en `app/web`.
- **¿Quieres corregir el manual?** Cada página del manual tiene un enlace "Editar página" que abre el archivo aquí en GitHub.

## Licencia

- **Código** (app y sitio del manual): [GNU Affero General Public License v3.0](LICENSE). Puedes usarlo, estudiarlo, modificarlo y redistribuirlo. Si publicas una versión modificada, incluso como servicio en internet, debes poner su código fuente a disposición bajo la misma licencia.
- **Contenido del manual** (textos, plantillas y guía de productos): [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Se puede compartir y adaptar con atribución, sin fines comerciales y bajo la misma licencia.

Copyright © 2026 Felipi Adenildo.

## Contacto

¿Tienes una sugerencia, una crítica o una historia sobre cómo Scaffold te ayudó (o no)? Todo comentario ayuda a mejorar el proyecto.

- **Formulario de contacto:** [felipiadenildo.github.io/scaffold/contato](https://felipiadenildo.github.io/scaffold/contato/)
- **Issues en GitHub:** [github.com/felipiadenildo/scaffold/issues](https://github.com/felipiadenildo/scaffold/issues)
- **GitHub:** [@felipiadenildo](https://github.com/felipiadenildo)
