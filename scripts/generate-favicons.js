const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'app');

// Create SVG with the TJ logo
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0F172A" rx="64"/>
  <text x="256" y="380" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="380" fill="#3B82F6">TJ</text>
</svg>`;

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgLogo);

  // Generate PNG favicons
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'icon.png', size: 512 },  // For app directory
  ];

  for (const { name, size } of sizes) {
    const outputPath = name === 'icon.png' ? path.join(appDir, name) : path.join(publicDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  // Generate ICO file (using 16, 32, 48 sizes combined)
  // Sharp doesn't support ICO natively, so we'll create a PNG that can be used
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated: favicon.png (48x48)');

  // Copy to app directory for Next.js App Router
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'favicon.ico'));
  console.log('Generated: app/favicon.ico');

  console.log('\\nAll favicons generated successfully!');
  console.log('\\nNote: For a proper .ico file with multiple sizes, use an online converter or install ico-endec');
}

generateFavicons().catch(console.error);
