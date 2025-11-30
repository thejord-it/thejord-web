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

    // Revalidate blog pages for all locales
    const locales = ['it', 'en']

    // If slug is provided, revalidate the specific blog post page for all locales
    if (slug) {
      for (const locale of locales) {
        revalidatePath(`/${locale}/blog/${slug}`)
        console.log(`Revalidated blog post: /${locale}/blog/${slug}`)
      }
    }

    // Always revalidate blog list page for all locales when any post changes
    for (const locale of locales) {
      revalidatePath(`/${locale}/blog`)
      console.log(`Revalidated /${locale}/blog list page`)
    }

    const revalidatedPaths = [
      path,
      ...locales.map(l => `/${l}/blog`),
      ...(slug ? locales.map(l => `/${l}/blog/${slug}`) : [])
    ].filter(Boolean)

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
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
