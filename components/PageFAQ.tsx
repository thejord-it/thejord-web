import { getPageFAQs } from '@/lib/page-faq'

// Renders a visible FAQ section + FAQPage JSON-LD for a given page.
// Server-renderable (no hooks) so it works in both server and client pages.
interface PageFAQProps {
  pageKey: string
  locale: string
}

export default function PageFAQ({ pageKey, locale }: PageFAQProps) {
  const faqs = getPageFAQs(pageKey, locale)
  if (faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
          {locale === 'it' ? 'Domande frequenti' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-bg-dark border border-border rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">{faq.question}</h3>
              <p className="text-text-secondary">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
