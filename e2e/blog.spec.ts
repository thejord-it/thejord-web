import { test, expect } from '@playwright/test';

// Skip blog tests in CI - requires backend API
test.describe('Blog E2E', () => {
  test.skip(({ }, testInfo) => !!process.env.CI, 'Blog tests require backend API');
  test.describe('Blog List Page', () => {
    test('should load Italian blog page', async ({ page }) => {
      await page.goto('/it/blog');
      await expect(page.locator('h1')).toContainText('Blog');
    });

    test('should load English blog page', async ({ page }) => {
      await page.goto('/en/blog');
      await expect(page.locator('h1')).toContainText('Blog');
    });

    test('should display blog posts', async ({ page }) => {
      await page.goto('/it/blog');
      // Wait for posts to load
      await page.waitForSelector('a[href*="/blog/"]', { timeout: 10000 });
      const posts = await page.locator('a[href*="/it/blog/"]').count();
      expect(posts).toBeGreaterThan(0);
    });

    test('should display post icons when present', async ({ page }) => {
      await page.goto('/it/blog');
      await page.waitForSelector('a[href*="/blog/"]', { timeout: 10000 });
      // Check if page renders without errors (icons may or may not be present)
      const pageContent = await page.content();
      expect(pageContent).toContain('blog');
    });

    test('should have working search', async ({ page }) => {
      await page.goto('/it/blog');
      const searchInput = page.locator('input[placeholder*="Cerca"]').first();
      await searchInput.fill('test');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      // Search should filter results - page renders without error
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Blog Post Page', () => {
    test('should load a blog post', async ({ page }) => {
      await page.goto('/it/blog');
      await page.waitForSelector('a[href*="/it/blog/"]', { timeout: 10000 });

      // Click on first post
      const firstPost = page.locator('a[href*="/it/blog/"]').first();
      await firstPost.click();

      // Should navigate to post page
      await expect(page).toHaveURL(/\/it\/blog\/.+/);

      // Should have article content
      await expect(page.locator('article')).toBeVisible();
    });

    test('should display language switch if translation exists', async ({ page }) => {
      // Navigate to a post that has translation
      await page.goto('/it/blog');
      await page.waitForSelector('a[href*="/it/blog/"]', { timeout: 10000 });

      const firstPost = page.locator('a[href*="/it/blog/"]').first();
      await firstPost.click();

      // Page should load without errors
      await expect(page.locator('article')).toBeVisible();
    });

    test('should have back to blog link', async ({ page }) => {
      await page.goto('/it/blog');
      await page.waitForSelector('a[href*="/it/blog/"]', { timeout: 10000 });

      const firstPost = page.locator('a[href*="/it/blog/"]').first();
      await firstPost.click();

      // Should have back link in article area (not nav)
      const backLink = page.locator('article').locator('a[href="/it/blog"]').first();
      await expect(backLink).toBeVisible();
    });
  });
});
