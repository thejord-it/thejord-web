export interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
}

export const REGEX_PATTERNS: RegexPattern[] = [
  // Email
  {
    name: 'Email (Basic)',
    pattern: '^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Basic email validation',
    category: 'Email',
    example: 'user@example.com'
  },
  {
    name: 'Email (RFC 5322)',
    pattern: '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
    description: 'RFC 5322 compliant email',
    category: 'Email',
    example: 'user.name+tag@example.co.uk'
  },

  // Italian Fiscal
  {
    name: 'Codice Fiscale',
    pattern: '^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$',
    description: 'Italian tax code (Codice Fiscale)',
    category: 'Italian',
    example: 'RSSMRA80A01H501U'
  },
  {
    name: 'Partita IVA',
    pattern: '^[0-9]{11}$',
    description: 'Italian VAT number (Partita IVA)',
    category: 'Italian',
    example: '12345678901'
  },

  // URLs
  {
    name: 'URL (HTTP/HTTPS)',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: 'HTTP/HTTPS URL validation',
    category: 'URL',
    example: 'https://www.example.com/path?query=value'
  },
  {
    name: 'URL (Any Protocol)',
    pattern: '^[a-zA-Z][a-zA-Z0-9+.-]*:\\/\\/[^\\s]+$',
    description: 'Any protocol URL',
    category: 'URL',
    example: 'ftp://files.example.com/data.zip'
  },

  // IP Addresses
  {
    name: 'IPv4',
    pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'IPv4 address',
    category: 'Network',
    example: '192.168.1.1'
  },
  {
    name: 'IPv6',
    pattern: '^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})$',
    description: 'IPv6 address',
    category: 'Network',
    example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
  },
  {
    name: 'IPv4 CIDR',
    pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[12]?[0-9])$',
    description: 'IPv4 CIDR notation',
    category: 'Network',
    example: '192.168.1.0/24'
  },

  // Credit Cards
  {
    name: 'Visa Card',
    pattern: '^4[0-9]{12}(?:[0-9]{3})?$',
    description: 'Visa credit card (13 or 16 digits)',
    category: 'Finance',
    example: '4532015112830366'
  },
  {
    name: 'Mastercard',
    pattern: '^5[1-5][0-9]{14}$',
    description: 'Mastercard credit card',
    category: 'Finance',
    example: '5425233430109903'
  },
  {
    name: 'American Express',
    pattern: '^3[47][0-9]{13}$',
    description: 'American Express card',
    category: 'Finance',
    example: '374245455400126'
  },
  {
    name: 'IBAN',
    pattern: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$',
    description: 'International Bank Account Number',
    category: 'Finance',
    example: 'GB82WEST12345698765432'
  },

  // Phone Numbers
  {
    name: 'Phone (International)',
    pattern: '^\\+?[1-9]\\d{1,14}$',
    description: 'International phone number (E.164)',
    category: 'Phone',
    example: '+393451234567'
  },
  {
    name: 'Phone (US)',
    pattern: '^(\\+1)?[-.●]?\\(?([0-9]{3})\\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$',
    description: 'US phone number',
    category: 'Phone',
    example: '(555) 123-4567'
  },
  {
    name: 'Phone (Italian)',
    pattern: '^(\\+39)?\\s?3\\d{2}\\s?\\d{6,7}$',
    description: 'Italian mobile phone',
    category: 'Phone',
    example: '+39 345 1234567'
  },

  // Dates
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    description: 'ISO 8601 date format',
    category: 'Date/Time',
    example: '2024-12-31'
  },
  {
    name: 'Date (DD/MM/YYYY)',
    pattern: '^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$',
    description: 'European date format',
    category: 'Date/Time',
    example: '31/12/2024'
  },
  {
    name: 'Time (24h)',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
    description: '24-hour time format',
    category: 'Date/Time',
    example: '23:59'
  },

  // Common Patterns
  {
    name: 'UUID v4',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    description: 'UUID version 4',
    category: 'Identifiers',
    example: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    name: 'Hex Color',
    pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
    description: 'Hexadecimal color code',
    category: 'Web',
    example: '#FF5733'
  },
  {
    name: 'Username',
    pattern: '^[a-zA-Z0-9_-]{3,16}$',
    description: 'Alphanumeric username (3-16 chars)',
    category: 'Common',
    example: 'user_name-123'
  },
  {
    name: 'Strong Password',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description: 'Password with uppercase, lowercase, number, and special char',
    category: 'Security',
    example: 'MyP@ssw0rd!'
  },
  {
    name: 'MAC Address',
    pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
    description: 'MAC address (with : or -)',
    category: 'Network',
    example: 'AA:BB:CC:DD:EE:FF'
  },
  {
    name: 'Domain Name',
    pattern: '^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.([A-Za-z]{2,}|xn--[A-Za-z0-9]+)$',
    description: 'Valid domain name',
    category: 'Web',
    example: 'example.com'
  },
  {
    name: 'JWT Token',
    pattern: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$',
    description: 'JSON Web Token structure',
    category: 'Security',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123'
  },
];

export const CATEGORIES = Array.from(new Set(REGEX_PATTERNS.map(p => p.category))).sort();
