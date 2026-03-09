import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  let document: vscode.TextDocument;
  let editor: vscode.TextEditor;

  const sampleContent = Array.from(
    { length: 20 },
    (_, i) => `line ${i + 1}`,
  ).join("\n");

  setup(async () => {
    document = await vscode.workspace.openTextDocument({
      content: sampleContent,
      language: "plaintext",
    });
    editor = await vscode.window.showTextDocument(document);
  });

  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  });

  test("copyLineRef: single line selection", async () => {
    editor.selection = new vscode.Selection(4, 0, 4, 0);

    await vscode.commands.executeCommand("lineref.copyLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(
      document.uri,
      false,
    );
    assert.strictEqual(clipboard, `${relativePath}:5`);
  });

  test("copyLineRef: multi-line selection", async () => {
    editor.selection = new vscode.Selection(4, 0, 9, 0);

    await vscode.commands.executeCommand("lineref.copyLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(
      document.uri,
      false,
    );
    assert.strictEqual(clipboard, `${relativePath}:5-10`);
  });

  test("copyGlobalLineRef: single line selection", async () => {
    editor.selection = new vscode.Selection(0, 0, 0, 0);

    await vscode.commands.executeCommand("lineref.copyGlobalLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboard, `${document.uri.fsPath}:1`);
  });

  test("copyGlobalLineRef: multi-line selection", async () => {
    editor.selection = new vscode.Selection(2, 0, 7, 0);

    await vscode.commands.executeCommand("lineref.copyGlobalLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboard, `${document.uri.fsPath}:3-8`);
  });
});
