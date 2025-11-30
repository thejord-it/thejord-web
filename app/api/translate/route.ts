import { NextRequest, NextResponse } from 'next/server'

interface TranslateRequest {
  texts: string[]
  sourceLang: 'it' | 'en'
  targetLang: 'it' | 'en'
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string
    text: string
  }>
}

function getDeepLLanguage(lang: 'it' | 'en'): string {
  return lang === 'it' ? 'IT' : 'EN'
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { texts, sourceLang, targetLang } = body

    // Validate input
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'texts array is required' },
        { status: 400 }
      )
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'sourceLang and targetLang are required' },
        { status: 400 }
      )
    }

    // Get API key from server-side environment variable
    const apiKey = process.env.DEEPL_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepL API key not configured', fallback: true },
        { status: 503 }
      )
    }

    // Call DeepL API from server-side (no CORS issues)
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        source_lang: getDeepLLanguage(sourceLang),
        target_lang: getDeepLLanguage(targetLang),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepL API error:', response.status, errorText)
      return NextResponse.json(
        { error: `DeepL API error: ${response.status}`, fallback: true },
        { status: response.status }
      )
    }

    const data: DeepLResponse = await response.json()

    return NextResponse.json({
      success: true,
      provider: 'deepl',
      translations: data.translations.map(t => t.text),
    })

  } catch (error: any) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed', fallback: true },
      { status: 500 }
    )
  }
}
