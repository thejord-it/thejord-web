# Blog Posts Scripts

Questa cartella contiene script e contenuti per la creazione di post sul blog THEJORD.

## Struttura File

```
scripts/
├── README.md                          # Questa documentazione
├── create-tool-posts.ts               # Script generico per 5 tool
├── create-xml-wsdl-posts.ts           # Script specifico XML/WSDL
├── content-url-encoder-it.html        # Contenuto URL Encoder (IT)
├── content-url-encoder-en.html        # Contenuto URL Encoder (EN)
├── content-markdown-converter-it.html # Contenuto Markdown (IT)
├── content-markdown-converter-en.html # Contenuto Markdown (EN)
├── content-color-converter-it.html    # Contenuto Color Converter (IT)
├── content-color-converter-en.html    # Contenuto Color Converter (EN)
├── content-lorem-ipsum-it.html        # Contenuto Lorem Ipsum (IT)
├── content-lorem-ipsum-en.html        # Contenuto Lorem Ipsum (EN)
├── content-pdf-tools-it.html          # Contenuto PDF Tools (IT)
├── content-pdf-tools-en.html          # Contenuto PDF Tools (EN)
├── content-xml-wsdl-it.html           # Contenuto XML/WSDL (IT)
└── content-xml-wsdl-en.html           # Contenuto XML/WSDL (EN)
```

## Processo Creazione Blog Post

### 1. Creare i file di contenuto HTML

Per ogni tool, creare 2 file HTML (italiano e inglese) seguendo le linee guida SEO:

**Nome file**: `content-{tool-slug}-{lang}.html`

**Struttura contenuto SEO-optimized**:
- Introduzione estesa (100-150 parole)
- Spiegazione tecnica del tool
- 7+ casi d'uso reali con esempi concreti
- 5+ esempi di codice (JavaScript, Python, PHP, Node.js)
- Tabelle comparative
- FAQ completa (6-8 domande)
- Security best practices
- Internal linking (3-5 link ad altri tool)
- External links (2-3 risorse autorevoli)

### 2. Aggiungere metadata allo script

Nel file `create-tool-posts.ts`, aggiungere un nuovo oggetto `NewPost`:

```typescript
{
  slug: 'nome-tool-guida-completa',           // URL-friendly
  title: 'Nome Tool: Guida Completa',         // Titolo H1
  language: 'it',                              // 'it' o 'en'
  translationGroup: 'nome-tool-001',          // ID per collegare IT/EN
  filePath: './scripts/content-nome-tool-it.html',
  excerpt: 'Descrizione breve 1-2 frasi per preview',
  readTime: '8 min',                          // Stima tempo lettura
  metaTitle: 'Meta title per SEO (max 60 char)',
  metaDescription: 'Meta description per SEO (max 160 char)',
  keywords: ['keyword1', 'keyword2', ...],    // 5-7 keywords
  tags: ['tag1', 'tag2', ...]                 // 3-5 tags
}
```

### 3. Eseguire lo script

```bash
# Produzione
ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts

# Staging (staging.thejord.it)
ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts --staging

# Dry run (verifica senza creare)
npx tsx scripts/create-tool-posts.ts --dry-run
```

### 4. Verificare i post

1. Accedere all'admin: `https://thejord.it/admin/posts`
2. Verificare i post sul blog: `https://thejord.it/blog`
3. Testare i link interni/esterni
4. Verificare le traduzioni IT/EN

## Come Ottenere ADMIN_TOKEN

### Metodo 1: Login API (Consigliato)

```bash
# Produzione
curl -s -X POST https://thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD"}' \
  | jq -r '.data.token'

# Staging
curl -s -X POST https://staging.thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD"}' \
  | jq -r '.data.token'
```

### Metodo 2: Admin Panel

Login su https://thejord.it/admin e copia il token dal localStorage

### Note sui Token

- Token JWT scadono dopo **7 giorni**
- Produzione e Staging hanno **JWT_SECRET diversi**
- Vedi `.claude/CREDENTIALS.md` per token attuali e credenziali

## Linee Guida SEO per i Contenuti

### Checklist Contenuto
- [ ] Introduzione 100-150 parole con keyword principale
- [ ] Almeno 7 casi d'uso reali
- [ ] 5+ esempi di codice multilingua
- [ ] Tabella comparativa con alternative
- [ ] FAQ 6-8 domande (schema.org ready)
- [ ] Security/privacy best practices
- [ ] 3-5 internal link
- [ ] 2-3 external link autorevoli
- [ ] CTA finale con link al tool

### Best Practices SEO
- [ ] URL < 60 caratteri
- [ ] Meta title < 60 caratteri
- [ ] Meta description 150-160 caratteri
- [ ] Keyword principale nel primo paragrafo
- [ ] H2/H3 con keyword correlate
- [ ] Immagini con alt text (se presenti)
- [ ] Link descrittivi (no "clicca qui")

## Database

I post vengono salvati nel database PostgreSQL:
- **Produzione**: `thejord_db` (tabella: `blog_posts`)
- **Staging**: `thejord_db_dev` (tabella: `blog_posts`)

### Query utili

```sql
-- Contare post per lingua
SELECT language, COUNT(*) FROM blog_posts WHERE published = true GROUP BY language;

-- Elencare tool senza post blog
SELECT DISTINCT tool_slug FROM tools
WHERE tool_slug NOT IN (SELECT DISTINCT tags[1] FROM blog_posts);

-- Verificare translation groups
SELECT translation_group, array_agg(language) as languages
FROM blog_posts
GROUP BY translation_group
HAVING COUNT(*) < 2;
```

## Troubleshooting

### Errore "File not found"
Verificare che il file HTML esista nel path specificato in `filePath`

### Errore "401 Unauthorized"
Token scaduto o invalido. Rigenerare ADMIN_TOKEN

### Errore "409 Conflict"
Post con stesso slug già esistente. Modificare lo slug o eliminare il post esistente

### Errore "500 Internal Server Error"
Controllare i log del backend:
```bash
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl logs -n thejord deploy/thejord-api --tail=100'"
```
