import { test, expect } from '@playwright/test';

test.describe('URL Encoder/Decoder E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/url-encoder');
    await page.waitForLoadState('networkidle');
  });

  test('should load the URL tool page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('URL');
    await expect(page.locator('text=Encode or decode URLs')).toBeVisible();
  });

  test('should have mode selection buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Encode URL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decode URL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Encode Component' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decode Component' })).toBeVisible();
  });

  test('should encode URL when Encode button is clicked', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('https://example.com/search?q=hello world');

    // Click the Encode action button
    await page.getByRole('button', { name: /Encode$/ }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea').nth(1);
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('hello%20world');
  });

  test('should decode URL when Decode button is clicked', async ({ page }) => {
    // Switch to decode mode
    await page.getByRole('button', { name: 'Decode URL' }).click();

    const input = page.locator('textarea').first();
    await input.fill('https://example.com/search?q=hello%20world');

    // Click the Decode action button
    await page.getByRole('button', { name: /Decode$/ }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea').nth(1);
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('hello world');
  });

  test('should encode URI component', async ({ page }) => {
    await page.getByRole('button', { name: 'Encode Component' }).click();

    const input = page.locator('textarea').first();
    await input.fill('hello world & special chars');

    await page.getByRole('button', { name: /Encode$/ }).click();
    await page.waitForTimeout(500);

    const output = page.locator('textarea').nth(1);
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('%26');
  });

  test('should swap input and output', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('test input');

    await page.getByRole('button', { name: /Encode$/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: /Swap/i }).click();
    await page.waitForTimeout(300);

    // After swap, input contains the encoded output
    const newInput = page.locator('textarea').first();
    const newValue = await newInput.inputValue();
    expect(newValue).toContain('test');
  });

  test('should clear all fields', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('some text');

    await page.getByRole('button', { name: /Encode$/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: /Clear/i }).click();
    await page.waitForTimeout(300);

    await expect(input).toHaveValue('');
    const output = page.locator('textarea').nth(1);
    await expect(output).toHaveValue('');
  });

  test('should copy output to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const input = page.locator('textarea').first();
    await input.fill('test');

    await page.getByRole('button', { name: /Encode$/ }).click();
    await page.waitForTimeout(300);

    // Setup dialog handler for alert
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.getByRole('button', { name: /Copy/i }).click();
    await page.waitForTimeout(300);
  });

  test('should show error for invalid decode input', async ({ page }) => {
    await page.getByRole('button', { name: 'Decode URL' }).click();

    const input = page.locator('textarea').first();
    await input.fill('%ZZ invalid');

    await page.getByRole('button', { name: /Decode$/ }).click();
    await page.waitForTimeout(500);

    // Should show error message (red border or error div)
    await expect(page.locator('.border-red-500, .bg-red-900')).toBeVisible();
  });

  test('should show character count', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('Hello');
    await page.waitForTimeout(300);

    await expect(page.locator('text=/5.*characters/i')).toBeVisible();
  });

  test('should have disabled swap when no output', async ({ page }) => {
    const swapButton = page.getByRole('button', { name: /Swap/i });
    await expect(swapButton).toBeDisabled();
  });
});
