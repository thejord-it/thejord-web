import { useState } from 'react';
import { trackToolUsage, trackCopy, trackError, trackButtonClick } from '@/lib/tools/analytics';

export default function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | 'encodeComponent' | 'decodeComponent'>('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      let result = '';

      switch (mode) {
        case 'encode':
          result = encodeURI(input);
          break;
        case 'decode':
          result = decodeURI(input);
          break;
        case 'encodeComponent':
          result = encodeURIComponent(input);
          break;
        case 'decodeComponent':
          result = decodeURIComponent(input);
          break;
      }

      setOutput(result);
      trackToolUsage('URL Tool', mode, 'success');
    } catch (err: any) {
      setError(err.message || 'Error processing URL');
      setOutput('');
      trackError(`${mode}_error`, err.message || 'Error processing URL', 'URL Tool');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      trackCopy(`url_${mode}`, 'URL Tool');
      alert('Copied to clipboard!');
    } catch (error) {
      alert('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    trackButtonClick('Clear', 'URL Tool');
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);

    // Swap encode/decode
    if (mode === 'encode') setMode('decode');
    else if (mode === 'decode') setMode('encode');
    else if (mode === 'encodeComponent') setMode('decodeComponent');
    else setMode('encodeComponent');

    trackButtonClick('Swap', 'URL Tool');
  };

  const examples = {
    encode: 'https://example.com/search?q=hello world&lang=en',
    encodeComponent: 'hello world & special chars: @#$%'
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            🔗 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              URL
            </span> Encoder/Decoder
          </h1>
          <p className="text-text-muted text-lg">
            Encode or decode URLs and URI components.
          </p>
        </div>

        <div className="bg-bg-surface rounded-xl p-3 mb-6 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setMode('encode')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all text-sm ' + (mode === 'encode'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode('decode')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all text-sm ' + (mode === 'decode'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              Decode URL
            </button>
            <button
              onClick={() => setMode('encodeComponent')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all text-sm ' + (mode === 'encodeComponent'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              Encode Component
            </button>
            <button
              onClick={() => setMode('decodeComponent')}
              className={'px-4 py-2 rounded-lg font-semibold transition-all text-sm ' + (mode === 'decodeComponent'
                  ? 'bg-primary text-white shadow-lg shadow-primary/40'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
            >
              Decode Component
            </button>
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
          <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
            <h2 className="font-semibold text-text-primary text-lg">
              {mode.includes('encode') ? 'Text to URL' : 'URL to Text'}
            </h2>
            <div className="flex flex-wrap gap-2">
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
                {mode.includes('encode') ? '🔒 Encode' : '🔓 Decode'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                <span className="font-semibold text-text-secondary">Input</span>
              </div>
              <div className="p-4 md:p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode.includes('encode') ?
                    (mode === 'encode' ? examples.encode : examples.encodeComponent) :
                    'Enter encoded URL or component to decode...'}
                  className="w-full h-64 md:h-96 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="bg-bg-dark px-4 md:px-6 py-2 md:py-3 border-t border-border flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center text-sm">
                <div className="text-text-muted">
                  {input.length} characters
                </div>
              </div>
            </div>

            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                <span className="font-semibold text-text-secondary">Output</span>
              </div>
              <div className="p-4 md:p-6">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="w-full h-64 md:h-96 px-4 py-3 bg-bg-dark border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none resize-none"
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
              <div className="bg-bg-dark px-4 md:px-6 py-2 md:py-3 border-t border-border flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="text-text-muted text-sm">
                  {output && `${output.length} characters`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
          <div className="bg-bg-surface rounded-xl border border-border p-4 md:p-6">
            <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
              ℹ️ encodeURI() vs encodeURIComponent()
            </h3>
            <div className="text-text-secondary space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-accent-light mb-2">encodeURI()</h4>
                <p className="mb-2">Encodes a complete URL. Preserves URL structure characters:</p>
                <code className="block bg-bg-dark p-2 rounded font-mono text-xs text-primary-light">
                  : / ? # [ ] @ ! $ & ' ( ) * + , ; =
                </code>
                <p className="mt-2 text-xs">Use for full URLs</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-4 md:p-6">
            <h3 className="font-semibold text-text-primary text-lg mb-4">
              &nbsp;
            </h3>
            <div className="text-text-secondary space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-secondary-light mb-2">encodeURIComponent()</h4>
                <p className="mb-2">Encodes URI components. Encodes ALL special characters including:</p>
                <code className="block bg-bg-dark p-2 rounded font-mono text-xs text-primary-light">
                  : / ? # [ ] @ ! $ & ' ( ) * + , ; =
                </code>
                <p className="mt-2 text-xs">Use for query parameters and path segments</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
