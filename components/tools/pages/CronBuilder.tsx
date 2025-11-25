import { trackToolUsage, trackCopy, trackError, trackButtonClick } from "@/lib/tools/analytics";
import { useState, useEffect } from 'react'
import {
  parseCronExpression,
  buildCronExpression,
  validateCronExpression,
  cronToHumanReadable,
  getNextExecutions,
  CRON_PATTERNS,
  type CronExpression
} from '@/lib/tools/cron-utils'

type Tab = 'visual' | 'direct' | 'patterns'

export default function CronBuilder() {
  const [activeTab, setActiveTab] = useState<Tab>('visual')
  const [expression, setExpression] = useState<string>('* * * * *')
  const [cronFields, setCronFields] = useState<CronExpression>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*'
  })
  const [directInput, setDirectInput] = useState<string>('* * * * *')
  const [copySuccess, setCopySuccess] = useState(false)

  // Update expression when fields change
  useEffect(() => {
    if (activeTab === 'visual') {
      const newExpression = buildCronExpression(cronFields)
      setExpression(newExpression)
      setDirectInput(newExpression)
    }
  }, [cronFields, activeTab])

  // Update fields when direct input changes
  useEffect(() => {
    if (activeTab === 'direct') {
      try {
        const parsed = parseCronExpression(directInput)
        setCronFields(parsed)
        setExpression(directInput)
      } catch {
        // Invalid expression, don't update
      }
    }
  }, [directInput, activeTab])

  const validation = validateCronExpression(expression)
  const description = validation.valid ? cronToHumanReadable(expression) : 'Invalid expression'
  const nextRuns = validation.valid ? getNextExecutions(expression, 5) : []

  const handleFieldChange = (field: keyof CronExpression, value: string) => {
    setCronFields(prev => ({ ...prev, [field]: value }))
  }

  const handlePatternSelect = (patternExpression: string) => {
    const parsed = parseCronExpression(patternExpression)
    setCronFields(parsed)
    setExpression(patternExpression)
    setDirectInput(patternExpression)
    setActiveTab('visual')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(expression)
      trackCopy('cron_expression', 'Cron Builder')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const handleClear = () => {
    const defaultCron = { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' }
    setCronFields(defaultCron)
    setDirectInput('* * * * *')
    setExpression('* * * * *')
    trackButtonClick('Clear', 'Cron Builder')
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕐</div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              Cron Expression Builder
            </span>
          </h1>
          <p className="text-text-muted text-lg">
            Build and validate cron schedules with a visual interface
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'visual'
                ? 'text-primary-light'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            🎨 Visual Builder
            {activeTab === 'visual' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'direct'
                ? 'text-primary-light'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ⌨️ Direct Input
            {activeTab === 'direct' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'patterns'
                ? 'text-primary-light'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            📚 Pattern Library
            {activeTab === 'patterns' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light"></div>
            )}
          </button>
        </div>

        {/* Visual Builder Tab */}
        {activeTab === 'visual' && (
          <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <CronField
                label="Minute"
                value={cronFields.minute}
                onChange={(val) => handleFieldChange('minute', val)}
                range="0-59"
                examples="0, 15, 30, 45, */5, 0-30, 0,15,30,45"
              />
              <CronField
                label="Hour"
                value={cronFields.hour}
                onChange={(val) => handleFieldChange('hour', val)}
                range="0-23"
                examples="0, 12, 18, */6, 9-17, 0,6,12,18"
              />
              <CronField
                label="Day of Month"
                value={cronFields.dayOfMonth}
                onChange={(val) => handleFieldChange('dayOfMonth', val)}
                range="1-31"
                examples="1, 15, 28, */5, 1-15, 1,15,30"
              />
              <CronField
                label="Month"
                value={cronFields.month}
                onChange={(val) => handleFieldChange('month', val)}
                range="1-12"
                examples="1, 6, 12, */3, 1-6, 1,4,7,10"
              />
              <CronField
                label="Day of Week"
                value={cronFields.dayOfWeek}
                onChange={(val) => handleFieldChange('dayOfWeek', val)}
                range="0-7 (0 and 7 are Sunday)"
                examples="0, 1, 5, 1-5 (Mon-Fri), 0,6 (weekends)"
              />
            </div>
          </div>
        )}

        {/* Direct Input Tab */}
        {activeTab === 'direct' && (
          <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Cron Expression
            </label>
            <input
              type="text"
              value={directInput}
              onChange={(e) => setDirectInput(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-lg focus:outline-none focus:border-primary transition-colors"
              placeholder="* * * * *"
            />
            <p className="text-text-muted text-sm mt-2">
              Enter a cron expression with 5 fields: minute hour day month weekday
            </p>
          </div>
        )}

        {/* Pattern Library Tab */}
        {activeTab === 'patterns' && (
          <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
            <p className="text-text-secondary mb-4">
              Click on a pattern to apply it to the builder:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CRON_PATTERNS.map((pattern, index) => (
                <button
                  key={index}
                  onClick={() => handlePatternSelect(pattern.expression)}
                  className="bg-bg-elevated border border-border rounded-lg p-4 text-left hover:border-primary transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-text-primary group-hover:text-primary-light transition-colors">
                      {pattern.name}
                    </h3>
                    <code className="text-xs bg-bg-dark px-2 py-1 rounded text-primary-light font-mono">
                      {pattern.expression}
                    </code>
                  </div>
                  <p className="text-sm text-text-muted">{pattern.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expression Output */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Cron Expression</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-primary hover:bg-primary-light text-bg-darkest rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-bg-elevated border border-border hover:border-primary text-text-primary rounded-lg font-semibold transition-colors"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-4 mb-4">
            <code className="text-2xl font-mono text-primary-light">{expression}</code>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-1">Description:</h3>
              <p className={`text-lg ${validation.valid ? 'text-text-primary' : 'text-red-500'}`}>
                {description}
              </p>
            </div>

            {!validation.valid && validation.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-red-400 mb-1">Validation Errors:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-400">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.valid && nextRuns.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-2">Next 5 Executions:</h3>
                <ul className="space-y-1">
                  {nextRuns.map((date, index) => (
                    <li key={index} className="text-text-primary font-mono flex items-center gap-2">
                      <span className="text-primary-light">•</span>
                      {formatDate(date)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Special Characters Guide */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Special Characters Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-elevated border border-border rounded-lg p-4">
              <code className="text-lg font-bold text-primary-light">*</code>
              <p className="text-text-secondary mt-1">
                <strong className="text-text-primary">Wildcard</strong> - Any value
              </p>
              <p className="text-text-muted text-sm">Example: * in minute = every minute</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-4">
              <code className="text-lg font-bold text-primary-light">,</code>
              <p className="text-text-secondary mt-1">
                <strong className="text-text-primary">List</strong> - Multiple values
              </p>
              <p className="text-text-muted text-sm">Example: 0,15,30,45 = at 0, 15, 30, and 45</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-4">
              <code className="text-lg font-bold text-primary-light">-</code>
              <p className="text-text-secondary mt-1">
                <strong className="text-text-primary">Range</strong> - Range of values
              </p>
              <p className="text-text-muted text-sm">Example: 1-5 = from 1 to 5</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-lg p-4">
              <code className="text-lg font-bold text-primary-light">/</code>
              <p className="text-text-secondary mt-1">
                <strong className="text-text-primary">Step</strong> - Step values
              </p>
              <p className="text-text-muted text-sm">Example: */5 = every 5 units</p>
            </div>
          </div>
        </div>

        {/* Field Format Reference */}
        <div className="bg-bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Cron Format Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 px-4 text-text-secondary font-semibold">Position</th>
                  <th className="py-2 px-4 text-text-secondary font-semibold">Field</th>
                  <th className="py-2 px-4 text-text-secondary font-semibold">Allowed Values</th>
                  <th className="py-2 px-4 text-text-secondary font-semibold">Special Characters</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-primary-light">1</td>
                  <td className="py-3 px-4 text-text-primary">Minute</td>
                  <td className="py-3 px-4 text-text-secondary">0-59</td>
                  <td className="py-3 px-4 text-text-muted font-mono">* , - /</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-primary-light">2</td>
                  <td className="py-3 px-4 text-text-primary">Hour</td>
                  <td className="py-3 px-4 text-text-secondary">0-23</td>
                  <td className="py-3 px-4 text-text-muted font-mono">* , - /</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-primary-light">3</td>
                  <td className="py-3 px-4 text-text-primary">Day of Month</td>
                  <td className="py-3 px-4 text-text-secondary">1-31</td>
                  <td className="py-3 px-4 text-text-muted font-mono">* , - /</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-primary-light">4</td>
                  <td className="py-3 px-4 text-text-primary">Month</td>
                  <td className="py-3 px-4 text-text-secondary">1-12</td>
                  <td className="py-3 px-4 text-text-muted font-mono">* , - /</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-primary-light">5</td>
                  <td className="py-3 px-4 text-text-primary">Day of Week</td>
                  <td className="py-3 px-4 text-text-secondary">0-7 (0 and 7 = Sunday)</td>
                  <td className="py-3 px-4 text-text-muted font-mono">* , - /</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
  )
}

interface CronFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  range: string
  examples: string
}

function CronField({ label, value, onChange, range, examples }: CronFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-secondary mb-2">
        {label}
        <span className="text-text-muted ml-2 font-normal">({range})</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary font-mono focus:outline-none focus:border-primary transition-colors"
        placeholder="*"
      />
      <p className="text-text-muted text-xs mt-1">Examples: {examples}</p>
    </div>
  )
}
