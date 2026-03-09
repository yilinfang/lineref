import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "lineref.copyLineRef",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        editor.document.uri,
      );
      const relativePath = workspaceFolder
        ? vscode.workspace.asRelativePath(editor.document.uri, false)
        : editor.document.fileName;

      const startLine = editor.selection.start.line + 1;
      const endLine = editor.selection.end.line + 1;

      const lineRef =
        startLine === endLine
          ? `${relativePath}:${startLine}`
          : `${relativePath}:${startLine}-${endLine}`;

      await vscode.env.clipboard.writeText(lineRef);
      vscode.window.showInformationMessage(`Copied: ${lineRef}`);
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

      const filePath = editor.document.uri.fsPath;
      const startLine = editor.selection.start.line + 1;
      const endLine = editor.selection.end.line + 1;

      const lineRef =
        startLine === endLine
          ? `${filePath}:${startLine}`
          : `${filePath}:${startLine}-${endLine}`;

      await vscode.env.clipboard.writeText(lineRef);
      vscode.window.showInformationMessage(`Copied: ${lineRef}`);
    },
  );

  context.subscriptions.push(disposable, disposableGlobal);
}

export function deactivate() {}
