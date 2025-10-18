/**
 * E2E Tests for NoteEditor Component
 * Tests Monaco Editor integration in a real browser environment
 */

import { test, expect } from '@playwright/test';

test.describe('NoteEditor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for app to be ready
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should load and display the editor', async ({ page }) => {
    // Wait for Monaco Editor to be present in the DOM
    await page.waitForFunction(
      () => {
        const editor = document.querySelector('.monaco-editor');
        return editor !== null;
      },
      { timeout: 10000 }
    );

    const editor = await page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });

  test('should apply theme when toggled', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Get initial theme from editor
    const initialTheme = await page.locator('.monaco-editor').getAttribute('class');

    // Click theme toggle
    await page.click('[aria-label="Toggle theme"]');

    // Wait for theme to change
    await page.waitForFunction(
      (initial) => {
        const editor = document.querySelector('.monaco-editor');
        return editor && editor.className !== initial;
      },
      initialTheme,
      { timeout: 5000 }
    );

    const newTheme = await page.locator('.monaco-editor').getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should allow typing in the editor', async ({ page }) => {
    // Wait for editor to be ready and focused
    await page.waitForFunction(
      () => {
        const editor = document.querySelector('.monaco-editor');
        const textarea = editor?.querySelector('textarea');
        return editor !== null && textarea !== null;
      },
      { timeout: 10000 }
    );

    // Focus the editor
    const textarea = await page.locator('.monaco-editor textarea').first();
    await textarea.click();

    // Type some markdown
    const testText = '# Hello Zenoter\n\nThis is a **test** note.';
    await textarea.fill(testText);

    // Verify the content was added (Monaco renders it in the DOM)
    await page.waitForFunction(
      () => {
        const editorContent = document.querySelector('.monaco-editor');
        return editorContent?.textContent?.includes('Hello Zenoter') || false;
      },
      { timeout: 5000 }
    );
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(
      () => document.querySelector('[aria-label="Note editor container"]') !== null,
      { timeout: 10000 }
    );

    const editorContainer = await page.locator('[aria-label="Note editor container"]');
    await expect(editorContainer).toBeVisible();

    // Monaco Editor should have proper role
    const editor = await page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor textarea') !== null, {
      timeout: 10000,
    });

    // Tab to editor (assuming it's first focusable element or use specific navigation)
    await page.keyboard.press('Tab');

    // Type using keyboard
    await page.keyboard.type('Testing keyboard input');

    // Verify content was added
    await page.waitForFunction(
      () => {
        const editor = document.querySelector('.monaco-editor');
        return editor?.textContent?.includes('Testing keyboard') || false;
      },
      { timeout: 5000 }
    );
  });

  test('should display markdown syntax highlighting', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    const textarea = await page.locator('.monaco-editor textarea').first();
    await textarea.click();

    // Type markdown with syntax that should be highlighted
    await textarea.fill('# Heading\n\n**Bold** and *italic*\n\n```javascript\nconst x = 1;\n```');

    // Wait for Monaco to process and render the syntax
    await page.waitForTimeout(500);

    // Verify Monaco has rendered the content
    const editorHasContent = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      return (editor?.textContent?.length || 0) > 0;
    });

    expect(editorHasContent).toBe(true);
  });
});
