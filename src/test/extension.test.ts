import * as assert from "assert";
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
    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    assert.strictEqual(clipboard, `${relativePath}:5`);
  });

  test("copyLineRef: multi-line selection", async () => {
    editor.selection = new vscode.Selection(4, 0, 9, 0);

    await vscode.commands.executeCommand("lineref.copyLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    assert.strictEqual(clipboard, `${relativePath}:5-9`);
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
    assert.strictEqual(clipboard, `${document.uri.fsPath}:3-7`);
  });

  test("copyLineRef: includes end line when selection ends mid-line", async () => {
    editor.selection = new vscode.Selection(4, 0, 9, 3);

    await vscode.commands.executeCommand("lineref.copyLineRef");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    assert.strictEqual(clipboard, `${relativePath}:5-10`);
  });

  test("copyLineRefWithCode: single line selection", async () => {
    editor.selection = new vscode.Selection(4, 0, 4, 6);

    await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    const selectedText = document.getText(editor.selection);
    assert.strictEqual(
      clipboard,
      `${relativePath}:5\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
    );
  });

  test("copyLineRefWithCode: multi-line selection", async () => {
    editor.selection = new vscode.Selection(4, 0, 9, 0);

    await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

    const clipboard = await vscode.env.clipboard.readText();
    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    const selectedText = document.getText(editor.selection);
    assert.strictEqual(
      clipboard,
      `${relativePath}:5-9\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
    );
  });

  test("copyGlobalLineRefWithCode: multi-line selection", async () => {
    editor.selection = new vscode.Selection(2, 0, 7, 0);

    await vscode.commands.executeCommand("lineref.copyGlobalLineRefWithCode");

    const clipboard = await vscode.env.clipboard.readText();
    const selectedText = document.getText(editor.selection);
    assert.strictEqual(
      clipboard,
      `${document.uri.fsPath}:3-7\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
    );
  });
});
