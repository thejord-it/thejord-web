import Layout from '@/components/tools/Layout';
import SEO from '@/components/tools/SEO';
import Toast from '@/components/tools/Toast';
import { useState } from 'react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit.',
  'Esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident.',
  'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
];

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const generateWords = (n: number): string => {
    const words: string[] = [];
    if (startWithLorem) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    while (words.length < n) {
      const word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
      words.push(word);
    }
    return words.slice(0, n).join(' ') + '.';
  };

  const generateSentences = (n: number): string => {
    const sentences: string[] = [];
    if (startWithLorem) {
      sentences.push(LOREM_SENTENCES[0]);
    }
    while (sentences.length < n) {
      const sentence = LOREM_SENTENCES[Math.floor(Math.random() * LOREM_SENTENCES.length)];
      sentences.push(sentence);
    }
    return sentences.slice(0, n).join(' ');
  };

  const generateParagraphs = (n: number): string => {
    const paragraphs: string[] = [];
    for (let i = 0; i < n; i++) {
      const sentenceCount = 3 + Math.floor(Math.random() * 5); // 3-7 sentences per paragraph
      paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
  };

  const generate = () => {
    let result = '';
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        result = generateSentences(count);
        break;
      case 'paragraphs':
        result = generateParagraphs(count);
        break;
    }
    setOutput(result);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clear = () => {
    setOutput('');
  };

  return (
    <Layout showFullNav={false}>
      <SEO
        title="Lorem Ipsum Generator - THEJORD.IT"
        description="Generate Lorem Ipsum placeholder text online. Free Lorem Ipsum generator for mockups and design projects."
        path="/lorem-ipsum"
      />
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
            Lorem Ipsum Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Generate placeholder text for your designs and mockups
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Selection */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">
                Generate
              </label>
              <div className="flex gap-2">
                {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      type === t
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Input */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">
                Count: {count}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1"
                  max={type === 'words' ? 200 : type === 'sentences' ? 50 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="1"
                  max={type === 'words' ? 200 : type === 'sentences' ? 50 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-20 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span>Start with "Lorem ipsum dolor sit amet"</span>
            </label>
          </div>

          {/* Generate Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={generate}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
            >
              Generate Lorem Ipsum
            </button>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
            >
              Copy
            </button>
            <button
              onClick={clear}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Characters</div>
            <div className="text-2xl font-bold text-purple-400">{output.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Words</div>
            <div className="text-2xl font-bold text-pink-400">
              {output.split(/\s+/).filter(Boolean).length}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Sentences</div>
            <div className="text-2xl font-bold text-blue-400">
              {output.split(/[.!?]+/).filter(Boolean).length}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Paragraphs</div>
            <div className="text-2xl font-bold text-green-400">
              {output.split(/\n\n+/).filter(Boolean).length}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">📄</span>
            Generated Text
          </h2>
          <textarea
            value={output}
            readOnly
            placeholder="Click 'Generate Lorem Ipsum' to create placeholder text..."
            className="w-full h-96 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 text-sm leading-relaxed focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>

        {/* Info */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">What is Lorem Ipsum?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Lorem Ipsum is placeholder text commonly used in the graphic, print, and publishing
            industries for previewing layouts and visual mockups. It helps designers and
            developers focus on design elements without being distracted by meaningful content.
            The text is derived from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
            Malorum" by Cicero, written in 45 BC.
          </p>
        </div>
      </div>
    </Layout>
  );
}
