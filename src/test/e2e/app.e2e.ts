import { test, expect } from '@playwright/test';

test.describe('Zenoter App - Phase 1 MVP', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // Check if the app loaded
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should display FileTree component', async ({ page }) => {
    await page.goto('/');

    // Check if FileTree is rendered
    await expect(page.getByRole('tree')).toBeVisible();
  });

  test('should display app title', async ({ page }) => {
    await page.goto('/');

    // Check if main heading is present
    await expect(page.getByRole('heading', { name: /Zenoter/i })).toBeVisible();
  });
});
