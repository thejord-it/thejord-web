const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA';

const newContent = `## Introduzione

L'**Hash Generator** e uno strumento fondamentale per la sicurezza informatica e la verifica dell'integrita dei dati. Un hash e una "impronta digitale" unica di qualsiasi dato: un file, una password, un messaggio. Questa impronta e irreversibile - non puoi risalire al dato originale partendo dall'hash.

Il nostro Hash Generator online supporta tutti i principali algoritmi: **MD5**, **SHA-1**, **SHA-256**, **SHA-512** e molti altri. Funziona interamente nel browser, garantendo che i tuoi dati sensibili non vengano mai trasmessi a server esterni.

---

## Come Funziona

### Cos'e una Funzione Hash?

Una funzione hash prende un input di qualsiasi dimensione e produce un output di lunghezza fissa chiamato "digest" o "checksum". Le caratteristiche fondamentali sono:

1. **Deterministica**: Lo stesso input produce sempre lo stesso output
2. **Unidirezionale**: Impossibile risalire all'input dall'output
3. **Collision-resistant**: Estremamente improbabile che due input diversi producano lo stesso hash
4. **Effetto valanga**: Una minima modifica all'input cambia drasticamente l'output

### Gli Algoritmi Disponibili

**MD5 (Message Digest 5)**
- Output: 128 bit (32 caratteri hex)
- Veloce ma non piu sicuro per scopi crittografici
- Ancora usato per checksum e identificatori

**SHA-1 (Secure Hash Algorithm 1)**
- Output: 160 bit (40 caratteri hex)
- Deprecato per firme digitali dal 2017
- Ancora presente in sistemi legacy

**SHA-256**
- Output: 256 bit (64 caratteri hex)
- Standard attuale per la maggior parte delle applicazioni
- Usato in Bitcoin e blockchain

**SHA-512**
- Output: 512 bit (128 caratteri hex)
- Maggiore sicurezza, leggermente piu lento
- Consigliato per dati critici

---

## Casi d'Uso Reali

### Verifica Integrita File

Quando scarichi software, l'autore spesso fornisce il checksum SHA-256. Puoi verificare che il file non sia stato corrotto o manomesso:

1. Scarica il file
2. Genera l'hash SHA-256
3. Confronta con l'hash pubblicato
4. Se corrispondono, il file e integro

Questo e fondamentale per:
- **Distribuzione software**: Verificare che il download sia completo e non alterato
- **Backup**: Confermare che i file di backup siano identici agli originali
- **Transfer**: Validare trasferimenti su reti inaffidabili

### Password Hashing

Le password non dovrebbero mai essere memorizzate in chiaro. Si salva invece l'hash:

\`\`\`
Password: "MiaPassword123"
SHA-256: a1b2c3d4e5f6... (64 caratteri)
\`\`\`

Quando l'utente effettua il login:
1. Inserisce la password
2. Il sistema calcola l'hash
3. Confronta con l'hash salvato
4. Se corrispondono, accesso garantito

**Nota**: Per le password, algoritmi specializzati come bcrypt o Argon2 sono preferibili a SHA-256 puro perche includono salt e sono computazionalmente costosi.

### Deduplicazione Storage

I sistemi di storage usano hash per identificare file duplicati:

- Ogni file viene hashato
- Se due file hanno lo stesso hash, sono (quasi certamente) identici
- Si conserva una sola copia, risparmiando spazio

### Firma Digitale e Blockchain

Le blockchain usano hash per:
- Collegare blocchi tra loro (ogni blocco contiene l'hash del precedente)
- Verificare transazioni senza rivelare i dati originali
- Creare "proof of work" nel mining

---

## Guida Pratica

### Come Usare il Nostro Hash Generator

**Passo 1: Scegli l'Algoritmo**

Seleziona l'algoritmo appropriato per il tuo caso d'uso:
- **Verifica file**: SHA-256 (standard industriale)
- **Identificatori veloci**: MD5 (non per sicurezza)
- **Massima sicurezza**: SHA-512

**Passo 2: Inserisci i Dati**

Puoi:
- Digitare o incollare testo direttamente
- Trascinare un file nel campo di input
- Selezionare un file dal tuo computer

**Passo 3: Genera l'Hash**

Clicca "Genera" per calcolare l'hash. Il risultato appare immediatamente in diversi formati:
- **Hex**: Notazione esadecimale (standard)
- **Base64**: Formato compatto per trasmissione
- **Binary**: Rappresentazione binaria grezza

**Passo 4: Copia o Confronta**

- Usa il pulsante copia per salvare l'hash
- Incolla un hash di riferimento per confrontarlo
- Genera report per documentazione

### Best Practices

1. **Usa SHA-256 o superiore** per applicazioni di sicurezza
2. **Non usare MD5/SHA-1** per password o firme
3. **Verifica sempre** i checksum di software scaricato
4. **Aggiungi salt** alle password prima dell'hashing
5. **Documenta** l'algoritmo usato insieme all'hash

---

## Esempi di Codice

### JavaScript (Browser)

\`\`\`javascript
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Utilizzo
const hash = await sha256('Hello World');
console.log(hash);
// Output: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
\`\`\`

### Node.js

\`\`\`javascript
const crypto = require('crypto');

function hash(algorithm, data) {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

console.log(hash('md5', 'Hello'));     // 8b1a9953c4611296...
console.log(hash('sha256', 'Hello'));  // 185f8db32271fe25...
console.log(hash('sha512', 'Hello'));  // 3615f80c9d293ed7...
\`\`\`

### Python

\`\`\`python
import hashlib

def generate_hash(algorithm, data):
    h = hashlib.new(algorithm)
    h.update(data.encode('utf-8'))
    return h.hexdigest()

print(generate_hash('md5', 'Hello'))
print(generate_hash('sha256', 'Hello'))
print(generate_hash('sha512', 'Hello'))
\`\`\`

### Bash (OpenSSL)

\`\`\`bash
# MD5
echo -n "Hello" | openssl dgst -md5

# SHA-256
echo -n "Hello" | openssl dgst -sha256

# SHA-256 di un file
openssl dgst -sha256 myfile.zip
\`\`\`

---

## Confronto con Alternative

| Caratteristica | TheJord Hash | Online-Convert | HashCalc | OpenSSL |
|----------------|--------------|----------------|----------|---------|
| **Gratuito** | Si | Limitato | Si | Si |
| **Online** | Si | Si | No (Desktop) | CLI |
| **Privacy** | 100% Client | Server | Local | Local |
| **File support** | Si | Si | Si | Si |
| **Algoritmi** | 8+ | 6 | 5 | 20+ |
| **Multi-hash** | Si | No | Si | Manuale |

### Perche Scegliere il Nostro Tool

- **Zero upload**: I tuoi file restano sul tuo dispositivo
- **Risultato istantaneo**: Nessun tempo di attesa
- **Tutti i formati**: Hex, Base64, Binary
- **Confronto integrato**: Verifica hash in un click

---

## FAQ

**Qual e la differenza tra MD5 e SHA-256?**

MD5 produce un hash di 128 bit ed e piu veloce, ma e considerato crittograficamente debole. SHA-256 produce un hash di 256 bit ed e lo standard attuale per sicurezza. Usa MD5 solo per checksum non critici.

**Posso decifrare un hash per ottenere il dato originale?**

No, gli algoritmi hash sono progettati per essere unidirezionali. Non esiste un modo matematico per invertire l'hash. Gli "attacchi" funzionano provando milioni di combinazioni (brute force) o usando tabelle pre-calcolate (rainbow tables).

**E sicuro hashare password con SHA-256?**

SHA-256 da solo non e ideale per le password perche e troppo veloce - un attaccante puo provare miliardi di combinazioni al secondo. Usa algoritmi specializzati come bcrypt, scrypt o Argon2 che sono intenzionalmente lenti.

**Come verifico l'integrita di un file scaricato?**

1. Cerca il checksum pubblicato (solitamente SHA-256)
2. Genera l'hash del file scaricato con il nostro tool
3. Confronta i due hash - devono essere identici
4. Una sola differenza significa file corrotto o modificato

**Quanti algoritmi supportate?**

Supportiamo: MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-256, SHA3-512.

**C'e un limite alla dimensione dei file?**

Il processing avviene nel browser, quindi il limite dipende dalla memoria disponibile. Per file molto grandi (oltre 1GB), potresti notare rallentamenti.

---

## Risorse Correlate

- [UUID Generator](/tools/uuid-generator) - Genera identificatori univoci
- [Base64 Encoder](/tools/base64) - Codifica e decodifica Base64
- [Diff Checker](/tools/diff-checker) - Confronta testi e codice
- [Password Generator](/tools/password-generator) - Genera password sicure

Per approfondire la crittografia, consulta la [documentazione NIST su SHA-3](https://www.nist.gov/publications/sha-3-standard-permutation-based-hash-and-extendable-output-functions).
`;

const data = JSON.stringify({
  content: newContent
});

const options = {
  hostname: 'thejord.it',
  port: 443,
  path: '/api/proxy/api/posts/hash-gen-it-001',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Updating Hash Generator content...');
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
