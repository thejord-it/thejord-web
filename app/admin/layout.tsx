'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return (
      <html lang="en">
        <body className="antialiased bg-bg-darkest min-h-screen">
          {children}
        </body>
      </html>
    )
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/posts', label: 'Posts', icon: '📝' },
    { href: '/admin/posts/new', label: 'New Post', icon: '➕' },
    { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
    { href: '/admin/seo', label: 'SEO & Health', icon: '🔍' },
    { href: '/admin/strategy', label: 'Strategy', icon: '📈' },
  ]

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-bg-darkest flex">
          {/* Sidebar */}
          <aside className="w-64 bg-bg-surface border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold text-primary">THEJORD</h1>
              <p className="text-sm text-text-muted">Admin Panel</p>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-text-secondary hover:bg-bg-dark hover:text-text-primary'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
