# LineRef — VSCode Extension

## Project Overview

A VSCode extension that copies file path + line range references (e.g. `src/foo.ts:10-20` or `/abs/path/src/foo.ts:10-20`) to the clipboard from the current editor selection.

## Tech Stack

- TypeScript, VSCode Extension API
- Build: `npm run compile` (runs `tsc`)
- Lint: `npm run lint` (runs `eslint src`)
- Format: `npx prettier --write "src/**/*.ts"` (runs prettier)
- Test: `npm run test` (runs `vscode-test`)

## Project Structure

- `src/extension.ts` — Extension entry point. Registers `lineref.copyLineRef` and `lineref.copyGlobalLineRef`.
- `package.json` — Extension manifest: commands and menus (no default keybindings).
- `src/test/extension.test.ts` — Tests for `copyLineRef` and `copyGlobalLineRef` (single line and multi-line selections).
- `.prettierrc.json` — Prettier config (double quotes, semicolons, trailing commas, 80-char print width, LF line endings).

## Versioning

- Before bumping: update CHANGELOG.md and any relevant docs, then commit those changes first.
- Then use `npm version <version>` (e.g. `npm version 0.0.4` or `npm version patch`) to bump — this creates a version commit and git tag automatically.

## Release

- Not published to the VSCode Marketplace.
- Distributed via `.vsix` files attached to GitHub Releases and published to Open VSX Registry.
- Workflow: push a tag `v*` → GitHub Actions builds the `.vsix`, creates a GitHub release, and publishes to Open VSX.
- CI config: `.github/workflows/release.yml`
- Open VSX publish requires `OVSX_PAT` secret set in GitHub repo settings.

## Key Details

- Command IDs: `lineref.copyLineRef`, `lineref.copyGlobalLineRef`
- Keybinding: no default keybindings (users can assign their own in `keybindings.json`)
- Output format:
  - `lineref.copyLineRef`: `relativePath:startLine` (single line) or `relativePath:startLine-endLine` (range)
  - `lineref.copyGlobalLineRef`: `absolutePath:startLine` (single line) or `absolutePath:startLine-endLine` (range)
- Line numbers are 1-based.
