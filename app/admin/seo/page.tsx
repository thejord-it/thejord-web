'use client'

import { useState, useCallback, useEffect } from 'react'

interface JobResult {
  id: string
  type: 'sitemap' | 'content-links' | 'indexing' | 'search-analytics'
  status: 'running' | 'completed' | 'error'
  startedAt: Date
  completedAt?: Date
  result?: unknown
  error?: string
}

interface IndexingResult {
  url: string
  indexed: boolean
  verdict: string
  lastCrawl?: string
  error?: string | null
}

interface SearchQuery {
  query: string
  clicks: number
  impressions: number
  ctr: string
  position: string
}

interface SearchPage {
  page: string
  clicks: number
  impressions: number
  ctr: string
  position: string
}

interface Issue {
  type: string
  severity: 'error' | 'warning' | 'info'
  message: string
  url?: string
}

interface HealthSummary {
  sitemap?: { total: number; ok: number; broken: { url: string; status: number | string }[] }
  contentLinks?: { total: number; ok: number; broken: { url: string; status: number | string }[] }
  timestamp: string
  issues: Issue[]
}

interface RssStats {
  total: number
  byLanguage: Record<string, number>
  period: string
}

interface RssReader {
  userAgent: string
  count: number
}

export default function SEOPage() {
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [activeJob, setActiveJob] = useState<string | null>(null)
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null)
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [rssStats, setRssStats] = useState<RssStats | null>(null)
  const [rssReaders, setRssReaders] = useState<RssReader[]>([])
  const [loadingRss, setLoadingRss] = useState(false)

  // Load health summary on mount
  useEffect(() => {
    const saved = localStorage.getItem('thejord_health_summary')
    if (saved) {
      setHealthSummary(JSON.parse(saved))
    }
  }, [])

  // Run full health check
  const runHealthCheck = useCallback(async () => {
    setLoadingHealth(true)
    try {
      const res = await fetch('/api/health-check?check=all')
      const data = await res.json()
      if (data.success) {
        setHealthSummary(data.data)
        localStorage.setItem('thejord_health_summary', JSON.stringify(data.data))
      }
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoadingHealth(false)
    }
  }, [])

  // Load RSS stats
  const loadRssStats = useCallback(async () => {
    setLoadingRss(true)
    try {
      const [statsRes, readersRes] = await Promise.all([
        fetch('/api/analytics?action=rss-stats'),
        fetch('/api/analytics?action=rss-readers'),
      ])
      const statsData = await statsRes.json()
      const readersData = await readersRes.json()
      
      if (statsData.success) setRssStats(statsData.data)
      if (readersData.success) setRssReaders(readersData.data.readers || [])
    } catch (error) {
      console.error('RSS stats failed:', error)
    } finally {
      setLoadingRss(false)
    }
  }, [])

  // Load RSS stats on mount
  useEffect(() => {
    loadRssStats()
  }, [loadRssStats])

  // Run a job
  const runJob = useCallback(async (type: JobResult['type']) => {
    const jobId = `${type}-${Date.now()}`
    const newJob: JobResult = {
      id: jobId,
      type,
      status: 'running',
      startedAt: new Date(),
    }

    setJobs(prev => [newJob, ...prev])
    setActiveJob(jobId)

    try {
      let result: unknown

      switch (type) {
        case 'sitemap':
          result = await runSitemapCheck()
          break
        case 'content-links':
          result = await runContentLinksCheck()
          break
        case 'indexing':
          result = await runIndexingCheck()
          break
        case 'search-analytics':
          result = await runSearchAnalytics()
          break
      }

      setJobs(prev => prev.map(j =>
        j.id === jobId
          ? { ...j, status: 'completed', completedAt: new Date(), result }
          : j
      ))
    } catch (error) {
      setJobs(prev => prev.map(j =>
        j.id === jobId
          ? { ...j, status: 'error', completedAt: new Date(), error: error instanceof Error ? error.message : 'Unknown error' }
          : j
      ))
    }
  }, [])

  const errorCount = healthSummary?.issues.filter(i => i.severity === 'error').length || 0
  const warningCount = healthSummary?.issues.filter(i => i.severity === 'warning').length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">SEO & Maintenance</h1>
          <p className="text-text-muted mt-1">Monitor site health, indexing status, and search performance</p>
        </div>
        <button
          onClick={runHealthCheck}
          disabled={loadingHealth}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loadingHealth ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Run Full Health Check
            </>
          )}
        </button>
      </div>

      {/* Health Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${errorCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <div className="text-3xl font-bold text-center">{errorCount}</div>
          <div className="text-center text-sm text-text-muted">Errors</div>
        </div>
        <div className={`p-4 rounded-lg border ${warningCount > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <div className="text-3xl font-bold text-center">{warningCount}</div>
          <div className="text-center text-sm text-text-muted">Warnings</div>
        </div>
        <div className="p-4 rounded-lg border bg-bg-surface border-border">
          <div className="text-3xl font-bold text-center">{healthSummary?.sitemap?.total || '-'}</div>
          <div className="text-center text-sm text-text-muted">Sitemap URLs</div>
        </div>
        <div className="p-4 rounded-lg border bg-bg-surface border-border">
          <div className="text-3xl font-bold text-center">{healthSummary?.contentLinks?.total || '-'}</div>
          <div className="text-center text-sm text-text-muted">Internal Links</div>
        </div>
      </div>

      {/* RSS Feed Statistics */}
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span className="text-orange-500">📡</span> RSS Feed Statistics
          </h2>
          <button
            onClick={loadRssStats}
            disabled={loadingRss}
            className="text-sm text-primary hover:text-primary-light transition-colors disabled:opacity-50"
          >
            {loadingRss ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="p-6">
          {rssStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-400">{rssStats.total}</div>
                  <div className="text-sm text-text-muted">Total Accesses ({rssStats.period})</div>
                </div>
                <div className="bg-bg-dark rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-text-primary">{rssStats.byLanguage['it'] || 0}</div>
                  <div className="text-sm text-text-muted">Italian Feed</div>
                </div>
                <div className="bg-bg-dark rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-text-primary">{rssStats.byLanguage['en'] || 0}</div>
                  <div className="text-sm text-text-muted">English Feed</div>
                </div>
              </div>
              
              {rssReaders.length > 0 && (
                <div>
                  <h4 className="text-text-primary font-medium mb-2">Top RSS Readers</h4>
                  <div className="bg-bg-dark rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-text-muted text-left border-b border-border">
                          <th className="px-4 py-2">User Agent</th>
                          <th className="px-4 py-2 text-right">Requests</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rssReaders.slice(0, 5).map((reader, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-text-secondary truncate max-w-xs">{reader.userAgent}</td>
                            <td className="px-4 py-2 text-right text-text-muted">{reader.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-text-muted py-4">
              {loadingRss ? 'Loading RSS statistics...' : 'No RSS data available yet'}
            </div>
          )}
        </div>
      </div>

      {/* Issues List */}
      {healthSummary && healthSummary.issues.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Issues Found</h2>
            <span className="text-text-muted text-sm">
              Last check: {new Date(healthSummary.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="divide-y divide-border max-h-80 overflow-auto">
            {healthSummary.issues.map((issue, i) => (
              <div key={i} className="px-6 py-3 flex items-start gap-3">
                <span className={`text-lg ${
                  issue.severity === 'error' ? 'text-red-400' :
                  issue.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {issue.severity === 'error' ? '●' : issue.severity === 'warning' ? '▲' : 'ℹ'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary">{issue.message}</div>
                  {issue.url && (
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline truncate block"
                    >
                      {issue.url.replace('https://thejord.it', '')}
                    </a>
                  )}
                </div>
                <span className="text-text-muted text-xs uppercase">{issue.type.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {healthSummary && healthSummary.issues.length === 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <div className="text-green-400 font-semibold">All checks passed!</div>
          <div className="text-text-muted text-sm mt-1">
            Last check: {new Date(healthSummary.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Job Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <JobCard
          title="Check Sitemap"
          description="Verify all sitemap URLs are accessible"
          icon="🗺️"
          onClick={() => runJob('sitemap')}
          disabled={jobs.some(j => j.type === 'sitemap' && j.status === 'running')}
        />
        <JobCard
          title="Check Content Links"
          description="Verify internal links in blog posts and tools"
          icon="🔗"
          onClick={() => runJob('content-links')}
          disabled={jobs.some(j => j.type === 'content-links' && j.status === 'running')}
        />
        <JobCard
          title="Check Indexing"
          description="Verify Google indexing status via Search Console"
          icon="📊"
          onClick={() => runJob('indexing')}
          disabled={jobs.some(j => j.type === 'indexing' && j.status === 'running')}
        />
        <JobCard
          title="Search Analytics"
          description="View top queries and pages from Search Console"
          icon="📈"
          onClick={() => runJob('search-analytics')}
          disabled={jobs.some(j => j.type === 'search-analytics' && j.status === 'running')}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-bg-surface border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              const res = await fetch('/api/search-console?action=submit-sitemap')
              const data = await res.json()
              alert(data.success ? 'Sitemap submitted!' : `Error: ${data.error}`)
            }}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            Submit Sitemap to Google
          </button>
          <a
            href="https://search.google.com/search-console?resource_id=sc-domain%3Athejord.it"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-bg-elevated text-text-secondary rounded-lg hover:text-text-primary transition-colors"
          >
            Open Search Console →
          </a>
          <a
            href="https://github.com/thejord-it/thejord-web/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-bg-elevated text-text-secondary rounded-lg hover:text-text-primary transition-colors"
          >
            GitHub Actions →
          </a>
        </div>
      </div>

      {/* Job Results */}
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Job Results</h2>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            No jobs run yet. Click a job card above to start.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map(job => (
              <div
                key={job.id}
                className={`p-4 cursor-pointer hover:bg-bg-dark transition-colors ${
                  activeJob === job.id ? 'bg-bg-dark' : ''
                }`}
                onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={job.status} />
                    <div>
                      <span className="font-medium text-text-primary capitalize">
                        {job.type.replace('-', ' ')}
                      </span>
                      <span className="text-text-muted text-sm ml-2">
                        {job.startedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.completedAt && (
                      <span className="text-text-muted text-sm">
                        {Math.round((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)}s
                      </span>
                    )}
                    <span className="text-text-muted">
                      {activeJob === job.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* Expanded Results */}
                {activeJob === job.id && job.result !== undefined && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <JobResultDisplay type={job.type} result={job.result} />
                  </div>
                )}

                {activeJob === job.id && job.error && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">
                      {job.error}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Job Card Component
function JobCard({
  title,
  description,
  icon,
  onClick,
  disabled,
}: {
  title: string
  description: string
  icon: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-6 bg-bg-surface border border-border rounded-lg text-left transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-primary hover:shadow-lg hover:shadow-primary/10'
      }`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-text-primary">{title}</h3>
      <p className="text-text-muted text-sm mt-1">{description}</p>
      {disabled && (
        <div className="mt-2 flex items-center gap-2 text-primary text-sm">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Running...
        </div>
      )}
    </button>
  )
}

// Status Icon
function StatusIcon({ status }: { status: JobResult['status'] }) {
  if (status === 'running') {
    return (
      <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    )
  }
  if (status === 'completed') {
    return <span className="text-green-400 text-xl">✓</span>
  }
  return <span className="text-red-400 text-xl">✗</span>
}

// Job Result Display
function JobResultDisplay({ type, result }: { type: JobResult['type']; result: unknown }) {
  if (type === 'sitemap' || type === 'content-links') {
    const data = result as { total: number; ok: number; broken: { url: string; status: string | number }[] }
    return (
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="bg-green-500/10 text-green-400 px-3 py-2 rounded-lg">
            OK: {data.ok}
          </div>
          <div className={`px-3 py-2 rounded-lg ${data.broken.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-bg-dark text-text-muted'}`}>
            Broken: {data.broken.length}
          </div>
          <div className="bg-bg-dark text-text-muted px-3 py-2 rounded-lg">
            Total: {data.total}
          </div>
        </div>
        {data.broken.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <div className="text-red-400 font-medium mb-2">Broken URLs:</div>
            <ul className="space-y-1 text-sm">
              {data.broken.map((b, i) => (
                <li key={i} className="text-text-muted">
                  [{b.status}] {b.url}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (type === 'indexing') {
    const data = result as { summary: { total: number; indexed: number; notIndexed: number; errors: number }; data: IndexingResult[] }
    const notIndexed = data.data.filter((r: IndexingResult) => !r.indexed && !r.error)
    return (
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="bg-green-500/10 text-green-400 px-3 py-2 rounded-lg">
            Indexed: {data.summary.indexed}
          </div>
          <div className={`px-3 py-2 rounded-lg ${data.summary.notIndexed > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-bg-dark text-text-muted'}`}>
            Not Indexed: {data.summary.notIndexed}
          </div>
          <div className={`px-3 py-2 rounded-lg ${data.summary.errors > 0 ? 'bg-red-500/10 text-red-400' : 'bg-bg-dark text-text-muted'}`}>
            Errors: {data.summary.errors}
          </div>
        </div>
        {notIndexed.length > 0 && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            <div className="text-yellow-400 font-medium mb-2">Not Indexed:</div>
            <ul className="space-y-1 text-sm">
              {notIndexed.slice(0, 10).map((r: IndexingResult, i: number) => (
                <li key={i} className="text-text-muted">
                  {r.url.replace('https://thejord.it', '')} - {r.verdict}
                </li>
              ))}
              {notIndexed.length > 10 && (
                <li className="text-text-muted">... and {notIndexed.length - 10} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (type === 'search-analytics') {
    const data = result as { queries: SearchQuery[]; pages: SearchPage[] }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-text-primary font-medium mb-2">Top Queries (28 days)</h4>
          <div className="bg-bg-dark rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-left">
                  <th className="px-3 py-2">Query</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-right">Impressions</th>
                  <th className="px-3 py-2 text-right">CTR</th>
                  <th className="px-3 py-2 text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.queries.slice(0, 10).map((q: SearchQuery, i: number) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-text-primary">{q.query}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{q.clicks}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{q.impressions}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{q.ctr}%</td>
                    <td className="px-3 py-2 text-right text-text-muted">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 className="text-text-primary font-medium mb-2">Top Pages</h4>
          <div className="bg-bg-dark rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-left">
                  <th className="px-3 py-2">Page</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-right">Impressions</th>
                  <th className="px-3 py-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.pages.slice(0, 10).map((p: SearchPage, i: number) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-text-primary truncate max-w-xs">
                      {p.page.replace('https://thejord.it', '')}
                    </td>
                    <td className="px-3 py-2 text-right text-text-muted">{p.clicks}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{p.impressions}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{p.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return <pre className="text-xs text-text-muted overflow-auto">{JSON.stringify(result, null, 2)}</pre>
}

// Job implementations
async function runSitemapCheck() {
  // Fetch sitemap
  const sitemapRes = await fetch('https://thejord.it/sitemap.xml')
  const sitemapText = await sitemapRes.text()
  const urls: string[] = []
  const matches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)
  for (const match of matches) {
    urls.push(match[1])
  }

  // Check each URL
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        return { url, status: res.status, ok: res.ok }
      } catch {
        return { url, status: 'ERROR', ok: false }
      }
    })
  )

  return {
    total: results.length,
    ok: results.filter(r => r.ok).length,
    broken: results.filter(r => !r.ok).map(r => ({ url: r.url, status: r.status })),
  }
}

async function runContentLinksCheck() {
  // This would require server-side execution to avoid CORS
  // For now, return a placeholder
  return {
    total: 0,
    ok: 0,
    broken: [],
    message: 'Content link checking requires server-side execution. Use the CLI script instead.',
  }
}

async function runIndexingCheck() {
  // Fetch sitemap first
  const sitemapRes = await fetch('https://thejord.it/sitemap.xml')
  const sitemapText = await sitemapRes.text()
  const urls: string[] = []
  const matches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)
  for (const match of matches) {
    urls.push(match[1])
  }

  // Use our API to check indexing
  const res = await fetch('/api/search-console', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'batch-inspect', urls }),
  })

  return await res.json()
}

async function runSearchAnalytics() {
  const [queriesRes, pagesRes] = await Promise.all([
    fetch('/api/search-console?action=analytics'),
    fetch('/api/search-console?action=pages'),
  ])

  const queries = await queriesRes.json()
  const pages = await pagesRes.json()

  return {
    queries: queries.data || [],
    pages: pages.data || [],
  }
}
