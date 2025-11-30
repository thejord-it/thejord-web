import { trackToolUsage, trackCopy, trackError, trackButtonClick } from "@/lib/tools/analytics";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const EXAMPLE_MARKDOWN = `# Markdown Example

## Headings
### H3 Heading
#### H4 Heading

## Text Formatting
**Bold text** and *italic text* and ***bold italic***.

~~Strikethrough~~

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images
[Visit OpenAI](https://openai.com)

![Alt text](https://via.placeholder.com/150)

## Code

Inline \`code\` example.

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Blockquotes
> This is a blockquote
> Multiple lines

## Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Horizontal Rule
---

## Task Lists
- [x] Completed task
- [ ] Incomplete task
`;

export default function MarkdownConverter() {
  const t = useTranslations('toolPages.markdownConverter');
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState('');

  const convertMarkdown = (md: string) => {
    setMarkdown(md);
    try {
      const rawHtml = marked(md) as string;
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtml(sanitizedHtml);
      setPreview(sanitizedHtml);
    } catch (error) {
      setHtml('Error converting markdown');
      setPreview('');
    }
  };

  const loadExample = () => {
    convertMarkdown(EXAMPLE_MARKDOWN);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    trackCopy('markdown_html', 'Markdown Converter');
  };

  const clear = () => {
    setMarkdown('');
    setHtml('');
    setPreview('');
  };

  return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-transparent bg-clip-text">
            Markdown to HTML Converter
          </h1>
          <p className="text-gray-400 text-lg">
            {t('description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={loadExample}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
          >
            Load Example
          </button>
          <button
            onClick={copyHtml}
            disabled={!html}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
          >
            Copy HTML
          </button>
          <button
            onClick={clear}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          >
            Clear All
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">{t('markdownLength')}</div>
            <div className="text-2xl font-bold text-blue-400">{markdown.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">{t('htmlLength')}</div>
            <div className="text-2xl font-bold text-cyan-400">{html.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">{t('lines')}</div>
            <div className="text-2xl font-bold text-green-400">
              {markdown.split('\n').length}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:p-6">
          {/* Markdown Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">📝</span>
              {t('markdownInput')}
            </h2>
            <textarea
              value={markdown}
              onChange={(e) => convertMarkdown(e.target.value)}
              placeholder={t('enterMarkdownHere')}
              className="w-full h-64 md:h-96 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>

          {/* HTML Output */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">💻</span>
              {t('htmlOutput')}
            </h2>
            <textarea
              value={html}
              readOnly
              placeholder={t('htmlWillAppear')}
              className="w-full h-64 md:h-96 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 font-mono text-sm focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">👁️</span>
              {t('livePreview')}
            </h2>
            <div
              className="prose prose-invert max-w-none bg-white text-gray-900 rounded-lg p-4 md:p-6"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {t('syntaxReference')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-2">{t('headers')}</div>
              <code className="text-blue-300"># H1, ## H2, ### H3</code>
            </div>
            <div>
              <div className="text-gray-400 mb-2">{t('emphasis')}</div>
              <code className="text-blue-300">*italic* **bold** ***both***</code>
            </div>
            <div>
              <div className="text-gray-400 mb-2">{t('lists')}</div>
              <code className="text-blue-300">- item or 1. item</code>
            </div>
            <div>
              <div className="text-gray-400 mb-2">{t('links')}</div>
              <code className="text-blue-300">[text](url)</code>
            </div>
            <div>
              <div className="text-gray-400 mb-2">{t('code')}</div>
              <code className="text-blue-300">`inline` or ```block```</code>
            </div>
            <div>
              <div className="text-gray-400 mb-2">{t('quote')}</div>
              <code className="text-blue-300">&gt; quote text</code>
            </div>
          </div>
        </div>
      </div>
  );
}
