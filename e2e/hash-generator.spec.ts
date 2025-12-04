import { test, expect } from '@playwright/test';

test.describe('Hash Generator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/hash-generator');
    await page.waitForLoadState('networkidle');
  });

  test('should load the hash generator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hash');
  });

  test('should have input textarea', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter text to hash/i);
    await expect(input).toBeVisible();
  });

  test('should display algorithms section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Algorithms' })).toBeVisible();
  });

  test('should generate hashes when text is entered', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter text to hash/i);
    await input.fill('Hello World');
    await page.waitForTimeout(500);

    // Check that hash results appear
    await expect(page.locator('text=Hash Results')).toBeVisible();
    // Check for Copy buttons in results
    await expect(page.locator('button:has-text("Copy")').first()).toBeVisible();
  });

  test('should generate different hashes for different inputs', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter text to hash/i);

    // First input
    await input.fill('test1');
    await page.waitForTimeout(500);
    const firstHash = await page.locator('.font-mono.text-xs').first().textContent();

    // Second input
    await input.fill('test2');
    await page.waitForTimeout(500);
    const secondHash = await page.locator('.font-mono.text-xs').first().textContent();

    expect(firstHash).not.toBe(secondHash);
  });

  test('should copy hash to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const input = page.getByPlaceholder(/Enter text to hash/i);
    await input.fill('test');
    await page.waitForTimeout(500);

    // Click copy button
    const copyButton = page.locator('button:has-text("Copy")').first();
    await copyButton.click();
    await page.waitForTimeout(300);

    // Verify clipboard contains hash
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^[a-f0-9]+$/i);
  });

  test('should toggle HMAC mode', async ({ page }) => {
    // Find the HMAC checkbox by looking for checkbox near "HMAC" text
    const hmacCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(hmacCheckbox).toBeVisible();

    await hmacCheckbox.click();
    await expect(hmacCheckbox).toBeChecked();

    // HMAC key input should appear
    await expect(page.getByPlaceholder(/Enter secret key for HMAC/i)).toBeVisible();
  });

  test('should generate HMAC hashes with key', async ({ page }) => {
    // Enable HMAC
    const hmacCheckbox = page.locator('input[type="checkbox"]').first();
    await hmacCheckbox.click();
    await page.waitForTimeout(300);

    // Enter text and key
    const input = page.getByPlaceholder(/Enter text to hash/i);
    const keyInput = page.getByPlaceholder(/Enter secret key for HMAC/i);

    await input.fill('message');
    await keyInput.fill('secret');
    await page.waitForTimeout(500);

    // Check HMAC prefix in results
    await expect(page.locator('text=HMAC-').first()).toBeVisible();
  });

  test('should clear input when clear button is clicked', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter text to hash/i);

    // Enter text
    await input.fill('test');
    await page.waitForTimeout(500);

    // Click clear button
    await page.getByRole('button', { name: /Clear/i }).click();
    await page.waitForTimeout(300);

    // Input should be empty
    await expect(input).toHaveValue('');
  });

  test('should show character and byte count', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter text to hash/i);
    await input.fill('Hello');
    await page.waitForTimeout(300);

    // Check for character count - look for the count display with bytes
    await expect(page.locator('text=/5.*bytes/i')).toBeVisible();
  });
});
