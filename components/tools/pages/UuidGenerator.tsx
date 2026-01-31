import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ToastProvider';
import { trackUuidGenerate, trackContentCopy, trackToolAction } from '@/lib/tools/analytics';

type UuidVersion = 'v4' | 'v1' | 'v7' | 'nil';

interface GeneratedUuid {
  uuid: string;
  version: string;
  timestamp: Date;
}

// UUID v4 (random)
function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// UUID v1 (timestamp-based) - simplified version
function generateUuidV1(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const timeLow = timeHex.slice(-8);
  const timeMid = timeHex.slice(-12, -8);
  const timeHigh = '1' + timeHex.slice(0, 3);

  const clockSeq = (Math.random() * 0x3fff | 0x8000).toString(16);
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
}

// UUID v7 (time-ordered, RFC 9562)
function generateUuidV7(): string {
  const now = Date.now();

  // 48 bits of timestamp (milliseconds)
  const timeHex = now.toString(16).padStart(12, '0');

  // Random bits for the rest
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  // Build UUID parts
  const timeLow = timeHex.slice(0, 8);
  const timeMid = timeHex.slice(8, 12);

  // Version 7 + 12 bits random
  const rand12bits = ((randomBytes[0] << 8) | randomBytes[1]) & 0x0fff;
  const timeHighAndVersion = '7' + rand12bits.toString(16).padStart(3, '0');

  // Variant (10xx) + 14 bits random
  const clockSeq = ((randomBytes[2] & 0x3f) | 0x80).toString(16).padStart(2, '0') +
    randomBytes[3].toString(16).padStart(2, '0');

  // 48 bits random node
  const node = Array.from(randomBytes.slice(4, 10))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeq}-${node}`;
}

// Nil UUID (all zeros)
function generateNilUuid(): string {
  return '00000000-0000-0000-0000-000000000000';
}

// Validate UUID format
function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Detect UUID version
function detectUuidVersion(uuid: string): string {
  if (!isValidUuid(uuid)) return 'Invalid';
  if (uuid === '00000000-0000-0000-0000-000000000000') return 'Nil';
  const version = uuid.charAt(14);
  return `v${version}`;
}

export default function UuidGenerator() {
  const t = useTranslations('toolPages.uuidGenerator');
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [generatedUuids, setGeneratedUuids] = useState<GeneratedUuid[]>([]);
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; version: string } | null>(null);
  const { showToast } = useToast();

  const generateUuids = () => {
    const newUuids: GeneratedUuid[] = [];

    for (let i = 0; i < quantity; i++) {
      let uuid: string;

      switch (version) {
        case 'v1':
          uuid = generateUuidV1();
          break;
        case 'v7':
          uuid = generateUuidV7();
          break;
        case 'nil':
          uuid = generateNilUuid();
          break;
        case 'v4':
        default:
          uuid = generateUuidV4();
      }

      if (uppercase) {
        uuid = uuid.toUpperCase();
      }

      if (noDashes) {
        uuid = uuid.replace(/-/g, '');
      }

      newUuids.push({
        uuid,
        version: version.toUpperCase(),
        timestamp: new Date()
      });
    }

    setGeneratedUuids(newUuids);
    trackUuidGenerate(version, quantity);
  };

  const handleCopy = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      trackContentCopy('UUID Generator', 'uuid', uuid.length);
      showToast(t('copied'), 'success');
    } catch {
      showToast(t('copyFailed'), 'error');
    }
  };

  const handleCopyAll = async () => {
    try {
      const allUuids = generatedUuids.map(u => u.uuid).join('\n');
      await navigator.clipboard.writeText(allUuids);
      trackContentCopy('UUID Generator', 'uuid_batch', allUuids.length);
      showToast(t('allCopied'), 'success');
    } catch {
      showToast(t('copyFailed'), 'error');
    }
  };

  const handleValidate = () => {
    const trimmed = validateInput.trim();
    const valid = isValidUuid(trimmed);
    const detectedVersion = detectUuidVersion(trimmed);
    setValidationResult({ valid, version: detectedVersion });
    trackToolAction('UUID Generator', 'validate', { result: valid ? 'success' : 'error' });
  };

  const handleClear = () => {
    setGeneratedUuids([]);
    setValidateInput('');
    setValidationResult(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            UUID
          </span> Generator
        </h1>
        <p className="text-text-muted text-lg">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:p-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Generator Section */}
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
            <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
              <h2 className="font-semibold text-text-primary text-lg">{t('generate')}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:bg-bg-dark hover:border-primary hover:text-primary-light transition-all"
                >
                  {t('clear')}
                </button>
                <button
                  onClick={generateUuids}
                  className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all"
                >
                  {t('generateBtn')}
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">{t('version')}</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value as UuidVersion)}
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="v4">UUID v4 ({t('random')})</option>
                    <option value="v7">UUID v7 ({t('timeOrdered')})</option>
                    <option value="v1">UUID v1 ({t('timestamp')})</option>
                    <option value="nil">Nil UUID ({t('allZeros')})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">{t('quantity')}</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span>{t('uppercase')}</span>
                </label>
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noDashes}
                    onChange={(e) => setNoDashes(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span>{t('noDashes')}</span>
                </label>
              </div>

              {generatedUuids.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">
                      {generatedUuids.length} UUID{generatedUuids.length > 1 ? 's' : ''} {t('generated')}
                    </span>
                    {generatedUuids.length > 1 && (
                      <button
                        onClick={handleCopyAll}
                        className="px-3 py-1 bg-primary/20 text-primary-light rounded-lg text-sm hover:bg-primary/30 transition-all"
                      >
                        {t('copyAll')}
                      </button>
                    )}
                  </div>
                  {generatedUuids.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg border border-border group">
                      <code className="flex-1 font-mono text-sm text-text-primary break-all">
                        {item.uuid}
                      </code>
                      <button
                        onClick={() => handleCopy(item.uuid)}
                        className="px-3 py-1 bg-accent text-white rounded text-sm font-semibold opacity-70 group-hover:opacity-100 hover:shadow-lg hover:shadow-accent/40 transition-all"
                      >
                        {t('copy')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Validator Section */}
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
            <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border">
              <h2 className="font-semibold text-text-primary text-lg">{t('validate')}</h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={validateInput}
                  onChange={(e) => {
                    setValidateInput(e.target.value);
                    setValidationResult(null);
                  }}
                  placeholder={t('enterUuidToValidate')}
                  className="flex-1 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleValidate}
                  disabled={!validateInput.trim()}
                  className="px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('validateBtn')}
                </button>
              </div>

              {validationResult && (
                <div className={`mt-4 p-4 rounded-lg border ${
                  validationResult.valid
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl ${validationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                      {validationResult.valid ? '✓' : '✗'}
                    </span>
                    <div>
                      <p className={`font-semibold ${validationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                        {validationResult.valid ? t('validUuid') : t('invalidUuid')}
                      </p>
                      {validationResult.valid && (
                        <p className="text-text-muted text-sm">
                          {t('detectedVersion')}: {validationResult.version}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
            <div className="bg-bg-elevated px-4 md:px-6 py-2 md:py-4 border-b border-border">
              <h2 className="font-semibold text-text-primary text-lg">{t('uuidVersions')}</h2>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="p-3 bg-bg-elevated rounded-lg border border-border">
                <h4 className="font-semibold text-primary-light mb-1">UUID v4</h4>
                <p className="text-text-muted text-sm">{t('v4Description')}</p>
              </div>
              <div className="p-3 bg-bg-elevated rounded-lg border border-border">
                <h4 className="font-semibold text-primary-light mb-1">UUID v7</h4>
                <p className="text-text-muted text-sm">{t('v7Description')}</p>
              </div>
              <div className="p-3 bg-bg-elevated rounded-lg border border-border">
                <h4 className="font-semibold text-primary-light mb-1">UUID v1</h4>
                <p className="text-text-muted text-sm">{t('v1Description')}</p>
              </div>
              <div className="p-3 bg-bg-elevated rounded-lg border border-border">
                <h4 className="font-semibold text-primary-light mb-1">Nil UUID</h4>
                <p className="text-text-muted text-sm">{t('nilDescription')}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-4 md:p-6">
            <h3 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2">
              {t('aboutUuid')}
            </h3>
            <div className="text-text-secondary space-y-3 text-sm">
              <p>{t('aboutDescription')}</p>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">{t('commonUses')}</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('use1')}</li>
                  <li>{t('use2')}</li>
                  <li>{t('use3')}</li>
                  <li>{t('use4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
