import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'it' ? 'en' : 'it'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border hover:border-primary transition-colors text-sm"
      title={i18n.language === 'it' ? 'Switch to English' : 'Passa all\'Italiano'}
    >
      <span className="text-lg">{i18n.language === 'it' ? '🇮🇹' : '🇬🇧'}</span>
      <span className="text-text-secondary">{i18n.language === 'it' ? 'IT' : 'EN'}</span>
    </button>
  )
}
