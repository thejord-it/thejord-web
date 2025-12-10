const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA';

const newContent = `## Introduzione

**Base64** e uno schema di codifica che trasforma dati binari in testo ASCII. E fondamentale per trasmettere dati attraverso canali che gestiscono solo testo, come email (MIME), URL, JSON e XML.

Il nostro Base64 Encoder/Decoder online e completamente gratuito, funziona al 100% nel browser senza inviare dati a server esterni. Supporta codifica e decodifica di testi, file, immagini e qualsiasi tipo di dato binario.

---

## Come Funziona

### L'Algoritmo Base64

Base64 converte sequenze di 3 byte (24 bit) in 4 caratteri ASCII, usando un alfabeto di 64 caratteri:
- **A-Z** (26 caratteri)
- **a-z** (26 caratteri)
- **0-9** (10 caratteri)
- **+ e /** (2 caratteri speciali)
- **=** (padding)

**Esempio di Conversione:**

\`\`\`
Testo:    "Man"
ASCII:    77, 97, 110
Binario:  01001101 01100001 01101110
Gruppi:   010011 010110 000101 101110
Indici:   19     22     5      46
Base64:   T      W      F      u
\`\`\`

### Varianti di Base64

**Standard (RFC 4648)**
- Alfabeto: A-Z, a-z, 0-9, +, /
- Padding: = alla fine
- Usato in: Email (MIME), PEM certificates

**URL-Safe**
- Alfabeto: A-Z, a-z, 0-9, -, _
- Senza + e / che hanno significato speciale negli URL
- Usato in: JWT, URL, filename

**Base64URL (senza padding)**
- Come URL-Safe ma senza = finale
- Lunghezza variabile
- Usato in: OAuth, modern APIs

---

## Casi d'Uso Reali

### Embedding Immagini in HTML/CSS

Invece di caricare un'immagine esterna, puoi incorporarla direttamente nel codice:

\`\`\`html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." />
\`\`\`

\`\`\`css
.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxu...);
}
\`\`\`

**Vantaggi:**
- Meno richieste HTTP
- Nessun problema di CORS
- Il contenuto e sempre disponibile

**Svantaggi:**
- File HTML/CSS piu pesante (~33%)
- Nessun caching separato
- Difficile da aggiornare

### JWT (JSON Web Tokens)

I JWT sono composti da tre parti codificate in Base64URL:

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
      header              payload                           signature
\`\`\`

Ogni parte puo essere decodificata separatamente per ispezionare il contenuto:

\`\`\`json
// Header decodificato
{"alg": "HS256"}

// Payload decodificato
{"sub": "1234567890"}
\`\`\`

### Trasmissione Dati Binari

Quando devi inviare file binari via JSON o XML:

\`\`\`json
{
  "filename": "document.pdf",
  "content": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC...",
  "contentType": "application/pdf"
}
\`\`\`

### Autenticazione HTTP Basic

L'header Authorization Basic usa Base64:

\`\`\`
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                     (username:password in Base64)
\`\`\`

**Attenzione**: Base64 NON e crittografia! E facilmente decodificabile. Usa sempre HTTPS.

---

## Guida Pratica

### Come Usare il Nostro Tool

**Codifica (Encode)**

1. Seleziona la modalita "Encode"
2. Inserisci il testo o trascina un file
3. Scegli la variante (Standard o URL-Safe)
4. Clicca "Codifica"
5. Copia il risultato

**Decodifica (Decode)**

1. Seleziona la modalita "Decode"
2. Incolla la stringa Base64
3. Il tool rileva automaticamente la variante
4. Clicca "Decodifica"
5. Visualizza o scarica il risultato

**File e Immagini**

- Trascina qualsiasi file nel campo input
- Per immagini, ottieni il Data URI completo
- Scarica il file decodificato con un click

### Riconoscere Dati Base64

Una stringa Base64 valida:
- Contiene solo A-Z, a-z, 0-9, +, /, = (o -, _ per URL-safe)
- Ha lunghezza multipla di 4 (con padding)
- Termina con 0, 1 o 2 caratteri =

### Best Practices

1. **Usa URL-Safe per web**: Evita problemi con encoding URL
2. **Non codificare file grandi**: Base64 aumenta la dimensione del 33%
3. **Non usare per sicurezza**: Base64 non e crittografia
4. **Valida sempre l'input**: Prima di decodificare, verifica che sia Base64 valido

---

## Esempi di Codice

### JavaScript (Browser e Node.js)

**Codifica testo:**

\`\`\`javascript
// Browser
const encoded = btoa('Hello World');
console.log(encoded); // SGVsbG8gV29ybGQ=

// Decodifica
const decoded = atob('SGVsbG8gV29ybGQ=');
console.log(decoded); // Hello World
\`\`\`

**Gestione Unicode:**

\`\`\`javascript
// btoa non supporta Unicode direttamente
function encodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode(parseInt(p1, 16))
  ));
}

console.log(encodeUnicode('Ciao Mondo!')); // Q2lhbyBNb25kbyE=
\`\`\`

**Node.js:**

\`\`\`javascript
// Codifica
const encoded = Buffer.from('Hello World').toString('base64');

// Decodifica
const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

// URL-Safe
const urlSafe = Buffer.from('data').toString('base64url');
\`\`\`

### Python

\`\`\`python
import base64

# Codifica
encoded = base64.b64encode(b'Hello World').decode('utf-8')
print(encoded)  # SGVsbG8gV29ybGQ=

# Decodifica
decoded = base64.b64decode('SGVsbG8gV29ybGQ=').decode('utf-8')
print(decoded)  # Hello World

# URL-Safe
url_safe = base64.urlsafe_b64encode(b'Hello World').decode('utf-8')
\`\`\`

### Bash

\`\`\`bash
# Codifica
echo -n "Hello World" | base64
# Output: SGVsbG8gV29ybGQ=

# Decodifica
echo "SGVsbG8gV29ybGQ=" | base64 -d
# Output: Hello World

# Codifica file
base64 image.png > image.txt

# Decodifica file
base64 -d image.txt > image_decoded.png
\`\`\`

---

## Confronto con Alternative

| Caratteristica | TheJord Base64 | Base64Decode.org | Online-Convert |
|----------------|----------------|------------------|----------------|
| **Gratuito** | Si | Si | Limitato |
| **Privacy** | 100% Client | Server | Server |
| **File support** | Si | Si | Si |
| **URL-Safe** | Si | No | Si |
| **Preview immagini** | Si | No | Si |
| **Limite dimensione** | Browser memory | 5MB | 100MB |

### Perche Scegliere il Nostro Tool

- **Privacy totale**: Nessun upload, processing locale
- **Nessun limite**: Gestisci file di qualsiasi dimensione
- **Tutte le varianti**: Standard e URL-Safe
- **Preview integrato**: Visualizza immagini decodificate

---

## FAQ

**Qual e la differenza tra Base64 e crittografia?**

Base64 e una **codifica**, non una crittografia. Chiunque puo decodificare Base64 senza chiave. Per proteggere i dati, usa vera crittografia (AES, RSA) e poi eventualmente codifica in Base64 per la trasmissione.

**Perche Base64 aumenta la dimensione del 33%?**

Base64 trasforma 3 byte in 4 caratteri. Questo significa che ogni 6 bit diventano 8 bit (un carattere ASCII), causando un overhead del 33%.

**Quando devo usare Base64 URL-Safe?**

Usa URL-Safe quando la stringa codificata apparira in:
- URL (query string, path)
- Nomi di file
- Token JWT
- Qualsiasi contesto dove + e / possono causare problemi

**Posso codificare file molto grandi?**

Si, ma considera che:
- Il file codificato sara il 33% piu grande
- Il processing avviene in memoria
- Per file oltre 100MB, potresti notare rallentamenti

**Come riconosco se una stringa e Base64?**

Una stringa Base64 valida:
- Contiene solo caratteri dell'alfabeto Base64
- Ha lunghezza multipla di 4 (con padding)
- Termina con massimo 2 caratteri "="

**Base64 e sicuro per le password?**

No! Base64 non e sicurezza. Per le password usa bcrypt, Argon2 o scrypt. Base64 e solo per trasporto/encoding, non per protezione.

---

## Risorse Correlate

- [UUID Generator](/tools/uuid-generator) - Genera identificatori univoci
- [Hash Generator](/tools/hash-generator) - MD5, SHA-256, SHA-512
- [JSON Formatter](/tools/json-formatter) - Formatta e valida JSON
- [URL Encoder](/tools/url-encoder) - Codifica URL

Per approfondire, consulta la [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648) che definisce gli standard Base64.
`;

const data = JSON.stringify({
  content: newContent
});

const options = {
  hostname: 'thejord.it',
  port: 443,
  path: '/api/proxy/api/posts/640ca7d7-6d39-415f-9f57-c4f819fb55b0',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Updating Base64 content...');
console.log('Content length:', newContent.split(/\s+/).length, 'words');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('Content updated successfully');
    } else {
      console.log('Response:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
