# LineRef — VSCode Extension

## Project Overview

A VSCode extension that copies file path + line range references (e.g. `src/foo.ts:10-20`) to the clipboard from the current editor selection.

## Tech Stack

- TypeScript, VSCode Extension API
- Build: `npm run compile` (runs `tsc`)
- Lint: `npm run lint` (runs `eslint src`)
- Format: `npx prettier --write "src/**/*.ts"` (runs prettier)
- Test: `npm run test` (runs `vscode-test`)

## Project Structure

- `src/extension.ts` — Extension entry point. Registers the `lineref.copyLineRef` command.
- `package.json` — Extension manifest: commands, keybindings, menus.
- `src/test/` — Test files.
- `.prettierrc.json` — Prettier config (double quotes, semicolons, trailing commas, 80-char print width, LF line endings).

## Versioning

- Always use `npm version <options>` (e.g. `npm version 0.0.3` or `npm version major`) to bump the version.

## Release

- Not published to the VSCode Marketplace.
- Distributed via `.vsix` files attached to GitHub Releases and published to Open VSX Registry.
- Workflow: push a tag `v*` → GitHub Actions builds the `.vsix`, creates a GitHub release, and publishes to Open VSX.
- CI config: `.github/workflows/release.yml`
- Open VSX publish requires `OVSX_PAT` secret set in GitHub repo settings.

## Key Details

- Command ID: `lineref.copyLineRef`
- Keybinding: `Ctrl+Shift+L` / `Cmd+Shift+L`
- Output format: `relativePath:startLine` (single line) or `relativePath:startLine-endLine` (range)
- Line numbers are 1-based.
