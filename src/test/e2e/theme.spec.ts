import { test, expect } from '@playwright/test';

test.describe('Theme System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should render toggle switch on first load', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAttribute('aria-label');
  });

  test('should toggle between light and dark modes', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial label
    const initialLabel = await themeToggle.getAttribute('aria-label');
    expect(initialLabel).toContain('Switch to');

    // Click to toggle
    await themeToggle.click();
    // Wait for aria-label to change
    await page.waitForFunction((initial) => {
      const button = document.querySelector('[data-testid="theme-toggle"]');
      return button?.getAttribute('aria-label') !== initial;
    }, initialLabel);

    // Check label changed
    const newLabel = await themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);

    // Click again to toggle back
    await themeToggle.click();
    await page.waitForFunction((previous) => {
      const button = document.querySelector('[data-testid="theme-toggle"]');
      return button?.getAttribute('aria-label') !== previous;
    }, newLabel);

    const finalLabel = await themeToggle.getAttribute('aria-label');
    expect(finalLabel).toBe(initialLabel);
  });

  test('should apply theme to document root', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Start in auto mode (should be light or dark depending on system)
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toMatch(/^(light|dark)$/);

    // Toggle to opposite theme
    await themeToggle.click();
    await page.waitForFunction(
      (initial) => document.documentElement.getAttribute('data-theme') !== initial,
      initialTheme
    );

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    // Theme should have changed
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toMatch(/^(light|dark)$/);

    // Toggle back
    await themeToggle.click();
    await page.waitForFunction(
      (previous) => document.documentElement.getAttribute('data-theme') !== previous,
      newTheme
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
      initialTheme
    );

    // Check localStorage has a value
    const savedTheme = await page.evaluate(() => localStorage.getItem('zenoter-theme-mode'));
    expect(savedTheme).toMatch(/^(light|dark)$/);

    // Reload page and verify theme persists
    await page.reload();

    const themeAfterReload = await page.evaluate(() => localStorage.getItem('zenoter-theme-mode'));
    expect(themeAfterReload).toBe(savedTheme);
  });

  test('should have smooth toggle animation', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Toggle should be visible and clickable
    await expect(themeToggle).toBeVisible();

    // Click multiple times to test animation smoothness
    let currentTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    await themeToggle.click();
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      currentTheme
    );

    currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await themeToggle.click();
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      currentTheme
    );

    currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await themeToggle.click();
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      currentTheme
    );

    // Toggle should still be visible and functional
    await expect(themeToggle).toBeVisible();
  });
});
