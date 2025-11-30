import { test, expect } from '@playwright/test';

test.describe('Markdown Converter E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/markdown-converter');
    await page.waitForLoadState('networkidle');
  });

  test('should load the markdown converter page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Markdown to HTML');
  });

  test('should have markdown input and HTML output areas', async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter your Markdown/i)).toBeVisible();
    await expect(page.getByPlaceholder(/HTML will appear/i)).toBeVisible();
  });

  test('should convert markdown to HTML in real-time', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('# Hello World');
    await page.waitForTimeout(500);

    const output = page.getByPlaceholder(/HTML will appear/i);
    const htmlContent = await output.inputValue();
    expect(htmlContent).toContain('<h1>');
    expect(htmlContent).toContain('Hello World');
  });

  test('should load example markdown', async ({ page }) => {
    await page.getByRole('button', { name: /Load Example/i }).click();
    await page.waitForTimeout(500);

    const input = page.getByPlaceholder(/Enter your Markdown/i);
    const value = await input.inputValue();
    expect(value).toContain('# Markdown Example');
  });

  test('should convert bold and italic text', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('**bold** and *italic*');
    await page.waitForTimeout(500);

    const output = page.getByPlaceholder(/HTML will appear/i);
    const htmlContent = await output.inputValue();
    expect(htmlContent).toContain('<strong>bold</strong>');
    expect(htmlContent).toContain('<em>italic</em>');
  });

  test('should convert code blocks', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('```javascript\nconst x = 1;\n```');
    await page.waitForTimeout(500);

    const output = page.getByPlaceholder(/HTML will appear/i);
    const htmlContent = await output.inputValue();
    expect(htmlContent).toContain('<code');
  });

  test('should convert links', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('[Link Text](https://example.com)');
    await page.waitForTimeout(500);

    const output = page.getByPlaceholder(/HTML will appear/i);
    const htmlContent = await output.inputValue();
    expect(htmlContent).toContain('<a href="https://example.com"');
    expect(htmlContent).toContain('Link Text');
  });

  test('should copy HTML to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('# Test');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /Copy HTML/i }).click();
    await page.waitForTimeout(300);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('<h1>');
  });

  test('should clear all content', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('# Test');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /Clear All/i }).click();
    await page.waitForTimeout(300);

    await expect(input).toHaveValue('');
  });

  test('should show stats', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('# Hello');
    await page.waitForTimeout(500);

    await expect(page.locator('text=Markdown Length')).toBeVisible();
    await expect(page.locator('text=HTML Length')).toBeVisible();
  });

  test('should display syntax reference', async ({ page }) => {
    await expect(page.locator('text=Markdown Syntax Quick Reference')).toBeVisible();
    await expect(page.locator('text=# H1')).toBeVisible();
  });

  test('should have Copy button disabled when no content', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /Copy HTML/i });
    await expect(copyButton).toBeDisabled();
  });

  test('should convert lists', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your Markdown/i);
    await input.fill('- Item 1\n- Item 2\n- Item 3');
    await page.waitForTimeout(500);

    const output = page.getByPlaceholder(/HTML will appear/i);
    const htmlContent = await output.inputValue();
    expect(htmlContent).toContain('<ul>');
    expect(htmlContent).toContain('<li>');
  });
});
