# LineRef — VSCode Extension

## Project Overview

A VSCode extension that copies file path + line range references (e.g. `src/foo.ts:10-20`) to the clipboard from the current editor selection.

## Tech Stack

- TypeScript, VSCode Extension API
- Build: `npm run compile` (runs `tsc`)
- Lint: `npm run lint` (runs `eslint src`)
- Test: `npm run test` (runs `vscode-test`)

## Project Structure

- `src/extension.ts` — Extension entry point. Registers the `lineref.copyLineRef` command.
- `package.json` — Extension manifest: commands, keybindings, menus.
- `src/test/` — Test files.

## Release

- Not published to the VSCode Marketplace.
- Distributed via `.vsix` files attached to GitHub Releases.
- Workflow: push a tag `v*` → GitHub Actions builds the `.vsix` and creates a release.
- CI config: `.github/workflows/release.yml`

## Key Details

- Command ID: `lineref.copyLineRef`
- Keybinding: `Ctrl+Shift+L` / `Cmd+Shift+L`
- Output format: `relativePath:startLine` (single line) or `relativePath:startLine-endLine` (range)
- Line numbers are 1-based.
