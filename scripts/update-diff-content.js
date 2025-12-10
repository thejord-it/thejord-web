const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA';

const newContent = `## Introduzione

Il **Diff Checker** è uno strumento essenziale per chiunque lavori con testi e codice. Che tu sia uno sviluppatore che deve confrontare due versioni di un file, un editor che verifica le modifiche a un documento, o un traduttore che controlla le differenze tra due traduzioni, il diff checker ti permette di individuare immediatamente ogni singola modifica.

Il nostro Diff Checker online è completamente gratuito, funziona interamente nel browser (100% client-side) e non invia mai i tuoi dati a server esterni. Questo significa **massima privacy** per i tuoi contenuti sensibili.

---

## Come Funziona

Il diff checker utilizza algoritmi sofisticati per analizzare e confrontare due blocchi di testo. Il principio alla base è la **Longest Common Subsequence (LCS)**, un algoritmo che trova la sequenza più lunga di elementi comuni tra due testi.

### Il Processo di Confronto

1. **Tokenizzazione**: Il testo viene prima suddiviso in unità confrontabili (righe, parole o caratteri)
2. **Calcolo LCS**: L'algoritmo identifica le parti comuni tra i due testi
3. **Generazione Diff**: Le differenze vengono evidenziate come aggiunte, rimozioni o modifiche
4. **Visualizzazione**: I risultati sono presentati in formato side-by-side o unificato

### Tipi di Visualizzazione

- **Side-by-Side**: I due testi appaiono affiancati con le differenze evidenziate. Ideale per confronti dettagliati.
- **Unificato**: Le modifiche sono mostrate in un singolo flusso, con indicatori + e - per aggiunte e rimozioni.
- **Inline**: Le differenze sono evidenziate direttamente nel testo, utile per documenti lunghi.

---

## Casi d'Uso Reali

### Sviluppo Software

Nel mondo dello sviluppo, il diff è fondamentale. Prima di ogni commit Git, gli sviluppatori eseguono \`git diff\` per verificare esattamente cosa stanno modificando. Il nostro tool online è perfetto per:

- **Code Review**: Confrontare la versione precedente con quella nuova prima di approvare una pull request
- **Debug**: Identificare quali modifiche hanno introdotto un bug confrontando versioni funzionanti
- **Merge Conflicts**: Visualizzare chiaramente le differenze quando si risolvono conflitti

### Editing e Scrittura

Per editor e scrittori, il diff checker è uno strumento prezioso:

- **Revisioni Documenti**: Vedere esattamente cosa ha modificato un collaboratore in un documento
- **Versioning**: Tenere traccia dell'evoluzione di un testo nel tempo
- **Plagio Check**: Confrontare testi sospetti con le fonti originali

### Legal e Compliance

Nel settore legale, ogni parola conta:

- **Contratti**: Confrontare versioni di contratti per identificare ogni modifica
- **Policy Updates**: Visualizzare i cambiamenti nelle policy aziendali
- **Audit Trail**: Documentare precisamente cosa è cambiato tra versioni

### Traduzioni

Per traduttori professionisti:

- **Confronto Source-Target**: Verificare la corrispondenza tra originale e traduzione
- **Revision Tracking**: Identificare modifiche tra versioni tradotte
- **Quality Assurance**: Controllo qualità delle traduzioni

---

## Guida Pratica

### Come Usare il Nostro Diff Checker

**Passo 1: Inserisci i Testi**

Copia e incolla il primo testo nel campo "Testo Originale" (o "Testo A") e il secondo nel campo "Testo Modificato" (o "Testo B"). Puoi anche trascinare file direttamente nei campi.

**Passo 2: Configura le Opzioni**

- **Ignora maiuscole/minuscole**: Utile quando le differenze di case non sono rilevanti
- **Ignora spazi bianchi**: Nasconde le differenze dovute solo a spazi o tabulazioni
- **Ignora righe vuote**: Esclude le differenze dovute a righe vuote aggiunte o rimosse

**Passo 3: Esegui il Confronto**

Clicca su "Confronta" per avviare l'analisi. I risultati appariranno immediatamente con:

- 🟢 **Verde**: Testo aggiunto nella versione modificata
- 🔴 **Rosso**: Testo rimosso dalla versione originale
- 🟡 **Giallo**: Testo modificato (combinazione di rimozione e aggiunta)

**Passo 4: Naviga i Risultati**

Usa i pulsanti di navigazione per saltare tra le differenze. Il contatore mostra il numero totale di modifiche trovate.

### Best Practices

1. **Prepara i testi**: Rimuovi formattazione non necessaria prima del confronto
2. **Usa le opzioni giuste**: Scegli se ignorare spazi/case in base al contesto
3. **Confronta sezioni**: Per file molto grandi, confronta sezione per sezione
4. **Salva i risultati**: Esporta il diff in formato HTML o testo per documentazione

---

## Esempi di Codice

### Integrazione Programmatica

Se vuoi integrare funzionalità diff nel tuo progetto, ecco alcuni esempi:

**JavaScript con diff-match-patch**

\`\`\`javascript
import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();
const text1 = "Hello World";
const text2 = "Hello Beautiful World";

const diffs = dmp.diff_main(text1, text2);
dmp.diff_cleanupSemantic(diffs);

// Risultato: [["=","Hello "],["1","Beautiful "],[0,"World"]]
// 0 = uguale, -1 = rimosso, 1 = aggiunto
\`\`\`

**Python con difflib**

\`\`\`python
import difflib

text1 = "Hello World".splitlines()
text2 = "Hello Beautiful World".splitlines()

differ = difflib.unified_diff(text1, text2, lineterm='')
print('\\n'.join(differ))
\`\`\`

**Bash con diff**

\`\`\`bash
# Confronto base
diff file1.txt file2.txt

# Output side-by-side
diff -y file1.txt file2.txt

# Output unificato (stile Git)
diff -u file1.txt file2.txt
\`\`\`

### Output Tipico

Un diff unificato mostra le modifiche così:

\`\`\`diff
--- originale.txt
+++ modificato.txt
@@ -1,3 +1,4 @@
 Riga invariata
-Riga rimossa
+Riga aggiunta
+Altra riga nuova
 Altra riga invariata
\`\`\`

---

## Confronto con Alternative

| Caratteristica | TheJord Diff | GitHub Diff | DiffNow | Meld |
|----------------|--------------|-------------|---------|------|
| **Gratuito** | ✅ | ✅ | Limitato | ✅ |
| **Online** | ✅ | ✅ | ✅ | ❌ Desktop |
| **Privacy** | 100% Client | Server | Server | Local |
| **Limite caratteri** | Illimitato | - | 20MB | - |
| **Esportazione** | HTML/TXT | - | PDF | - |
| **Sintassi highlight** | ✅ | ✅ | ❌ | ✅ |
| **Registrazione** | Non richiesta | Richiesta | Non richiesta | - |

### Perché Scegliere il Nostro Tool

- **Nessun limite**: Confronta file di qualsiasi dimensione
- **Zero tracking**: I tuoi dati non lasciano mai il browser
- **Veloce**: Risultati istantanei senza upload/download
- **Accessibile**: Funziona su qualsiasi dispositivo con un browser

---

## FAQ

**Il mio testo viene inviato a server esterni?**

No, assolutamente. Tutto il processing avviene nel tuo browser usando JavaScript. I tuoi dati non vengono mai trasmessi a server esterni, garantendo la massima privacy.

**C'è un limite alla dimensione dei file?**

Non ci sono limiti imposti dal tool. L'unico limite è la memoria del tuo browser. Per file molto grandi (oltre 10MB), potrebbe esserci un leggero ritardo nel processing.

**Posso confrontare file binari?**

No, il diff checker è ottimizzato per testi e codice. Per file binari (immagini, PDF, etc.) sono necessari strumenti specializzati.

**Come funziona l'algoritmo diff?**

Utilizziamo una variante ottimizzata dell'algoritmo Longest Common Subsequence (LCS) che identifica efficacemente le differenze minimizzando il numero di operazioni necessarie.

**Posso salvare i risultati?**

Sì, puoi esportare il diff in formato HTML (con colori) o testo semplice. Usa i pulsanti di esportazione nella barra degli strumenti.

**Supporta la sintassi di linguaggi di programmazione?**

Sì, il nostro diff checker riconosce la sintassi di oltre 100 linguaggi di programmazione e applica l'evidenziazione appropriata.

---

## Risorse Correlate

- [UUID Generator](/tools/uuid-generator) - Genera identificatori univoci
- [Base64 Encoder](/tools/base64) - Codifica e decodifica Base64
- [JSON Formatter](/tools/json-formatter) - Formatta e valida JSON
- [Hash Generator](/tools/hash-generator) - Genera hash MD5, SHA-256

Per approfondire l'algoritmo diff, consulta la [documentazione di GNU Diff](https://www.gnu.org/software/diffutils/manual/diffutils.html).
`;

const data = JSON.stringify({
  content: newContent
});

const options = {
  hostname: 'thejord.it',
  port: 443,
  path: '/api/proxy/api/posts/diff-it-001',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Updating Diff Checker content...');
console.log('Content length:', newContent.split(/\s+/).length, 'words');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('✅ Content updated successfully');
    } else {
      console.log('Response:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
