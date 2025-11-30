import { test, expect } from '@playwright/test';

test.describe('JSON Schema Converter E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-schema');
    await page.waitForLoadState('networkidle');
    // Wait for Monaco to load
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test('should load the JSON schema converter page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('JSON Schema');
  });

  test('should have input and output editors', async ({ page }) => {
    const editors = page.locator('.monaco-editor');
    expect(await editors.count()).toBeGreaterThanOrEqual(2);
  });

  test('should generate schema from JSON', async ({ page }) => {
    // Click on the input editor
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();

    // Clear and type JSON
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText('{"name": "test", "age": 25}');
    await page.waitForTimeout(500);

    // Click Generate button
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(1000);

    // Check output contains schema keywords
    const outputEditor = page.locator('.monaco-editor').nth(1);
    const outputText = await outputEditor.textContent();
    expect(outputText).toContain('$schema');
    expect(outputText).toContain('properties');
  });

  test('should load example JSON', async ({ page }) => {
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);

    // Input editor should have content
    const inputEditor = page.locator('.monaco-editor').first();
    const inputText = await inputEditor.textContent();
    expect(inputText).toContain('name');
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();

    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText('{invalid json}');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(500);

    // Should show error message
    await expect(page.locator('text=/error|invalid/i')).toBeVisible();
  });

  test('should copy schema to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Load example and generate
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(1000);

    // Click copy button
    await page.getByRole('button', { name: /Copy/i }).click();
    await page.waitForTimeout(500);

    // Check clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('$schema');
  });

  test('should have schema version selector', async ({ page }) => {
    const select = page.locator('select');
    await expect(select).toBeVisible();
    // Check that the select has the draft-2020-12 option selected by default
    await expect(select).toHaveValue('draft-2020-12');
  });

  test('should have make required checkbox', async ({ page }) => {
    await expect(page.locator('text=Make all fields required')).toBeVisible();
  });

  test('should toggle format hints option', async ({ page }) => {
    const checkbox = page.getByLabel(/Add format hints/i);
    await expect(checkbox).toBeVisible();

    // Should be checked by default
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('should download schema file', async ({ page }) => {
    // Load example and generate
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(1000);

    // Setup download handler
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.json');
  });
});
