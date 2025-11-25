import { useState, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import { detectFileType, getFileIcon, DetectedFileType } from '@/lib/tools/file-detection';
import { trackToolUsage, trackCopy, trackError, trackButtonClick, trackFileUpload } from '@/lib/tools/analytics';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const [detectedType, setDetectedType] = useState<DetectedFileType | null>(null);
  const [decodedBase64, setDecodedBase64] = useState<string>(''); // Store clean Base64 for binary downloads
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    try {
      setError('');
      setDetectedType(null); // Clear file type detection for encoding
      setDecodedBase64(''); // Clear decoded Base64
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      trackToolUsage('Base64 Tool', 'encode', 'success');
    } catch (err) {
      setError('Error encoding: Invalid input');
      setOutput('');
      trackError('encode_error', err instanceof Error ? err.message : 'Invalid input', 'Base64 Tool');
    }
  };

  const handleDecode = () => {
    try {
      setError('');

      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      let base64Data = input.trim();
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }

      // Store clean Base64 for downloads
      setDecodedBase64(base64Data);

      // Detect file type from the clean Base64
      const fileType = detectFileType(base64Data);
      setDetectedType(fileType);

      // Check if it's a binary file
      const isBinary = fileType && (
        fileType.mime.startsWith('image/') ||
        fileType.mime.startsWith('video/') ||
        fileType.mime.startsWith('audio/') ||
        fileType.mime.includes('pdf') ||
        fileType.mime.includes('zip') ||
        fileType.mime.includes('rar') ||
        fileType.mime.includes('7z') ||
        fileType.mime.includes('gzip') ||
        fileType.mime.includes('bzip') ||
        fileType.mime.includes('compressed') ||
        fileType.mime.includes('executable') ||
        fileType.mime.includes('octet-stream')
      );

      if (isBinary) {
        // For binary files, show a message instead of garbled text
        setOutput(`[Binary ${fileType?.description || 'file'} detected - ${Math.round(base64Data.length * 0.75)} bytes]\n\nClick "Download" button to save the file.`);
      } else {
        // For text files, decode normally
        const decoded = decodeURIComponent(escape(atob(base64Data)));
        setOutput(decoded);
      }

      if (fileType) {
        console.log('Detected file type:', fileType);
      }
      trackToolUsage('Base64 Tool', 'decode', fileType?.mime || 'text');
    } catch (err) {
      console.error('Decode error:', err);
      setError('Error decoding: Invalid Base64 string');
      setOutput('');
      setDetectedType(null);
      setDecodedBase64('');
      trackError('decode_error', err instanceof Error ? err.message : 'Invalid Base64 string', 'Base64 Tool');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      trackCopy(mode === 'encode' ? 'base64_encoded' : 'base64_decoded', 'Base64 Tool');
      showToast('Copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setDetectedType(null);
    setDecodedBase64('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    trackButtonClick('Clear', 'Base64 Tool');
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    trackButtonClick('Swap', 'Base64 Tool');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      showToast(`File too large! Max ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 'error');
      trackError('file_size_error', `File exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`, 'Base64 Tool');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    trackFileUpload(file.type || 'unknown', file.size, 'Base64 Tool');

    const reader = new FileReader();

    if (mode === 'encode') {
      // Check if file is binary (image, pdf, etc.) or text
      const isTextFile = file.type.startsWith('text/') ||
                         file.type.includes('json') ||
                         file.type.includes('xml') ||
                         file.type.includes('javascript');

      if (isTextFile) {
        // Read text files as text
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            setInput(result);
            setError('');
            showToast('File loaded successfully!', 'success');
          }
        };
        reader.readAsText(file);
      } else {
        // Read binary files (images, pdf, etc.) as ArrayBuffer
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result;
          if (arrayBuffer instanceof ArrayBuffer) {
            // Convert ArrayBuffer to Base64
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            setInput(base64);
            setError('');
            showToast(`Binary file loaded (${file.type || 'unknown type'})`, 'success');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } else {
      // For decode mode, read as base64
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          // Remove data URL prefix if present
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          setInput(base64);
          setError('');
          showToast('File loaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }

    reader.onerror = () => {
      setError('Failed to read file');
      showToast('Failed to read file', 'error');
    };
  };

  const handleDownload = () => {
    if (!output) return;

    let filename: string;
    let mimeType = 'text/plain';
    let blob: Blob;

    if (mode === 'decode' && detectedType && decodedBase64) {
      // Use detected file type for decoded files
      filename = `decoded.${detectedType.extension}`;
      mimeType = detectedType.mime;

      // For binary files, convert Base64 back to binary
      try {
        const binaryString = atob(decodedBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: mimeType });
      } catch (err) {
        console.error('Error creating binary blob:', err);
        blob = new Blob([output], { type: mimeType });
      }
    } else {
      // Default filenames and text output
      filename = mode === 'encode' ? 'encoded.base64.txt' : 'decoded.txt';
      blob = new Blob([output], { type: mimeType });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File downloaded successfully!', 'success');
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            🔐 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              Base64
            </span> Encoder/Decoder
          </h1>
          <p className="text-text-muted text-lg">
            Encode or decode Base64 strings. All processing happens in your browser.
          </p>
        </div>

        <div className="bg-bg-surface rounded-xl p-3 mb-6 border border-border">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMode('encode')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all ' + (mode === 'encode'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              🔒 Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all ' + (mode === 'decode'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              🔓 Decode
            </button>
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
          <div className="bg-bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-text-primary text-lg">
              {mode === 'encode' ? 'Text to Base64' : 'Base64 to Text'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
              >
                🗑️ Clear
              </button>
              <button
                onClick={handleSwap}
                disabled={!output}
                className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-secondary hover:text-secondary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Swap
              </button>
              <button
                onClick={handleConvert}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
              >
                {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                <span className="font-semibold text-text-secondary">
                  {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
                </span>
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                  className="w-full h-96 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
                <div className="text-text-muted">
                  {input.length} characters • {new Blob([input]).size} bytes
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all cursor-pointer inline-block"
                  >
                    📁 Upload File
                  </label>
                  <p className="text-xs text-text-muted mt-1">Max {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
                </div>
              </div>
            </div>

            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                <span className="font-semibold text-text-secondary">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Text Output'}
                </span>
              </div>
              <div className="p-6">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="w-full h-96 px-4 py-3 bg-bg-dark border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none resize-none"
                />
                {error && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                      ✗
                    </div>
                    <span className="text-red-400">{error}</span>
                  </div>
                )}
              </div>
              <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-secondary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💾 Download
                  </button>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {output && (
                    <div className="text-text-muted text-sm">
                      {output.length} characters • {new Blob([output]).size} bytes
                    </div>
                  )}
                  {detectedType && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">{getFileIcon(detectedType.mime)}</span>
                      <div className="text-right">
                        <div className="text-text-primary font-semibold">{detectedType.description}</div>
                        <div className="text-text-muted text-xs">
                          {detectedType.mime} • .{detectedType.extension}
                          {detectedType.confidence && (
                            <span className={`ml-2 px-2 py-0.5 rounded ${
                              detectedType.confidence === 'high' ? 'bg-green-900/30 text-green-400' :
                              detectedType.confidence === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                              'bg-gray-900/30 text-gray-400'
                            }`}>
                              {detectedType.confidence === 'high' ? '✓ High confidence' :
                               detectedType.confidence === 'medium' ? '~ Medium confidence' :
                               '? Low confidence'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
            ℹ️ About Base64
          </h3>
          <div className="text-text-secondary space-y-2">
            <p>
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
              It's commonly used to encode data that needs to be stored or transferred over media designed to handle text.
            </p>
            <div className="mt-4">
              <h4 className="font-semibold text-text-primary mb-2">Common Use Cases:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Encoding images for data URIs in HTML/CSS</li>
                <li>Storing complex data in cookies or URLs</li>
                <li>Email attachments (MIME)</li>
                <li>API authentication tokens</li>
                <li>Embedding binary data in JSON or XML</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
  );
}
