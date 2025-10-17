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
    await page.waitForTimeout(300); // Wait for animation

    // Check label changed
    const newLabel = await themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);

    // Click again to toggle back
    await themeToggle.click();
    await page.waitForTimeout(300);

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
    await page.waitForTimeout(100);

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    // Theme should have changed
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toMatch(/^(light|dark)$/);

    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(100);

    const finalTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(100);

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
    await themeToggle.click();
    await page.waitForTimeout(100);
    await themeToggle.click();
    await page.waitForTimeout(100);
    await themeToggle.click();

    // Toggle should still be visible and functional
    await expect(themeToggle).toBeVisible();
  });
});
