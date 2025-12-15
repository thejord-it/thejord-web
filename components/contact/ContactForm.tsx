'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export default function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'question'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`[THEJORD.IT] ${formData.type.toUpperCase()}: ${formData.subject}`)
    const body = encodeURIComponent(
      `${t('form.name')}: ${formData.name}\n` +
      `${t('form.email')}: ${formData.email}\n` +
      `${t('form.type')}: ${formData.type}\n\n` +
      `${t('form.message')}:\n${formData.message}\n\n` +
      `---\n` +
      `${locale === 'it' ? 'Inviato da' : 'Sent from'} thejord.it/contact`
    )

    window.location.href = `mailto:admin@thejord.it?subject=${subject}&body=${body}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 md:mb-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-bg-dark border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">{t('methods.title')}</h2>

              <div className="space-y-4">
                <a
                  href="mailto:admin@thejord.it"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">{t('methods.email.title')}</h3>
                    <p className="text-text-secondary text-sm mb-2">{t('methods.email.description')}</p>
                    <p className="text-primary">admin@thejord.it</p>
                  </div>
                </a>

                <a
                  href="https://github.com/thejord-it/thejord-web/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">🐛</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">{t('methods.github.title')}</h3>
                    <p className="text-text-secondary text-sm mb-2">{t('methods.github.description')}</p>
                    <p className="text-primary">github.com/thejord-it/thejord-web</p>
                  </div>
                </a>

                <a
                  href="https://github.com/thejord-it/thejord-web/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">💭</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">{t('methods.discussions.title')}</h3>
                    <p className="text-text-secondary text-sm mb-2">{t('methods.discussions.description')}</p>
                    <p className="text-primary">{t('methods.discussions.cta')}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Security Contact */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6">
              <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                <span>🔒</span>
                {t('security.title')}
              </h3>
              <p className="text-text-secondary text-sm mb-3">
                {t('security.warning')}
              </p>
              <p className="text-text-secondary text-sm">
                {t('security.instruction')}
                <a href="mailto:security@thejord.it" className="text-red-400 hover:underline">security@thejord.it</a>
                {t('security.instructionSuffix')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-dark border border-border rounded-xl p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">{t('form.title')}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('form.namePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-2">
                  {t('form.type')}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="question">{t('form.types.question')}</option>
                  <option value="bug">{t('form.types.bug')}</option>
                  <option value="feature">{t('form.types.feature')}</option>
                  <option value="feedback">{t('form.types.feedback')}</option>
                  <option value="other">{t('form.types.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
                  {t('form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('form.subjectPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-bg-darkest font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {t('form.send')}
              </button>

              <p className="text-xs text-text-muted text-center">
                {t('form.note')}
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">{t('faq.title')}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text-primary mb-2">{t('faq.contribute.question')}</h3>
              <p className="text-text-secondary">
                {t('faq.contribute.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">{t('faq.security.question')}</h3>
              <p className="text-text-secondary">
                {t('faq.security.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">{t('faq.selfhost.question')}</h3>
              <p className="text-text-secondary">
                {t('faq.selfhost.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">{t('faq.free.question')}</h3>
              <p className="text-text-secondary">
                {t('faq.free.answer')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">{t('faq.request.question')}</h3>
              <p className="text-text-secondary">
                {t('faq.request.answer')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
