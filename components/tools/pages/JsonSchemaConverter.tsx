import { trackToolUsage, trackCopy, trackError, trackButtonClick } from "@/lib/tools/analytics";
import { useState } from 'react'
import MonacoJsonEditor from '@/components/tools/MonacoJsonEditor'
import { jsonToJsonSchema, validateJSON, type JsonSchemaOptions } from '@/lib/tools/schema-generator'

export default function JsonSchemaConverter() {
  const [inputJson, setInputJson] = useState('')
  const [outputSchema, setOutputSchema] = useState('')
  const [schemaTitle, setSchemaTitle] = useState('')
  const [makeRequired, setMakeRequired] = useState(false)
  const [addFormatHints, setAddFormatHints] = useState(true)
  const [schemaVersion, setSchemaVersion] = useState<'draft-2020-12' | 'draft-07'>('draft-2020-12')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const exampleJSON = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "website": "https://example.com",
  "active": true,
  "tags": ["developer", "typescript"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`

  const handleGenerate = () => {
    setError('')

    if (!inputJson.trim()) {
      setError('Please enter JSON data')
      return
    }

    const validation = validateJSON(inputJson)

    if (!validation.valid) {
      setError(validation.error || 'Invalid JSON')
      return
    }

    try {
      const options: JsonSchemaOptions = {
        title: schemaTitle || undefined,
        makeRequired,
        addFormatHints,
        schemaVersion
      }

      const schema = jsonToJsonSchema(validation.parsed, options)
      setOutputSchema(JSON.stringify(schema, null, 2))
      trackToolUsage('JSON Schema Converter', 'generate_schema', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schema')
      trackError('schema_generation_error', err instanceof Error ? err.message : 'Failed to generate schema', 'JSON Schema Converter')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputSchema)
      trackCopy('json_schema', 'JSON Schema Converter')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      alert('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([outputSchema], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = schemaTitle ? `${schemaTitle}.schema.json` : 'schema.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setInputJson('')
    setOutputSchema('')
    setError('')
    setSchemaTitle('')
  }

  const handleLoadExample = () => {
    setInputJson(exampleJSON)
    setError('')
  }

  return (

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              JSON to JSON Schema Converter
            </span>
          </h1>
          <p className="text-text-muted text-lg">
            Generate JSON Schema from your JSON data automatically
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Schema Title (optional)
              </label>
              <input
                type="text"
                value={schemaTitle}
                onChange={(e) => setSchemaTitle(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="My Schema"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Schema Version
              </label>
              <select
                value={schemaVersion}
                onChange={(e) => setSchemaVersion(e.target.value as 'draft-2020-12' | 'draft-07')}
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
              >
                <option value="draft-2020-12">Draft 2020-12 (Latest)</option>
                <option value="draft-07">Draft 07</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={makeRequired}
                onChange={(e) => setMakeRequired(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-text-secondary">Make all fields required</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addFormatHints}
                onChange={(e) => setAddFormatHints(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-text-secondary">Add format hints (email, uri, date, etc.)</span>
            </label>
          </div>
        </div>

        {/* Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input JSON */}
          <div className="bg-bg-surface border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text-primary">Input JSON</h2>
              <button
                onClick={handleLoadExample}
                className="px-3 py-1 text-sm bg-bg-elevated border border-border hover:border-primary text-text-primary rounded-lg transition-colors"
              >
                Load Example
              </button>
            </div>
            <div className="h-96">
              <MonacoJsonEditor
                value={inputJson}
                onChange={setInputJson}
                readOnly={false}
              />
            </div>
          </div>

          {/* Output Schema */}
          <div className="bg-bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Generated Schema</h2>
            <div className="h-96">
              <MonacoJsonEditor
                value={outputSchema}
                onChange={() => {}}
                readOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-bg-darkest rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            ✨ Generate Schema
          </button>

          {outputSchema && (
            <>
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-bg-elevated border border-border hover:border-primary text-text-primary rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy'}
              </button>

              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-bg-elevated border border-border hover:border-primary text-text-primary rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                ⬇️ Download
              </button>
            </>
          )}

          <button
            onClick={handleClear}
            className="px-6 py-3 bg-bg-elevated border border-border hover:border-red-500 text-text-primary rounded-lg font-semibold transition-colors"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Format Detection Reference */}
        <div className="mt-8 bg-bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Format Detection</h2>
          <p className="text-text-secondary mb-4">
            When "Add format hints" is enabled, the converter automatically detects and adds format specifications:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">email</code>
              <p className="text-text-muted text-sm mt-1">user@example.com</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">uri</code>
              <p className="text-text-muted text-sm mt-1">https://example.com</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">date-time</code>
              <p className="text-text-muted text-sm mt-1">2025-11-17T15:30:00Z</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">date</code>
              <p className="text-text-muted text-sm mt-1">2025-11-17</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">uuid</code>
              <p className="text-text-muted text-sm mt-1">550e8400-e29b-41d4-a716-446655440000</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-3">
              <code className="text-primary-light">ipv4</code>
              <p className="text-text-muted text-sm mt-1">192.168.1.1</p>
            </div>
          </div>
        </div>

        {/* Type Mapping Reference */}
        <div className="mt-6 bg-bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">JSON to JSON Schema Type Mapping</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 px-4 text-text-secondary font-semibold">JSON Type</th>
                  <th className="py-2 px-4 text-text-secondary font-semibold">Schema Type</th>
                  <th className="py-2 px-4 text-text-secondary font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">string</td>
                  <td className="py-3 px-4 text-primary-light">"string"</td>
                  <td className="py-3 px-4 text-text-muted">"Hello"</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">number (integer)</td>
                  <td className="py-3 px-4 text-primary-light">"integer"</td>
                  <td className="py-3 px-4 text-text-muted">42</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">number (float)</td>
                  <td className="py-3 px-4 text-primary-light">"number"</td>
                  <td className="py-3 px-4 text-text-muted">3.14</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">boolean</td>
                  <td className="py-3 px-4 text-primary-light">"boolean"</td>
                  <td className="py-3 px-4 text-text-muted">true</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">null</td>
                  <td className="py-3 px-4 text-primary-light">"null"</td>
                  <td className="py-3 px-4 text-text-muted">null</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-primary">array</td>
                  <td className="py-3 px-4 text-primary-light">"array"</td>
                  <td className="py-3 px-4 text-text-muted">[1, 2, 3]</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-text-primary">object</td>
                  <td className="py-3 px-4 text-primary-light">"object"</td>
                  <td className="py-3 px-4 text-text-muted">{"{"} "key": "value" {"}"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
  )
}
