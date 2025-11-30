export const locales = ['it', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English'
}

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇬🇧'
}
