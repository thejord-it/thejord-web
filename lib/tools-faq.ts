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
  'cron-builder': { it: [{ question: 'Cosa è un\'espressione cron?', answer: 'Un\'espressione cron è una stringa di 5 campi (minuto, ora, giorno del mese, mese, giorno della settimana) che definisce quando eseguire un task schedulato su sistemi Unix/Linux. Ad esempio, "0 9 * * 1-5" esegue un job alle 9:00 dal lunedì al venerdì.' },{ question: 'Cosa significa ogni campo di crontab?', answer: 'I 5 campi, in ordine, sono: minuto (0-59), ora (0-23), giorno del mese (1-31), mese (1-12) e giorno della settimana (0-6, dove 0 è domenica). L\'asterisco (*) indica "ogni valore".' },{ question: 'Come si scrive un cron che gira ogni ora?', answer: 'Usa "0 * * * *": il minuto è fisso a 0 e tutti gli altri campi sono asterischi, quindi il job parte all\'inizio di ogni ora. Per ogni 15 minuti usa invece "*/15 * * * *".' },{ question: 'Il tool invia i miei dati a un server?', answer: 'No. Il generatore di espressioni cron funziona interamente nel tuo browser: nessuna espressione o configurazione viene inviata a un server.' }], en: [{ question: 'What is a cron expression?', answer: 'A cron expression is a 5-field string (minute, hour, day of month, month, day of week) that defines when a scheduled task runs on Unix/Linux systems. For example, "0 9 * * 1-5" runs a job at 9:00 AM Monday through Friday.' },{ question: 'What does each crontab field mean?', answer: 'The 5 fields, in order, are: minute (0-59), hour (0-23), day of month (1-31), month (1-12) and day of week (0-6, where 0 is Sunday). An asterisk (*) means "every value".' },{ question: 'How do I write a cron that runs every hour?', answer: 'Use "0 * * * *": the minute is fixed at 0 and every other field is an asterisk, so the job runs at the start of every hour. For every 15 minutes use "*/15 * * * *" instead.' },{ question: 'Does the tool send my data to a server?', answer: 'No. The cron expression builder runs entirely in your browser: no expression or configuration is ever sent to a server.' }] },
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
