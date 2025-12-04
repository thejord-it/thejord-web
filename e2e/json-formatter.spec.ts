import { test, expect } from '@playwright/test';

test.describe('JSON Formatter E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await page.waitForLoadState('networkidle');
    // Wait for Monaco to fully load (may take longer in CI)
    try {
      await page.waitForSelector('.monaco-editor', { timeout: 30000 });
    } catch {
      // If Monaco doesn't load, the test will fail gracefully
    }
    await page.waitForTimeout(1000); // Extra wait for Monaco initialization
  });

  test('should load Monaco editor', async ({ page }) => {
    expect(await page.locator('.monaco-editor').count()).toBeGreaterThan(0);
  });

  test('should format JSON', async ({ page }) => {
    // Click on the Monaco editor to focus it
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();

    // Clear any existing content
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // Type JSON using pressSequentially (faster and more reliable than type())
    await page.keyboard.insertText('{"name":"test","value":123}');

    // Wait for React to process the input
    await page.waitForTimeout(500);

    // Click the Format button
    await page.getByRole('button', { name: '✨ Format', exact: true }).click();

    // Check the output editor contains formatted JSON
    await page.waitForTimeout(1000);
    const outputEditor = page.locator('.monaco-editor').nth(1);
    const outputText = await outputEditor.textContent();

    expect(outputText).toContain('name');
    expect(outputText).toContain('test');
    expect(outputText).toContain('value');
  });

  test('should minify JSON', async ({ page }) => {
    // Click on the Minify tab
    await page.getByRole('button', { name: '🗜️ Minify' }).click();
    await page.waitForTimeout(500);

    // Click and clear editor
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);

    // Insert a valid JSON object with spaces (formatted style)
    await page.keyboard.insertText('{ "name": "test", "value": 123 }');

    // Wait for React state update
    await page.waitForTimeout(800);

    // Click the action button (look for any button with Minify that's not the tab)
    const minifyButton = page.locator('button:has-text("🗜️ Minify")').last();
    await minifyButton.click();

    // Check output
    await page.waitForTimeout(1000);
    const outputEditor = page.locator('.monaco-editor').nth(1);
    const outputText = await outputEditor.textContent();

    expect(outputText).toContain('"name"');
    expect(outputText).toContain('"test"');
  });

  test('should show error for invalid JSON', async ({ page }) => {
    // Click and clear editor
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // Insert invalid JSON
    await page.keyboard.insertText('{invalid json');

    // Wait for React state update
    await page.waitForTimeout(500);

    // Click Format button
    await page.getByRole('button', { name: '✨ Format', exact: true }).click();

    // Check that error message appears in output editor
    await page.waitForTimeout(1000);
    const outputEditor = page.locator('.monaco-editor').nth(1);
    const outputText = await outputEditor.textContent();
    expect(outputText).toContain('Error');
  });

  test('should copy to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Setup dialog handler BEFORE any action
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Copied to clipboard');
      await dialog.accept();
    });

    // Click and clear editor
    const inputEditor = page.locator('.monaco-editor').first();
    await inputEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // Insert JSON
    await page.keyboard.insertText('{"test":true}');

    // Wait for React state update
    await page.waitForTimeout(500);

    // Click Format button
    await page.getByRole('button', { name: '✨ Format', exact: true }).click();
    await page.waitForTimeout(1000);

    // Click Copy button
    await page.getByRole('button', { name: '📋 Copy' }).click();

    await page.waitForTimeout(500);
  });
});
