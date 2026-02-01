// FAQ for blog posts - used for FAQPage schema
// Generated based on blog post tags/topics

export interface FAQ {
  question: string
  answer: string
}

// FAQ templates per topic/tag
const TOPIC_FAQS: Record<string, { it: FAQ[], en: FAQ[] }> = {
  'json': {
    it: [
      { question: 'Come validare JSON online?', answer: 'Usa un validatore JSON che verifica la sintassi e mostra errori in tempo reale.' },
      { question: 'Qual è la differenza tra JSON e XML?', answer: 'JSON è più leggero e leggibile, XML è più verboso ma supporta attributi e namespace.' }
    ],
    en: [
      { question: 'How to validate JSON online?', answer: 'Use a JSON validator that checks syntax and shows errors in real-time.' },
      { question: 'What is the difference between JSON and XML?', answer: 'JSON is lighter and more readable, XML is more verbose but supports attributes and namespaces.' }
    ]
  },
  'regex': {
    it: [
      { question: 'Come testare espressioni regolari?', answer: 'Usa un tester regex online che evidenzia i match in tempo reale.' },
      { question: 'Quali sono i pattern regex più comuni?', answer: 'Email, telefono, URL, codice fiscale e date sono tra i più utilizzati.' }
    ],
    en: [
      { question: 'How to test regular expressions?', answer: 'Use an online regex tester that highlights matches in real-time.' },
      { question: 'What are the most common regex patterns?', answer: 'Email, phone, URL, postal codes and dates are among the most used.' }
    ]
  },
  'cron': {
    it: [
      { question: 'Cosa significa ogni campo cron?', answer: 'I 5 campi sono: minuto, ora, giorno del mese, mese, giorno della settimana.' },
      { question: 'Come schedulare un task ogni 5 minuti?', answer: 'Usa l\'espressione */5 * * * * per eseguire ogni 5 minuti.' }
    ],
    en: [
      { question: 'What does each cron field mean?', answer: 'The 5 fields are: minute, hour, day of month, month, day of week.' },
      { question: 'How to schedule a task every 5 minutes?', answer: 'Use the expression */5 * * * * to run every 5 minutes.' }
    ]
  },
  'base64': {
    it: [
      { question: 'A cosa serve Base64?', answer: 'Base64 converte dati binari in testo ASCII per trasmissione sicura via email o URL.' },
      { question: 'Base64 è una forma di crittografia?', answer: 'No, Base64 è solo encoding, non crittografia. I dati sono facilmente decodificabili.' }
    ],
    en: [
      { question: 'What is Base64 used for?', answer: 'Base64 converts binary data to ASCII text for safe transmission via email or URL.' },
      { question: 'Is Base64 a form of encryption?', answer: 'No, Base64 is just encoding, not encryption. Data can be easily decoded.' }
    ]
  },
  'hash': {
    it: [
      { question: 'Qual è la differenza tra MD5 e SHA-256?', answer: 'SHA-256 è più sicuro e lungo (256 bit vs 128 bit), MD5 è più veloce ma vulnerabile.' },
      { question: 'Si può decifrare un hash?', answer: 'No, gli hash sono funzioni one-way. Si possono solo confrontare o usare rainbow tables.' }
    ],
    en: [
      { question: 'What is the difference between MD5 and SHA-256?', answer: 'SHA-256 is more secure and longer (256 bit vs 128 bit), MD5 is faster but vulnerable.' },
      { question: 'Can you decrypt a hash?', answer: 'No, hashes are one-way functions. You can only compare them or use rainbow tables.' }
    ]
  },
  'url': {
    it: [
      { question: 'Perché codificare gli URL?', answer: 'Per trasmettere caratteri speciali in modo sicuro nei parametri delle query string.' },
      { question: 'Qual è la differenza tra encode e decode URL?', answer: 'Encode converte caratteri speciali in %XX, decode fa il contrario.' }
    ],
    en: [
      { question: 'Why encode URLs?', answer: 'To safely transmit special characters in query string parameters.' },
      { question: 'What is the difference between URL encode and decode?', answer: 'Encode converts special characters to %XX, decode does the opposite.' }
    ]
  },
  'markdown': {
    it: [
      { question: 'Cos\'è Markdown?', answer: 'Un linguaggio di markup leggero per formattare testo in modo semplice e leggibile.' },
      { question: 'Dove si usa Markdown?', answer: 'GitHub, documentazione, blog, note e molte piattaforme di scrittura tecnica.' }
    ],
    en: [
      { question: 'What is Markdown?', answer: 'A lightweight markup language for formatting text in a simple and readable way.' },
      { question: 'Where is Markdown used?', answer: 'GitHub, documentation, blogs, notes and many technical writing platforms.' }
    ]
  },
  'pdf': {
    it: [
      { question: 'Come unire PDF online?', answer: 'Carica i file, riordinali se necessario e scarica il PDF unito.' },
      { question: 'I file PDF vengono inviati a server esterni?', answer: 'No, l\'elaborazione avviene interamente nel browser per garantire la privacy.' }
    ],
    en: [
      { question: 'How to merge PDFs online?', answer: 'Upload files, reorder if needed and download the merged PDF.' },
      { question: 'Are PDF files sent to external servers?', answer: 'No, processing happens entirely in the browser to ensure privacy.' }
    ]
  },
  'uuid': {
    it: [
      { question: 'Cos\'è un UUID?', answer: 'Un identificatore univoco universale a 128 bit usato per identificare risorse.' },
      { question: 'Qual è la differenza tra UUID v1 e v4?', answer: 'V1 usa timestamp e MAC address, v4 è completamente random e più usato.' }
    ],
    en: [
      { question: 'What is a UUID?', answer: 'A 128-bit universally unique identifier used to identify resources.' },
      { question: 'What is the difference between UUID v1 and v4?', answer: 'V1 uses timestamp and MAC address, v4 is completely random and more commonly used.' }
    ]
  },
  'xml': {
    it: [
      { question: 'Come validare XML?', answer: 'Usa un validatore che verifica sintassi e opzionalmente lo schema XSD.' },
      { question: 'Cos\'è WSDL?', answer: 'Web Services Description Language, descrive interfacce di web service SOAP.' }
    ],
    en: [
      { question: 'How to validate XML?', answer: 'Use a validator that checks syntax and optionally the XSD schema.' },
      { question: 'What is WSDL?', answer: 'Web Services Description Language, describes SOAP web service interfaces.' }
    ]
  },
  'color': {
    it: [
      { question: 'Qual è la differenza tra HEX e RGB?', answer: 'HEX usa notazione esadecimale (#RRGGBB), RGB usa valori decimali (0-255).' },
      { question: 'Cos\'è HSL?', answer: 'Hue-Saturation-Lightness, un modello colore più intuitivo per i designer.' }
    ],
    en: [
      { question: 'What is the difference between HEX and RGB?', answer: 'HEX uses hexadecimal notation (#RRGGBB), RGB uses decimal values (0-255).' },
      { question: 'What is HSL?', answer: 'Hue-Saturation-Lightness, a color model more intuitive for designers.' }
    ]
  },
  'diff': {
    it: [
      { question: 'Come confrontare due testi?', answer: 'Incolla i testi nei due campi e le differenze verranno evidenziate automaticamente.' },
      { question: 'Quali formati di diff sono supportati?', answer: 'Diff unificato, side-by-side e inline con evidenziazione colorata.' }
    ],
    en: [
      { question: 'How to compare two texts?', answer: 'Paste texts in both fields and differences will be highlighted automatically.' },
      { question: 'Which diff formats are supported?', answer: 'Unified diff, side-by-side and inline with color highlighting.' }
    ]
  },
  'nextjs': {
    it: [
      { question: 'Cos\'è Next.js?', answer: 'Un framework React per applicazioni web con SSR, SSG e routing automatico.' },
      { question: 'Quali sono i vantaggi di Next.js?', answer: 'SEO migliorato, performance ottimizzate, developer experience eccellente.' }
    ],
    en: [
      { question: 'What is Next.js?', answer: 'A React framework for web applications with SSR, SSG and automatic routing.' },
      { question: 'What are the advantages of Next.js?', answer: 'Improved SEO, optimized performance, excellent developer experience.' }
    ]
  },
  'i18n': {
    it: [
      { question: 'Cos\'è l\'internazionalizzazione (i18n)?', answer: 'Il processo di progettare software per supportare multiple lingue e regioni.' },
      { question: 'Qual è la differenza tra i18n e l10n?', answer: 'i18n è la preparazione tecnica, l10n è l\'adattamento per una specifica lingua/cultura.' }
    ],
    en: [
      { question: 'What is internationalization (i18n)?', answer: 'The process of designing software to support multiple languages and regions.' },
      { question: 'What is the difference between i18n and l10n?', answer: 'i18n is the technical preparation, l10n is the adaptation for a specific language/culture.' }
    ]
  }
}

// Match tags to topics
function getTopicFromTags(tags: string[]): string | null {
  const tagLower = tags.map(t => t.toLowerCase())

  for (const tag of tagLower) {
    if (tag.includes('json')) return 'json'
    if (tag.includes('regex') || tag.includes('espression')) return 'regex'
    if (tag.includes('cron') || tag.includes('crontab')) return 'cron'
    if (tag.includes('base64')) return 'base64'
    if (tag.includes('hash') || tag.includes('md5') || tag.includes('sha')) return 'hash'
    if (tag.includes('url') || tag.includes('encoder')) return 'url'
    if (tag.includes('markdown')) return 'markdown'
    if (tag.includes('pdf')) return 'pdf'
    if (tag.includes('uuid')) return 'uuid'
    if (tag.includes('xml') || tag.includes('wsdl')) return 'xml'
    if (tag.includes('color') || tag.includes('colore')) return 'color'
    if (tag.includes('diff') || tag.includes('compare') || tag.includes('confronta')) return 'diff'
    if (tag.includes('next') || tag.includes('react')) return 'nextjs'
    if (tag.includes('i18n') || tag.includes('internazional') || tag.includes('multilingue')) return 'i18n'
  }

  return null
}

export function getBlogFAQs(tags: string[], locale: string): FAQ[] {
  const topic = getTopicFromTags(tags)
  if (!topic) return []

  const faqs = TOPIC_FAQS[topic]
  if (!faqs) return []

  return locale === 'it' ? faqs.it : faqs.en
}

export function getBlogFAQSchema(tags: string[], locale: string) {
  const faqs = getBlogFAQs(tags, locale)
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
