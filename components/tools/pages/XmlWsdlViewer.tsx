import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ToastProvider';
import { validateXML, formatXML, minifyXML, xmlToJSON, jsonToXML, getXMLStats, parseWSDL, WSDLData } from '@/lib/xml-wsdl-utils';
import { trackToolUsage, trackCopy, trackError, trackButtonClick } from '@/lib/tools/analytics';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
</catalog>`;

const SAMPLE_WSDL = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="HelloService"
   targetNamespace="http://www.examples.com/wsdl/HelloService.wsdl"
   xmlns="http://schemas.xmlsoap.org/wsdl/"
   xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
   xmlns:tns="http://www.examples.com/wsdl/HelloService.wsdl"
   xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <message name="SayHelloRequest">
    <part name="firstName" type="xsd:string"/>
  </message>
  <message name="SayHelloResponse">
    <part name="greeting" type="xsd:string"/>
  </message>

  <portType name="Hello_PortType">
    <operation name="sayHello">
      <input message="tns:SayHelloRequest"/>
      <output message="tns:SayHelloResponse"/>
    </operation>
  </portType>

  <binding name="Hello_Binding" type="tns:Hello_PortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="sayHello">
      <soap:operation soapAction="sayHello"/>
      <input>
        <soap:body use="encoded" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
      </input>
      <output>
        <soap:body use="encoded" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
      </output>
    </operation>
  </binding>

  <service name="Hello_Service">
    <documentation>WSDL File for HelloService</documentation>
    <port binding="tns:Hello_Binding" name="Hello_Port">
      <soap:address location="http://www.examples.com/SayHello/"/>
    </port>
  </service>
</definitions>`;

export default function XmlWsdlViewer() {
  const t = useTranslations('toolPages.xmlWsdlViewer');
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState(SAMPLE_XML);
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('format');
  const [validation, setValidation] = useState({ valid: true, error: null as string | null, line: null as number | null, column: null as number | null });
  const [stats, setStats] = useState({ elements: 0, attributes: 0, textNodes: 0, comments: 0, depth: 0, size: 0 });
  const [indent, setIndent] = useState(2);
  const [wsdlData, setWsdlData] = useState<WSDLData | null>(null);
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    const result = validateXML(input);
    setValidation(result);
    if (result.valid) {
      setStats(getXMLStats(input));

      // Try to parse as WSDL if on WSDL tab
      if (activeTab === 'wsdl') {
        try {
          const parsed = parseWSDL(input);
          setWsdlData(parsed);
        } catch {
          setWsdlData(null);
        }
      }
    } else {
      setWsdlData(null);
    }
  }, [input, activeTab]);

  const handleFormat = () => {
    try {
      const formatted = formatXML(input, indent);
      setOutput(formatted);
      trackToolUsage('XML & WSDL Viewer', 'format', 'success');
      trackButtonClick('format_xml');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid XML';
      setOutput('Error: ' + errorMsg);
      trackError('format_error', errorMsg, 'XML & WSDL Viewer');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyXML(input);
      setOutput(minified);

      // Calculate compression stats
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

      console.log(`Minification complete: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
      trackToolUsage('XML & WSDL Viewer', 'minify', `${savings}% reduction`);
      trackButtonClick('minify_xml');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid XML';
      setOutput('Error: ' + errorMsg);
      trackError('minify_error', errorMsg, 'XML & WSDL Viewer');
    }
  };

  const handleXMLtoJSON = () => {
    try {
      const json = xmlToJSON(input);
      setOutput(JSON.stringify(json, null, indent));
      trackToolUsage('XML & WSDL Viewer', 'xml_to_json', 'success');
      trackButtonClick('xml_to_json');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid XML';
      setOutput('Error: ' + errorMsg);
      trackError('xml_to_json_error', errorMsg, 'XML & WSDL Viewer');
    }
  };

  const handleJSONtoXML = () => {
    try {
      const json = JSON.parse(jsonInput);
      const xml = jsonToXML(json, 'root');
      setOutput(xml);
      trackToolUsage('XML & WSDL Viewer', 'json_to_xml', 'success');
      trackButtonClick('json_to_xml');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid JSON';
      setOutput('Error: ' + errorMsg);
      trackError('json_to_xml_error', errorMsg, 'XML & WSDL Viewer');
    }
  };

  const handleLoadSampleWSDL = () => {
    setInput(SAMPLE_WSDL);
    setActiveTab('wsdl');
    trackButtonClick('load_sample_wsdl');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      showToast(t('copySuccess', { defaultValue: 'Copied to clipboard!' }), 'success');
      trackCopy('XML & WSDL Viewer', output.length);
    } catch (error) {
      showToast(t('copyError', { defaultValue: 'Failed to copy' }), 'error');
      trackError('copy_error', 'Clipboard API failed', 'XML & WSDL Viewer');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], {
      type: activeTab === 'convert' && output.startsWith('{') ? 'application/json' : 'application/xml'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'convert' && output.startsWith('{') ? 'output.json' : 'output.xml';
    a.click();
    URL.revokeObjectURL(url);
    trackButtonClick('download_output');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setJsonInput('');
    setWsdlData(null);
    trackButtonClick('clear_all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">
          📄 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            XML & WSDL Viewer
          </span>
        </h1>
        <p className="text-text-muted text-lg">
          {t('subtitle', { defaultValue: 'Format, validate, and parse XML and WSDL files. All processing happens in your browser.' })}
        </p>
      </div>

      <div className="bg-bg-surface rounded-xl p-3 mb-6 border border-border">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'format', icon: '✨', label: t('tabs.format', { defaultValue: 'Format & Validate' }) },
            { id: 'wsdl', icon: '🔧', label: t('tabs.wsdl', { defaultValue: 'WSDL Parser' }) },
            { id: 'convert', icon: '🔄', label: t('tabs.convert', { defaultValue: 'XML ↔ JSON' }) },
            { id: 'minify', icon: '🗜️', label: t('tabs.minify', { defaultValue: 'Minify' }) },
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

      {activeTab === 'wsdl' ? (
        // WSDL Parser View
        <div>
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
            <div className="bg-bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="font-semibold text-text-primary text-lg">{t('wsdl.title', { defaultValue: 'WSDL Input' })}</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleLoadSampleWSDL}
                  className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
                >
                  📝 {t('wsdl.loadSample', { defaultValue: 'Load Sample WSDL' })}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
                >
                  🗑️ {t('buttons.clear', { defaultValue: 'Clear' })}
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-4 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder={t('wsdl.placeholder', { defaultValue: 'Paste your WSDL here...' })}
              />
            </div>
            <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-md shadow-accent/40">
                      ✓
                    </div>
                    <span className="text-accent-light font-semibold">{t('validation.valid', { defaultValue: 'Valid XML/WSDL' })}</span>
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
                {stats.elements} elements • {stats.attributes} attributes • {stats.size} bytes
              </div>
            </div>
          </div>

          {wsdlData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary text-lg">🌐 {t('wsdl.services', { defaultValue: 'Services & Endpoints' })}</h3>
                </div>
                <div className="p-6">
                  {wsdlData.targetNamespace && (
                    <div className="mb-4 p-3 bg-bg-dark rounded-lg border border-border">
                      <span className="text-text-muted text-sm">{t('wsdl.namespace', { defaultValue: 'Target Namespace:' })}</span>
                      <div className="text-primary-light font-mono text-sm mt-1 break-all">
                        {wsdlData.targetNamespace}
                      </div>
                    </div>
                  )}

                  {wsdlData.services.length > 0 ? (
                    <div className="space-y-3">
                      {wsdlData.services.map((service, idx) => (
                        <div key={idx} className="p-4 bg-bg-dark rounded-lg border border-border">
                          <div className="font-semibold text-text-primary mb-2">{service.name}</div>
                          {service.port && (
                            <div className="text-sm text-text-secondary">Port: {service.port}</div>
                          )}
                          {service.address && (
                            <div className="text-sm text-primary-light font-mono mt-1 break-all">
                              {service.address}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-text-muted text-center py-8">{t('wsdl.noServices', { defaultValue: 'No services found' })}</div>
                  )}
                </div>
              </div>

              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary text-lg">⚙️ {t('wsdl.operations', { defaultValue: 'Operations' })}</h3>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {wsdlData.operations.length > 0 ? (
                    <div className="space-y-3">
                      {wsdlData.operations.map((op, idx) => (
                        <div key={idx} className="p-4 bg-bg-dark rounded-lg border border-border">
                          <div className="font-semibold text-text-primary mb-2">{op.name}</div>
                          {op.input && (
                            <div className="text-sm text-text-secondary">
                              Input: <span className="text-accent-light font-mono">{op.input}</span>
                            </div>
                          )}
                          {op.output && (
                            <div className="text-sm text-text-secondary">
                              Output: <span className="text-secondary-light font-mono">{op.output}</span>
                            </div>
                          )}
                          {op.documentation && (
                            <div className="text-sm text-text-muted mt-2 italic">{op.documentation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-text-muted text-center py-8">{t('wsdl.noOperations', { defaultValue: 'No operations found' })}</div>
                  )}
                </div>
              </div>

              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary text-lg">📦 {t('wsdl.types', { defaultValue: 'Types' })}</h3>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  {wsdlData.types.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {wsdlData.types.map((type, idx) => (
                        <span key={idx} className="px-3 py-1 bg-accent/20 text-accent-light rounded-lg text-sm font-mono">
                          {type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-text-muted text-center py-4">{t('wsdl.noTypes', { defaultValue: 'No types defined' })}</div>
                  )}
                </div>
              </div>

              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary text-lg">🔗 {t('wsdl.bindings', { defaultValue: 'Bindings' })}</h3>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  {wsdlData.bindings.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {wsdlData.bindings.map((binding, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/20 text-primary-light rounded-lg text-sm font-mono">
                          {binding}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-text-muted text-center py-4">{t('wsdl.noBindings', { defaultValue: 'No bindings defined' })}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'convert' ? (
        // XML ↔ JSON Converter View
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
          <div className="bg-bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-text-primary text-lg">{t('convert.title', { defaultValue: 'XML ↔ JSON Converter' })}</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleXMLtoJSON}
                className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all"
              >
                XML → JSON
              </button>
              <button
                onClick={handleJSONtoXML}
                className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-secondary/40 transition-all"
              >
                JSON → XML
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                <span className="font-semibold text-text-secondary">{t('convert.xmlInput', { defaultValue: 'XML Input' })}</span>
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-96 p-4 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder={t('convert.xmlPlaceholder', { defaultValue: 'Paste XML here for XML→JSON conversion...' })}
                />
              </div>
            </div>

            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                <span className="font-semibold text-text-secondary">{t('convert.jsonInput', { defaultValue: 'JSON Input (for JSON→XML)' })}</span>
              </div>
              <div className="p-6">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-96 p-4 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder={t('convert.jsonPlaceholder', { defaultValue: 'Paste JSON here for JSON→XML conversion...' })}
                />
              </div>
            </div>
          </div>

          {output && (
            <div className="border-t border-border p-6">
              <div className="bg-bg-elevated px-6 py-3 border border-border rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold text-text-primary">{t('output.title', { defaultValue: 'Output' })}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all"
                  >
                    📋 {t('buttons.copy', { defaultValue: 'Copy' })}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-bg-elevated border border-border text-text-secondary rounded-lg hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
                  >
                    ⬇️ {t('buttons.download', { defaultValue: 'Download' })}
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 p-4 bg-bg-dark border border-border border-t-0 rounded-b-lg text-text-primary font-mono text-sm resize-none"
              />
            </div>
          )}
        </div>
      ) : (
        // Format & Minify View
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl mb-6">
          <div className="bg-bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-text-primary text-lg">{t('editor.title', { defaultValue: 'XML Editor' })}</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
              >
                🗑️ {t('buttons.clear', { defaultValue: 'Clear' })}
              </button>
              {activeTab === 'format' && (
                <button
                  onClick={handleFormat}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
                >
                  ✨ {t('buttons.format', { defaultValue: 'Format' })}
                </button>
              )}
              {activeTab === 'minify' && (
                <button
                  onClick={handleMinify}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
                >
                  🗜️ {t('buttons.minify', { defaultValue: 'Minify' })}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/40"></div>
                <span className="font-semibold text-text-secondary">{t('editor.input', { defaultValue: 'Input XML' })}</span>
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-96 p-4 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder={t('editor.placeholder', { defaultValue: 'Paste your XML here...' })}
                />
              </div>
              <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {validation.valid ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-md shadow-accent/40">
                        ✓
                      </div>
                      <span className="text-accent-light font-semibold">{t('validation.valid', { defaultValue: 'Valid XML' })}</span>
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
                  {stats.elements} elements • {stats.attributes} attributes • {stats.size} bytes
                </div>
              </div>
            </div>

            <div className="bg-bg-surface">
              <div className="bg-bg-elevated px-6 py-3 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/40"></div>
                <span className="font-semibold text-text-secondary">{t('output.title', { defaultValue: 'Output' })}</span>
              </div>
              <div className="p-6">
                <textarea
                  value={output || t('output.placeholder', { defaultValue: '// Output will appear here...' })}
                  readOnly
                  className="w-full h-96 p-4 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm resize-none"
                />
              </div>
              <div className="bg-bg-dark px-6 py-3 border-t border-border flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📋 {t('buttons.copy', { defaultValue: 'Copy' })}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="px-4 py-2 bg-bg-elevated border border-border text-text-secondary rounded-lg hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⬇️ {t('buttons.download', { defaultValue: 'Download' })}
                  </button>
                </div>
                <div className="text-text-muted text-sm">
                  {output && `Depth: ${stats.depth} levels`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
          ⚙️ {t('options.title', { defaultValue: 'Options' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t('options.indentation', { defaultValue: 'Indentation' })}
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
