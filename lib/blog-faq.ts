// FAQ for blog posts - used for FAQPage schema + visible FAQ section.
// Generated based on blog post tags/topics (and slug as a fallback signal).

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
  },
  'docker': {
    it: [
      { question: 'A cosa serve Docker?', answer: 'Docker impacchetta un\'applicazione e le sue dipendenze in un container isolato che gira identico su qualsiasi macchina.' },
      { question: 'Qual è la differenza tra immagine e container Docker?', answer: 'L\'immagine è il template di sola lettura, il container è un\'istanza in esecuzione di quell\'immagine.' }
    ],
    en: [
      { question: 'What is Docker used for?', answer: 'Docker packages an application and its dependencies into an isolated container that runs the same on any machine.' },
      { question: 'What is the difference between a Docker image and a container?', answer: 'The image is the read-only template, the container is a running instance of that image.' }
    ]
  },
  'typescript': {
    it: [
      { question: 'Perché usare TypeScript invece di JavaScript?', answer: 'TypeScript aggiunge tipizzazione statica che intercetta errori a compile-time e migliora autocompletamento e refactoring.' },
      { question: 'TypeScript sostituisce JavaScript?', answer: 'No, TypeScript è un superset che compila in JavaScript standard: non è un linguaggio separato.' }
    ],
    en: [
      { question: 'Why use TypeScript instead of JavaScript?', answer: 'TypeScript adds static typing that catches errors at compile-time and improves autocompletion and refactoring.' },
      { question: 'Does TypeScript replace JavaScript?', answer: 'No, TypeScript is a superset that compiles to standard JavaScript: it is not a separate language.' }
    ]
  },
  'websocket': {
    it: [
      { question: 'Qual è la differenza tra WebSocket e REST?', answer: 'REST è request-response stateless, WebSocket mantiene una connessione bidirezionale persistente per dati in tempo reale.' },
      { question: 'Quando usare GraphQL al posto di REST?', answer: 'Quando il client deve richiedere esattamente i campi che gli servono, evitando over-fetching su più endpoint.' }
    ],
    en: [
      { question: 'What is the difference between WebSocket and REST?', answer: 'REST is stateless request-response, WebSocket keeps a persistent two-way connection for real-time data.' },
      { question: 'When should you use GraphQL instead of REST?', answer: 'When the client needs to request exactly the fields it needs, avoiding over-fetching across multiple endpoints.' }
    ]
  },
  'cicd': {
    it: [
      { question: 'Cos\'è una pipeline CI/CD?', answer: 'Un flusso automatizzato che testa, builda e rilascia il codice a ogni push, riducendo gli errori manuali.' },
      { question: 'Cosa sono le GitHub Actions?', answer: 'Un sistema di automazione integrato in GitHub che esegue workflow (test, build, deploy) definiti in file YAML.' }
    ],
    en: [
      { question: 'What is a CI/CD pipeline?', answer: 'An automated flow that tests, builds and ships code on every push, reducing manual errors.' },
      { question: 'What are GitHub Actions?', answer: 'An automation system built into GitHub that runs workflows (test, build, deploy) defined in YAML files.' }
    ]
  },
  'npm': {
    it: [
      { question: 'Qual è la differenza tra npm, yarn e pnpm?', answer: 'Fanno la stessa cosa (gestire dipendenze); pnpm è il più efficiente su disco, npm e yarn i più diffusi.' },
      { question: 'A cosa serve il file package-lock?', answer: 'Blocca le versioni esatte delle dipendenze così l\'installazione è riproducibile su ogni macchina.' }
    ],
    en: [
      { question: 'What is the difference between npm, yarn and pnpm?', answer: 'They do the same thing (manage dependencies); pnpm is the most disk-efficient, npm and yarn the most widespread.' },
      { question: 'What is the package-lock file for?', answer: 'It pins the exact dependency versions so installs are reproducible on every machine.' }
    ]
  },
  'cors': {
    it: [
      { question: 'Cos\'è un errore CORS?', answer: 'Il browser blocca una richiesta cross-origin quando il server non include gli header CORS che la autorizzano.' },
      { question: 'Come si risolve un errore CORS?', answer: 'Configurando il server per inviare l\'header Access-Control-Allow-Origin con l\'origine (o le origini) consentite.' }
    ],
    en: [
      { question: 'What is a CORS error?', answer: 'The browser blocks a cross-origin request when the server does not include the CORS headers that authorize it.' },
      { question: 'How do you fix a CORS error?', answer: 'By configuring the server to send the Access-Control-Allow-Origin header with the allowed origin (or origins).' }
    ]
  },
  'sql': {
    it: [
      { question: 'Qual è la differenza tra SQL e NoSQL?', answer: 'SQL usa schemi relazionali rigidi e tabelle, NoSQL è flessibile e scala orizzontalmente per dati non strutturati.' },
      { question: 'Quando scegliere un database NoSQL?', answer: 'Quando servono flessibilità dello schema, grandi volumi e scalabilità orizzontale più che transazioni complesse.' }
    ],
    en: [
      { question: 'What is the difference between SQL and NoSQL?', answer: 'SQL uses rigid relational schemas and tables, NoSQL is flexible and scales horizontally for unstructured data.' },
      { question: 'When should you choose a NoSQL database?', answer: 'When you need schema flexibility, large volumes and horizontal scalability more than complex transactions.' }
    ]
  },
  'database': {
    it: [
      { question: 'Ogni quanto fare il backup di un database?', answer: 'Dipende dalla criticità: molti sistemi usano backup giornalieri completi più backup incrementali frequenti.' },
      { question: 'Qual è la differenza tra backup completo e incrementale?', answer: 'Il completo copia tutti i dati, l\'incrementale solo le modifiche dall\'ultimo backup, risparmiando spazio e tempo.' }
    ],
    en: [
      { question: 'How often should you back up a database?', answer: 'It depends on how critical it is: many systems use daily full backups plus frequent incremental backups.' },
      { question: 'What is the difference between a full and an incremental backup?', answer: 'A full backup copies all data, an incremental one only the changes since the last backup, saving space and time.' }
    ]
  },
  'env': {
    it: [
      { question: 'A cosa servono le variabili d\'ambiente?', answer: 'A separare la configurazione (chiavi, URL, segreti) dal codice, così cambia per ambiente senza toccare il sorgente.' },
      { question: 'Perché non mettere i segreti nel codice?', answer: 'Perché finirebbero nel repository e sarebbero visibili a chiunque; vanno in variabili d\'ambiente o secret manager.' }
    ],
    en: [
      { question: 'What are environment variables for?', answer: 'To separate configuration (keys, URLs, secrets) from code, so it changes per environment without touching the source.' },
      { question: 'Why should you not put secrets in the code?', answer: 'Because they would end up in the repository and be visible to anyone; use environment variables or a secret manager.' }
    ]
  },
  'debug': {
    it: [
      { question: 'Come debuggare JavaScript nel browser?', answer: 'Con i DevTools: breakpoint nel pannello Sources, ispezione delle variabili ed esecuzione passo-passo.' },
      { question: 'A cosa serve un breakpoint?', answer: 'A mettere in pausa l\'esecuzione su una riga specifica per ispezionare lo stato del programma in quel punto.' }
    ],
    en: [
      { question: 'How do you debug JavaScript in the browser?', answer: 'With DevTools: breakpoints in the Sources panel, variable inspection and step-by-step execution.' },
      { question: 'What is a breakpoint for?', answer: 'To pause execution on a specific line and inspect the state of the program at that point.' }
    ]
  },
  'git': {
    it: [
      { question: 'Qual è un buon workflow Git per team piccoli?', answer: 'Un branch per feature, pull request con review e merge su main: semplice ma sufficiente per team ridotti.' },
      { question: 'Qual è la differenza tra merge e rebase?', answer: 'Merge unisce mantenendo la storia dei branch, rebase la riscrive per una linea di commit più pulita.' }
    ],
    en: [
      { question: 'What is a good Git workflow for small teams?', answer: 'One branch per feature, pull requests with review and merge into main: simple but enough for small teams.' },
      { question: 'What is the difference between merge and rebase?', answer: 'Merge joins while keeping branch history, rebase rewrites it for a cleaner, linear commit history.' }
    ]
  },
  'testing': {
    it: [
      { question: 'Qual è la differenza tra unit test ed end-to-end test?', answer: 'Gli unit test verificano singole funzioni in isolamento, gli E2E simulano l\'utente sull\'intera applicazione.' },
      { question: 'Perché scrivere test automatici?', answer: 'Per intercettare le regressioni prima del deploy e rilasciare con più sicurezza a ogni modifica.' }
    ],
    en: [
      { question: 'What is the difference between unit and end-to-end tests?', answer: 'Unit tests check single functions in isolation, E2E tests simulate the user across the whole application.' },
      { question: 'Why write automated tests?', answer: 'To catch regressions before deploy and ship with more confidence on every change.' }
    ]
  },
  'http': {
    it: [
      { question: 'Cosa significa un codice HTTP 200 rispetto a 404?', answer: '200 indica successo, 404 significa che la risorsa richiesta non è stata trovata sul server.' },
      { question: 'Cosa indica un errore 500?', answer: 'Un errore interno del server: qualcosa è andato storto lato server nell\'elaborare la richiesta.' }
    ],
    en: [
      { question: 'What does an HTTP 200 vs 404 status code mean?', answer: '200 indicates success, 404 means the requested resource was not found on the server.' },
      { question: 'What does a 500 error indicate?', answer: 'An internal server error: something went wrong on the server side while processing the request.' }
    ]
  },
  'images': {
    it: [
      { question: 'Come ottimizzare le immagini per il web?', answer: 'Usa formati moderni come WebP o AVIF, comprimi e ridimensiona alle dimensioni reali di visualizzazione.' },
      { question: 'Qual è la differenza tra WebP e JPEG?', answer: 'WebP offre compressione migliore a parità di qualità e supporta la trasparenza, JPEG è più universalmente supportato.' }
    ],
    en: [
      { question: 'How do you optimize images for the web?', answer: 'Use modern formats like WebP or AVIF, compress and resize to the actual display dimensions.' },
      { question: 'What is the difference between WebP and JPEG?', answer: 'WebP offers better compression at the same quality and supports transparency, JPEG is more universally supported.' }
    ]
  },
  'performance': {
    it: [
      { question: 'Cosa sono i Core Web Vitals?', answer: 'Tre metriche di Google (LCP, INP, CLS) che misurano caricamento, interattività e stabilità visiva di una pagina.' },
      { question: 'Come migliorare il punteggio delle performance?', answer: 'Ottimizzando le immagini, riducendo il JavaScript, usando il caching e servendo i contenuti da una CDN.' }
    ],
    en: [
      { question: 'What are Core Web Vitals?', answer: 'Three Google metrics (LCP, INP, CLS) that measure a page\'s loading, interactivity and visual stability.' },
      { question: 'How do you improve the performance score?', answer: 'By optimizing images, reducing JavaScript, using caching and serving content from a CDN.' }
    ]
  },
  'api': {
    it: [
      { question: 'Quali sono le best practice per una API REST?', answer: 'Usare sostantivi per le risorse, i verbi HTTP corretti, codici di stato coerenti, versioning e paginazione.' },
      { question: 'Qual è la differenza tra PUT e PATCH?', answer: 'PUT sostituisce l\'intera risorsa, PATCH applica una modifica parziale solo ai campi indicati.' }
    ],
    en: [
      { question: 'What are the best practices for a REST API?', answer: 'Use nouns for resources, the correct HTTP verbs, consistent status codes, versioning and pagination.' },
      { question: 'What is the difference between PUT and PATCH?', answer: 'PUT replaces the entire resource, PATCH applies a partial change only to the given fields.' }
    ]
  },
  'security': {
    it: [
      { question: 'Cosa sono gli header di sicurezza HTTP?', answer: 'Header come CSP, HSTS e X-Frame-Options che istruiscono il browser a proteggere l\'utente da attacchi comuni.' },
      { question: 'A cosa serve l\'header Content-Security-Policy?', answer: 'A limitare da quali origini la pagina può caricare script e risorse, mitigando gli attacchi XSS.' }
    ],
    en: [
      { question: 'What are HTTP security headers?', answer: 'Headers like CSP, HSTS and X-Frame-Options that tell the browser to protect the user from common attacks.' },
      { question: 'What is the Content-Security-Policy header for?', answer: 'To restrict which origins the page can load scripts and resources from, mitigating XSS attacks.' }
    ]
  },
  'tools': {
    it: [
      { question: 'Esistono strumenti gratuiti per sviluppatori senza registrazione?', answer: 'Sì, THEJORD offre decine di tool gratuiti che girano nel browser senza account né installazione.' },
      { question: 'I tool online per sviluppatori sono sicuri?', answer: 'Dipende: quelli client-side come THEJORD elaborano tutto nel browser, così i tuoi dati non vengono inviati a server.' }
    ],
    en: [
      { question: 'Are there free developer tools without registration?', answer: 'Yes, THEJORD offers dozens of free tools that run in the browser with no account or installation.' },
      { question: 'Are online developer tools safe?', answer: 'It depends: client-side ones like THEJORD process everything in the browser, so your data is never sent to a server.' }
    ]
  }
}

// Match tags (and slug as fallback) to a topic. Existing tool topics are matched
// on tags first (unchanged precedence); additional dev topics also use the slug.
function getTopicFromTags(tags: string[], slug: string = ''): string | null {
  const t = tags.join(' ').toLowerCase()
  const s = (t + ' ' + slug).toLowerCase()

  // Tool topics (tag-based, most specific first)
  if (t.includes('json')) return 'json'
  if (t.includes('regex') || t.includes('espression')) return 'regex'
  if (t.includes('cron') || t.includes('crontab')) return 'cron'
  if (t.includes('base64')) return 'base64'
  if (t.includes('hash') || t.includes('md5') || t.includes('sha')) return 'hash'
  if (t.includes('url') || t.includes('encoder')) return 'url'
  if (t.includes('markdown')) return 'markdown'
  if (t.includes('pdf')) return 'pdf'
  if (t.includes('uuid')) return 'uuid'
  if (t.includes('xml') || t.includes('wsdl')) return 'xml'
  if (t.includes('color') || t.includes('colore')) return 'color'
  if (t.includes('diff') || t.includes('compare') || t.includes('confronta')) return 'diff'
  if (t.includes('next') || t.includes('react')) return 'nextjs'
  if (t.includes('i18n') || t.includes('internazional') || t.includes('multilingue')) return 'i18n'

  // Additional dev topics (tag + slug, ordered specific -> generic)
  if (s.includes('docker') || s.includes('container')) return 'docker'
  if (s.includes('typescript')) return 'typescript'
  if (s.includes('websocket') || s.includes('graphql') || s.includes('real-time') || s.includes('realtime')) return 'websocket'
  if (s.includes('cicd') || s.includes('ci-cd') || s.includes('github-action')) return 'cicd'
  if (s.includes('npm') || s.includes('yarn') || s.includes('pnpm')) return 'npm'
  if (s.includes('cors')) return 'cors'
  if (s.includes('sql') || s.includes('nosql')) return 'sql'
  if (s.includes('database') || s.includes('backup')) return 'database'
  if (s.includes('env') || s.includes('variabili-ambiente') || s.includes('environment') || s.includes('dotenv')) return 'env'
  if (s.includes('debug') || s.includes('debuggare')) return 'debug'
  if (s.includes('git-workflow') || s.includes('workflow')) return 'git'
  if (s.includes('testing') || s.includes('test-') || s.includes('quality')) return 'testing'
  if (s.includes('http-status') || s.includes('status-code')) return 'http'
  if (s.includes('immagini') || s.includes('image')) return 'images'
  if (s.includes('performance') || s.includes('web-vitals') || s.includes('web vitals')) return 'performance'
  if (s.includes('api') || s.includes('rest')) return 'api'
  if (s.includes('security') || s.includes('sicurezza')) return 'security'
  if (s.includes('risorse') || s.includes('produttivita') || s.includes('productivity') || s.includes('tool-online') || s.includes('free-tools')) return 'tools'

  return null
}

export function getBlogFAQs(tags: string[], locale: string, slug: string = ''): FAQ[] {
  const topic = getTopicFromTags(tags, slug)
  if (!topic) return []

  const faqs = TOPIC_FAQS[topic]
  if (!faqs) return []

  return locale === 'it' ? faqs.it : faqs.en
}

export function getBlogFAQSchema(tags: string[], locale: string, slug: string = '') {
  const faqs = getBlogFAQs(tags, locale, slug)
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
