import { test, expect } from '@playwright/test';

test.describe('Base64 File Detection E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/base64');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  // Helper function to test file detection
  async function testFileDetection(page: any, base64Data: string, expectedType: string) {
    // Switch to decode mode
    await page.getByRole('button', { name: '🔓 Decode' }).first().click();

    // Input the Base64 string
    const input = page.getByPlaceholder(/Enter Base64 string to decode/i);
    await input.click();
    await input.fill(base64Data);

    // Click decode button
    await page.getByRole('button', { name: '🔓 Decode' }).nth(1).click();

    // Wait for detection to complete
    await page.waitForTimeout(1000);

    // Check output contains expected file type (in the output textarea)
    const output = page.getByPlaceholder(/Output will appear here/i);
    await expect(output).toHaveValue(new RegExp(expectedType, 'i'));
  }

  test.describe('Image Formats', () => {
    test('should detect PNG images', async ({ page }) => {
      const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      await testFileDetection(page, pngBase64, 'PNG Image');
    });

    test('should detect JPEG images', async ({ page }) => {
      const jpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
      await testFileDetection(page, jpegBase64, 'JPEG Image');
    });

    test('should detect GIF images', async ({ page }) => {
      const gifBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      await testFileDetection(page, gifBase64, 'GIF Image');
    });

    test('should detect BMP images', async ({ page }) => {
      const bmpBase64 = 'Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A';
      await testFileDetection(page, bmpBase64, 'BMP Image');
    });

    test('should detect WebP images', async ({ page }) => {
      const webpBase64 = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      await testFileDetection(page, webpBase64, 'WebP Image');
    });
  });

  test.describe('Document Formats', () => {
    test('should detect PDF documents', async ({ page }) => {
      // Minimal PDF (empty file)
      const pdfBase64 = 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAo+Pgo+Pgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDE1IDAwMDAwIG4NCjAwMDAwMDAwNzQgMDAwMDAgbg0KMDAwMDAwMDEzMSAwMDAwMCBuDQowMDAwMDAwMjczIDAwMDAwIG4NCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzY1CiUlRU9G';
      await testFileDetection(page, pdfBase64, 'PDF Document');
    });

    test('should detect ZIP archives', async ({ page }) => {
      // Minimal ZIP with proper magic bytes PK\x03\x04
      const zipBase64 = 'UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAB4';
      await testFileDetection(page, zipBase64, 'ZIP Archive');
    });
  });

  test.describe('Audio Formats', () => {
    test('should detect MP3 audio', async ({ page }) => {
      // Minimal MP3 with ID3 tag - ID3 magic bytes
      const mp3Base64 = 'SUQzAAAAAAAAAA==';
      await testFileDetection(page, mp3Base64, 'MP3 Audio');
    });
  });

  test.describe('Video Formats', () => {
    test('should detect MP4 video', async ({ page }) => {
      // Minimal MP4 container
      const mp4Base64 = 'AAAAGGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAAhm';
      await testFileDetection(page, mp4Base64, 'MP4 Video');
    });
  });

  test.describe('Archive Formats', () => {
    test('should detect RAR archives', async ({ page }) => {
      // Minimal RAR with proper magic bytes
      const rarBase64 = 'UmFyIRoHAAAAAA==';
      await testFileDetection(page, rarBase64, 'RAR Archive');
    });

    test('should detect GZIP archives', async ({ page }) => {
      const gzipBase64 = 'H4sIAAAAAAAAAwvJyCxWAKJEhZLU4hIAoxwpDwsAAAA=';
      await testFileDetection(page, gzipBase64, 'GZIP Archive');
    });

    test('should detect 7-Zip archives', async ({ page }) => {
      // Minimal 7-Zip with proper magic bytes: 0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C
      const sevenZipBase64 = 'N3q8ryccAAAAAA==';
      await testFileDetection(page, sevenZipBase64, '7-Zip Archive');
    });
  });

  test.describe('Text and Binary Fallback', () => {
    test('should detect plain text', async ({ page }) => {
      const textBase64 = btoa('Hello World! This is plain text content.');

      await page.getByRole('button', { name: '🔓 Decode' }).first().click();
      const input = page.getByPlaceholder(/Enter Base64 string to decode/i);
      await input.click();
      await input.fill(textBase64);
      await page.getByRole('button', { name: '🔓 Decode' }).nth(1).click();
      await page.waitForTimeout(500);

      // Should decode to text, not show as binary
      const output = page.getByPlaceholder(/Output will appear here/i);
      await expect(output).toHaveValue(/Hello World/);
    });

    test('should detect binary files with unknown signature', async ({ page }) => {
      // Random binary data that doesn't match any signature
      const binaryBase64 = 'WFlaABCDEFGHIJKLMNOPQRSTUVWXYZ';

      await page.getByRole('button', { name: '🔓 Decode' }).first().click();
      const input = page.getByPlaceholder(/Enter Base64 string to decode/i);
      await input.click();
      await input.fill(binaryBase64);
      await page.getByRole('button', { name: '🔓 Decode' }).nth(1).click();
      await page.waitForTimeout(500);

      // Should show as binary file
      const output = page.getByPlaceholder(/Output will appear here/i);
      await expect(output).toHaveValue(/Binary.*File/i);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid Base64 data gracefully', async ({ page }) => {
      // Invalid Base64 string (contains invalid characters)
      const invalidBase64 = 'This is not valid Base64!!!';

      await page.getByRole('button', { name: '🔓 Decode' }).first().click();
      const input = page.getByPlaceholder(/Enter Base64 string to decode/i);
      await input.click();
      await input.fill(invalidBase64);
      await page.getByRole('button', { name: '🔓 Decode' }).nth(1).click();
      await page.waitForTimeout(500);

      // Should show an error message (not in textarea, but in error div)
      // For now just verify the output is empty (error is shown elsewhere)
      const output = page.getByPlaceholder(/Output will appear here/i);
      await expect(output).toBeEmpty();
    });

    test('should handle data URLs correctly', async ({ page }) => {
      const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      await page.getByRole('button', { name: '🔓 Decode' }).first().click();
      const input = page.getByPlaceholder(/Enter Base64 string to decode/i);
      await input.click();
      await input.fill(dataURL);
      await page.getByRole('button', { name: '🔓 Decode' }).nth(1).click();
      await page.waitForTimeout(500);

      // Should strip data URL prefix and detect PNG
      const output = page.getByPlaceholder(/Output will appear here/i);
      await expect(output).toHaveValue(/PNG Image/i);
    });
  });
});
