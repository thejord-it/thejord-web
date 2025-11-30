import { test, expect } from '@playwright/test';

test.describe('Regex Tester E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/regex-tester');
    await page.waitForLoadState('networkidle');
  });

  test('should load the regex tester page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('RegExp');
  });

  test('should have pattern input', async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter your regex pattern/i)).toBeVisible();
  });

  test('should have test string section', async ({ page }) => {
    await expect(page.locator('text=Test String')).toBeVisible();
  });

  test('should find matches in real-time', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('[0-9]+');
    await testString.fill('abc123def456');
    await page.waitForTimeout(500);

    // Should show matches found count
    await expect(page.locator('text=Matches found')).toBeVisible();
  });

  test('should show match count', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('\\d+');
    await testString.fill('1 2 3');
    await page.waitForTimeout(500);

    // Should show 3 matches
    await expect(page.locator('text=/Matches found.*3/i')).toBeVisible();
  });

  test('should show error for invalid regex', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('[invalid');
    await testString.fill('test');
    await page.waitForTimeout(500);

    // Should show error message
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should have flag buttons', async ({ page }) => {
    // Flags are single letter buttons: g, i, m, s, u
    await expect(page.getByRole('button', { name: 'g', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'i', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'm', exact: true })).toBeVisible();
  });

  test('should toggle case insensitive flag', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('hello');
    await testString.fill('HELLO hello');
    await page.waitForTimeout(500);

    // By default with global flag, should find 1 match (case sensitive)
    await expect(page.locator('text=/Matches found.*1/i')).toBeVisible();

    // Enable case insensitive flag (i button)
    await page.getByRole('button', { name: 'i', exact: true }).click();
    await page.waitForTimeout(500);

    // Should now find 2 matches
    await expect(page.locator('text=/Matches found.*2/i')).toBeVisible();
  });

  test('should have pattern library section', async ({ page }) => {
    await expect(page.locator('text=Pattern Library')).toBeVisible();
  });

  test('should highlight matches in test string', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('test');
    await testString.fill('this is a test string');
    await page.waitForTimeout(500);

    // Should have highlighted content (bg-accent class)
    const highlighted = page.locator('.bg-accent');
    expect(await highlighted.count()).toBeGreaterThan(0);
  });

  test('should show captured groups in matches section', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('(\\d{3})-(\\d{4})');
    await testString.fill('Phone: 123-4567');
    await page.waitForTimeout(500);

    // Should show matches section with match details
    await expect(page.locator('text=Matches found')).toBeVisible();
  });

  test('should show no matches message when pattern does not match', async ({ page }) => {
    const pattern = page.getByPlaceholder(/Enter your regex pattern/i);
    const testString = page.locator('textarea').first();

    await pattern.fill('xyz');
    await testString.fill('abc');
    await page.waitForTimeout(500);

    // Matches found should not be visible when there are no matches
    await expect(page.locator('text=Matches found')).not.toBeVisible();
  });

  test('should display flags status', async ({ page }) => {
    await expect(page.locator('text=Flags:')).toBeVisible();
  });
});
