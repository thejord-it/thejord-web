import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ToastProvider';
import CryptoJS from 'crypto-js';
import { trackToolUsage, trackCopy, trackButtonClick } from '@/lib/tools/analytics';

type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA3';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

export default function HashGenerator() {
  const t = useTranslations('toolPages.hashGenerator');
  const [input, setInput] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(['MD5', 'SHA1', 'SHA256']);
  const [results, setResults] = useState<HashResult[]>([]);
  const [hmacKey, setHmacKey] = useState('');
  const [useHMAC, setUseHMAC] = useState(false);
  const { showToast } = useToast();

  const algorithms: { name: HashAlgorithm; descKey: string }[] = [
    { name: 'MD5', descKey: 'notSecure' },
    { name: 'SHA1', descKey: 'deprecated' },
    { name: 'SHA256', descKey: 'recommended' },
    { name: 'SHA512', descKey: 'verySecure' },
    { name: 'SHA3', descKey: 'latestStandard' },
  ];

  useEffect(() => {
    if (!input) {
      setResults([]);
      return;
    }

    const newResults: HashResult[] = [];

    selectedAlgorithms.forEach(algo => {
      let hash = '';

      try {
        if (useHMAC && hmacKey) {
          switch (algo) {
            case 'MD5':
              hash = CryptoJS.HmacMD5(input, hmacKey).toString();
              break;
            case 'SHA1':
              hash = CryptoJS.HmacSHA1(input, hmacKey).toString();
              break;
            case 'SHA256':
              hash = CryptoJS.HmacSHA256(input, hmacKey).toString();
              break;
            case 'SHA512':
              hash = CryptoJS.HmacSHA512(input, hmacKey).toString();
              break;
            case 'SHA3':
              hash = CryptoJS.HmacSHA3(input, hmacKey).toString();
              break;
          }
        } else {
          switch (algo) {
            case 'MD5':
              hash = CryptoJS.MD5(input).toString();
              break;
            case 'SHA1':
              hash = CryptoJS.SHA1(input).toString();
              break;
            case 'SHA256':
              hash = CryptoJS.SHA256(input).toString();
              break;
            case 'SHA512':
              hash = CryptoJS.SHA512(input).toString();
              break;
            case 'SHA3':
              hash = CryptoJS.SHA3(input).toString();
              break;
          }
        }

        newResults.push({
          algorithm: useHMAC ? `HMAC-${algo}` : algo,
          hash,
          length: hash.length
        });
      } catch (error) {
        console.error(`Error generating ${algo} hash:`, error);
      }
    });

    setResults(newResults);
    if (input && newResults.length > 0) {
      trackToolUsage('Hash Generator', 'generate_hash', selectedAlgorithms.join(','));
    }
  }, [input, selectedAlgorithms, useHMAC, hmacKey]);

  const handleCopy = async (hash: string, algorithm: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      trackCopy(`hash_${algorithm.toLowerCase()}`, 'Hash Generator');
      showToast('Hash copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleToggleAlgorithm = (algo: HashAlgorithm) => {
    if (selectedAlgorithms.includes(algo)) {
      setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== algo));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algo]);
    }
  };

  const handleClear = () => {
    setInput('');
    setHmacKey('');
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            🔑 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              Hash
            </span> Generator
          </h1>
          <p className="text-text-muted text-lg">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:p-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
                <h2 className="font-semibold text-text-primary text-lg">{t('inputText')}</h2>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
              <div className="p-4 md:p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('enterTextToHash')}
                  className="w-full h-48 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="mt-4 text-sm text-text-muted">
                  {input.length} {t('chars')} • {new Blob([input]).size} bytes
                </div>
              </div>
            </div>

            {useHMAC && (
              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border">
                  <h2 className="font-semibold text-text-primary text-lg">{t('hmacSecretKey')}</h2>
                </div>
                <div className="p-4 md:p-6">
                  <input
                    type="text"
                    value={hmacKey}
                    onChange={(e) => setHmacKey(e.target.value)}
                    placeholder={t('enterSecretKey')}
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-2 text-xs text-text-muted">
                    {t('hmacDescription')}
                  </p>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border">
                  <h2 className="font-semibold text-text-primary text-lg">{t('hashResults')}</h2>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                  {results.map((result, idx) => (
                    <div key={idx} className="p-4 bg-bg-elevated rounded-lg border border-border">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center mb-2">
                        <div>
                          <span className="font-semibold text-primary-light">{result.algorithm}</span>
                          <span className="text-text-muted text-sm ml-3">({result.length} {t('chars')})</span>
                        </div>
                        <button
                          onClick={() => handleCopy(result.hash, result.algorithm)}
                          className="px-3 py-1 bg-accent text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <div className="font-mono text-xs text-text-primary bg-bg-dark p-3 rounded border border-border break-all">
                        {result.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border">
                <h2 className="font-semibold text-text-primary text-lg">{t('algorithms')}</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-text-secondary cursor-pointer p-3 bg-bg-elevated rounded-lg border border-border hover:border-primary transition-all">
                    <input
                      type="checkbox"
                      checked={useHMAC}
                      onChange={(e) => setUseHMAC(e.target.checked)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="font-semibold">{t('useHmac')}</span>
                  </label>
                  {useHMAC && !hmacKey && (
                    <p className="mt-2 text-xs text-yellow-400">⚠️ {t('enterKeyAbove')}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {algorithms.map(algo => (
                    <button
                      key={algo.name}
                      onClick={() => handleToggleAlgorithm(algo.name)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedAlgorithms.includes(algo.name)
                          ? 'bg-primary/20 border-primary text-text-primary'
                          : 'bg-bg-elevated border-border text-text-secondary hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{algo.name}</span>
                        {selectedAlgorithms.includes(algo.name) && (
                          <span className="text-accent text-xl">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted">{t(algo.descKey)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-bg-surface rounded-xl border border-border p-4 md:p-6">
              <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
                ℹ️ {t('aboutHashing')}
              </h3>
              <div className="text-text-secondary space-y-3 text-sm">
                <p>
                  {t('hashingDescription')}
                </p>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">{t('commonUses')}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('use1')}</li>
                    <li>{t('use2')}</li>
                    <li>{t('use3')}</li>
                    <li>{t('use4')}</li>
                    <li>{t('use5')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">{t('securityNotes')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>{t('secNote1')}</li>
                    <li>{t('secNote2')}</li>
                    <li>{t('secNote3')}</li>
                    <li>{t('secNote4')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
