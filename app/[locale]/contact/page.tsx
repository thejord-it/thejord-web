import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://thejord.it/${locale}/contact`,
      languages: {
        'it': 'https://thejord.it/it/contact',
        'en': 'https://thejord.it/en/contact',
      },
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('title'),
    description: t('description'),
    url: `https://thejord.it/${locale}/contact`,
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'THEJORD', url: 'https://thejord.it' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <ContactForm />
    </>
  )
}
