# Changelog

All notable changes to the "LineRef" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
