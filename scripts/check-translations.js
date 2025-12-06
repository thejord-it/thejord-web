const fs = require('fs');
const path = require('path');

// Read translation files
const enPath = path.join(__dirname, '..', 'messages', 'en.json');
const itPath = path.join(__dirname, '..', 'messages', 'it.json');

const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const itTranslations = JSON.parse(fs.readFileSync(itPath, 'utf-8'));

// Get all keys from an object
function getKeys(obj, prefix = '') {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Get nested value from object by dot-separated key path
function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

// Read all tool components
const componentsDir = path.join(__dirname, '..', 'components', 'tools', 'pages');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const namespaceRegex = /useTranslations\(['"]([^'"]+)['"]\)/;
const tCallRegex = /\bt\(['"]([^'"]+)['"]\)/g;

console.log('\n=== Translation Check ===\n');

let foundIssues = false;

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract namespace from useTranslations call
  const namespaceMatch = namespaceRegex.exec(content);
  if (!namespaceMatch) {
    console.log(`${file}: No useTranslations found, skipping`);
    continue;
  }

  const namespace = namespaceMatch[1]; // e.g., "toolPages.jsonSchema"
  const namespaceObj = getNestedValue(enTranslations, namespace);

  if (!namespaceObj) {
    foundIssues = true;
    console.log(`${file}: Namespace '${namespace}' NOT FOUND in en.json!`);
    continue;
  }

  const existingKeys = new Set(Object.keys(namespaceObj));

  // Find all t() calls
  const matches = [];
  let match;
  while ((match = tCallRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }

  // Check for missing keys
  const missing = [];
  for (const key of matches) {
    // Skip nested keys like 'tabs.format' - just check first level for now
    const rootKey = key.split('.')[0];
    if (!existingKeys.has(rootKey)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    foundIssues = true;
    console.log(`\n${file} (namespace: ${namespace}):`);
    for (const key of missing) {
      console.log(`  MISSING: t('${key}')`);
    }
  }
}

// Check for keys in en.json toolPages but not in it.json toolPages
const enToolPages = getKeys(enTranslations.toolPages || {});
const itToolPages = getKeys(itTranslations.toolPages || {});
const enSet = new Set(enToolPages);
const itSet = new Set(itToolPages);

const enOnly = enToolPages.filter(k => !itSet.has(k));
const itOnly = itToolPages.filter(k => !enSet.has(k));

if (enOnly.length > 0) {
  foundIssues = true;
  console.log('\n\nKeys in EN toolPages but NOT in IT:');
  for (const key of enOnly) {
    console.log(`  - ${key}`);
  }
}

if (itOnly.length > 0) {
  foundIssues = true;
  console.log('\n\nKeys in IT toolPages but NOT in EN:');
  for (const key of itOnly) {
    console.log(`  - ${key}`);
  }
}

if (!foundIssues) {
  console.log('All translations are in sync!');
}

console.log('\n');
