import { useState, useEffect } from 'react';
import { REGEX_PATTERNS, CATEGORIES, RegexPattern } from '@/lib/tools/regex-patterns';
import Layout from '@/components/tools/Layout';
import SEO from '@/components/tools/SEO';

interface Match {
  match: string;
  index: number;
  groups?: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(pattern, flagString);
      const foundMatches: Match[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Invalid regular expression');
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const handleSelectPattern = (regexPattern: RegexPattern) => {
    setPattern(regexPattern.pattern);
    setTestString(regexPattern.example);
    setFlags({ g: true, i: false, m: false, s: false, u: false });
  };

  const filteredPatterns = REGEX_PATTERNS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highlightMatches = (text: string): JSX.Element[] => {
    if (matches.length === 0) {
      return [<span key={0}>{text}</span>];
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      parts.push(
        <span key={`match-${idx}`} className="bg-accent text-white font-bold px-1 rounded">
          {match.match}
        </span>
      );
      lastIndex = match.index + match.match.length;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <Layout showFullNav={false}>
      <SEO
        title="RegEx Tester - THEJORD.IT"
        description="Test regular expressions online with 30+ predefined patterns. Real-time regex testing for email, URL, phone numbers, and more."
        path="/regex-tester"
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            🔍 <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              RegExp
            </span> Tester
          </h1>
          <p className="text-text-muted text-lg">
            Test regular expressions with real-time matching and highlighting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-text-primary text-lg">Regular Expression</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-text-muted font-mono text-lg">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter your regex pattern..."
                    className="flex-1 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-text-muted font-mono text-lg">/</span>
                  <div className="flex gap-2">
                    {Object.entries(flags).map(([flag, enabled]) => (
                      <button
                        key={flag}
                        onClick={() => setFlags({ ...flags, [flag]: !enabled })}
                        className={`w-8 h-10 rounded-lg font-mono font-bold transition-all ${
                          enabled
                            ? 'bg-primary text-white shadow-lg shadow-primary/40'
                            : 'bg-bg-elevated text-text-muted border border-border hover:border-primary'
                        }`}
                        title={
                          flag === 'g' ? 'Global' :
                          flag === 'i' ? 'Case insensitive' :
                          flag === 'm' ? 'Multiline' :
                          flag === 's' ? 'Dotall' :
                          'Unicode'
                        }
                      >
                        {flag}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                      ✗
                    </div>
                    <span className="text-red-400">{error}</span>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Flags:</span>
                    <span className="font-mono">
                      {Object.entries(flags).filter(([_, v]) => v).map(([k]) => k).join('') || 'none'}
                    </span>
                  </div>
                  {matches.length > 0 && (
                    <div className="flex justify-between text-accent-light font-semibold">
                      <span>Matches found:</span>
                      <span>{matches.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-text-primary text-lg">Test String</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Enter text to test against your regex..."
                  className="w-full h-48 px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
                {testString && (
                  <div className="mt-4 p-4 bg-bg-dark rounded-lg border border-border">
                    <div className="text-sm text-text-secondary mb-2">Highlighted Matches:</div>
                    <div className="font-mono text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">
                      {highlightMatches(testString)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {matches.length > 0 && (
              <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
                <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                  <h2 className="font-semibold text-text-primary text-lg">Match Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {matches.map((match, idx) => (
                      <div key={idx} className="p-4 bg-bg-elevated rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-text-secondary text-sm">Match #{idx + 1}</span>
                          <span className="text-text-muted text-xs">Index: {match.index}</span>
                        </div>
                        <div className="font-mono text-accent-light font-semibold mb-2">{match.match}</div>
                        {match.groups && match.groups.length > 0 && match.groups.some(g => g) && (
                          <div className="text-sm">
                            <div className="text-text-secondary mb-1">Capture Groups:</div>
                            {match.groups.map((group, gIdx) => group && (
                              <div key={gIdx} className="ml-4 text-text-muted">
                                Group {gIdx + 1}: <span className="text-primary-light font-mono">{group}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="bg-bg-elevated px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-text-primary text-lg">Pattern Library</h2>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patterns..."
                  className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-3"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      selectedCategory === 'All'
                        ? 'bg-primary text-white'
                        : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-bg-elevated text-text-secondary hover:bg-bg-dark'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredPatterns.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPattern(p)}
                      className="w-full text-left p-3 bg-bg-elevated rounded-lg border border-border hover:border-primary hover:bg-bg-dark transition-all"
                    >
                      <div className="font-semibold text-text-primary text-sm mb-1">{p.name}</div>
                      <div className="text-text-muted text-xs mb-2">{p.description}</div>
                      <div className="font-mono text-xs text-primary-light break-all">{p.pattern}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
