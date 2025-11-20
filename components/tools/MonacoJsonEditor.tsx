import Editor from '@monaco-editor/react';
import { useState } from 'react';

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

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'relative', height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-bg-dark flex items-center justify-center z-10">
          <div className="text-text-secondary">Loading editor...</div>
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
