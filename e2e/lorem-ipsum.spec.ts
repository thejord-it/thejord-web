import { test, expect } from '@playwright/test';

test.describe('Lorem Ipsum Generator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/lorem-ipsum');
    await page.waitForLoadState('networkidle');
  });

  test('should load the lorem ipsum page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Lorem Ipsum');
  });

  test('should have type selection buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Paragraphs/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sentences/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Words/i })).toBeVisible();
  });

  test('should have count input', async ({ page }) => {
    const countInput = page.locator('input[type="number"]');
    await expect(countInput).toBeVisible();
  });

  test('should generate text when Generate is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should start with Lorem ipsum by default', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    expect(value).toContain('Lorem');
  });

  test('should switch to sentences mode', async ({ page }) => {
    await page.getByRole('button', { name: /Sentences/i }).click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should switch to words mode', async ({ page }) => {
    await page.getByRole('button', { name: /Words/i }).click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should respect count setting', async ({ page }) => {
    // Set count to 5
    const countInput = page.locator('input[type="number"]');
    await countInput.fill('5');

    // Generate words
    await page.getByRole('button', { name: /Words/i }).click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    // Should have approximately 5 words (plus punctuation)
    const wordCount = value.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(4);
    expect(wordCount).toBeLessThanOrEqual(6);
  });

  test('should clear output', async ({ page }) => {
    // Generate first
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    // Clear
    await page.getByRole('button', { name: /Clear/i }).click();
    await page.waitForTimeout(300);

    const output = page.locator('textarea');
    await expect(output).toHaveValue('');
  });

  test('should copy to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Generate
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    // Copy
    await page.getByRole('button', { name: /Copy/i }).click();
    await page.waitForTimeout(300);

    // Verify clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Lorem');
  });

  test('should have Copy button disabled when no output', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /Copy/i });
    await expect(copyButton).toBeDisabled();
  });

  test('should toggle start with Lorem option', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('should show stats', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Characters')).toBeVisible();
  });

  test('should display info section', async ({ page }) => {
    await expect(page.locator('text=/What is Lorem Ipsum/i')).toBeVisible();
  });

  test('should generate multiple paragraphs', async ({ page }) => {
    const countInput = page.locator('input[type="number"]');
    await countInput.fill('3');

    await page.getByRole('button', { name: /Paragraphs/i }).click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea');
    const value = await output.inputValue();
    // Multiple paragraphs should have newlines
    expect(value).toContain('\n\n');
  });
});
