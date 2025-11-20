import Layout from '@/components/tools/Layout';
import SEO from '@/components/tools/SEO';
import Toast from '@/components/tools/Toast';
import { useState, useEffect } from 'react';
import { validateJSON, formatJSON, minifyJSON, getJSONStats, FormatOptions } from '@/lib/tools/json-utils';
import { jsonToCSV, jsonToXML, jsonToYAML, jsonToTypeScript } from '@/lib/tools/json-converters';
import MonacoJsonEditor from '@/components/tools/MonacoJsonEditor';
import JsonTree from '@/components/tools/JsonTree';
import JsonDiff from '@/components/tools/JsonDiff';

const DEFAULT_OPTIONS: FormatOptions = {
  indent: 4,
  sortKeys: true,
  trailingComma: false,
  quoteStyle: 'double',
  maxLineLength: 80,
};

const SAMPLE_JSON = `{
  "name": "The Jord",
  "type": "Developer Tools",
  "version": "1.0.0",
  "features": ["JSON Formatter", "Validator", "Tree View"],
  "active": true,
  "downloads": 1337
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [activeTab, setActiveTab] = useState('format');
  const [validation, setValidation] = useState(validateJSON(SAMPLE_JSON));
  const [stats, setStats] = useState(getJSONStats(SAMPLE_JSON));
  const [parsedData, setParsedData] = useState<any>(null);
  const [compareInput, setCompareInput] = useState('');
  const [compareValidation, setCompareValidation] = useState<any>(null);
  const [compareParsedData, setCompareParsedData] = useState<any>(null);

  useEffect(() => {
    const result = validateJSON(input);
    setValidation(result);
    if (result.valid) {
      setStats(getJSONStats(input));
      try {
        setParsedData(JSON.parse(input));
      } catch {
        setParsedData(null);
      }
    } else {
      setParsedData(null);
    }
  }, [input]);

  useEffect(() => {
    if (compareInput) {
      const result = validateJSON(compareInput);
      setCompareValidation(result);
      if (result.valid) {
        try {
          setCompareParsedData(JSON.parse(compareInput));
        } catch {
          setCompareParsedData(null);
        }
      } else {
        setCompareParsedData(null);
      }
    } else {
      setCompareValidation(null);
      setCompareParsedData(null);
    }
  }, [compareInput]);

  const handleFormat = () => {
    try {
      const formatted = formatJSON(input, options);
      setOutput(formatted);
    } catch (error) {
      setOutput('Error: Invalid JSON');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJSON(input);
      setOutput(minified);

      // Calculate compression stats
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

      console.log(`Minification complete: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
    } catch (error) {
      setOutput('Error: Invalid JSON');
    }
  };

  const handleConvert = (format: 'csv' | 'xml' | 'yaml' | 'typescript') => {
    try {
      const parsed = JSON.parse(input);
      let converted = '';

      switch (format) {
        case 'csv':
          converted = jsonToCSV(parsed);
          break;
        case 'xml':
          converted = jsonToXML(parsed);
          break;
        case 'yaml':
          converted = jsonToYAML(parsed);
          break;
        case 'typescript':
          converted = jsonToTypeScript(parsed);
          break;
      }

      setOutput(converted);
    } catch (error) {
      setOutput('Error: Invalid JSON');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('Copied to clipboard!');
    } catch (error) {
      alert('Failed to copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setCompareInput('');
  };

  return (
    <Layout showFullNav={false}>
      <SEO
        title="JSON Formatter - THEJORD.IT"
        description="Format, validate, and beautify JSON online. Free JSON formatter with syntax highlighting, tree view, and conversion to CSV, XML, YAML."
        path="/json-formatter"
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            📄 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              JSON Formatter
            </span> & Validator
          </h1>
          <p className="text-text-muted text-lg">
            Format, validate, and beautify JSON instantly. All processing happens in your browser.
          </p>
        </div>

        <div className="bg-bg-surface rounded-xl p-3 mb-6 border border-border">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'format', icon: '✨', label: 'Format & Beautify' },
              { id: 'tree', icon: '🌲', label: 'Tree View' },
              { id: 'compare', icon: '🔍', label: 'Compare & Diff' },
              { id: 'minify', icon: '🗜️', label: 'Minify' },
              { id: 'convert', icon: '🔄', label: 'Convert' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={'px-4 py-2 rounded-lg font-semibold transition-all ' + (activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/40'
                    : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light border border-transparent')}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
          <div className="bg-bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-text-primary text-lg">
              {activeTab === 'compare' ? 'JSON Comparison' : 'JSON Editor'}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
              >
                🗑️ Clear
              </button>
              {activeTab === 'format' && (
                <button
                  onClick={handleFormat}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
                >
                  ✨ Format
                </button>
              )}
              {activeTab === 'minify' && (
                <button
                  onClick={handleMinify}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
                >
                  🗜️ Minify
                </button>
              )}
              {activeTab === 'convert' && (
                <>
                  <button
                    onClick={() => handleConvert('csv')}
                    className="px-3 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all text-sm"
                  >
                    → CSV
                  </button>
                  <button
                    onClick={() => handleConvert('xml')}
                    className="px-3 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all text-sm"
                  >
                    → XML
                  </button>
                  <button
                    onClick={() => handleConvert('yaml')}
                    className="px-3 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all text-sm"
                  >
                    → YAML
                  </button>
                  <button
                    onClick={() => handleConvert('typescript')}
                    className="px-3 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all text-sm"
                  >
                    → TypeScript
                  </button>
                </>
              )}
            </div>
          </div>

          {activeTab === 'compare' ? (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
                <div className="bg-bg-surface">
                  <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                    <span className="font-semibold text-text-secondary">Input JSON</span>
                  </div>
                  <div className="p-6">
                    <div className="border border-border rounded-lg overflow-hidden">
                      <MonacoJsonEditor
                        value={input}
                        onChange={setInput}
                        height="400px"
                      />
                    </div>
                  </div>
                  <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {validation.valid ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-md shadow-accent/40">
                            ✓
                          </div>
                          <span className="text-accent-light font-semibold">Valid JSON</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                            ✗
                          </div>
                          <span className="text-red-400">
                            {validation.error}
                            {validation.line && ` (Line ${validation.line}, Col ${validation.column})`}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-text-muted">
                      {stats.objects} objects • {stats.arrays} arrays • {stats.size} bytes
                    </div>
                  </div>
                </div>

                <div className="bg-bg-surface">
                  <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                    <span className="font-semibold text-text-secondary">Compare JSON</span>
                  </div>
                  <div className="p-6">
                    <div className="border border-border rounded-lg overflow-hidden">
                      <MonacoJsonEditor
                        value={compareInput}
                        onChange={setCompareInput}
                        height="400px"
                      />
                    </div>
                  </div>
                  <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {compareInput ? (
                        compareValidation?.valid ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-md shadow-accent/40">
                              ✓
                            </div>
                            <span className="text-accent-light font-semibold">Valid JSON</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                              ✗
                            </div>
                            <span className="text-red-400">
                              {compareValidation?.error}
                              {compareValidation?.line && ` (Line ${compareValidation.line}, Col ${compareValidation.column})`}
                            </span>
                          </>
                        )
                      ) : (
                        <span className="text-text-muted">Enter JSON to compare</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-6">
                <JsonDiff left={parsedData} right={compareParsedData} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
              <div className="bg-bg-surface">
                <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                  <span className="font-semibold text-text-secondary">Input JSON</span>
                </div>
                <div className="p-6">
                  <div className="border border-border rounded-lg overflow-hidden">
                    <MonacoJsonEditor
                      value={input}
                      onChange={setInput}
                      height="400px"
                    />
                  </div>
                </div>
                <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    {validation.valid ? (
                      <>
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-md shadow-accent/40">
                          ✓
                        </div>
                        <span className="text-accent-light font-semibold">Valid JSON</span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                          ✗
                        </div>
                        <span className="text-red-400">
                          {validation.error}
                          {validation.line && ` (Line ${validation.line}, Col ${validation.column})`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-text-muted">
                    {stats.objects} objects • {stats.arrays} arrays • {stats.size} bytes
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface">
                <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                  <span className="font-semibold text-text-secondary">
                    {activeTab === 'tree' ? 'JSON Tree View' : 'Formatted Output'}
                  </span>
                </div>
                <div className="p-6">
                  {activeTab === 'tree' ? (
                    parsedData ? (
                      <JsonTree data={parsedData} />
                    ) : (
                      <div className="h-96 flex items-center justify-center text-text-muted">
                        Enter valid JSON to see tree view
                      </div>
                    )
                  ) : (
                    <div className="border border-border rounded-lg overflow-hidden">
                      <MonacoJsonEditor
                        value={output || '// Output will appear here...'}
                        onChange={() => {}}
                        height="400px"
                        readOnly={true}
                      />
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
                      className="px-4 py-2 bg-bg-elevated border border-border text-text-secondary rounded-lg hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                  <div className="text-text-muted text-sm">
                    {output && `${options.indent} spaces • ${options.sortKeys ? 'Sorted' : 'Original order'}`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-bg-surface rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
            ⚙️ Formatting Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Indentation</label>
              <select
                value={options.indent}
                onChange={(e) => setOptions({ ...options, indent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Quote Style</label>
              <select
                value={options.quoteStyle}
                onChange={(e) => setOptions({ ...options, quoteStyle: e.target.value as 'double' | 'single' })}
                className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="double">Double quotes</option>
                <option value="single">Single quotes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Max Line Length</label>
              <input
                type="number"
                value={options.maxLineLength}
                onChange={(e) => setOptions({ ...options, maxLineLength: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={options.sortKeys}
                onChange={(e) => setOptions({ ...options, sortKeys: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <span>Sort keys alphabetically</span>
            </label>
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={options.trailingComma}
                onChange={(e) => setOptions({ ...options, trailingComma: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <span>Allow trailing commas</span>
            </label>
          </div>
        </div>
      </main>
    </Layout>
  );
}
