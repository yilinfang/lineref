import * as vscode from "vscode";

async function copyLineRefInternal(
  editor: vscode.TextEditor,
  useAbsolutePath: boolean,
  includeCode: boolean = false,
): Promise<void> {
  let filePath: string;
  if (useAbsolutePath) {
    filePath = editor.document.uri.fsPath;
  } else {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(
      editor.document.uri,
    );
    filePath = workspaceFolder
      ? vscode.workspace.asRelativePath(editor.document.uri, false)
      : editor.document.fileName;
  }

  const startLine = editor.selection.start.line + 1;
  const endLine =
    !editor.selection.isEmpty && editor.selection.end.character === 0
      ? editor.selection.end.line
      : editor.selection.end.line + 1;

  const lineRef =
    startLine === endLine
      ? `${filePath}:${startLine}`
      : `${filePath}:${startLine}-${endLine}`;

  let output = lineRef;
  if (includeCode) {
    const selectedText = editor.document.getText(editor.selection);
    const lang = editor.document.languageId;
    output = `${lineRef}\n\`\`\`${lang}\n${selectedText}\n\`\`\``;
  }

  try {
    await vscode.env.clipboard.writeText(output);
    vscode.window.setStatusBarMessage(`Copied: ${lineRef}`, 3000);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to copy: ${err}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "lineref.copyLineRef",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }

      await copyLineRefInternal(editor, false);
    },
  );

  const disposableGlobal = vscode.commands.registerCommand(
    "lineref.copyGlobalLineRef",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }

      await copyLineRefInternal(editor, true);
    },
  );

  const disposableWithCode = vscode.commands.registerCommand(
    "lineref.copyLineRefWithCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }

      await copyLineRefInternal(editor, false, true);
    },
  );

  const disposableGlobalWithCode = vscode.commands.registerCommand(
    "lineref.copyGlobalLineRefWithCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }

      await copyLineRefInternal(editor, true, true);
    },
  );

  context.subscriptions.push(
    disposable,
    disposableGlobal,
    disposableWithCode,
    disposableGlobalWithCode,
  );
}

export function deactivate() {}
