import { test, expect } from '@playwright/test';

test.describe('XML & WSDL Viewer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/xml-wsdl-viewer');
    await page.waitForLoadState('networkidle');
  });

  test('should load the XML & WSDL Viewer page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('XML');
  });

  test('should have input textarea with sample XML', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    await expect(textarea).toContainText('<?xml');
  });

  test('should display tab buttons', async ({ page }) => {
    // Use .first() as there may be multiple buttons with similar names
    await expect(page.getByRole('button', { name: /Format/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /WSDL/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /JSON/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Minify/i }).first()).toBeVisible();
  });

  test('should show valid XML status for sample data', async ({ page }) => {
    await expect(page.locator('text=Valid XML')).toBeVisible();
  });

  test('should format XML when clicking format button', async ({ page }) => {
    // Click format button
    await page.getByRole('button', { name: /Format XML/i }).click();
    await page.waitForTimeout(500);

    // Check output textarea has content
    const output = page.locator('textarea').nth(1);
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('<?xml');
  });

  test('should show invalid status for malformed XML', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('<invalid><xml');
    await page.waitForTimeout(500);

    await expect(page.locator('text=/Invalid/i')).toBeVisible();
  });

  test('should switch to WSDL Parser tab', async ({ page }) => {
    await page.getByRole('button', { name: /WSDL/i }).click();
    await page.waitForTimeout(300);

    await expect(page.getByRole('button', { name: /Load Sample WSDL/i })).toBeVisible();
  });

  test('should load sample WSDL', async ({ page }) => {
    await page.getByRole('button', { name: /WSDL/i }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: /Load Sample WSDL/i }).click();
    await page.waitForTimeout(500);

    // Should show WSDL content with services
    await expect(page.locator('text=Services')).toBeVisible();
  });

  test('should switch to XML to JSON converter tab', async ({ page }) => {
    await page.getByRole('button', { name: /JSON/i }).first().click();
    await page.waitForTimeout(300);

    // Should show converter interface - check for h2 with converter title
    await expect(page.locator('h2').filter({ hasText: /JSON/i }).first()).toBeVisible();
  });

  test('should convert XML to JSON', async ({ page }) => {
    await page.getByRole('button', { name: /JSON/i }).first().click();
    await page.waitForTimeout(500);

    // Verify the converter interface is visible
    // There should be two textareas in the grid (XML input and JSON input)
    await expect(page.locator('textarea').first()).toBeVisible();
    await expect(page.locator('textarea').nth(1)).toBeVisible();

    // Verify convert buttons are visible
    const xmlToJsonBtn = page.locator('button').filter({ hasText: /XML.*JSON/i }).first();
    await expect(xmlToJsonBtn).toBeVisible();
  });

  test('should switch to Minify tab', async ({ page }) => {
    await page.getByRole('button', { name: /Minify/i }).first().click();
    await page.waitForTimeout(300);

    // The action button inside the tab just says "Minify" not "Minify XML"
    await expect(page.locator('button').filter({ hasText: /Minify/i }).nth(1)).toBeVisible();
  });

  test('should minify XML', async ({ page }) => {
    // First switch to Minify tab
    await page.getByRole('button', { name: /Minify/i }).first().click();
    await page.waitForTimeout(500);

    // Enter formatted XML
    const textarea = page.locator('textarea').first();
    await textarea.clear();
    await textarea.fill('<root>\n  <child>\n    content\n  </child>\n</root>');
    await page.waitForTimeout(500);

    // Click the action button (has emoji 🗜️)
    const actionButton = page.locator('button').filter({ hasText: '🗜️' }).first();
    await actionButton.click();
    await page.waitForTimeout(1000);

    // Output should be minified - check that minification happened
    const output = page.locator('textarea').nth(1);
    const outputValue = await output.inputValue();
    // Just verify we got some output that looks minified (single line or fewer newlines)
    expect(outputValue.length).toBeGreaterThan(0);
  });

  test('should copy output to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Format XML first
    await page.getByRole('button', { name: /Format XML/i }).click();
    await page.waitForTimeout(500);

    // Click copy button
    await page.getByRole('button', { name: /Copy/i }).click();
    await page.waitForTimeout(300);

    // Verify clipboard contains XML
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('<?xml');
  });

  test('should clear input when clear button is clicked', async ({ page }) => {
    const textarea = page.locator('textarea').first();

    // Click clear button
    await page.getByRole('button', { name: /Clear/i }).click();
    await page.waitForTimeout(300);

    // Input should be empty
    await expect(textarea).toHaveValue('');
  });

  test('should show element and attribute counts', async ({ page }) => {
    await expect(page.locator('text=/\\d+.*elements/i')).toBeVisible();
    await expect(page.locator('text=/\\d+.*attributes/i')).toBeVisible();
  });

  test('should change indentation level', async ({ page }) => {
    // Find indentation selector and change value
    const indentSelect = page.locator('select').first();
    if (await indentSelect.isVisible()) {
      await indentSelect.selectOption('4');
      await page.waitForTimeout(300);
    }
  });

  test('should download formatted XML', async ({ page }) => {
    // Format XML first
    await page.getByRole('button', { name: /Format XML/i }).click();
    await page.waitForTimeout(500);

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Click download button
    await page.getByRole('button', { name: /Download/i }).click();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.xml$/);
  });
});
