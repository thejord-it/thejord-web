import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-bg-dark border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img src="/logo.png" alt="The Jord Logo" className="h-10 w-auto" width="96" height="89" />
              </picture>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                THE JORD
              </span>
            </Link>
            <p className="text-text-muted text-sm">
              {t('footer.brand.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/json-formatter" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('home.tools.jsonFormatter.name')}
                </Link>
              </li>
              <li>
                <Link to="/cron-builder" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('home.tools.cron.name')}
                </Link>
              </li>
              <li>
                <Link to="/base64" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('home.tools.base64.name')}
                </Link>
              </li>
              <li>
                <Link to="/regex-tester" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('home.tools.regexTester.name')}
                </Link>
              </li>
              <li>
                <Link to="/hash-generator" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('home.tools.hashGenerator.name')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">{t('footer.community')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/thejord-it/thejord-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-light transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  {t('footer.github')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/thejord-it/thejord-tools/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-light transition-colors text-sm"
                >
                  {t('footer.issues')}
                </a>
              </li>
              <li>
                <Link to="/changelog" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('footer.changelog')}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/thejord-it/thejord-tools/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-light transition-colors text-sm"
                >
                  {t('footer.contributing')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-primary-light transition-colors text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/thejord-it/thejord-tools/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-light transition-colors text-sm"
                >
                  {t('footer.mitLicense')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm text-center md:text-left">
              {t('footer.madeWith')} • {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-4 text-text-muted text-sm">
              <span>{t('footer.values.openSource')}</span>
              <span>•</span>
              <span>{t('footer.values.clientSide')}</span>
              <span>•</span>
              <span>{t('footer.values.free')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
