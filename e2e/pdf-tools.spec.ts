import { test, expect } from '@playwright/test';

test.describe('PDF Tools E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/pdf-tools');
    await page.waitForLoadState('networkidle');
  });

  test('should load the PDF Tools page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('PDF Tools');
  });

  test('should display all tab buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Merge/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Split/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Edit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Convert/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Compress/i })).toBeVisible();
  });

  test('should have Merge tab active by default', async ({ page }) => {
    const mergeButton = page.getByRole('button', { name: /Merge/i });
    await expect(mergeButton).toHaveClass(/bg-primary/);
  });

  test('should display drag and drop area in Merge tab', async ({ page }) => {
    // Check for dropzone with dashed border
    await expect(page.locator('.border-dashed')).toBeVisible();
  });

  test('should switch to Split tab', async ({ page }) => {
    await page.getByRole('button', { name: /Split/i }).click();
    await page.waitForTimeout(300);

    const splitButton = page.getByRole('button', { name: /Split/i });
    await expect(splitButton).toHaveClass(/bg-primary/);
    // Dropzone should be shown when no file uploaded
    await expect(page.locator('.border-dashed')).toBeVisible();
  });

  test('should switch to Edit tab', async ({ page }) => {
    await page.getByRole('button', { name: /Edit/i }).click();
    await page.waitForTimeout(300);

    const editButton = page.getByRole('button', { name: /Edit/i });
    await expect(editButton).toHaveClass(/bg-primary/);
    await expect(page.locator('.border-dashed')).toBeVisible();
  });

  test('should switch to Convert tab', async ({ page }) => {
    await page.getByRole('button', { name: /Convert/i }).click();
    await page.waitForTimeout(300);

    const convertButton = page.getByRole('button', { name: /Convert/i });
    await expect(convertButton).toHaveClass(/bg-primary/);
  });

  test('should show conversion options in Convert tab', async ({ page }) => {
    await page.getByRole('button', { name: /Convert/i }).click();
    await page.waitForTimeout(300);

    // Check for conversion mode buttons - they contain arrow symbols
    await expect(page.locator('button:has-text("→")')).toHaveCount(2); // Images → PDF, PDF → Images
  });

  test('should switch to Compress tab', async ({ page }) => {
    await page.getByRole('button', { name: /Compress/i }).click();
    await page.waitForTimeout(300);

    const compressButton = page.getByRole('button', { name: /Compress/i });
    await expect(compressButton).toHaveClass(/bg-primary/);
    // Dropzone should be visible when no file uploaded
    await expect(page.locator('.border-dashed')).toBeVisible();
  });

  test('should navigate through all tabs without errors', async ({ page }) => {
    // Navigate through each tab
    const tabs = ['Split', 'Edit', 'Convert', 'Compress', 'Merge'];

    for (const tab of tabs) {
      await page.getByRole('button', { name: new RegExp(tab, 'i') }).click();
      await page.waitForTimeout(200);

      const button = page.getByRole('button', { name: new RegExp(tab, 'i') });
      await expect(button).toHaveClass(/bg-primary/);
    }
  });

  test('should display tool description', async ({ page }) => {
    // Check for description paragraph
    await expect(page.locator('p.text-text-secondary').first()).toBeVisible();
  });

  test('should have file input in Merge tab', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should have file input in Convert tab', async ({ page }) => {
    await page.getByRole('button', { name: /Convert/i }).click();
    await page.waitForTimeout(300);

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    // Should still show tabs
    await expect(page.getByRole('button', { name: /Merge/i })).toBeVisible();

    // Should still be functional
    await page.getByRole('button', { name: /Split/i }).click();
    await expect(page.getByRole('button', { name: /Split/i })).toHaveClass(/bg-primary/);
  });

  test('should have working tab keyboard navigation', async ({ page }) => {
    // Focus on first tab
    const mergeButton = page.getByRole('button', { name: /Merge/i });
    await mergeButton.focus();

    // Press Tab to move to next button
    await page.keyboard.press('Tab');

    // Verify focus moved (Split button should be focusable)
    const splitButton = page.getByRole('button', { name: /Split/i });
    await expect(splitButton).toBeFocused();
  });
});

test.describe('PDF Tools - File Upload Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/pdf-tools');
    await page.waitForLoadState('networkidle');
  });

  test('should accept PDF files via file input', async ({ page }) => {
    // Verify the file input accepts PDF files
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeAttached();

    // Verify accept attribute allows PDF
    const acceptAttr = await fileInput.getAttribute('accept');
    expect(acceptAttr).toContain('pdf');
  });

  test('should have multiple attribute on file input for merge', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    const multipleAttr = await input.getAttribute('multiple');
    expect(multipleAttr).not.toBeNull();
  });
});

test.describe('PDF Tools - Convert Tab Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/pdf-tools');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Convert/i }).click();
    await page.waitForTimeout(300);
  });

  test('should show file input for images', async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await expect(input).toBeAttached();
  });

  test('should have convert button', async ({ page }) => {
    // Find button with convert-related text
    const convertButton = page.locator('button').filter({ hasText: /Convert/i });
    await expect(convertButton.first()).toBeVisible();
  });
});
