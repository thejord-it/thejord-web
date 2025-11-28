import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export default function MonacoJsonEditor({
  value,
  onChange,
  readOnly = false,
  height = '400px'
}: MonacoJsonEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Timeout fallback se Monaco non carica in 10 secondi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorDidMount = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Fallback textarea quando Monaco non carica
  if (hasError) {
    return (
      <div style={{ height }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="Enter JSON here..."
          className="w-full h-full px-4 py-3 bg-bg-dark border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary resize-none"
          style={{ minHeight: height }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-bg-dark flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-text-secondary text-sm">Loading editor...</div>
          </div>
        </div>
      )}
      <Editor
        height={height}
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        loading={<div style={{ display: 'none' }} />}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            showKeywords: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
        }}
      />
    </div>
  );
}
