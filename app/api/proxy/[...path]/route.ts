import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:4000'

/**
 * Proxy all requests to the internal API
 * This keeps the backend API internal and not exposed publicly
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)

  // Don't add /api/ prefix for uploads (static files)
  const apiPath = path.startsWith('uploads') ? `/${path}` : `/api/${path}`
  const targetUrl = `${API_URL}${apiPath}${url.search}`

  // Forward headers (except host)
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value)
    }
  })

  try {
    // Handle body for non-GET requests
    let body: BodyInit | null = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || ''

      if (contentType.includes('multipart/form-data')) {
        // For file uploads, pass the body as-is
        body = await request.blob()
      } else {
        // For JSON/text, get as text
        body = await request.text()
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    })

    // Forward response headers
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      // Skip headers that Next.js handles
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })

    // Handle different response types
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, {
        status: response.status,
        headers: responseHeaders,
      })
    } else {
      // For non-JSON (like images), return as blob
      const blob = await response.blob()
      return new NextResponse(blob, {
        status: response.status,
        headers: responseHeaders,
      })
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal proxy error' },
      { status: 500 }
    )
  }
}
