// JSON to CSV converter
export function jsonToCSV(json: any): string {
  const data = Array.isArray(json) ? json : [json];

  if (data.length === 0) {
    return '';
  }

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(obj => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);

  // Escape CSV values
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => escapeCSV(row[header])).join(',')
    )
  ];

  return csvRows.join('\n');
}

// JSON to XML converter
export function jsonToXML(json: any, rootName: string = 'root'): string {
  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const convert = (obj: any, indent: string = ''): string => {
    if (obj === null) return '';

    if (typeof obj !== 'object') {
      return escapeXML(String(obj));
    }

    if (Array.isArray(obj)) {
      return obj.map(item => `${indent}<item>\n${convert(item, indent + '  ')}\n${indent}</item>`).join('\n');
    }

    return Object.entries(obj).map(([key, value]) => {
      const tagName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          return `${indent}<${tagName}>\n${convert(value, indent + '  ')}\n${indent}</${tagName}>`;
        }
        return `${indent}<${tagName}>\n${convert(value, indent + '  ')}\n${indent}</${tagName}>`;
      }
      return `${indent}<${tagName}>${escapeXML(String(value))}</${tagName}>`;
    }).join('\n');
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${convert(json, '  ')}\n</${rootName}>`;
}

// JSON to YAML converter
export function jsonToYAML(json: any, indent: number = 2): string {
  const spaces = ' '.repeat(indent);

  const convert = (obj: any, level: number = 0): string => {
    const nextIndent = spaces.repeat(level + 1);

    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') {
      // Quote strings that contain special characters or start with special chars
      if (obj.includes(':') || obj.includes('#') || obj.includes('\n') || /^[&*!|>@`]/.test(obj)) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return '\n' + obj.map(item => {
        const value = convert(item, level + 1);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return `${nextIndent}-${value.substring(nextIndent.length)}`;
        }
        return `${nextIndent}- ${value}`;
      }).join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';

      return '\n' + entries.map(([key, value]) => {
        const convertedValue = convert(value, level + 1);
        if (typeof value === 'object' && value !== null) {
          return `${nextIndent}${key}:${convertedValue}`;
        }
        return `${nextIndent}${key}: ${convertedValue}`;
      }).join('\n');
    }

    return String(obj);
  };

  const result = convert(json, 0);
  return result.startsWith('\n') ? result.substring(1) : result;
}

// JSON to TypeScript interface generator
export function jsonToTypeScript(json: any, interfaceName: string = 'Root'): string {
  const getType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      const firstType = getType(value[0]);
      return `${firstType}[]`;
    }
    if (typeof value === 'object') return interfaceName;
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'any';
  };

  const generateInterface = (obj: any, name: string, level: number = 0): string => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return '';
    }

    const indent = '  '.repeat(level);
    const props = Object.entries(obj).map(([key, value]) => {
      const type = getType(value);
      return `${indent}  ${key}: ${type};`;
    }).join('\n');

    return `${indent}interface ${name} {\n${props}\n${indent}}`;
  };

  return generateInterface(json, interfaceName, 0);
}
