import { test, expect } from '@playwright/test';

test.describe('Layout Structure E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should have correct flexbox layout with sidebar and main content', async ({ page }) => {
    // Check that app container uses flexbox
    const appContainer = page.locator('[class*="appContainer"]').first();
    await expect(appContainer).toBeVisible();

    const display = await appContainer.evaluate((el) => window.getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('should have sidebar on the left with correct width', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();

    if (sidebarBox) {
      // Sidebar should be 250px wide
      expect(sidebarBox.width).toBeCloseTo(250, 5);

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

  test('should have FileTree inside sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const fileTree = page.getByRole('tree', { name: 'File tree navigation' });

    await expect(sidebar).toBeVisible();
    await expect(fileTree).toBeVisible();

    // Wait for Framer Motion animations to complete (deterministic)
    await page.waitForFunction(
      ([sidebarSelector, fileTreeSelector]) => {
        const sidebar = document.querySelector(sidebarSelector);
        const fileTree = document.querySelector(fileTreeSelector);
        if (!sidebar || !fileTree) return false;
        const sidebarBox = sidebar.getBoundingClientRect();
        const treeBox = fileTree.getBoundingClientRect();
        // FileTree should be inside sidebar bounds (with tolerance for animations)
        return (
          treeBox.x >= sidebarBox.x - 1 &&
          treeBox.x + treeBox.width <= sidebarBox.x + sidebarBox.width + 5 &&
          treeBox.y >= sidebarBox.y - 10
        );
      },
      ['aside', '[role="tree"][aria-label="File tree navigation"]'],
      { timeout: 5000 }
    );

    const sidebarBox = await sidebar.boundingBox();
    const treeBox = await fileTree.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(treeBox).not.toBeNull();

    if (sidebarBox && treeBox) {
      // FileTree should be inside sidebar bounds (with tolerance for animations)
      expect(treeBox.x).toBeGreaterThanOrEqual(sidebarBox.x - 1);
      expect(treeBox.x + treeBox.width).toBeLessThanOrEqual(sidebarBox.x + sidebarBox.width + 5);
      expect(treeBox.y).toBeGreaterThanOrEqual(sidebarBox.y - 10); // Tolerance for animation transforms
    }
  });

  test('should have heading and demo section in main content area', async ({ page }) => {
    const main = page.locator('main');
    const heading = page.getByRole('heading', { name: /Zenoter - Phase 1 MVP/i });
    const demoSection = page.locator('[class*="demoSection"]');

    await expect(main).toBeVisible();
    await expect(heading).toBeVisible();
    await expect(demoSection).toBeVisible();

    const mainBox = await main.boundingBox();
    const headingBox = await heading.boundingBox();
    const demoBox = await demoSection.boundingBox();

    expect(mainBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect(demoBox).not.toBeNull();

    if (mainBox && headingBox && demoBox) {
      // Both should be inside main content bounds
      expect(headingBox.x).toBeGreaterThanOrEqual(mainBox.x);
      expect(demoBox.x).toBeGreaterThanOrEqual(mainBox.x);

      // Demo section should be below heading (vertical stack)
      expect(demoBox.y).toBeGreaterThan(headingBox.y);
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
      expect(sidebarBox.width).toBeCloseTo(250, 5);
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
      1600,
      { timeout: 5000 }
    );

    // Re-check layout
    sidebarBox = await sidebar.boundingBox();
    mainBox = await main.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    if (sidebarBox && mainBox) {
      // Sidebar width should remain 250px
      expect(sidebarBox.width).toBeCloseTo(250, 5);

      // Main content should have expanded to fill new space
      expect(mainBox.width).toBeGreaterThan(1600);

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
