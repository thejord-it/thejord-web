/**
 * Translation utility with DeepL (primary via server proxy) and MyMemory (fallback)
 */

export type TranslationLanguage = 'it' | 'en'

interface TranslationResult {
  success: boolean
  translatedText: string
  error?: string
  provider: 'deepl' | 'mymemory'
}

interface ProxyResponse {
  success?: boolean
  provider?: 'deepl'
  translations?: string[]
  error?: string
  fallback?: boolean
}

interface MyMemoryResponse {
  responseStatus: number
  responseData: {
    translatedText: string
  }
}

/**
 * Translate using DeepL via server-side proxy (avoids CORS issues)
 */
async function translateWithDeepLProxy(
  texts: string[],
  sourceLang: TranslationLanguage,
  targetLang: TranslationLanguage
): Promise<{ success: boolean; translations: string[]; error?: string }> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        sourceLang,
        targetLang,
      }),
    })

    const data: ProxyResponse = await response.json()

    if (!response.ok || data.fallback) {
      throw new Error(data.error || 'DeepL proxy failed')
    }

    return {
      success: true,
      translations: data.translations || [],
    }
  } catch (error: any) {
    console.error('DeepL proxy error:', error)
    return {
      success: false,
      translations: [],
      error: error.message,
    }
  }
}

/**
 * Translate using MyMemory API (free fallback)
 */
async function translateWithMyMemory(
  text: string,
  sourceLang: TranslationLanguage,
  targetLang: TranslationLanguage
): Promise<TranslationResult> {
  try {
    const langPair = `${sourceLang}|${targetLang}`
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`)
    }

    const data: MyMemoryResponse = await response.json()

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory response error: ${data.responseStatus}`)
    }

    return {
      success: true,
      translatedText: data.responseData.translatedText,
      provider: 'mymemory',
    }
  } catch (error: any) {
    console.error('MyMemory translation error:', error)
    return {
      success: false,
      translatedText: '',
      error: error.message,
      provider: 'mymemory',
    }
  }
}

/**
 * Main translation function - uses DeepL proxy first, falls back to MyMemory
 */
export async function translate(
  text: string,
  sourceLang: TranslationLanguage,
  targetLang: TranslationLanguage
): Promise<TranslationResult> {
  // If text is empty, return immediately
  if (!text.trim()) {
    return {
      success: true,
      translatedText: '',
      provider: 'deepl',
    }
  }

  // Try DeepL proxy first
  const proxyResult = await translateWithDeepLProxy([text], sourceLang, targetLang)
  if (proxyResult.success && proxyResult.translations.length > 0) {
    return {
      success: true,
      translatedText: proxyResult.translations[0],
      provider: 'deepl',
    }
  }
  console.warn('DeepL proxy failed, falling back to MyMemory:', proxyResult.error)

  // Fallback to MyMemory
  return translateWithMyMemory(text, sourceLang, targetLang)
}

/**
 * Translate multiple texts in batch (more efficient for DeepL)
 */
export async function translateBatch(
  texts: string[],
  sourceLang: TranslationLanguage,
  targetLang: TranslationLanguage
): Promise<TranslationResult[]> {
  // Try DeepL proxy first (supports batch)
  const proxyResult = await translateWithDeepLProxy(texts, sourceLang, targetLang)

  if (proxyResult.success && proxyResult.translations.length === texts.length) {
    return proxyResult.translations.map(text => ({
      success: true,
      translatedText: text,
      provider: 'deepl' as const,
    }))
  }

  console.warn('DeepL proxy batch failed, falling back to MyMemory:', proxyResult.error)

  // Fallback to MyMemory one by one
  const results: TranslationResult[] = []
  for (const text of texts) {
    // Add small delay to avoid rate limiting
    if (results.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    results.push(await translateWithMyMemory(text, sourceLang, targetLang))
  }
  return results
}

/**
 * Generate a slug from translated title
 */
export function generateSlug(title: string, langSuffix?: string): string {
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '')            // Remove leading/trailing hyphens

  // Add language suffix if provided (e.g., '-en' for English translations)
  if (langSuffix) {
    slug = `${slug}-${langSuffix}`
  }

  return slug
}

/**
 * Generate a translation group ID if not exists
 */
export function generateTranslationGroup(slug: string): string {
  // Use a simplified version of the slug as the translation group
  return slug.replace(/-/g, '-')
}
