// FAQ for all tools - used for FAQPage schema

export interface FAQ {
  question: string
  answer: string
}

export interface ToolFAQs {
  it: FAQ[]
  en: FAQ[]
}

export const TOOLS_FAQ: Record<string, ToolFAQs> = {
  'json-formatter': { it: [{ question: 'Come formattare JSON online?', answer: 'Incolla il tuo JSON nel campo di input e clicca Formatta.' },{ question: 'È sicuro usare questo tool?', answer: 'Sì, tutto avviene nel browser.' }], en: [{ question: 'How to format JSON online?', answer: 'Paste your JSON and click Format.' },{ question: 'Is it safe to use?', answer: 'Yes, all processing happens in your browser.' }] },
  'base64': { it: [{ question: 'Cosa significa Base64?', answer: 'Base64 converte dati binari in testo ASCII.' },{ question: 'È sicuro?', answer: 'Sì, tutto avviene nel browser.' }], en: [{ question: 'What is Base64?', answer: 'Base64 converts binary data to ASCII text.' },{ question: 'Is it safe?', answer: 'Yes, all processing happens in your browser.' }] },
  'regex-tester': { it: [{ question: 'Come testare regex?', answer: 'Inserisci la regex e il testo da testare.' }], en: [{ question: 'How to test regex?', answer: 'Enter your regex pattern and test text.' }] },
  'hash-generator': { it: [{ question: 'Quali algoritmi sono supportati?', answer: 'MD5, SHA-1, SHA-256, SHA-512.' }], en: [{ question: 'Which algorithms are supported?', answer: 'MD5, SHA-1, SHA-256, SHA-512.' }] },
  'url-encoder': { it: [{ question: 'Cosa è la codifica URL?', answer: 'Converte caratteri speciali in formato %XX.' }], en: [{ question: 'What is URL encoding?', answer: 'Converts special characters to %XX format.' }] },
  'markdown-converter': { it: [{ question: 'Quale sintassi Markdown?', answer: 'GitHub Flavored Markdown.' }], en: [{ question: 'Which Markdown syntax?', answer: 'GitHub Flavored Markdown.' }] },
  'color-converter': { it: [{ question: 'Quali formati colore?', answer: 'HEX, RGB, HSL.' }], en: [{ question: 'Which color formats?', answer: 'HEX, RGB, HSL.' }] },
  'lorem-ipsum': { it: [{ question: 'Cosa è Lorem Ipsum?', answer: 'Testo segnaposto per design.' }], en: [{ question: 'What is Lorem Ipsum?', answer: 'Placeholder text for design.' }] },
  'diff-checker': { it: [{ question: 'Come confrontare testi?', answer: 'Incolla i testi a sinistra e destra.' }], en: [{ question: 'How to compare texts?', answer: 'Paste texts on left and right.' }] },
  'cron-builder': { it: [{ question: 'Cosa è cron?', answer: 'Stringa per task schedulati.' }], en: [{ question: 'What is cron?', answer: 'String for scheduled tasks.' }] },
  'json-schema': { it: [{ question: 'Cosa è JSON Schema?', answer: 'Standard per struttura JSON.' }], en: [{ question: 'What is JSON Schema?', answer: 'Standard for JSON structure.' }] },
  'xml-wsdl-viewer': { it: [{ question: 'Quali file XML?', answer: 'Qualsiasi XML valido.' }], en: [{ question: 'Which XML files?', answer: 'Any valid XML.' }] },
  'pdf-tools': { it: [{ question: 'Quali operazioni PDF?', answer: 'Unisci, dividi, comprimi.' },{ question: 'Funziona offline?', answer: 'Sì.' }], en: [{ question: 'Which PDF operations?', answer: 'Merge, split, compress.' },{ question: 'Works offline?', answer: 'Yes.' }] },
  'uuid-generator': { it: [{ question: 'Cosa è UUID?', answer: 'Identificatore univoco a 128 bit.' }], en: [{ question: 'What is UUID?', answer: 'Unique 128-bit identifier.' }] }
}

export function getToolFAQs(slug: string, locale: string): FAQ[] {
  const faqs = TOOLS_FAQ[slug]
  if (!faqs) return []
  return locale === 'it' ? faqs.it : faqs.en
}

export function getFAQSchema(slug: string, locale: string) {
  const faqs = getToolFAQs(slug, locale)
  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}
