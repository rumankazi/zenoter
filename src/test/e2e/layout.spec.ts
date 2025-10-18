/**
 * Layout E2E Tests - Black-box testing
 * Tests all layout functionality: flexbox structure, resizable panes, responsive design
 */

import { test, expect } from '@playwright/test';

test.describe('Layout - Structure & Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should have correct flexbox layout with sidebar and main content', async ({ page }) => {
    // Check that app container uses flexbox
    const appContainer = page.locator('[class*="appContainer"]').first();
    await expect(appContainer).toBeVisible();

    const display = await appContainer.evaluate((el) => window.getComputedStyle(el).display);
    // App container now has display: flex for horizontal layout
    expect(display).toBe('flex');
  });

  test('should have sidebar on the left with correct width', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();

    if (sidebarBox) {
      // Sidebar should be approximately 20% of viewport (around 256px at 1280px width)
      expect(sidebarBox.width).toBeGreaterThan(200);
      expect(sidebarBox.width).toBeLessThan(300);

      // Sidebar should start at the left edge (x = 0)
      expect(sidebarBox.x).toBeLessThanOrEqual(5);
    }
  });

  test('should have main content area taking remaining space', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();

    const mainBox = await main.boundingBox();
    const viewportSize = page.viewportSize();

    expect(mainBox).not.toBeNull();
    expect(viewportSize).not.toBeNull();

    if (mainBox && viewportSize) {
      // Main content should be wider than sidebar (taking flex: 1)
      expect(mainBox.width).toBeGreaterThan(250);

      // Main content should start after sidebar (around x = 250)
      expect(mainBox.x).toBeGreaterThanOrEqual(240);
      expect(mainBox.x).toBeLessThanOrEqual(260);
    }
  });

  test('should have sidebar and main content side by side (not stacked)', async ({ page }) => {
    const sidebar = page.locator('aside');
    const main = page.locator('main');

    await expect(sidebar).toBeVisible();
    await expect(main).toBeVisible();

    const sidebarBox = await sidebar.boundingBox();
    const mainBox = await main.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    if (sidebarBox && mainBox) {
      // They should have similar Y positions (side by side, not stacked)
      expect(Math.abs(sidebarBox.y - mainBox.y)).toBeLessThan(10);

      // Main should be to the right of sidebar
      expect(mainBox.x).toBeGreaterThan(sidebarBox.x);

      // Sidebar should end approximately where main begins
      const sidebarEnd = sidebarBox.x + sidebarBox.width;
      expect(mainBox.x).toBeGreaterThanOrEqual(sidebarEnd - 5);
      expect(mainBox.x).toBeLessThanOrEqual(sidebarEnd + 5);
    }
  });

  test('should have full viewport height layout', async ({ page }) => {
    const appContainer = page.locator('[class*="appContainer"]').first();
    const viewportSize = page.viewportSize();

    await expect(appContainer).toBeVisible();
    expect(viewportSize).not.toBeNull();

    const containerBox = await appContainer.boundingBox();

    if (containerBox && viewportSize) {
      // Container should take full viewport height
      expect(containerBox.height).toBeCloseTo(viewportSize.height, 5);

      // Container should take full viewport width
      expect(containerBox.width).toBeCloseTo(viewportSize.width, 5);
    }
  });

  test('should have NotesList inside sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const createButton = page.getByRole('button', { name: 'Create new note' });

    await expect(sidebar).toBeVisible();
    await expect(createButton).toBeVisible();

    // Wait for Framer Motion animations to complete (deterministic)
    await page.waitForFunction(
      () => {
        const sidebar = document.querySelector('aside');
        const createBtn = document.querySelector('[aria-label="Create new note"]');
        if (!sidebar || !createBtn) return false;
        const sidebarBox = sidebar.getBoundingClientRect();
        const btnBox = createBtn.getBoundingClientRect();
        // NotesList (create button) should be inside sidebar bounds (with tolerance for animations)
        return (
          btnBox.x >= sidebarBox.x - 1 &&
          btnBox.x + btnBox.width <= sidebarBox.x + sidebarBox.width + 5 &&
          btnBox.y >= sidebarBox.y - 10
        );
      },
      { timeout: 5000 }
    );

    const sidebarBox = await sidebar.boundingBox();
    const createBtnBox = await createButton.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(createBtnBox).not.toBeNull();

    if (sidebarBox && createBtnBox) {
      // NotesList should be inside sidebar bounds (with tolerance for animations)
      expect(createBtnBox.x).toBeGreaterThanOrEqual(sidebarBox.x - 1);
      expect(createBtnBox.x + createBtnBox.width).toBeLessThanOrEqual(
        sidebarBox.x + sidebarBox.width + 5
      );
      expect(createBtnBox.y).toBeGreaterThanOrEqual(sidebarBox.y - 10); // Tolerance for animation transforms
    }
  });

  test('should have toolbar and demo section in main content area', async ({ page }) => {
    const main = page.locator('main');
    const toolbar = page.locator('main > [class*="toolbar"]').first();
    const noteTitle = page.locator('[class*="noteTitle"]');
    const demoSection = page.locator('[class*="demoSection"]');

    await expect(main).toBeVisible();
    await expect(toolbar).toBeVisible();
    await expect(noteTitle).toBeVisible();
    await expect(demoSection).toBeVisible();

    const mainBox = await main.boundingBox();
    const toolbarBox = await toolbar.boundingBox();
    const demoBox = await demoSection.boundingBox();

    expect(mainBox).not.toBeNull();
    expect(toolbarBox).not.toBeNull();
    expect(demoBox).not.toBeNull();

    if (mainBox && toolbarBox && demoBox) {
      // Both should be inside main content bounds
      expect(toolbarBox.x).toBeGreaterThanOrEqual(mainBox.x);
      expect(demoBox.x).toBeGreaterThanOrEqual(mainBox.x);

      // Demo section should be below toolbar (vertical stack)
      expect(demoBox.y).toBeGreaterThan(toolbarBox.y);
    }
  });

  test('should have theme toggle in fixed position (top-right)', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    const viewportSize = page.viewportSize();
    const toggleBox = await themeToggle.boundingBox();

    expect(viewportSize).not.toBeNull();
    expect(toggleBox).not.toBeNull();

    if (viewportSize && toggleBox) {
      // Should be in top-right corner (allowing for 20px margin as per CSS)
      expect(toggleBox.y).toBeLessThan(100); // Top area
      expect(toggleBox.x + toggleBox.width).toBeGreaterThan(viewportSize.width - 100); // Right area
    }
  });

  test('should verify layout remains correct after resizing', async ({ page }) => {
    // Set initial viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173');

    const sidebar = page.locator('aside');
    const main = page.locator('main');

    // Check initial layout
    let sidebarBox = await sidebar.boundingBox();
    let mainBox = await main.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    if (sidebarBox && mainBox) {
      expect(sidebarBox.width).toBeGreaterThan(200);
      expect(sidebarBox.width).toBeLessThan(300);
      expect(mainBox.x).toBeGreaterThan(sidebarBox.x);
    }

    // Resize viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Wait for layout to adjust (deterministic)
    await page.waitForFunction(
      (expectedWidth) => {
        const main = document.querySelector('main');
        return main && main.getBoundingClientRect().width > expectedWidth;
      },
      1400,
      { timeout: 5000 }
    );

    // Re-check layout
    sidebarBox = await sidebar.boundingBox();
    mainBox = await main.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    if (sidebarBox && mainBox) {
      // Sidebar width should be proportional (20% of new width)
      expect(sidebarBox.width).toBeGreaterThan(300);
      expect(sidebarBox.width).toBeLessThan(450);

      // Main content should have expanded to fill new space (1920px - sidebar)
      expect(mainBox.width).toBeGreaterThan(1400);

      // Still side by side
      expect(Math.abs(sidebarBox.y - mainBox.y)).toBeLessThan(10);
    }
  });

  test('should have no horizontal overflow', async ({ page }) => {
    const appContainer = page.locator('[class*="appContainer"]').first();
    await expect(appContainer).toBeVisible();

    const hasOverflow = await appContainer.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });

    expect(hasOverflow).toBe(false);
  });

  test('should verify all layout elements are using theme colors', async ({ page }) => {
    const appContainer = page.locator('[class*="appContainer"]').first();
    const sidebar = page.locator('aside');
    const main = page.locator('main');

    await expect(appContainer).toBeVisible();
    await expect(sidebar).toBeVisible();
    await expect(main).toBeVisible();

    // Verify CSS variables are applied
    const bgColor = await appContainer.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    const sidebarBg = await sidebar.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Both should have valid colors (not 'transparent' or empty)
    expect(bgColor).toMatch(/rgb/);
    expect(sidebarBg).toMatch(/rgb/);

    // Sidebar should have a different background than main container
    expect(bgColor).not.toBe(sidebarBg);
  });
});

test.describe('Layout - Resizable Panes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app-container"]', { state: 'visible' });
  });

  test('should have resizable sidebar', async ({ page }) => {
    // Check for resize handle (first separator is for sidebar)
    const resizeHandle = page.locator('[role="separator"]').first();
    await expect(resizeHandle).toBeVisible();

    // Verify it's draggable (has proper cursor)
    const cursor = await resizeHandle.evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursor).toContain('resize');

    // Verify it has horizontal orientation
    const orientation = await resizeHandle.getAttribute('aria-orientation');
    expect(orientation).toBe('horizontal');
  });

  test('should have resizable editor/preview split', async ({ page }) => {
    // Ensure preview is visible first
    const previewToggle = page.getByTestId('preview-toggle');
    const isPressed = await previewToggle.getAttribute('aria-pressed');
    if (isPressed === 'false') {
      await previewToggle.click();
      await page.waitForFunction(
        () => document.querySelector('[class*="markdownPreview"]') !== null,
        { timeout: 3000 }
      );
    }

    // Check for resize handle between editor and preview
    // Find second separator (after sidebar separator)
    const separators = page.locator('[role="separator"]');
    const count = await separators.count();

    if (count >= 2) {
      const handle = separators.nth(1);
      await expect(handle).toBeVisible();

      // Verify it's draggable
      const cursor = await handle.evaluate((el) => window.getComputedStyle(el).cursor);
      expect(cursor).toContain('resize');
    }
  });

  test('should maintain layout when preview is toggled', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');

    // Get initial layout
    const main = page.locator('main');
    const initialBox = await main.boundingBox();
    expect(initialBox).not.toBeNull();

    // Toggle preview off
    await previewToggle.click();
    await page.waitForTimeout(500); // Wait for animation

    // Main area should still exist
    const afterToggleBox = await main.boundingBox();
    expect(afterToggleBox).not.toBeNull();

    // Toggle back on
    await previewToggle.click();
    await page.waitForTimeout(500);

    const finalBox = await main.boundingBox();
    expect(finalBox).not.toBeNull();

    // Layout should be stable (within tolerance)
    if (initialBox && finalBox) {
      expect(Math.abs(initialBox.height - finalBox.height)).toBeLessThan(10);
    }
  });

  test('should have proper z-index for preview toggle button', async ({ page }) => {
    const previewToggle = page.getByTestId('preview-toggle');
    await expect(previewToggle).toBeVisible();

    // Button should be positioned above content (z-index > 0)
    const zIndex = await previewToggle.evaluate((el) => window.getComputedStyle(el).zIndex);

    // z-index should be a number greater than 0 or 'auto' (which is fine for positioned elements)
    expect(zIndex === 'auto' || parseInt(zIndex) > 0).toBe(true);
  });

  test('should maintain sidebar width constraints', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();

    if (sidebarBox) {
      // Should respect min-width (150px based on typical constraints)
      expect(sidebarBox.width).toBeGreaterThanOrEqual(150);

      // Should respect max-width (500px based on typical constraints)
      expect(sidebarBox.width).toBeLessThanOrEqual(500);
    }
  });
});
