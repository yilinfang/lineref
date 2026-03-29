import * as vscode from "vscode";

// =============================================================================
// Test Data Constants
// =============================================================================

export const TestData = {
  /** Sample content with 20 lines numbered "line 1" through "line 20" */
  sampleContent: Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
    "\n",
  ),

  /** Creates a relative path reference string for a given line number */
  relativeLineRef: (relativePath: string, line: number): string =>
    `${relativePath}:${line}`,

  /** Creates a relative path reference string for a line range */
  relativeLineRangeRef: (
    relativePath: string,
    startLine: number,
    endLine: number,
  ): string => `${relativePath}:${startLine}-${endLine}`,

  /** Creates an absolute path reference string for a given line number */
  absoluteLineRef: (fsPath: string, line: number): string =>
    `${fsPath}:${line}`,

  /** Creates an absolute path reference string for a line range */
  absoluteLineRangeRef: (
    fsPath: string,
    startLine: number,
    endLine: number,
  ): string => `${fsPath}:${startLine}-${endLine}`,
};

// =============================================================================
// Selection Patterns
// =============================================================================

export const Selections = {
  /** Single line selection at the beginning of a line (0-indexed) */
  singleLine: (line: number): vscode.Selection =>
    new vscode.Selection(line, 0, line, 0),

  /**
   * Multi-line selection spanning from start to end (0-indexed).
   * Note: Extension treats end position at character 0 as exclusive,
   * so multiLine(2, 6) effectively selects lines 3-6 (1-indexed).
   */
  multiLine: (start: number, end: number): vscode.Selection =>
    new vscode.Selection(start, 0, end, 0),

  /** Selection ending mid-line (at endChar position) */
  midLineEnd: (
    startLine: number,
    endLine: number,
    endChar: number,
  ): vscode.Selection => new vscode.Selection(startLine, 0, endLine, endChar),
};

// =============================================================================
// Document Helpers
// =============================================================================

/** Tracks all documents opened during tests for cleanup */
const trackedDocuments: vscode.TextDocument[] = [];

/**
 * Creates a test document with optional content and language.
 * The document is automatically tracked for cleanup.
 */
export async function createTestDocument(
  content: string = TestData.sampleContent,
  language: string = "plaintext",
): Promise<{ document: vscode.TextDocument; editor: vscode.TextEditor }> {
  const document = await vscode.workspace.openTextDocument({
    content,
    language,
  });
  trackedDocuments.push(document);
  const editor = await vscode.window.showTextDocument(document);
  return { document, editor };
}

/**
 * Cleans up all tracked documents and closes active editors.
 */
export async function cleanupDocuments(): Promise<void> {
  // Close all editors in the workspace to properly clean up documents
  try {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  } catch {
    // Ignore cleanup errors - editor may already be closed
  }

  // Clear the tracked documents list
  trackedDocuments.length = 0;
}

// =============================================================================
// Clipboard Helpers
// =============================================================================

let clipboardBackup: string = "";

/**
 * Backs up the current clipboard content.
 */
export async function backupClipboard(): Promise<void> {
  clipboardBackup = await vscode.env.clipboard.readText();
}

/**
 * Restores the clipboard to the backed-up content.
 */
export async function restoreClipboard(): Promise<void> {
  await vscode.env.clipboard.writeText(clipboardBackup);
}

/**
 * Reads the current clipboard content.
 */
export async function readClipboard(): Promise<string> {
  return vscode.env.clipboard.readText();
}

/**
 * Clears the clipboard to a known empty state.
 */
export async function clearClipboard(): Promise<void> {
  await vscode.env.clipboard.writeText("");
}

// =============================================================================
// Assertion Helpers
// =============================================================================

/**
 * Asserts that the clipboard contains the expected string.
 * Provides a descriptive error message on failure.
 */
export async function assertClipboardContains(expected: string): Promise<void> {
  const actual = await vscode.env.clipboard.readText();
  if (actual !== expected) {
    throw new Error(
      `Clipboard assertion failed:\nExpected: "${expected}"\nActual: "${actual}"`,
    );
  }
}
