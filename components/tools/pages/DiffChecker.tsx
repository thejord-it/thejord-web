import { trackToolUsage, trackCopy, trackError, trackButtonClick } from "@/lib/tools/analytics";
import { useState } from 'react';

interface DiffLine {
  type: 'equal' | 'added' | 'removed';
  text: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

export default function DiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const computeDiff = () => {
    let lines1 = text1.split('\n');
    let lines2 = text2.split('\n');

    // Apply preprocessing
    if (ignoreWhitespace) {
      lines1 = lines1.map((line) => line.trim());
      lines2 = lines2.map((line) => line.trim());
    }

    if (ignoreCase) {
      lines1 = lines1.map((line) => line.toLowerCase());
      lines2 = lines2.map((line) => line.toLowerCase());
    }

    const result: DiffLine[] = [];
    let i = 0,
      j = 0;

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Remaining lines in text2 are additions
        result.push({ type: 'added', text: text2.split('\n')[j], lineNumber2: j + 1 });
        j++;
      } else if (j >= lines2.length) {
        // Remaining lines in text1 are removals
        result.push({ type: 'removed', text: text1.split('\n')[i], lineNumber1: i + 1 });
        i++;
      } else if (lines1[i] === lines2[j]) {
        // Lines are equal
        result.push({
          type: 'equal',
          text: text1.split('\n')[i],
          lineNumber1: i + 1,
          lineNumber2: j + 1
        });
        i++;
        j++;
      } else {
        // Lines differ - check if next line matches
        const nextMatch1 = lines2.indexOf(lines1[i], j + 1);
        const nextMatch2 = lines1.indexOf(lines2[j], i + 1);

        if (nextMatch2 !== -1 && (nextMatch1 === -1 || nextMatch2 < nextMatch1)) {
          // Line was removed
          result.push({ type: 'removed', text: text1.split('\n')[i], lineNumber1: i + 1 });
          i++;
        } else {
          // Line was added
          result.push({ type: 'added', text: text2.split('\n')[j], lineNumber2: j + 1 });
          j++;
        }
      }
    }

    setDiff(result);
  };

  const clear = () => {
    setText1('');
    setText2('');
    setDiff([]);
  };

  const swap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const loadExample = () => {
    setText1(`function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}`);
    setText2(`function calculateTotal(items, tax = 0) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total * (1 + tax);
}`);
  };

  const stats = {
    additions: diff.filter((d) => d.type === 'added').length,
    deletions: diff.filter((d) => d.type === 'removed').length,
    unchanged: diff.filter((d) => d.type === 'equal').length,
    total: diff.length
  };

  return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Text Diff Checker
          </h1>
          <p className="text-gray-400 text-lg">
            Compare two texts and highlight the differences line by line
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={computeDiff}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
          >
            Compare
          </button>
          <button
            onClick={loadExample}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
          >
            Load Example
          </button>
          <button
            onClick={swap}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
          >
            Swap Texts
          </button>
          <button
            onClick={clear}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          >
            Clear All
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="w-4 h-4"
            />
            Line Numbers
          </label>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="w-4 h-4"
            />
            Ignore Whitespace
          </label>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="w-4 h-4"
            />
            Ignore Case
          </label>
        </div>

        {/* Stats */}
        {diff.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Lines</div>
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Unchanged</div>
              <div className="text-2xl font-bold text-gray-400">{stats.unchanged}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Additions</div>
              <div className="text-2xl font-bold text-green-400">{stats.additions}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-red-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Deletions</div>
              <div className="text-2xl font-bold text-red-400">{stats.deletions}</div>
            </div>
          </div>
        )}

        {/* Input Texts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:p-6 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">📄</span>
              Original Text
            </h2>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-64 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">📄</span>
              Modified Text
            </h2>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full h-64 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Diff Output */}
        {diff.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">🔍</span>
              Differences
            </h2>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
              {diff.map((line, index) => (
                <div
                  key={index}
                  className={`flex font-mono text-sm ${
                    line.type === 'added'
                      ? 'bg-green-500/10 border-l-4 border-green-500'
                      : line.type === 'removed'
                      ? 'bg-red-500/10 border-l-4 border-red-500'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {showLineNumbers && (
                    <div className="flex flex-wrap gap-2 px-3 py-2 text-gray-500 select-none bg-gray-800/50 border-r border-gray-700">
                      <span className="w-10 text-right">
                        {line.lineNumber1 || ''}
                      </span>
                      <span className="w-10 text-right">
                        {line.lineNumber2 || ''}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex-1 px-4 py-2 ${
                      line.type === 'added'
                        ? 'text-green-300'
                        : line.type === 'removed'
                        ? 'text-red-300'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className="mr-2">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.text || ' '}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 md:p-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 border-l-2 border-green-500"></div>
              <span className="text-green-400">+ Added line</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/20 border-l-2 border-red-500"></div>
              <span className="text-red-400">- Removed line</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700"></div>
              <span className="text-gray-400">Unchanged line</span>
            </div>
          </div>
        </div>
      </div>
  );
}
