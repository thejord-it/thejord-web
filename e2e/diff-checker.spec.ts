import { test, expect } from '@playwright/test';

test.describe('Diff Checker E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/diff-checker');
    await page.waitForLoadState('networkidle');
  });

  test('should load the diff checker page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Text Diff Checker');
  });

  test('should have two text input areas', async ({ page }) => {
    const textareas = page.locator('textarea');
    await expect(textareas).toHaveCount(2);
    await expect(page.getByPlaceholder(/Paste original text/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Paste modified text/i)).toBeVisible();
  });

  test('should load example texts', async ({ page }) => {
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);

    const text1 = page.getByPlaceholder(/Paste original text/i);
    const text2 = page.getByPlaceholder(/Paste modified text/i);

    await expect(text1).not.toHaveValue('');
    await expect(text2).not.toHaveValue('');
  });

  test('should compare texts and show differences', async ({ page }) => {
    // Load example first
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);

    // Click Compare
    await page.getByRole('button', { name: /Compare/i }).click();
    await page.waitForTimeout(1000);

    // Check diff results appear
    await expect(page.locator('h2:has-text("Differences")')).toBeVisible();
  });

  test('should show statistics after comparing', async ({ page }) => {
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Compare/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Total Lines')).toBeVisible();
    await expect(page.locator('text=Additions')).toBeVisible();
    await expect(page.locator('text=Deletions')).toBeVisible();
  });

  test('should swap texts', async ({ page }) => {
    const text1 = page.getByPlaceholder(/Paste original text/i);
    const text2 = page.getByPlaceholder(/Paste modified text/i);

    await text1.fill('original');
    await text2.fill('modified');

    await page.getByRole('button', { name: /Swap Texts/i }).click();
    await page.waitForTimeout(300);

    await expect(text1).toHaveValue('modified');
    await expect(text2).toHaveValue('original');
  });

  test('should clear all texts', async ({ page }) => {
    const text1 = page.getByPlaceholder(/Paste original text/i);
    const text2 = page.getByPlaceholder(/Paste modified text/i);

    await text1.fill('some text');
    await text2.fill('other text');

    await page.getByRole('button', { name: /Clear All/i }).click();
    await page.waitForTimeout(300);

    await expect(text1).toHaveValue('');
    await expect(text2).toHaveValue('');
  });

  test('should have option checkboxes', async ({ page }) => {
    await expect(page.getByLabel(/Line Numbers/i)).toBeVisible();
    await expect(page.getByLabel(/Ignore Whitespace/i)).toBeVisible();
    await expect(page.getByLabel(/Ignore Case/i)).toBeVisible();
  });

  test('should toggle ignore whitespace option', async ({ page }) => {
    const checkbox = page.getByLabel(/Ignore Whitespace/i);
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should display legend', async ({ page }) => {
    await expect(page.locator('text=Legend')).toBeVisible();
    await expect(page.locator('text=Added line')).toBeVisible();
    await expect(page.locator('text=Removed line')).toBeVisible();
  });

  test('should show colored diff lines after comparing', async ({ page }) => {
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Compare/i }).click();
    await page.waitForTimeout(1000);

    // Check for colored diff indicators (green for added, red for removed)
    const addedLines = page.locator('.bg-green-900, .bg-green-500, [class*="green"]');
    const removedLines = page.locator('.bg-red-900, .bg-red-500, [class*="red"]');

    // At least one of these should be visible
    const hasAddedOrRemoved = await addedLines.count() > 0 || await removedLines.count() > 0;
    expect(hasAddedOrRemoved).toBeTruthy();
  });
});
