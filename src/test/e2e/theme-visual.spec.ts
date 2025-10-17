import { test, expect } from '@playwright/test';

test.describe('Theme Visual Changes E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should verify data-theme attribute exists on load', async ({ page }) => {
    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Initial data-theme:', dataTheme);
    expect(dataTheme).toMatch(/^(light|dark)$/);
  });

  test('should change data-theme attribute when toggle is clicked', async ({ page }) => {
    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Initial theme:', initialTheme);

    // Click toggle
    const themeToggle = page.getByTestId('theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(500); // Wait for animation

    // Get new theme
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('New theme after toggle:', newTheme);

    // Should have changed
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toMatch(/^(light|dark)$/);
  });

  test('should verify CSS variables are defined', async ({ page }) => {
    // Check if CSS variables exist
    const colorBackground = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--color-background').trim();
    });

    console.log('--color-background value:', colorBackground);
    expect(colorBackground).toBeTruthy();
    expect(colorBackground).toMatch(/#[0-9a-f]{6}|rgb/i);
  });

  test('should verify body background changes with theme', async ({ page }) => {
    // Set to light mode explicitly
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(100);

    const lightBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log('Light mode body background:', lightBg);

    // Set to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(100);

    const darkBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log('Dark mode body background:', darkBg);

    // Backgrounds should be different
    expect(lightBg).not.toBe(darkBg);
  });

  test('should verify main app container uses theme colors', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');

    // Get initial app background
    const appContainer = page.locator('[style*="display: flex"]').first();
    const initialBg = await appContainer.evaluate((el) => getComputedStyle(el).backgroundColor);
    console.log('Initial app background:', initialBg);

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Get new app background
    const newBg = await appContainer.evaluate((el) => getComputedStyle(el).backgroundColor);
    console.log('New app background:', newBg);

    // Should have changed
    expect(newBg).not.toBe(initialBg);
  });
});
