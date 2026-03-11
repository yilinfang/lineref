# LineRef

Quickly copy file path and line range references from the current selection. Perfect for pasting into coding agents (Claude Code, Codex, etc.), code reviews, or documentation.

## Features

- Select code in the editor and copy a reference like `src/utils/helper.ts:10-20` to the clipboard
- Single line selection produces `file:10`, multi-line produces `file:10-20`
- Paths are relative to the workspace root

## Usage

1. Select one or more lines in the editor
2. Use one of the following:
   - **Command Palette**: `LineRef: Copy Line Reference`
   - **Command Palette**: `LineRef: Copy Global Line Reference`
   - **Right-click** context menu: "Copy Line Reference" or "Copy Global Line Reference"
3. Paste the reference wherever you need it

## Installation

### Option 1: Open VSX Registry (Recommended for Antigravity, Windsurf, etc.)

Search for "LineRef" in your editor's extensions marketplace, or visit the [Open VSX Registry](https://open-vsx.org/extension/yilinfang/lineref)

### Option 2: Manual Installation (VSCode and Others)

1. Go to the [Releases](https://github.com/yilinfang/lineref/releases) page or [Open VSX Registry](https://open-vsx.org/extension/yilinfang/lineref)
2. Download the latest `.vsix` file
3. Install:
   - **VSCode**: Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`), run **Extensions: Install from VSIX...**, and select the downloaded `.vsix` file
   - **Other editors**: Follow your editor's instructions for installing VSIX files

## Extension Settings

This extension has no configurable settings.

## Keybindings

This extension does not set default keybindings to avoid conflicts with existing shortcuts.

You can assign your own keys in `keybindings.json`, for example:

```json
[
  {
    "key": "ctrl+alt+l",
    "command": "lineref.copyLineRef",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+g",
    "command": "lineref.copyGlobalLineRef",
    "when": "editorTextFocus"
  }
]
```
