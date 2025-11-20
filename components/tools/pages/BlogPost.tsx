import Layout from '@/components/tools/Layout'
import { Link, useParams } from 'react-router-dom'

// Blog posts data
const blogPosts: Record<string, {
  title: string
  author: string
  date: string
  readTime: string
  tags: string[]
  content: JSX.Element
}> = {
  'cron-expression-builder': {
    title: 'Cron Expression Builder: Pianifica Task Automatici con Facilità',
    author: 'THEJORD Team',
    date: '2025-11-17',
    readTime: '10 min',
    tags: ['Tools', 'Cron', 'Automation'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          Oggi siamo entusiasti di presentare il nostro ultimo tool: <strong className="text-primary-light">Cron Expression Builder</strong> 🕐
        </p>
        <p className="text-text-secondary leading-relaxed mb-6">
          Se hai mai dovuto configurare task schedulati su Linux, macOS o sistemi CI/CD, sicuramente conosci le espressioni cron.
          Potenti ma criptiche, queste stringhe di 5 campi controllano quando e come vengono eseguiti i tuoi script automatici.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🎯 Il Problema con le Espressioni Cron</h2>
        <div className="bg-bg-dark border border-border rounded-lg p-4 mb-6">
          <code className="text-primary-light">*/15 9-17 * * 1-5</code>
        </div>
        <p className="text-text-secondary leading-relaxed mb-6">
          Cosa significa questa espressione? A memoria, potresti non saperlo. Le espressioni cron sono notoriamente difficili da
          leggere e scrivere correttamente al primo tentativo.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">✨ La Soluzione: Visual Builder</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Il nostro <strong className="text-primary-light">Cron Expression Builder</strong> risolve questo problema con tre modalità di lavoro:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">🎨 Visual Builder</h3>
            <p className="text-text-secondary text-sm">
              Costruisci campo per campo con interfaccia intuitiva. Supporta *, range, liste e step.
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">⌨️ Direct Input</h3>
            <p className="text-text-secondary text-sm">
              Scrivi direttamente con validazione real-time. Errori immediati con indicazione del problema.
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">📚 Pattern Library</h3>
            <p className="text-text-secondary text-sm">
              12 pattern comuni pronti all'uso. Un click per applicare e modificare.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🚀 Feature Avanzate</h2>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">Validazione Real-Time</strong> - Range e sintassi verificati istantaneamente</li>
          <li><strong className="text-primary-light">Anteprima Esecuzioni</strong> - Vedi le prossime 5 esecuzioni</li>
          <li><strong className="text-primary-light">Descrizione Human-Readable</strong> - Traduzione in linguaggio naturale</li>
          <li><strong className="text-primary-light">Copy & Paste</strong> - Un click per copiare negli appunti</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">📋 Casi d'Uso Reali</h2>
        <div className="space-y-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">Database Backup Notturno</h3>
            <code className="text-sm text-text-secondary">0 2 * * *</code>
            <p className="text-sm text-text-muted mt-2">Ogni giorno alle 2:00 AM - backup quando il traffico è minimo</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">Report Settimanale</h3>
            <code className="text-sm text-text-secondary">0 9 * * 1</code>
            <p className="text-sm text-text-muted mt-2">Ogni lunedì alle 9:00 AM - generazione report per il team</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">Health Check Frequente</h3>
            <code className="text-sm text-text-secondary">*/5 * * * *</code>
            <p className="text-sm text-text-muted mt-2">Ogni 5 minuti - verifica stato dei servizi</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🛠️ Integrazione con Strumenti Popolari</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Compatibile con: Linux/macOS Crontab, GitHub Actions, GitLab CI/CD, Jenkins, Kubernetes CronJob.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔒 Privacy e Sicurezza</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Come tutti i tool di THEJORD.IT, il Cron Expression Builder funziona <strong className="text-primary-light">100% lato client</strong>:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li>Nessun dato inviato ai server</li>
          <li>Zero tracking delle tue espressioni</li>
          <li>Funziona offline dopo il caricamento</li>
          <li>Open source e verificabile</li>
        </ul>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">🚀 Prova Subito</h2>
          <p className="text-text-secondary mb-6">
            Non lasciare che le espressioni cron ti rallentino. Provalo oggi e semplifica la gestione dei tuoi task automatici!
          </p>
          <a
            href="/cron-builder"
            className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Apri Cron Builder →
          </a>
        </div>
      </div>
    )
  },
  'json-schema-converter': {
    title: 'JSON Schema Converter: Genera Schemi di Validazione Automaticamente',
    author: 'THEJORD Team',
    date: '2025-11-17',
    readTime: '12 min',
    tags: ['Tools', 'JSON', 'API'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          La documentazione e validazione delle API è fondamentale, ma creare JSON Schema manualmente è tedioso e soggetto a errori.
          Oggi presentiamo il nostro <strong className="text-primary-light">JSON Schema Converter</strong> 📋
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🎯 Cos'è JSON Schema?</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          JSON Schema è lo standard de facto per descrivere e validare strutture JSON. È usato in:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">OpenAPI/Swagger</strong> - Documentazione API REST</li>
          <li><strong className="text-primary-light">API Gateway</strong> - Validazione richieste/risposte</li>
          <li><strong className="text-primary-light">Form Generation</strong> - Generazione automatica di UI</li>
          <li><strong className="text-primary-light">Data Validation</strong> - Librerie come Ajv</li>
          <li><strong className="text-primary-light">IDE Autocomplete</strong> - IntelliSense e code completion</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">✨ Funzionalità Chiave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">🔍 Auto Type Detection</h3>
            <p className="text-text-secondary text-sm">
              Rileva automaticamente: string, number, integer, boolean, array, object, null
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">📧 Format Detection</h3>
            <p className="text-text-secondary text-sm">
              Identifica email, URI, UUID, date-time, IPv4, IPv6 e altri formati
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">🔄 Schema Versions</h3>
            <p className="text-text-secondary text-sm">
              Supporta Draft 2020-12 (latest) e Draft 07 per retrocompatibilità
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary-light mb-3">🌳 Nested Objects</h3>
            <p className="text-text-secondary text-sm">
              Gestisce oggetti e array annidati con rilevamento ricorsivo
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">💼 Casi d'Uso Pratici</h2>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">1. API Documentation (OpenAPI)</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Genera automaticamente gli schemi per le tue spec OpenAPI/Swagger. Parti da esempi di response e ottieni schemi pronti da integrare.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">2. API Validation (Ajv)</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Usa gli schemi generati con librerie come Ajv per validare richieste e risposte API in runtime.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">3. TypeScript Type Generation</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Usa tool come json-schema-to-typescript per generare interfacce TypeScript type-safe dai tuoi schemi.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">4. Form Generation</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Librerie come react-jsonschema-form generano form UI automaticamente dai JSON Schema.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">⚙️ Opzioni di Configurazione</h2>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">Schema Title</strong> - Aggiungi un titolo descrittivo</li>
          <li><strong className="text-primary-light">Make Required</strong> - Marca tutti i campi come required</li>
          <li><strong className="text-primary-light">Add Format Hints</strong> - Include rilevamento formati (email, URI, etc.)</li>
          <li><strong className="text-primary-light">Schema Version</strong> - Scegli tra Draft 2020-12 o Draft 07</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔒 Privacy Garantita</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Il tool funziona <strong className="text-primary-light">100% client-side</strong>:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li>I tuoi dati JSON non lasciano mai il browser</li>
          <li>Zero tracking, zero analytics sui contenuti</li>
          <li>Codice open source verificabile</li>
        </ul>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">📋 Inizia Subito</h2>
          <p className="text-text-secondary mb-6">
            Semplifica la validazione e documentazione delle tue API. Genera JSON Schema professionali in pochi secondi!
          </p>
          <a
            href="/json-schema"
            className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Apri JSON Schema Converter →
          </a>
        </div>
      </div>
    )
  },
  'come-validare-json-online': {
    title: 'Come Validare JSON Online Gratis: Guida Completa 2025',
    author: 'Team THEJORD',
    date: '2025-01-13',
    readTime: '8 min',
    tags: ['Tutorial', 'JSON', 'Developer Tools'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          Hai bisogno di <strong className="text-primary-light">validare JSON online</strong> in modo rapido e sicuro?
          In questa guida completa scoprirai come utilizzare il nostro JSON Formatter gratuito e privacy-first per
          validare, formattare e convertire file JSON senza inviare dati a server esterni.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔍 Cos'è JSON e Perché Validarlo?</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          JSON (JavaScript Object Notation) è un formato di scambio dati leggero e universale. Validare JSON significa
          verificare che la sintassi sia corretta secondo lo standard RFC 8259. Errori comuni includono:
        </p>

        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li>Virgole mancanti o in eccesso</li>
          <li>Parentesi graffe o quadre non bilanciate</li>
          <li>Stringhe non quotate correttamente</li>
          <li>Valori non validi (es. NaN, undefined)</li>
          <li>Commenti non supportati dal formato JSON standard</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">⚡ Come Utilizzare il JSON Validator</h2>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Passo 1: Incolla il Tuo JSON</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Accedi al nostro <a href="/json-formatter" className="text-primary-light hover:underline">JSON Formatter online</a> e
          incolla il tuo codice JSON nel pannello di sinistra. Il tool supporta file fino a 10MB.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Passo 2: Validazione Automatica</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Il validatore analizza istantaneamente il codice. Se ci sono errori, vedrai:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">Messaggio di errore</strong> - Descrizione dell'errore trovato</li>
          <li><strong className="text-primary-light">Posizione esatta</strong> - Riga e colonna dell'errore</li>
          <li><strong className="text-primary-light">Suggerimento</strong> - Come correggere il problema</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Passo 3: Formattazione e Beautify</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Una volta validato, puoi formattare il JSON con:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Beautify (2 spazi)</h4>
            <p className="text-text-secondary text-sm">Formattazione leggibile con indentazione a 2 spazi</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Beautify (4 spazi)</h4>
            <p className="text-text-secondary text-sm">Indentazione classica a 4 spazi</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Minify</h4>
            <p className="text-text-secondary text-sm">Compressione su singola riga per ridurre dimensioni</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Single Quotes</h4>
            <p className="text-text-secondary text-sm">Converti virgolette doppie in singole</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🛠️ Funzionalità Avanzate</h2>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Tree View Interattiva</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Visualizza la struttura JSON come albero espandibile/collassabile. Ideale per navigare grandi file JSON con
          centinaia di chiavi nested.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Conversione Formati</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Converti il tuo JSON in altri formati con un click:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">JSON → CSV</strong> - Esporta in formato tabellare</li>
          <li><strong className="text-primary-light">JSON → XML</strong> - Converti in XML strutturato</li>
          <li><strong className="text-primary-light">JSON → YAML</strong> - Formato human-readable</li>
          <li><strong className="text-primary-light">JSON → TypeScript</strong> - Genera interfacce TypeScript</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔒 Privacy e Sicurezza</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          A differenza di altri validatori JSON online, THEJORD.IT garantisce:
        </p>
        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">100% Client-Side Processing</strong>
              <p className="text-text-secondary text-sm">Il tuo JSON non lascia mai il browser. Zero upload a server esterni.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Zero Tracking</strong>
              <p className="text-text-secondary text-sm">Nessun cookie, nessuna analytics, nessun log.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Open Source</strong>
              <p className="text-text-secondary text-sm">Codice verificabile pubblicamente su GitHub.</p>
            </div>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">💡 Casi d'Uso Comuni</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Debug API Response</h4>
            <p className="text-text-secondary text-sm">
              Hai ricevuto una risposta JSON da un'API ma è tutta su una riga? Usa il beautify per renderla leggibile
              e debuggare eventuali errori.
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Configurazione File</h4>
            <p className="text-text-secondary text-sm">
              Valida file di configurazione come package.json, tsconfig.json, .eslintrc prima del commit.
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Data Migration</h4>
            <p className="text-text-secondary text-sm">
              Converti JSON in CSV per import su database o Excel, oppure in YAML per configurazioni Kubernetes.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🚀 Prova Subito il JSON Validator</h2>
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 mt-8">
          <h3 className="text-2xl font-bold mb-3 text-text-primary">Inizia Ora - Gratis e Senza Registrazione</h3>
          <p className="text-text-secondary mb-4">
            Valida, formatta e converti JSON in secondi. Nessun limite, nessuna registrazione richiesta.
          </p>
          <Link
            to="/json-formatter"
            className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apri JSON Formatter →
          </Link>
        </div>

        <hr className="border-border my-12" />

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">❓ FAQ - Domande Frequenti</h2>

        <div className="space-y-6 mb-8">
          <div>
            <h4 className="font-bold text-text-primary mb-2">È sicuro validare JSON sensibili online?</h4>
            <p className="text-text-secondary text-sm">
              Sì, su THEJORD.IT. Il processing è 100% client-side, quindi i tuoi dati non vengono mai inviati a server esterni.
              Puoi anche usarlo offline dopo il primo caricamento.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text-primary mb-2">C'è un limite di dimensione per i file JSON?</h4>
            <p className="text-text-secondary text-sm">
              Il tool supporta file JSON fino a 10MB. Per file più grandi, consigliamo di utilizzare tool da riga di comando
              come jq o validatori offline.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text-primary mb-2">Posso usare il validatore senza connessione internet?</h4>
            <p className="text-text-secondary text-sm">
              Sì! Dopo la prima visita, THEJORD.IT funziona offline grazie al service worker. Perfetto per validare JSON
              anche senza rete.
            </p>
          </div>
        </div>
      </div>
    )
  },

  'base64-encoder-decoder-guida': {
    title: 'Base64 Encoder Online: Guida Completa con Rilevamento File',
    author: 'Team THEJORD',
    date: '2025-01-13',
    readTime: '7 min',
    tags: ['Tutorial', 'Base64', 'Security'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          Cerchi un <strong className="text-primary-light">Base64 encoder online</strong> sicuro e potente?
          La nostra guida ti mostra come codificare e decodificare testo e file in Base64, con rilevamento automatico
          di 50+ tipi di file per massima precisione.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔤 Cos'è Base64 e Quando Usarlo</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Base64 è uno schema di codifica che converte dati binari in testo ASCII. Utilizzato principalmente per:
        </p>

        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li><strong className="text-primary-light">Embedding file in HTML/CSS</strong> - Data URL per immagini inline</li>
          <li><strong className="text-primary-light">Email attachment</strong> - Standard MIME per allegati</li>
          <li><strong className="text-primary-light">API REST</strong> - Trasmissione sicura di dati binari in JSON</li>
          <li><strong className="text-primary-light">Web Token</strong> - JWT (JSON Web Token) encoding</li>
          <li><strong className="text-primary-light">Obfuscation</strong> - Nascondere testo semplice (NON per sicurezza!)</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">⚡ Come Codificare in Base64</h2>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Codifica Testo</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          1. Vai su <a href="/base64" className="text-primary-light hover:underline">Base64 Encoder</a><br/>
          2. Seleziona la tab "Encode"<br/>
          3. Incolla il testo da codificare<br/>
          4. Ottieni istantaneamente il risultato Base64
        </p>

        <div className="bg-bg-dark border border-border rounded-lg p-4 mb-8">
          <p className="text-text-muted text-sm mb-2">Esempio:</p>
          <p className="text-text-secondary font-mono text-sm mb-2">Input: <code className="bg-bg-darkest px-2 py-1 rounded">Hello World!</code></p>
          <p className="text-text-secondary font-mono text-sm">Output: <code className="bg-bg-darkest px-2 py-1 rounded">SGVsbG8gV29ybGQh</code></p>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Codifica File (Immagini, PDF, ZIP)</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Il nostro encoder supporta <strong className="text-primary-light">upload file fino a 5MB</strong> con rilevamento
          automatico del tipo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">🖼️ Immagini</h4>
            <p className="text-text-secondary text-sm">JPEG, PNG, GIF, WebP, BMP, TIFF, ICO</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">📄 Documenti</h4>
            <p className="text-text-secondary text-sm">PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">🗜️ Archivi</h4>
            <p className="text-text-secondary text-sm">ZIP, RAR, 7-Zip, GZIP, BZIP2, TAR</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">🎵 Media</h4>
            <p className="text-text-secondary text-sm">MP3, MP4, FLAC, WAV, OGG, WebM</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔓 Come Decodificare Base64</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          La decodifica è altrettanto semplice:
        </p>

        <ol className="list-decimal list-inside space-y-3 text-text-secondary mb-8">
          <li>Seleziona la tab "Decode"</li>
          <li>Incolla la stringa Base64 (supporta anche data URL prefix)</li>
          <li>Il tool rileva automaticamente il tipo di file tramite <strong className="text-primary-light">magic bytes</strong></li>
          <li>Vedi un badge con tipo file, MIME type ed estensione corretta</li>
          <li>Clicca "Download" per salvare il file con estensione automatica</li>
        </ol>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🎯 Rilevamento File Automatico</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          La nostra tecnologia di <strong className="text-primary-light">magic bytes detection</strong> analizza i primi byte
          del file decodificato per identificare con precisione il tipo. Supportiamo 50+ signature:
        </p>

        <div className="bg-bg-dark border border-border rounded-lg p-6 mb-8">
          <h4 className="font-bold text-primary-light mb-3">Livelli di Confidenza</h4>
          <div className="space-y-2 text-text-secondary text-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs">✓ High confidence</span>
              <span>Magic bytes corrispondono esattamente (es. FF D8 FF = JPEG)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs">~ Medium confidence</span>
              <span>Rilevato formato testuale (JSON, XML, HTML, CSS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-900/30 text-gray-400 rounded text-xs">? Low confidence</span>
              <span>Testo generico, nessun formato riconosciuto</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔒 Privacy e Sicurezza</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Perché scegliere il nostro Base64 encoder rispetto ad altri?
        </p>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Zero Data Transmission</strong>
              <p className="text-text-secondary text-sm">
                File e testo vengono processati esclusivamente nel browser. Nessun upload a server.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">File Binari Sicuri</strong>
              <p className="text-text-secondary text-sm">
                Supporto completo per ArrayBuffer. Immagini, PDF e archivi vengono gestiti correttamente senza corruzione.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">No Logs, No Tracking</strong>
              <p className="text-text-secondary text-sm">
                Zero analytics, cookie o fingerprinting. La tua privacy è garantita.
              </p>
            </div>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">💼 Casi d'Uso Pratici</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Embedding Immagini in HTML</h4>
            <p className="text-text-secondary text-sm mb-2">
              Codifica un'immagine e usala come data URL:
            </p>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto">
              {`<img src="data:image/png;base64,iVBORw0KGgo..." />`}
            </code>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Trasmissione File via API</h4>
            <p className="text-text-secondary text-sm">
              Invia file binari tramite JSON payload codificandoli in Base64
            </p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Download File da Base64</h4>
            <p className="text-text-secondary text-sm">
              Ricevuto Base64 da API? Decodifica e scarica il file con estensione corretta automatica
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 mt-8">
          <h3 className="text-2xl font-bold mb-3 text-text-primary">Prova il Base64 Encoder</h3>
          <p className="text-text-secondary mb-4">
            Codifica e decodifica testo e file in Base64. Gratis, veloce e 100% privacy-first.
          </p>
          <Link
            to="/base64"
            className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apri Base64 Tool →
          </Link>
        </div>
      </div>
    )
  },

  'regex-tester-italiano-pattern': {
    title: 'RegEx Tester Italiano: 30+ Pattern Pronti all\'Uso',
    author: 'Team THEJORD',
    date: '2025-01-13',
    readTime: '6 min',
    tags: ['Tutorial', 'RegEx', 'Developer Tools'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          Le <strong className="text-primary-light">espressioni regolari (RegEx)</strong> sono potenti ma complesse.
          Il nostro RegEx Tester online ti offre 30+ pattern predefiniti e testing in tempo reale per validare email,
          URL, numeri di telefono italiani e molto altro.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🔍 Cos'è un RegEx Tester?</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Un RegEx Tester è un tool che permette di:
        </p>

        <ul className="list-disc list-inside space-y-2 text-text-secondary mb-8">
          <li>Testare espressioni regolari su testo campione</li>
          <li>Visualizzare match in tempo reale con highlighting</li>
          <li>Debuggare pattern complessi prima di usarli nel codice</li>
          <li>Sperimentare con flag (global, multiline, case-insensitive)</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">⚡ Come Usare il RegEx Tester</h2>

        <ol className="list-decimal list-inside space-y-3 text-text-secondary mb-8">
          <li>Vai su <a href="/regex-tester" className="text-primary-light hover:underline">RegEx Tester</a></li>
          <li>Scegli un pattern dalla libreria di 30+ esempi oppure scrivi il tuo</li>
          <li>Inserisci il testo da testare nel campo "Test String"</li>
          <li>Vedi i match evidenziati in tempo reale</li>
          <li>Modifica flag (g, m, i, s) per comportamenti diversi</li>
        </ol>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">📚 Libreria Pattern Predefiniti</h2>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Validazione Email e Web</h3>
        <div className="space-y-3 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Email Address</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{`{2,}`}$/
            </code>
            <p className="text-text-secondary text-sm">Valida indirizzi email standard (RFC 5322)</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">URL/Website</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{`{1,256}`}\.[a-zA-Z0-9()]{`{1,6}`}\b/
            </code>
            <p className="text-text-secondary text-sm">Match HTTP/HTTPS URLs completi</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Formati Italiani</h3>
        <div className="space-y-3 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Codice Fiscale Italiano</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^[A-Z]{`{6}`}[0-9]{`{2}`}[A-Z][0-9]{`{2}`}[A-Z][0-9]{`{3}`}[A-Z]$/
            </code>
            <p className="text-text-secondary text-sm">Formato: RSSMRA85T10A562S</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Partita IVA</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^[0-9]{`{11}`}$/
            </code>
            <p className="text-text-secondary text-sm">11 cifre numeriche</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Telefono Italiano</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^(\+39)?[\s]?[0-9]{`{2,4}`}[\s]?[0-9]{`{6,8}`}$/
            </code>
            <p className="text-text-secondary text-sm">Supporta +39, spazi, fissi e mobili</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-3 text-text-primary">Validazione Dati</h3>
        <div className="space-y-3 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">IPv4 Address</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){`{3}`}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            </code>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Data (GG/MM/AAAA)</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{`{4}`}$/
            </code>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Carta di Credito</h4>
            <code className="block bg-bg-darkest p-2 rounded text-xs text-text-muted overflow-x-auto mb-2">
              /^[0-9]{`{4}`}[\s\-]?[0-9]{`{4}`}[\s\-]?[0-9]{`{4}`}[\s\-]?[0-9]{`{4}`}$/
            </code>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🎯 Flag e Modificatori</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Il nostro tester supporta tutti i flag JavaScript:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">g (global)</h4>
            <p className="text-text-secondary text-sm">Trova tutti i match, non solo il primo</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">i (case-insensitive)</h4>
            <p className="text-text-secondary text-sm">Ignora maiuscole/minuscole</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">m (multiline)</h4>
            <p className="text-text-secondary text-sm">^ e $ matchano inizio/fine riga</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">s (dotAll)</h4>
            <p className="text-text-secondary text-sm">. matcha anche newline</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">💡 Esempi Pratici</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Estrarre Tag HTML</h4>
            <p className="text-text-secondary text-sm mb-2">Pattern: <code className="bg-bg-darkest px-2 py-1 rounded">{`/<([a-z]+)([^<]+)*(?:>(.*)<\/\\1>|\\s+\/>)/gi`}</code></p>
            <p className="text-text-muted text-xs">Cattura tag HTML apertura/chiusura con attributi</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Validare Password Sicura</h4>
            <p className="text-text-secondary text-sm mb-2">Pattern: <code className="bg-bg-darkest px-2 py-1 rounded">{`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/`}</code></p>
            <p className="text-text-muted text-xs">Min 8 char, maiusc, minusc, numero, simbolo</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h4 className="font-bold text-primary-light mb-2">Match Hex Color Codes</h4>
            <p className="text-text-secondary text-sm mb-2">Pattern: <code className="bg-bg-darkest px-2 py-1 rounded">/^#([A-Fa-f0-9]{`{6}`}|[A-Fa-f0-9]{`{3}`})$/</code></p>
            <p className="text-text-muted text-xs">Formato: #FFF o #FFFFFF</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 mt-8">
          <h3 className="text-2xl font-bold mb-3 text-text-primary">Testa le Tue RegEx</h3>
          <p className="text-text-secondary mb-4">
            30+ pattern predefiniti, testing in tempo reale, highlighting dei match. Gratis e senza registrazione.
          </p>
          <Link
            to="/regex-tester"
            className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apri RegEx Tester →
          </Link>
        </div>
      </div>
    )
  },

  'lancio-thejord-it': {
    title: 'Lancio di THEJORD.IT: Developer Tools Privacy-First Made in Italy',
    author: 'Team THEJORD',
    date: '2025-01-12',
    readTime: '5 min',
    tags: ['Announcement', 'Open Source', 'Privacy'],
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-text-secondary leading-relaxed mb-8">
          Oggi siamo felici di annunciare il lancio ufficiale di <strong className="text-primary-light">THEJORD.IT</strong>,
          una suite di strumenti per sviluppatori completamente gratuita, open source e privacy-first. Made in Italy 🇮🇹
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🎯 Perché THEJORD.IT?</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Nel mondo dello sviluppo web, utilizziamo quotidianamente decine di tool online: formattatori JSON,
          encoder Base64, hash generator, regex tester... La maggior parte di questi strumenti sono sparsi
          su siti diversi, con interfacce datate, pubblicità invasiva e senza garanzie sulla privacy dei dati.
        </p>

        <p className="text-text-secondary leading-relaxed mb-6">
          Abbiamo deciso di creare THEJORD.IT per offrire un\'alternativa:
        </p>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <strong className="text-text-primary">100% Privacy-First</strong>
              <p className="text-text-secondary">Tutto il processing avviene nel browser. Zero dati inviati ai server.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <strong className="text-text-primary">Veloce e Moderno</strong>
              <p className="text-text-secondary">Costruito con React 18, TypeScript e Vite. Performance ottimizzate.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <strong className="text-text-primary">Open Source</strong>
              <p className="text-text-secondary">Codice pubblico su GitHub. Audit, contributi e trasparenza totale.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">🇮🇹</span>
            <div>
              <strong className="text-text-primary">Made in Italy</strong>
              <p className="text-text-secondary">L\'alternativa italiana a IT-Tools, con focus sulla community italiana.</p>
            </div>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🛠️ Strumenti Disponibili</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Al lancio, THEJORD.IT offre <strong className="text-primary-light">9 strumenti essenziali</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">📝 JSON Formatter</h3>
            <p className="text-text-secondary text-sm">Formatta, valida, minifica e converti JSON. Tree view, JSON↔CSV, JSON↔YAML.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">🔤 Base64 Encoder/Decoder</h3>
            <p className="text-text-secondary text-sm">Codifica e decodifica Base64 con supporto file.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">🔍 RegEx Tester</h3>
            <p className="text-text-secondary text-sm">Testa espressioni regolari con 30+ pattern predefiniti.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">🔐 Hash Generator</h3>
            <p className="text-text-secondary text-sm">Genera hash MD5, SHA-1, SHA-256, SHA-512, SHA-3.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">🔗 URL Encoder/Decoder</h3>
            <p className="text-text-secondary text-sm">Codifica e decodifica URL e componenti.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">📄 Markdown to HTML</h3>
            <p className="text-text-secondary text-sm">Converti Markdown in HTML sanitizzato con preview live.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">🎨 Color Converter</h3>
            <p className="text-text-secondary text-sm">Converti tra HEX, RGB, HSL, CMYK con picker visuale.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">📰 Lorem Ipsum Generator</h3>
            <p className="text-text-secondary text-sm">Genera testo placeholder per mockup.</p>
          </div>
          <div className="bg-bg-dark border border-border rounded-lg p-4">
            <h3 className="font-bold text-primary-light mb-2">📊 Text Diff Checker</h3>
            <p className="text-text-secondary text-sm">Confronta testi riga per riga con opzioni avanzate.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🏗️ Stack Tecnologico</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          THEJORD.IT è costruito con tecnologie moderne e performanti:
        </p>

        <div className="bg-bg-dark border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-primary-light mb-3">Frontend</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• <strong>React 18.2.0</strong> - UI library</li>
                <li>• <strong>TypeScript 5.2.2</strong> - Type safety</li>
                <li>• <strong>Vite 4.5.0</strong> - Build tool velocissimo</li>
                <li>• <strong>Tailwind CSS 3.3.5</strong> - Utility-first CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary-light mb-3">Infrastructure</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• <strong>Docker</strong> - Containerization</li>
                <li>• <strong>Kubernetes (K3s)</strong> - Orchestration</li>
                <li>• <strong>Cloudflare Tunnel</strong> - Secure ingress</li>
                <li>• <strong>Self-hosted</strong> - Full control</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">📊 Privacy & Security</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          La privacy è al centro di THEJORD.IT. Ecco le nostre garanzie:
        </p>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Processing Client-Side</strong>
              <p className="text-text-secondary text-sm">Tutto avviene nel tuo browser. Nessun dato lascia il tuo dispositivo.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Zero Tracking</strong>
              <p className="text-text-secondary text-sm">Nessun cookie di tracking, analytics invasiva o fingerprinting.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Security Headers</strong>
              <p className="text-text-secondary text-sm">CSP, HSTS, Permissions-Policy configurati per massima sicurezza (9/10).</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <strong className="text-text-primary">Open Source</strong>
              <p className="text-text-secondary text-sm">Codice pubblico su GitHub. Puoi auditarlo tu stesso.</p>
            </div>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🗺️ Roadmap</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Questo è solo l\'inizio! Ecco cosa abbiamo in programma:
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 bg-bg-dark border border-border rounded-lg p-4">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <strong className="text-text-primary">Fase 1: Foundation (Completata)</strong>
              <p className="text-text-secondary text-sm">9 tool essenziali, deployment K3s, SEO e security optimizzati.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-bg-dark border border-yellow-500/30 rounded-lg p-4">
            <span className="text-yellow-500 text-xl">🔄</span>
            <div>
              <strong className="text-text-primary">Fase 2: Testing & CI/CD (Settimane 1-2)</strong>
              <p className="text-text-secondary text-sm">Unit tests con Vitest (80%+ coverage), GitHub Actions CI/CD.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-bg-dark border border-border rounded-lg p-4">
            <span className="text-blue-500 text-xl">📋</span>
            <div>
              <strong className="text-text-primary">Fase 3: Next.js Migration (Settimane 3-4)</strong>
              <p className="text-text-secondary text-sm">SSR/SSG per SEO 9/10, migliore indicizzazione Google.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-bg-dark border border-border rounded-lg p-4">
            <span className="text-blue-500 text-xl">📋</span>
            <div>
              <strong className="text-text-primary">Fase 4: Backend & Features (Settimane 5-6)</strong>
              <p className="text-text-secondary text-sm">PDF tools (merge, compress), Blog completo, User auth, Issue tracking.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-bg-dark border border-border rounded-lg p-4">
            <span className="text-blue-500 text-xl">📋</span>
            <div>
              <strong className="text-text-primary">Fase 5: Advanced Tools (Settimane 7-8)</strong>
              <p className="text-text-secondary text-sm">20+ tool totali, API pubblica, Analytics avanzate.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🤝 Come Contribuire</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          THEJORD.IT è un progetto open source e accogliamo contributi dalla community!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a
            href="https://github.com/thejord-it/thejord-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bg-dark border border-border hover:border-primary rounded-lg p-4 transition-colors"
          >
            <h4 className="font-bold text-primary-light mb-2">⭐ Star su GitHub</h4>
            <p className="text-text-secondary text-sm">Se ti piace il progetto, lascia una stella!</p>
          </a>
          <a
            href="https://github.com/thejord-it/thejord-tools/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bg-dark border border-border hover:border-primary rounded-lg p-4 transition-colors"
          >
            <h4 className="font-bold text-primary-light mb-2">🐛 Report Bug</h4>
            <p className="text-text-secondary text-sm">Hai trovato un bug? Aprici una issue!</p>
          </a>
          <a
            href="https://github.com/thejord-it/thejord-tools/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bg-dark border border-border hover:border-primary rounded-lg p-4 transition-colors"
          >
            <h4 className="font-bold text-primary-light mb-2">💻 Contribuisci al Codice</h4>
            <p className="text-text-secondary text-sm">Pull request benvenute! Leggi la guida.</p>
          </a>
          <Link
            to="/contact"
            className="bg-bg-dark border border-border hover:border-primary rounded-lg p-4 transition-colors"
          >
            <h4 className="font-bold text-primary-light mb-2">💬 Contattaci</h4>
            <p className="text-text-secondary text-sm">Domande, feedback o suggerimenti?</p>
          </Link>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4 text-text-primary">🚀 Prossimi Passi</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          Nelle prossime settimane ci concentreremo su:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-text-secondary mb-8">
          <li>Implementazione testing suite (Vitest + Playwright)</li>
          <li>Setup GitHub Actions per CI/CD automatico</li>
          <li>Migrazione a Next.js 14 per SEO migliorato</li>
          <li>Aggiunta primi PDF tools (merge, compress)</li>
          <li>Sistema blog completo con MDX</li>
        </ol>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 mt-12">
          <h3 className="text-2xl font-bold mb-3 text-text-primary">🎉 Provalo Ora!</h3>
          <p className="text-text-secondary mb-4">
            THEJORD.IT è già live e pronto per essere utilizzato. Completamente gratis, sempre.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Vai agli Strumenti
            </Link>
            <a
              href="https://github.com/thejord-it/thejord-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-bg-dark border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <hr className="border-border my-12" />

        <p className="text-text-muted text-center italic">
          Grazie per il supporto! Insieme possiamo costruire qualcosa di grande. 🚀
        </p>
      </div>
    )
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blogPosts[slug] : null

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-text-primary">404 - Post non trovato</h1>
          <Link to="/blog" className="text-primary-light hover:underline">
            Torna al Blog
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Layout showFullNav={false}>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Back to Blog */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-light transition-colors mb-8">
          <span>←</span>
          <span>Torna al Blog</span>
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-12">
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary-light rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-6 text-text-primary">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-text-muted mb-8">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime} lettura</span>
            </div>

            <hr className="border-border" />
          </header>

          {/* Content */}
          <div className="mb-12">
            {post.content}
          </div>

          {/* Footer CTA */}
          <div className="bg-bg-surface border border-border rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Ti è piaciuto questo articolo?</h3>
            <p className="text-text-secondary mb-6">
              Condividilo con la tua community o lasciaci una stella su GitHub!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://github.com/thejord-it/thejord-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Star su GitHub
              </a>
              <Link
                to="/contact"
                className="inline-block bg-bg-dark border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      </Layout>
  )
}
