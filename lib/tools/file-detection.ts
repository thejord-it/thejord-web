// Magic bytes for common file types
interface FileSignature {
  bytes: number[];
  mime: string;
  extension: string;
  description: string;
}

const FILE_SIGNATURES: FileSignature[] = [
  // Images
  { bytes: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg', extension: 'jpg', description: 'JPEG Image' },
  { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mime: 'image/png', extension: 'png', description: 'PNG Image' },
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], mime: 'image/gif', extension: 'gif', description: 'GIF Image (87a)' },
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], mime: 'image/gif', extension: 'gif', description: 'GIF Image (89a)' },
  { bytes: [0x42, 0x4D], mime: 'image/bmp', extension: 'bmp', description: 'BMP Image' },
  { bytes: [0x49, 0x49, 0x2A, 0x00], mime: 'image/tiff', extension: 'tif', description: 'TIFF Image (little endian)' },
  { bytes: [0x4D, 0x4D, 0x00, 0x2A], mime: 'image/tiff', extension: 'tif', description: 'TIFF Image (big endian)' },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: 'image/webp', extension: 'webp', description: 'WebP Image' },
  { bytes: [0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20], mime: 'image/jp2', extension: 'jp2', description: 'JPEG 2000' },

  // Documents
  { bytes: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf', extension: 'pdf', description: 'PDF Document' },
  { bytes: [0x50, 0x4B, 0x03, 0x04], mime: 'application/zip', extension: 'zip', description: 'ZIP Archive / Office Document' },
  { bytes: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], mime: 'application/msword', extension: 'doc', description: 'Microsoft Office Document (old)' },

  // Archives
  { bytes: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07], mime: 'application/x-rar-compressed', extension: 'rar', description: 'RAR Archive' },
  { bytes: [0x1F, 0x8B], mime: 'application/gzip', extension: 'gz', description: 'GZIP Archive' },
  { bytes: [0x42, 0x5A, 0x68], mime: 'application/x-bzip2', extension: 'bz2', description: 'BZIP2 Archive' },
  { bytes: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], mime: 'application/x-7z-compressed', extension: '7z', description: '7-Zip Archive' },

  // Audio
  { bytes: [0x49, 0x44, 0x33], mime: 'audio/mpeg', extension: 'mp3', description: 'MP3 Audio (ID3)' },
  { bytes: [0xFF, 0xFB], mime: 'audio/mpeg', extension: 'mp3', description: 'MP3 Audio' },
  { bytes: [0x66, 0x4C, 0x61, 0x43], mime: 'audio/flac', extension: 'flac', description: 'FLAC Audio' },
  { bytes: [0x4F, 0x67, 0x67, 0x53], mime: 'audio/ogg', extension: 'ogg', description: 'OGG Audio' },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: 'audio/wav', extension: 'wav', description: 'WAV Audio' },

  // Video
  { bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], mime: 'video/mp4', extension: 'mp4', description: 'MP4 Video' },
  { bytes: [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70], mime: 'video/mp4', extension: 'mp4', description: 'MP4 Video' },
  { bytes: [0x1A, 0x45, 0xDF, 0xA3], mime: 'video/webm', extension: 'webm', description: 'WebM Video' },
  { bytes: [0x46, 0x4C, 0x56], mime: 'video/x-flv', extension: 'flv', description: 'FLV Video' },

  // Executable
  { bytes: [0x4D, 0x5A], mime: 'application/x-msdownload', extension: 'exe', description: 'Windows Executable' },
  { bytes: [0x7F, 0x45, 0x4C, 0x46], mime: 'application/x-executable', extension: 'elf', description: 'Linux Executable' },

  // Other
  { bytes: [0x3C, 0x3F, 0x78, 0x6D, 0x6C], mime: 'application/xml', extension: 'xml', description: 'XML Document' },
  { bytes: [0x7B], mime: 'application/json', extension: 'json', description: 'JSON Document (possible)' },
];

export interface DetectedFileType {
  mime: string;
  extension: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

export function detectFileType(data: string): DetectedFileType | null {
  try {
    // Convert base64 to binary
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Debug: Log first 16 bytes
    console.log('First 16 bytes:', Array.from(bytes.slice(0, 16)).map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(', '));

    // Check against known signatures
    for (const signature of FILE_SIGNATURES) {
      if (matchesSignature(bytes, signature.bytes)) {
        console.log('Matched signature:', signature.description);
        return {
          mime: signature.mime,
          extension: signature.extension,
          description: signature.description,
          confidence: 'high'
        };
      }
    }

    console.log('No magic byte signature matched, checking text format...');

    // Calculate binary vs text ratio before text detection
    const printableChars = binaryString.match(/[\x20-\x7E\n\r\t]/g);
    const printableRatio = printableChars ? printableChars.length / binaryString.length : 0;
    console.log('Printable ratio:', printableRatio);

    // If mostly non-printable, it's probably binary
    if (printableRatio < 0.7) {
      console.log('Low printable ratio, assuming binary');
      return {
        mime: 'application/octet-stream',
        extension: 'bin',
        description: 'Binary File',
        confidence: 'medium'
      };
    }

    // Try to detect text-based formats
    const textCheck = detectTextFormat(binaryString);
    if (textCheck) {
      return textCheck;
    }

    return null;
  } catch (error) {
    console.error('Error in detectFileType:', error);
    return null;
  }
}

function matchesSignature(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;

  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) return false;
  }

  return true;
}

function detectTextFormat(text: string): DetectedFileType | null {
  // Check if it's valid UTF-8 text
  const printableChars = text.match(/[\x20-\x7E\n\r\t]/g);
  const printableRatio = printableChars ? printableChars.length / text.length : 0;

  if (printableRatio < 0.7) {
    return null; // Likely binary, not text
  }

  // Try to detect specific text formats
  const trimmed = text.trim();

  // HTML
  if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) {
    return {
      mime: 'text/html',
      extension: 'html',
      description: 'HTML Document',
      confidence: 'high'
    };
  }

  // JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return {
        mime: 'application/json',
        extension: 'json',
        description: 'JSON Document',
        confidence: 'high'
      };
    } catch {
      // Not valid JSON
    }
  }

  // XML
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
    return {
      mime: 'application/xml',
      extension: 'xml',
      description: 'XML/Text Document',
      confidence: 'medium'
    };
  }

  // CSV
  if (text.includes(',') && text.includes('\n')) {
    const lines = text.split('\n');
    if (lines.length > 1 && lines[0].includes(',')) {
      return {
        mime: 'text/csv',
        extension: 'csv',
        description: 'CSV Document',
        confidence: 'medium'
      };
    }
  }

  // Plain text
  return {
    mime: 'text/plain',
    extension: 'txt',
    description: 'Plain Text',
    confidence: 'low'
  };
}

export function getFileIcon(mime: string): string {
  if (mime.startsWith('image/')) return '🖼️';
  if (mime.startsWith('video/')) return '🎬';
  if (mime.startsWith('audio/')) return '🎵';
  if (mime.includes('pdf')) return '📄';
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('7z') || mime.includes('gzip')) return '📦';
  if (mime.includes('json')) return '📋';
  if (mime.includes('xml') || mime.includes('html')) return '📝';
  if (mime.includes('executable') || mime.includes('msdownload')) return '⚙️';
  if (mime.startsWith('text/')) return '📃';
  return '📁';
}
