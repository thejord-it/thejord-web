import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, slug } = body

    // Validate secret token for security (optional but recommended)
    const token = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATE_TOKEN || 'dev-token'

    if (token !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Revalidate specific paths
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // If slug is provided, revalidate the specific blog post page
    if (slug) {
      revalidatePath(`/blog/${slug}`)
      console.log(`Revalidated blog post: /blog/${slug}`)
    }

    // Always revalidate blog list page when any post changes
    revalidatePath('/blog')
    console.log('Revalidated /blog list page')

    return NextResponse.json({
      revalidated: true,
      paths: [path, slug ? `/blog/${slug}` : null, '/blog'].filter(Boolean),
      now: Date.now()
    })
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
