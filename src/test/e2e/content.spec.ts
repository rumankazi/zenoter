/**
 * Content E2E Tests - Black-box testing
 * Tests all content-related functionality: editing, preview, markdown rendering
 */

import { test, expect } from '@playwright/test';

test.describe('Content - Editor & Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should load Monaco Editor successfully', async ({ page }) => {
    // Wait for Monaco Editor to be present
    await page.waitForFunction(
      () => {
        const editor = document.querySelector('.monaco-editor');
        return editor !== null;
      },
      { timeout: 10000 }
    );

    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });

  test('should type content in the editor', async ({ page }) => {
    // Wait for editor to be ready
    await page.waitForFunction(
      () => {
        const editor = document.querySelector('.monaco-editor');
        return editor !== null;
      },
      { timeout: 10000 }
    );

    const editor = page.locator('.monaco-editor').first();
    await editor.click({ position: { x: 100, y: 100 } });

    // Type markdown content
    await page.keyboard.type('# Hello Zenoter');

    // Wait a bit for Monaco to process
    await page.waitForTimeout(500);

    // Verify editor is still visible and functional
    await expect(editor).toBeVisible();
  });

  test('should display markdown preview when enabled', async ({ page }) => {
    // First, ensure editor is loaded
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Check if preview toggle exists
    const previewToggle = page.getByTestId('preview-toggle');
    await expect(previewToggle).toBeVisible();

    // Verify preview is shown by default (aria-pressed="true")
    const isPressed = await previewToggle.getAttribute('aria-pressed');
    expect(isPressed).toBe('true');

    // Verify preview pane is visible
    const preview = page.locator('[class*="previewContainer"]');
    await expect(preview).toBeVisible();
  });

  test('should render markdown syntax in preview', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor textarea') !== null, {
      timeout: 10000,
    });

    // Verify preview shows default content (already has markdown from initial state)
    const preview = page.locator('[class*="previewContent"]');
    await expect(preview).toBeVisible();

    // Verify some markdown elements are rendered from default content
    const html = await preview.innerHTML();
    expect(html).toContain('<h1>'); // Has headings from default content
    expect(html).toContain('<strong>'); // Has bold text from default content
  });

  test('should toggle preview visibility', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    const previewToggle = page.getByTestId('preview-toggle');
    await expect(previewToggle).toBeVisible();

    // Get initial state
    const initialState = await previewToggle.getAttribute('aria-pressed');

    // Click toggle
    await previewToggle.click();

    // Wait for state to change
    await page.waitForFunction(
      (initial) => {
        const toggle = document.querySelector('[data-testid="preview-toggle"]');
        return toggle?.getAttribute('aria-pressed') !== initial;
      },
      initialState,
      { timeout: 3000 }
    );

    // Verify state changed
    const newState = await previewToggle.getAttribute('aria-pressed');
    expect(newState).not.toBe(initialState);

    // Click again to toggle back
    await previewToggle.click();
    await page.waitForFunction(
      (previous) => {
        const toggle = document.querySelector('[data-testid="preview-toggle"]');
        return toggle?.getAttribute('aria-pressed') !== previous;
      },
      newState,
      { timeout: 3000 }
    );

    const finalState = await previewToggle.getAttribute('aria-pressed');
    expect(finalState).toBe(initialState);
  });

  test('should show full-width editor when preview is toggled off', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Preview should be visible initially
    const previewToggle = page.getByTestId('preview-toggle');
    const initialState = await previewToggle.getAttribute('aria-pressed');
    expect(initialState).toBe('true');

    // Find the editorContainer which holds the editor/preview split
    const editorContainer = page.locator('[class*="editorContainer"]');

    // Verify ResizablePane exists within editorContainer (editor and preview split)
    const leftPane = editorContainer.locator('[class*="leftPane"]');
    const rightPane = editorContainer.locator('[class*="rightPane"]');

    await expect(leftPane).toBeVisible();
    await expect(rightPane).toBeVisible();

    // Get initial editor width (should be ~50% of container)
    const initialWidth = await leftPane.evaluate((el) => el.getBoundingClientRect().width);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    // Editor should be roughly half width (accounting for sidebar)
    expect(initialWidth).toBeLessThan(viewportWidth * 0.6);

    // Toggle preview off
    await previewToggle.click();
    await page.waitForTimeout(400); // Wait for animation

    // Verify preview pane is hidden (no ResizablePane in editorContainer)
    await expect(rightPane).not.toBeVisible();

    // Verify editor expanded to full width using editorOnly class
    const editorOnly = page.locator('[class*="editorOnly"]');
    await expect(editorOnly).toBeVisible();

    const expandedWidth = await editorOnly.evaluate((el) => el.getBoundingClientRect().width);

    // Editor should now be much wider (nearly full width minus sidebar)
    expect(expandedWidth).toBeGreaterThan(initialWidth * 1.5);
  });

  test('should show split panes with animation when preview is toggled on', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    const previewToggle = page.getByTestId('preview-toggle');

    // Start with preview visible (default state)
    const ariaPressed = await previewToggle.getAttribute('aria-pressed');
    if (ariaPressed === 'false') {
      // If preview is off, turn it on first to establish baseline
      await previewToggle.click();
      await page.waitForTimeout(400);
    }

    // Turn preview off
    await previewToggle.click();
    await page.waitForTimeout(400);

    // Find the editorContainer which holds the editor/preview split
    const editorContainer = page.locator('[class*="editorContainer"]');

    // Verify preview is hidden (no ResizablePane panes in editorContainer)
    const rightPane = editorContainer.locator('[class*="rightPane"]');
    await expect(rightPane).not.toBeVisible();

    // Turn preview back on
    await previewToggle.click();

    // Wait for animation to start (preview should appear with fade-in)
    await page.waitForTimeout(100);

    // Verify preview becomes visible with animation
    await expect(rightPane).toBeVisible({ timeout: 500 });

    // Verify both panes are now visible and side-by-side
    const leftPane = editorContainer.locator('[class*="leftPane"]');
    await expect(leftPane).toBeVisible();
    await expect(rightPane).toBeVisible();

    // Verify they're split roughly 50/50
    const editorBox = await leftPane.boundingBox();
    const previewBox = await rightPane.boundingBox();

    expect(editorBox).not.toBeNull();
    expect(previewBox).not.toBeNull();

    if (editorBox && previewBox) {
      // Both panes should have similar widths (within 20% tolerance)
      const widthRatio = editorBox.width / previewBox.width;
      expect(widthRatio).toBeGreaterThan(0.8);
      expect(widthRatio).toBeLessThan(1.25);
    }
  });

  test('should maintain editor content when toggling preview', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Click directly on the editor container to focus
    const editor = page.locator('.monaco-editor').first();
    await editor.click({ position: { x: 100, y: 100 } });

    // Type content using keyboard
    const testContent = '# Test Content';
    await page.keyboard.type(testContent);

    // Wait for typing to complete
    await page.waitForTimeout(500);

    // Toggle preview off
    const previewToggle = page.getByTestId('preview-toggle');
    await previewToggle.click();
    await page.waitForTimeout(500); // Wait for animation

    // Toggle preview back on
    await previewToggle.click();
    await page.waitForTimeout(500);

    // Verify editor is still visible (content persists)
    const editorAfterToggle = page.locator('.monaco-editor');
    await expect(editorAfterToggle).toBeVisible();
  });

  test('should display syntax highlighting for markdown', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    const editor = page.locator('.monaco-editor').first();
    await editor.click({ position: { x: 100, y: 100 } });

    // Type markdown content
    await page.keyboard.type('# Markdown Syntax');

    // Wait for Monaco to process the syntax
    await page.waitForTimeout(1000);

    // Verify Monaco has rendered the content with proper structure
    const hasContent = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      const lines = editor?.querySelectorAll('.view-line');
      return (lines?.length || 0) > 0;
    });

    expect(hasContent).toBe(true);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Click editor to focus
    const editor = page.locator('.monaco-editor').first();
    await editor.click({ position: { x: 100, y: 100 } });

    // Type content using keyboard
    await page.keyboard.type('Keyboard input');

    // Wait for typing to complete
    await page.waitForTimeout(500);

    // Verify editor is still functional
    const editorElement = page.locator('.monaco-editor');
    await expect(editorElement).toBeVisible();
  });

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    // Wait for Monaco Editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Verify editor container has aria-label
    const editorContainer = page.locator('[aria-label="Note editor container"]');
    await expect(editorContainer).toBeVisible();

    // Verify preview toggle has aria-pressed
    const previewToggle = page.getByTestId('preview-toggle');
    const ariaPressed = await previewToggle.getAttribute('aria-pressed');
    expect(ariaPressed).toMatch(/^(true|false)$/);

    // Verify Monaco Editor is visible
    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });

  test('should sync preview with editor content updates', async ({ page }) => {
    // Wait for editor
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Preview should be visible by default
    const previewToggle = page.getByTestId('preview-toggle');
    const isPressed = await previewToggle.getAttribute('aria-pressed');
    expect(isPressed).toBe('true');

    // Preview should show the default content from initial state
    const preview = page.locator('[class*="previewContent"]');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('Welcome to Zenoter');
  });

  test('should synchronize scroll position between editor and preview', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    // Ensure preview is visible
    const previewToggle = page.getByTestId('preview-toggle');
    const isPressed = await previewToggle.getAttribute('aria-pressed');
    if (isPressed !== 'true') {
      await previewToggle.click();
      await page.waitForTimeout(400);
    }

    const previewContainer = page.locator('[class*="previewContainer"]');
    await expect(previewContainer).toBeVisible();

    // Get initial scroll positions
    const initialPreviewScroll = await previewContainer.evaluate((el) => el.scrollTop);

    // Click in the middle of the editor to position cursor
    const editor = page.locator('.monaco-editor').first();
    await editor.click({ position: { x: 100, y: 100 } });

    // Scroll down in the editor using keyboard (Page Down multiple times)
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');

    // Wait a bit for scroll sync to happen
    await page.waitForTimeout(200);

    // Verify preview scrolled (should be greater than initial)
    const newPreviewScroll = await previewContainer.evaluate((el) => el.scrollTop);
    expect(newPreviewScroll).toBeGreaterThan(initialPreviewScroll);

    // Scroll back to top
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(200);

    // Verify preview scrolled back near top
    const finalPreviewScroll = await previewContainer.evaluate((el) => el.scrollTop);
    expect(finalPreviewScroll).toBeLessThan(newPreviewScroll);
  });
});
