# Changelog

All notable changes to the "LineRef" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.4.1] - 2026-03-26

### Changed

- Release: bump patch version (no functional changes)

## [0.4.0] - 2026-03-26

### Added

- `LineRef: Copy Line Reference with Code` command to copy relative path reference followed by a fenced markdown code block of the selected text
- `LineRef: Copy Global Line Reference with Code` command to copy absolute path reference followed by a fenced markdown code block of the selected text

## [0.3.1] - 2026-03-24

### Changed

- Update clipboard notification to use status bar message

## [0.3.0] - 2026-03-23

### Added

- Make LineRef a UI plugin

## [0.2.2] - 2026-03-23

### Changed

- Add `extensionKind` configuration for UI-only extension classification

## [0.2.1] - 2026-03-23

### Changed

- Update README documentation

## [0.2.0] - 2026-03-18

### Fixed

- Handle end-of-line-exclusive selections correctly

## [0.1.4] - 2026-03-15

### Changed

- Refactor: extract `copyLineRefInternal` function to reduce code duplication

## [0.1.3] - 2026-03-11

### Fixed

- Fix README.md markdown formatting for consistency in link syntax

## [0.1.2] - 2026-03-11

### Changed

- Reorganize context menu group from "navigation" to "8_lineref" for better menu organization

## [0.1.1] - 2026-03-09

### Added

- Add real tests for `copyLineRef` and `copyGlobalLineRef` commands (single line and multi-line selections)

## [0.1.0] - 2026-03-09

### Added

- `LineRef: Copy Global Line Reference` command to copy `absolutePath:line` or `absolutePath:startLine-endLine` to clipboard

### Removed

- Remove default keybindings to avoid conflicts with existing shortcuts

## [0.0.5] - 2026-03-08

### Changed

- Lower minimum VS Code version requirement from 1.109 to 1.70 for broader compatibility (Cursor, Windsurf, etc.)

## [0.0.4] - 2026-03-08

### Changed

- CI: auto-publish to Open VSX Registry on release

## [0.0.3] - 2026-03-04

- Format with prettier

## [0.0.2] - 2026-03-04

### Changed

- Updated `publisher` and `repository` fields in `package.json`

## [0.0.1] - 2026-03-04

### Added

- `LineRef: Copy Line Reference` command to copy `file:line` or `file:startLine-endLine` to clipboard
- Keyboard shortcut: `Ctrl+Shift+L` (Mac: `Cmd+Shift+L`)
- Editor right-click context menu entry
