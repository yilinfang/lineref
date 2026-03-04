# LineRef

Quickly copy file path and line range references from the current selection. Perfect for pasting into coding agents (Claude Code, Codex, etc.), code reviews, or documentation.

## Features

- Select code in the editor and copy a reference like `src/utils/helper.ts:10-20` to the clipboard
- Single line selection produces `file:10`, multi-line produces `file:10-20`
- Paths are relative to the workspace root

## Usage

1. Select one or more lines in the editor
2. Use one of the following:
   - **Keyboard shortcut**: `Ctrl+Shift+L` (Mac: `Cmd+Shift+L`)
   - **Command Palette**: `LineRef: Copy Line Reference`
   - **Right-click** context menu: "Copy Line Reference"
3. Paste the reference wherever you need it

## Installation

1. Go to the [Releases](https://github.com/yilinfang/lineref/releases) page
2. Download the latest `.vsix` file
3. Install in VSCode:
   - Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Run **Extensions: Install from VSIX...**
   - Select the downloaded `.vsix` file

## Extension Settings

This extension has no configurable settings.

## Keybindings

| Command             | Windows / Linux | Mac           |
| ------------------- | --------------- | ------------- |
| Copy Line Reference | `Ctrl+Shift+L`  | `Cmd+Shift+L` |

## Release Notes

### 0.0.1

Initial release — copy line references from the editor.
