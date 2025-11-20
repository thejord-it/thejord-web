import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'THEJORD.IT Privacy Policy: How we collect, use, and protect your data. GDPR compliant, 100% client-side processing.',
}

export default function Privacy() {
  const lastUpdate = new Date().toLocaleDateString('it-IT')

  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">
            Ultimo aggiornamento: {lastUpdate}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Introduzione</h2>
            <p>
              THEJORD.IT ("noi", "nostro") si impegna a proteggere la tua privacy. Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando utilizzi il nostro sito web.
            </p>
            <p>
              La tua privacy è fondamentale per noi. Tutti i nostri strumenti elaborano i dati esclusivamente nel tuo browser (client-side), garantendo che le tue informazioni non vengano mai inviate ai nostri server.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Raccolta Dati</h2>

            <h3 className="text-xl font-semibold text-text-primary mb-2">Analytics</h3>
            <p>
              Utilizziamo Google Analytics per comprendere come i visitatori utilizzano il nostro sito. Raccogliamo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pagine visitate e durata della visita</li>
              <li>Tipo di dispositivo e browser utilizzato</li>
              <li>Località approssimativa (città/paese)</li>
              <li>Sorgente di traffico (come sei arrivato sul sito)</li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> Gli indirizzi IP vengono anonimizzati prima dell'elaborazione. Non tracciamo identificatori personali.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mb-2 mt-6">Dati Locali</h3>
            <p>
              Alcuni strumenti possono salvare le tue preferenze nel Local Storage del browser per migliorare l'esperienza utente. Questi dati rimangono esclusivamente sul tuo dispositivo e non vengono mai trasmessi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Utilizzo dei Dati</h2>
            <p>Utilizziamo i dati raccolti per:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Migliorare la funzionalità e l'esperienza utente del sito</li>
              <li>Ottimizzare le prestazioni e risolvere problemi tecnici</li>
              <li>Comprendere quali strumenti sono più utili per sviluppare nuove funzionalità</li>
              <li>Monitorare e prevenire abusi del servizio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Cookie</h2>
            <p>
              Utilizziamo cookie per:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Memorizzare il tuo consenso all'utilizzo dei cookie</li>
              <li>Cookie di Google Analytics per comprendere l'utilizzo del sito</li>
            </ul>
            <p className="mt-4">
              Puoi gestire o eliminare i cookie attraverso le impostazioni del tuo browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Condivisione Dati</h2>
            <p>
              <strong>Non vendiamo, affittiamo o condividiamo i tuoi dati personali con terze parti per scopi commerciali.</strong>
            </p>
            <p>
              I dati anonimi di Google Analytics sono soggetti alla{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Privacy Policy di Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">I Tuoi Diritti (GDPR)</h2>
            <p>
              In conformità al GDPR, hai i seguenti diritti:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Accesso:</strong> Puoi richiedere una copia dei dati che abbiamo su di te</li>
              <li><strong>Rettifica:</strong> Puoi correggere dati inesatti o incompleti</li>
              <li><strong>Cancellazione:</strong> Puoi richiedere la cancellazione dei tuoi dati</li>
              <li><strong>Opposizione:</strong> Puoi opporti al trattamento dei tuoi dati per scopi specifici</li>
              <li><strong>Portabilità:</strong> Puoi richiedere i tuoi dati in formato strutturato</li>
            </ul>
            <p className="mt-4">
              Per esercitare questi diritti, contattaci a privacy@thejord.it
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Sicurezza</h2>
            <p>
              Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTTPS per tutte le comunicazioni</li>
              <li>Security headers (CSP, HSTS, X-Frame-Options)</li>
              <li>Anonimizzazione degli IP in Google Analytics</li>
              <li>Elaborazione client-side per gli strumenti</li>
              <li>Nessuna memorizzazione server-side dei dati degli utenti</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Servizi di Terze Parti</h2>
            <p>
              Utilizziamo i seguenti servizi di terze parti:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Google Analytics - per analisi del traffico</li>
              <li>GitHub - per hosting del codice sorgente</li>
              <li>Cloudflare - per CDN e sicurezza</li>
            </ul>
            <p className="mt-4">
              Ciascun servizio è soggetto alla propria privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Modifiche alla Privacy Policy</h2>
            <p>
              Possiamo aggiornare questa Privacy Policy periodicamente. Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. Ti consigliamo di controllare regolarmente questa pagina.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Contatti</h2>
            <p>
              Per domande o richieste riguardanti questa Privacy Policy:
            </p>
            <ul className="list-none space-y-2 ml-4 mt-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@thejord.it" className="text-primary hover:underline">
                  privacy@thejord.it
                </a>
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a href="https://thejord.it" className="text-primary hover:underline">
                  https://thejord.it
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
