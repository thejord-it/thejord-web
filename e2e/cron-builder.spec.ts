import { test, expect } from '@playwright/test';

test.describe('Cron Expression Builder E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/cron-builder');
    // Wait for React hydration to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should load the cron builder page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Cron Expression Builder');
    await expect(page.locator('text=Build and validate cron schedules')).toBeVisible();
  });

  test('should display default cron expression', async ({ page }) => {
    const expression = page.locator('code:has-text("* * * * *")').first();
    await expect(expression).toBeVisible();
  });

  test('should update expression when changing minute field', async ({ page }) => {
    // Change minute field to "0"
    const minuteInput = page.locator('input').first();
    await minuteInput.fill('0');

    // Check that expression updated
    await page.waitForTimeout(500);
    const expression = page.locator('code').first();
    const text = await expression.textContent();
    expect(text).toContain('0 * * * *');
  });

  test('should apply pattern from pattern library', async ({ page }) => {
    // Switch to Pattern Library tab (use regex for emoji+text)
    await page.locator('button:has-text("Pattern Library")').click();

    // Click on "Every day at midnight" pattern
    await page.locator('button:has-text("Every day at midnight")').click();

    // Verify expression changed to "0 0 * * *"
    await page.waitForTimeout(500);
    const expression = page.locator('code').first();
    await expect(expression).toContainText('0 0 * * *');
  });

  test('should validate and show errors for invalid expression', async ({ page }) => {
    // Switch to Direct Input tab (use text match for emoji+text)
    await page.locator('button:has-text("Direct Input")').click();

    // Enter invalid expression
    const directInput = page.locator('input[placeholder="* * * * *"]');
    await directInput.fill('60 * * * *'); // Invalid minute (60 > 59)

    // Check for validation error (look for error styling/list)
    await page.waitForTimeout(500);
    await expect(page.locator('.bg-red-500\\/10')).toBeVisible();
    await expect(page.locator('li.text-red-400').first()).toBeVisible();
  });

  test('should show next execution times for valid expression', async ({ page }) => {
    // Default expression "* * * * *" should show next executions (check for h3 header)
    await expect(page.locator('h3').filter({ hasText: /Executions/i }).first()).toBeVisible();

    // Should have 5 execution times listed (look for list items with timestamps)
    const executions = page.locator('li.text-text-primary');
    await expect(executions.first()).toBeVisible();
  });

  test('should copy expression to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click copy button (use text match for emoji+text)
    await page.locator('button:has-text("Copy")').first().click();

    // Verify button shows success state
    await expect(page.locator('button:has-text("Copied")').first()).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('* * * * *');
  });

  test('should clear all fields', async ({ page }) => {
    // Change first field
    const minuteInput = page.locator('input').first();
    await minuteInput.fill('15');
    await page.waitForTimeout(300);

    // Verify expression changed
    let expression = await page.locator('code').first().textContent();
    expect(expression).toContain('15');

    // Click clear button (use text match for emoji+text)
    await page.locator('button:has-text("Clear")').click();
    await page.waitForTimeout(300);

    // Verify expression reset to default
    expression = await page.locator('code').first().textContent();
    expect(expression).toBe('* * * * *');
  });

  test('should show human-readable description', async ({ page }) => {
    // Switch to Direct Input tab (use text match)
    await page.locator('button:has-text("Direct Input")').click();

    // Enter "0 0 * * *" (every day at midnight)
    const directInput = page.locator('input[placeholder="* * * * *"]');
    await directInput.fill('0 0 * * *');
    await page.waitForTimeout(500);

    // Check for description section - use h3 with translation key text
    await expect(page.locator('h3').filter({ hasText: /Description/i }).first()).toBeVisible();
  });

  test('should display special characters guide', async ({ page }) => {
    await expect(page.locator('h2:has-text("Special Characters Guide")')).toBeVisible();
    await expect(page.locator('text=Wildcard')).toBeVisible();
    await expect(page.locator('text=List')).toBeVisible();
    await expect(page.locator('text=Range')).toBeVisible();
    await expect(page.locator('text=Step')).toBeVisible();
  });

  test('should display cron format reference table', async ({ page }) => {
    // Check for table with reference info (translations may vary)
    await expect(page.locator('table')).toBeVisible();
    // Check that table has content by looking for range values that don't change
    await expect(page.locator('td:has-text("0-59")')).toBeVisible();
    await expect(page.locator('td:has-text("0-23")')).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    // Start on Visual Builder - check for active state
    await expect(page.locator('button:has-text("Visual Builder")')).toHaveClass(/text-primary/);

    // Switch to Direct Input
    await page.locator('button:has-text("Direct Input")').click();
    await expect(page.locator('button:has-text("Direct Input")')).toHaveClass(/text-primary/);
    await expect(page.locator('input[placeholder="* * * * *"]')).toBeVisible();

    // Switch to Pattern Library
    await page.locator('button:has-text("Pattern Library")').click();
    await expect(page.locator('button:has-text("Pattern Library")')).toHaveClass(/text-primary/);
    // Check for pattern buttons instead of specific translated text
    await expect(page.locator('button:has-text("Every minute")').first()).toBeVisible();
  });

  test('should validate all cron fields correctly', async ({ page }) => {
    // Test invalid hour
    const hourInput = page.locator('input').nth(1);
    await hourInput.fill('25'); // Invalid: hour must be 0-23

    // Switch to see validation (use text match)
    await page.locator('button:has-text("Direct Input")').click();
    await page.waitForTimeout(500);

    // Should show validation error (check for error styling)
    await expect(page.locator('.bg-red-500\\/10')).toBeVisible();
  });

  test('should handle complex cron expressions', async ({ page }) => {
    // Switch to Direct Input (use text match)
    await page.locator('button:has-text("Direct Input")').click();

    // Enter complex expression: every 5 minutes during business hours on weekdays
    const directInput = page.locator('input[placeholder="* * * * *"]');
    await directInput.fill('*/5 9-17 * * 1-5');
    await page.waitForTimeout(500);

    // Should be valid (no error styling visible)
    await expect(page.locator('.bg-red-500\\/10')).not.toBeVisible();

    // Should show next executions (check for list items with dates)
    await expect(page.locator('li.text-text-primary').first()).toBeVisible();
  });
});
