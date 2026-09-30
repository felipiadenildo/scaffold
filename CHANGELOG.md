# Changelog

All notable changes to the Scaffold app are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/). Changes to the manual content are listed on the
manual's own [changelog page](https://felipiadenildo.github.io/scaffold/changelog/).

## [Unreleased]

### Changed

- Swiping sideways to change the day now works over the text too (unless a field is being
  edited), and the sheet follows the finger like a carousel. A tip explains the gesture on first
  use on touch devices.

### Fixed

- The print preview no longer overflows narrow phone screens (360px).

## [0.1.0] - 2026-09-30

First public release of the app.

### Added

- Daily planner where each day is a sheet with a front and a back: blocks for each part of the day,
  mood, habit tracker, "don't skip" list, about the day and notes.
- Templates: Light, Default and Detailed, plus templates of your own, suggested by weekday. A day's
  layout can also be changed on its own.
- Printing of blank sheets in A5 or A4 (two planners per page) with a preview and ink saving options.
- Installable app (PWA) that works offline from the first visit and warns when a new version is
  available.
- Data stored on the device, with backup download and import (merge or replace).
- Portuguese, English and Spanish, with a language selector.
- Light and dark themes without a flash on load.
- Mobile layout for the planner and an error screen that keeps data safe.
- Catalog with tools in development: Shopping List, Dopamine Menu, Meal Prep and SOS Card.
- Source code released under the GNU AGPL v3.0, with a link to it in the app footer.

[Unreleased]: https://github.com/felipiadenildo/scaffold/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/felipiadenildo/scaffold/releases/tag/v0.1.0
