import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'THEJORD'
  const subtitle = searchParams.get('subtitle') || 'Developer Tools & Blog'
  const tag = searchParams.get('tag') || ''
  const locale = searchParams.get('locale') || 'it'
  const type = searchParams.get('type') || 'blog' // blog, tool, page

  // Color scheme based on type
  const colors = {
    blog: { accent: '#3B82F6', bg: '#0a0a0a' },
    tool: { accent: '#10B981', bg: '#0a0a0a' },
    page: { accent: '#8B5CF6', bg: '#0a0a0a' },
  }
  const { accent, bg } = colors[type as keyof typeof colors] || colors.blog

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bg,
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${accent}15 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${accent}10 0%, transparent 40%)`,
          }}
        />

        {/* Top bar with logo and tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${accent}, ${accent}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              TJ
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '2px',
              }}
            >
              THEJORD
            </span>
          </div>

          {/* Tag badge */}
          {tag && (
            <div
              style={{
                display: 'flex',
                padding: '8px 20px',
                backgroundColor: `${accent}20`,
                borderRadius: '999px',
                border: `2px solid ${accent}40`,
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  color: accent,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {tag}
              </span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 60 ? '48px' : title.length > 40 ? '56px' : '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              lineHeight: 1.5,
              maxWidth: '800px',
            }}
          >
            {subtitle.length > 120 ? subtitle.slice(0, 120) + '...' : subtitle}
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #27272a',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              color: '#71717a',
            }}
          >
            thejord.it
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#71717a',
              }}
            >
              {locale === 'it' ? 'Italiano' : 'English'}
            </span>
            <span
              style={{
                fontSize: '20px',
              }}
            >
              {locale === 'it' ? '🇮🇹' : '🇬🇧'}
            </span>
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${accent}, ${accent}60, transparent)`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
