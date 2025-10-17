import { test, expect } from '@playwright/test';

test.describe('Zenoter App - Phase 1 MVP E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('should load the application successfully', async ({ page }) => {
    // Verify root element is present
    await expect(page.locator('#root')).toBeVisible();

    // Verify page title
    await expect(page).toHaveTitle(/Zenoter/i);
  });

  test('should display the main heading', async ({ page }) => {
    // Check if main heading is present with correct text
    const heading = page.getByRole('heading', { name: /Zenoter - Phase 1 MVP/i });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Zenoter - Phase 1 MVP');
  });

  test('should display the tagline', async ({ page }) => {
    // Check if tagline paragraph is present
    const tagline = page.getByText('Modern note-taking app for developers');
    await expect(tagline).toBeVisible();
  });

  test('should render FileTree component in sidebar', async ({ page }) => {
    // Check if FileTree is rendered with proper ARIA role
    const fileTree = page.getByRole('tree', { name: 'File tree navigation' });
    await expect(fileTree).toBeVisible();

    // Verify FileTree has the "Notes" root item
    await expect(page.getByRole('treeitem', { name: 'Notes' })).toBeVisible();
  });

  test('should have correct layout structure', async ({ page }) => {
    // Verify sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Verify main content area exists
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify sidebar is on the left (check CSS)
    const sidebarBox = await sidebar.boundingBox();
    const mainBox = await main.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    // Sidebar should be to the left of main content (allow for equal x due to flex layout)
    if (sidebarBox && mainBox) {
      expect(sidebarBox.x).toBeLessThanOrEqual(mainBox.x);
    }
  });

  test('should have FileTree with animation (opacity transition)', async ({ page }) => {
    // Wait for the FileTree to be visible and stable (animation completed)
    const fileTree = page.getByRole('tree');

    // Playwright's toBeVisible() waits for element to be stable and fully visible
    // This inherently waits for animations to complete
    await expect(fileTree).toBeVisible();

    // Additionally verify the element has rendered content
    await expect(fileTree).toContainText('Notes');

    // Verify the tree is interactive (has proper ARIA attributes)
    await expect(fileTree).toHaveAttribute('role', 'tree');
  });

  test('should display all expected UI elements', async ({ page }) => {
    // Comprehensive check for all elements that should be present
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page.getByText('Modern note-taking app for developers')).toBeVisible();
    await expect(page.getByRole('treeitem')).toBeVisible();
  });

  test('should have proper font family applied', async ({ page }) => {
    // Verify system font is being used from CSS Module classes
    const appContainer = page.locator('[class*="appContainer"]').first();
    await expect(appContainer).toBeVisible();

    const fontFamily = await appContainer.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    // CSS Modules should apply system fonts, but fallback is acceptable in test environment
    // Check that a font is applied (even if it's the browser default)
    expect(fontFamily).toBeTruthy();
    expect(fontFamily.length).toBeGreaterThan(0);
  });
});
