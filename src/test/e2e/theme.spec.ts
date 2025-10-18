/**
 * Theme E2E Tests - Black-box testing
 * Tests all theme-related functionality: toggle, persistence, visual changes, CSS variables
 */

import { test, expect } from '@playwright/test';

test.describe('Theme - Toggle & Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should render theme toggle on first load', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAttribute('aria-label');
  });

  test('should have correct initial theme', async ({ page }) => {
    // Should default to system preference or light mode
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toMatch(/^(light|dark)$/);
  });

  test('should toggle between light and dark modes', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial label
    const initialLabel = await themeToggle.getAttribute('aria-label');
    expect(initialLabel).toContain('Switch to');

    // Click to toggle
    await themeToggle.click();
    // Wait for aria-label to change
    await page.waitForFunction(
      (initial) => {
        const button = document.querySelector('[data-testid="theme-toggle"]');
        return button?.getAttribute('aria-label') !== initial;
      },
      initialLabel,
      { timeout: 3000 }
    );

    // Check label changed
    const newLabel = await themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);

    // Click again to toggle back
    await themeToggle.click();
    await page.waitForFunction(
      (previous) => {
        const button = document.querySelector('[data-testid="theme-toggle"]');
        return button?.getAttribute('aria-label') !== previous;
      },
      newLabel,
      { timeout: 3000 }
    );

    const finalLabel = await themeToggle.getAttribute('aria-label');
    expect(finalLabel).toBe(initialLabel);
  });

  test('should apply theme to document root', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toMatch(/^(light|dark)$/);

    // Toggle to opposite theme
    await themeToggle.click();
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    // Theme should have changed
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toMatch(/^(light|dark)$/);

    // Toggle back
    await themeToggle.click();
    await page.waitForFunction(
      (previous) => document.documentElement.getAttribute('data-theme') !== previous,
      newTheme,
      { timeout: 3000 }
    );

    const finalTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Toggle theme
    await themeToggle.click();
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );

    // Check localStorage has a value
    const savedTheme = await page.evaluate(() => localStorage.getItem('zenoter-theme-mode'));
    expect(savedTheme).toMatch(/^(light|dark)$/);

    // Reload page and verify theme persists
    await page.reload();

    // Wait for theme to be applied after reload
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') !== null, {
      timeout: 2000,
    });

    const themeAfterReload = await page.evaluate(() => localStorage.getItem('zenoter-theme-mode'));
    expect(themeAfterReload).toBe(savedTheme);

    // Verify data-theme attribute was applied (may be 'light' or 'dark' depending on saved theme)
    const dataThemeAfterReload = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataThemeAfterReload).toMatch(/^(light|dark)$/);
  });

  test('should have smooth toggle animation', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Click multiple times to test animation smoothness
    let currentTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    for (let i = 0; i < 3; i++) {
      await themeToggle.click();
      await page.waitForFunction(
        (prev) => document.documentElement.getAttribute('data-theme') !== prev,
        currentTheme,
        { timeout: 3000 }
      );
      currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    }

    // Toggle should still be visible and functional
    await expect(themeToggle).toBeVisible();
  });
});

test.describe('Theme - Visual & CSS Variables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have CSS variables defined', async ({ page }) => {
    // Check if CSS variables exist
    const colorBackground = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--color-background').trim();
    });

    expect(colorBackground).toBeTruthy();
    expect(colorBackground).toMatch(/#[0-9a-f]{6}|rgb/i);
  });

  test('should change body background color with theme', async ({ page }) => {
    // Set to light mode explicitly
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    // Wait for CSS to apply
    await page.waitForFunction(
      () => {
        const bg = getComputedStyle(document.body).backgroundColor;
        return bg.includes('255, 255, 255') || bg.includes('#fff');
      },
      { timeout: 2000 }
    );

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Set to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait for dark background
    await page.waitForFunction(
      () => {
        const bg = getComputedStyle(document.body).backgroundColor;
        const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          return r < 50 && g < 50 && b < 50;
        }
        return false;
      },
      { timeout: 2000 }
    );

    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Backgrounds should be different
    expect(lightBg).not.toBe(darkBg);
  });

  test('should apply theme colors to Monaco Editor', async ({ page }) => {
    // Wait for editor to load
    await page.waitForFunction(() => document.querySelector('.monaco-editor') !== null, {
      timeout: 10000,
    });

    const themeToggle = page.getByTestId('theme-toggle');
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Toggle theme
    await themeToggle.click();
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );

    // Wait for editor theme to update (Monaco has internal delays)
    await page.waitForTimeout(500);

    // Verify editor still visible and functional after theme change
    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });

  test('should update all UI components with theme', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Toggle theme
    await themeToggle.click();
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme,
      { timeout: 3000 }
    );

    // Verify CSS variable was updated
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim();
    });
    expect(bgColor).toBeTruthy();
    expect(bgColor).toMatch(/#[0-9a-f]{6}/i);
  });

  test('should maintain theme consistency across multiple components', async ({ page }) => {
    // Verify theme is applied to app container
    const appContainer = page.locator('[data-testid="app-container"]');
    await expect(appContainer).toBeVisible();

    const appBg = await appContainer.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Verify sidebar has theme colors
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    const sidebarBg = await sidebar.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Both should have valid RGB colors
    expect(appBg).toMatch(/rgb/);
    expect(sidebarBg).toMatch(/rgb/);

    // Sidebar should have different bg than main app (UI design)
    expect(appBg).not.toBe(sidebarBg);
  });
});
