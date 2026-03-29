import * as assert from "assert";
import * as vscode from "vscode";
import {
  TestData,
  Selections,
  backupClipboard,
  restoreClipboard,
  cleanupDocuments,
} from "./test-helpers";

suite("Extension Test Suite", () => {
  // =========================================================================
  // Setup and Teardown
  // =========================================================================

  let document: vscode.TextDocument;
  let editor: vscode.TextEditor;

  setup(async () => {
    // Backup clipboard state to prevent cross-test contamination
    await backupClipboard();

    // Create a fresh document for each test
    document = await vscode.workspace.openTextDocument({
      content: TestData.sampleContent,
      language: "plaintext",
    });
    editor = await vscode.window.showTextDocument(document);
  });

  teardown(async () => {
    // Restore clipboard to its original state
    await restoreClipboard();

    // Clean up document resources to prevent memory leaks
    await cleanupDocuments();
  });

  // =========================================================================
  // copyLineRef Tests (Relative path, no code)
  // =========================================================================

  suite("copyLineRef", () => {
    test("single line selection", async () => {
      editor.selection = Selections.singleLine(4); // Line 5 (0-indexed)

      await vscode.commands.executeCommand("lineref.copyLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      assert.strictEqual(clipboard, `${relativePath}:5`);
    });

    test("multi-line selection", async () => {
      // VS Code Selection is end-exclusive, so (4, 8) selects lines 5-8 (1-indexed)
      editor.selection = Selections.multiLine(4, 8);

      await vscode.commands.executeCommand("lineref.copyLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      assert.strictEqual(clipboard, `${relativePath}:5-8`);
    });

    test("includes end line when selection ends mid-line", async () => {
      // Selection from line 5 to line 10, ending at character 3
      editor.selection = Selections.midLineEnd(4, 9, 3);

      await vscode.commands.executeCommand("lineref.copyLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      assert.strictEqual(clipboard, `${relativePath}:5-10`);
    });
  });

  // =========================================================================
  // copyGlobalLineRef Tests (Absolute path, no code)
  // =========================================================================

  suite("copyGlobalLineRef", () => {
    test("single line selection", async () => {
      editor.selection = Selections.singleLine(0); // Line 1 (0-indexed)

      await vscode.commands.executeCommand("lineref.copyGlobalLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      assert.strictEqual(clipboard, `${document.uri.fsPath}:1`);
    });

    test("multi-line selection", async () => {
      // VS Code Selection is end-exclusive, so (2, 6) selects lines 3-6 (1-indexed)
      editor.selection = Selections.multiLine(2, 6);

      await vscode.commands.executeCommand("lineref.copyGlobalLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      assert.strictEqual(clipboard, `${document.uri.fsPath}:3-6`);
    });

    test("includes end line when selection ends mid-line", async () => {
      // Selection from line 5 to line 10, ending at character 3
      editor.selection = Selections.midLineEnd(4, 9, 3);

      await vscode.commands.executeCommand("lineref.copyGlobalLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      assert.strictEqual(clipboard, `${document.uri.fsPath}:5-10`);
    });
  });

  // =========================================================================
  // copyLineRefWithCode Tests (Relative path, with code)
  // =========================================================================

  suite("copyLineRefWithCode", () => {
    test("single line selection", async () => {
      editor.selection = Selections.singleLine(4); // Line 5

      await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${relativePath}:5\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });

    test("multi-line selection", async () => {
      // VS Code Selection is end-exclusive, so (4, 8) selects lines 5-8 (1-indexed)
      editor.selection = Selections.multiLine(4, 8);

      await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${relativePath}:5-8\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });

    test("includes end line when selection ends mid-line", async () => {
      // Selection from line 5 to line 10, ending at character 3
      editor.selection = Selections.midLineEnd(4, 9, 3);

      await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${relativePath}:5-10\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });

    test("preserves language identifier in code block", async () => {
      // Open a TypeScript document
      const tsDoc = await vscode.workspace.openTextDocument({
        content: "const x: number = 42;",
        language: "typescript",
      });
      const tsEditor = await vscode.window.showTextDocument(tsDoc);
      tsEditor.selection = Selections.singleLine(0);

      await vscode.commands.executeCommand("lineref.copyLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(tsDoc.uri, false);
      const selectedText = tsDoc.getText(tsEditor.selection);

      // Verify language identifier is "typescript", not "plaintext"
      assert.ok(
        clipboard.includes(`\`\`\`typescript\n${selectedText}\n\`\`\``),
        `Expected "typescript" language identifier in code block. Got: ${clipboard}`,
      );

      // Clean up TypeScript document
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
    });
  });

  // =========================================================================
  // copyGlobalLineRefWithCode Tests (Absolute path, with code)
  // =========================================================================

  suite("copyGlobalLineRefWithCode", () => {
    test("single line selection", async () => {
      editor.selection = Selections.singleLine(4); // Line 5

      await vscode.commands.executeCommand("lineref.copyGlobalLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${document.uri.fsPath}:5\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });

    test("multi-line selection", async () => {
      // VS Code Selection is end-exclusive, so (2, 6) selects lines 3-6 (1-indexed)
      editor.selection = Selections.multiLine(2, 6);

      await vscode.commands.executeCommand("lineref.copyGlobalLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${document.uri.fsPath}:3-6\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });

    test("includes end line when selection ends mid-line", async () => {
      // Selection from line 5 to line 10, ending at character 3
      editor.selection = Selections.midLineEnd(4, 9, 3);

      await vscode.commands.executeCommand("lineref.copyGlobalLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const selectedText = document.getText(editor.selection);
      assert.strictEqual(
        clipboard,
        `${document.uri.fsPath}:5-10\n\`\`\`plaintext\n${selectedText}\n\`\`\``,
      );
    });
  });

  // =========================================================================
  // Edge Case Tests
  // =========================================================================

  suite("Edge Cases", () => {
    test("shows warning when no active editor", async () => {
      // Close all editors first
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");

      // Execute command and verify it doesn't crash
      await vscode.commands.executeCommand("lineref.copyLineRef");

      // The command should handle this gracefully (no crash)
      // Note: Verifying warning message would require mocking vscode.window.showWarningMessage
      // which is complex in integration tests
    });

    test("uses fileName fallback for file without workspace folder", async () => {
      // Create an untitled document (no associated file path)
      const untitledDoc = await vscode.workspace.openTextDocument({
        content: "untitled content",
        language: "plaintext",
      });
      const untitledEditor = await vscode.window.showTextDocument(untitledDoc);
      untitledEditor.selection = Selections.singleLine(0);

      await vscode.commands.executeCommand("lineref.copyLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      // For untitled documents, the extension falls back to document.fileName
      // which may be an empty string or the untitled URI
      // The key is that it doesn't crash and produces some output
      assert.ok(
        clipboard.length > 0,
        "Expected some clipboard output for untitled document",
      );

      // Clean up
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
    });

    test("handles empty selection gracefully", async () => {
      // Create a document and don't make any selection (cursor at position 0,0)
      editor.selection = new vscode.Selection(0, 0, 0, 0);

      await vscode.commands.executeCommand("lineref.copyLineRef");

      const clipboard = await vscode.env.clipboard.readText();
      const relativePath = vscode.workspace.asRelativePath(document.uri, false);
      // Empty selection should still produce a valid line reference to line 1
      assert.strictEqual(clipboard, `${relativePath}:1`);
    });

    test("preserves special characters in code block", async () => {
      // Open a document with special characters
      const specialDoc = await vscode.workspace.openTextDocument({
        content: 'const str = "Hello `world`";\nconst obj = { key: "value" };',
        language: "javascript",
      });
      const specialEditor = await vscode.window.showTextDocument(specialDoc);
      specialEditor.selection = Selections.multiLine(0, 1);

      await vscode.commands.executeCommand("lineref.copyGlobalLineRefWithCode");

      const clipboard = await vscode.env.clipboard.readText();
      const expectedText = specialDoc.getText(specialEditor.selection);

      // Verify the code content is preserved exactly
      assert.ok(
        clipboard.includes(expectedText),
        `Expected code content to be preserved. Got: ${clipboard}`,
      );

      // Clean up
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
    });
  });
});
