import { test, expect } from '@playwright/test';

test.describe('Color Converter E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/color-converter');
    await page.waitForLoadState('networkidle');
  });

  test('should load the color converter page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Color Picker');
    await expect(page.locator('text=Pick colors and convert')).toBeVisible();
  });

  test('should display default color formats', async ({ page }) => {
    // Check all format labels are visible
    await expect(page.locator('text=HEX').first()).toBeVisible();
    await expect(page.locator('text=RGB').first()).toBeVisible();
    await expect(page.locator('text=HSL').first()).toBeVisible();
    await expect(page.locator('text=CMYK').first()).toBeVisible();
  });

  test('should update color formats when hex input changes', async ({ page }) => {
    // Find the hex text input
    const hexInput = page.locator('input[type="text"]');
    await hexInput.fill('#FF0000');
    await page.waitForTimeout(500);

    // Check that RGB shows red values
    const rgbCode = page.locator('code:has-text("rgb(255")');
    await expect(rgbCode).toBeVisible();
  });

  test('should have working color picker', async ({ page }) => {
    const colorPicker = page.locator('input[type="color"]');
    await expect(colorPicker).toBeVisible();
  });

  test('should display preset colors', async ({ page }) => {
    await expect(page.locator('text=Preset Colors')).toBeVisible();
    // Check that preset color buttons exist
    const presetButtons = page.locator('button[title^="#"]');
    await expect(presetButtons.first()).toBeVisible();
  });

  test('should change color when preset is clicked', async ({ page }) => {
    // Click on a preset color
    const presetButton = page.locator('button[title="#FF6B6B"]');
    await presetButton.click();
    await page.waitForTimeout(500);

    // Check hex input changed
    const hexInput = page.locator('input[type="text"]');
    await expect(hexInput).toHaveValue('#FF6B6B');
  });

  test('should copy color format to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click copy button on HEX format
    const copyButtons = page.locator('button:has-text("Copy")');
    await copyButtons.first().click();

    // Verify clipboard contains color value
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^#[A-F0-9]{6}$/i);
  });

  test('should display color format guide', async ({ page }) => {
    // Check for format guide section (uses translations, so match by structure)
    // The section contains HEX, RGB, HSL, CMYK descriptions
    await expect(page.locator('strong.text-blue-400:has-text("HEX")')).toBeVisible();
    await expect(page.locator('strong.text-green-400:has-text("RGB")')).toBeVisible();
  });

  test('should update all formats simultaneously', async ({ page }) => {
    const hexInput = page.locator('input[type="text"]');
    await hexInput.fill('#00FF00');
    await page.waitForTimeout(500);

    // Check all formats updated
    await expect(page.locator('code:has-text("#00FF00")')).toBeVisible();
    await expect(page.locator('code:has-text("rgb(0, 255, 0)")')).toBeVisible();
  });
});
