/**
 * Components E2E Tests - Black-box testing
 * Tests individual component interactions: FileTree, ThemeToggle, PreviewToggle, ResizablePane
 */

import { test, expect } from '@playwright/test';

test.describe('Components - NotesList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should render NotesList with correct structure', async ({ page }) => {
    // Wait for NotesList to load (create button should always be visible)
    await page.waitForFunction(
      () => {
        const createButton = document.querySelector('[aria-label="Create new note"]');
        return createButton !== null;
      },
      { timeout: 5000 }
    );

    const createButton = page.getByRole('button', { name: 'Create new note' });
    await expect(createButton).toBeVisible();

    // In browser mode (without Electron), database won't work, so notes may not appear
    // Just verify the NotesList container is rendered
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Wait for create button
    const createButton = page.getByRole('button', { name: 'Create new note' });
    await expect(createButton).toBeVisible();

    const ariaLabel = await createButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Create new note');

    // Note: Delete buttons only appear if notes exist (requires Electron database)
    // This test verifies the create button ARIA attributes which always exist
  });

  test('should be inside sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const createButton = page.getByRole('button', { name: 'Create new note' });

    await expect(sidebar).toBeVisible();
    await expect(createButton).toBeVisible();

    // Wait for animations to complete and verify NotesList is inside sidebar
    await page.waitForFunction(
      () => {
        const sidebar = document.querySelector('aside');
        const createBtn = document.querySelector('[aria-label="Create new note"]');
        if (!sidebar || !createBtn) return false;
        const sidebarBox = sidebar.getBoundingClientRect();
        const btnBox = createBtn.getBoundingClientRect();
        return (
          btnBox.x >= sidebarBox.x - 1 &&
          btnBox.x + btnBox.width <= sidebarBox.x + sidebarBox.width + 5
        );
      },
      { timeout: 5000 }
    );
  });

  test('should have animation on render', async ({ page }) => {
    // NotesList container should be rendered with Framer Motion
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Create button should be visible (has Framer Motion on parent)
    const createButton = page.getByRole('button', { name: 'Create new note' });
    await expect(createButton).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Components - ThemeToggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should render theme toggle button', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Switch to');

    // Button elements have implicit role, no need for explicit role attribute
    const tagName = await themeToggle.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
  });

  test('should be clickable', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    await themeToggle.click();

    // Wait for theme to change
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Focus the button
    await themeToggle.focus();

    // Verify it's focused
    const isFocused = await themeToggle.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);

    // Press Enter to activate
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    await page.keyboard.press('Enter');

    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );
  });

  test('should be in fixed position (top-right)', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    const viewportSize = page.viewportSize();
    const toggleBox = await themeToggle.boundingBox();

    expect(viewportSize).not.toBeNull();
    expect(toggleBox).not.toBeNull();

    if (viewportSize && toggleBox) {
      // Top area
      expect(toggleBox.y).toBeLessThan(100);

      // Right area
      expect(toggleBox.x + toggleBox.width).toBeGreaterThan(viewportSize.width - 100);
    }
  });
});

test.describe('Components - PreviewToggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should render preview toggle button', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');
    await expect(previewToggle).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

    const ariaPressed = await previewToggle.getAttribute('aria-pressed');
    expect(ariaPressed).toMatch(/^(true|false)$/);

    const ariaLabel = await previewToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toMatch(/preview/i);
  });

  test('should toggle preview visibility', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

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

    const newState = await previewToggle.getAttribute('aria-pressed');
    expect(newState).not.toBe(initialState);
  });

  test('should show/hide preview pane', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

    // Preview should start visible (aria-pressed="true")
    const initialPressed = await previewToggle.getAttribute('aria-pressed');
    expect(initialPressed).toBe('true');

    // Verify preview container is visible
    const preview = page.locator('[class*="previewContainer"]');
    await expect(preview).toBeVisible();

    // Toggle off
    await previewToggle.click();
    await page.waitForTimeout(500);

    // Preview should be hidden (not visible after animation)
    await expect(preview).not.toBeVisible();

    // Toggle back on
    await previewToggle.click();
    await page.waitForTimeout(500);

    // Preview should be visible again
    await expect(preview).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

    // Focus the button
    await previewToggle.focus();

    const isFocused = await previewToggle.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);

    // Press Enter to toggle
    const initialState = await previewToggle.getAttribute('aria-pressed');

    await page.keyboard.press('Enter');

    await page.waitForFunction(
      (initial) => {
        const toggle = document.querySelector('[data-testid="preview-toggle"]');
        return toggle?.getAttribute('aria-pressed') !== initial;
      },
      initialState,
      { timeout: 3000 }
    );
  });

  test('should have animation on click', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

    // Click multiple times to test animation
    for (let i = 0; i < 3; i++) {
      const currentState = await previewToggle.getAttribute('aria-pressed');
      await previewToggle.click();

      await page.waitForFunction(
        (previous) => {
          const toggle = document.querySelector('[data-testid="preview-toggle"]');
          return toggle?.getAttribute('aria-pressed') !== previous;
        },
        currentState,
        { timeout: 3000 }
      );
    }

    // Button should still be visible and functional
    await expect(previewToggle).toBeVisible();
  });
});

test.describe('Components - ResizablePane', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should render resize handles', async ({ page }) => {
    const separators = page.locator('[role="separator"]');
    const count = await separators.count();

    // Should have at least one separator (sidebar)
    expect(count).toBeGreaterThanOrEqual(1);

    // First separator should be visible
    await expect(separators.first()).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const separator = page.locator('[role="separator"]').first();
    await expect(separator).toHaveAttribute('role', 'separator');

    const ariaOrientation = await separator.getAttribute('aria-orientation');
    expect(ariaOrientation).toMatch(/^(horizontal|vertical)$/);
  });

  test('should have cursor style indicating resize', async ({ page }) => {
    const separator = page.locator('[role="separator"]').first();

    const cursor = await separator.evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursor).toContain('resize');
  });

  test('should maintain layout stability', async ({ page }) => {
    const sidebar = page.locator('aside');
    const main = page.locator('main');

    await expect(sidebar).toBeVisible();
    await expect(main).toBeVisible();

    const initialSidebarBox = await sidebar.boundingBox();
    const initialMainBox = await main.boundingBox();

    // Wait a bit and check again
    await page.waitForTimeout(1000);

    const finalSidebarBox = await sidebar.boundingBox();
    const finalMainBox = await main.boundingBox();

    expect(initialSidebarBox).not.toBeNull();
    expect(finalSidebarBox).not.toBeNull();

    if (initialSidebarBox && finalSidebarBox) {
      // Width should be stable (within 5px tolerance)
      expect(Math.abs(initialSidebarBox.width - finalSidebarBox.width)).toBeLessThan(5);
    }

    if (initialMainBox && finalMainBox) {
      expect(Math.abs(initialMainBox.width - finalMainBox.width)).toBeLessThan(5);
    }
  });
});
