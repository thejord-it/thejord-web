# SEO Implementation - THEJORD Blog

Documentazione completa dell'implementazione SEO per il blog THEJORD.

## ✅ Implementato

### 1. Sitemap Dinamico (`/sitemap.xml`)

**File**: `app/sitemap.ts`

**Funzionalità**:
- Genera automaticamente sitemap da database post pubblicati
- Include tutte le pagine statiche (home, blog)
- Include tutti i post pubblicati con metadata
- Aggiorna `lastModified` basato su `updatedAt` del post

**URL**: https://thejord.it/sitemap.xml

**Contenuto generato**:
```xml
<urlset>
  <url>
    <loc>https://thejord.it</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thejord.it/blog</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thejord.it/blog/post-slug</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

### 2. Robots.txt (`/robots.txt`)

**File**: `app/robots.ts`

**Funzionalità**:
- Blocca `/admin/` (CMS privato)
- Blocca `/api/` (endpoints API)
- Permette tutto il resto
- Punta al sitemap

**URL**: https://thejord.it/robots.txt

**Contenuto generato**:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://thejord.it/sitemap.xml
```

---

### 3. Schema.org JSON-LD

**File**: `app/blog/[slug]/page.tsx` (linee 90-120)

**Funzionalità**:
- Structured data per Google Rich Results
- Tipo: `BlogPosting`
- Include: autore, publisher, date, immagini, keywords
- Word count e tempo di lettura

**Esempio output**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Come Ottimizzare Next.js per il SEO",
  "description": "Guida completa...",
  "image": "https://thejord.it/uploads/image.webp",
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-16T14:30:00Z",
  "author": {
    "@type": "Person",
    "name": "The Jord"
  },
  "publisher": {
    "@type": "Organization",
    "name": "THEJORD",
    "logo": {
      "@type": "ImageObject",
      "url": "https://thejord.it/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://thejord.it/blog/ottimizzare-nextjs-seo"
  },
  "keywords": "nextjs, seo, performance",
  "articleSection": "Tutorial, Next.js",
  "wordCount": 1523,
  "timeRequired": "7 min",
  "inLanguage": "it-IT"
}
```

---

### 4. Open Graph Tags

**File**: `app/blog/[slug]/page.tsx` (linee 44-63)

**Funzionalità**:
- Meta tags per social sharing (Facebook, LinkedIn, etc.)
- Immagine OG 1200x630
- Tipo: `article`
- Include published/modified time, autore, tags

**Meta tags generati**:
```html
<meta property="og:type" content="article" />
<meta property="og:url" content="https://thejord.it/blog/slug" />
<meta property="og:title" content="Titolo Articolo" />
<meta property="og:description" content="Descrizione..." />
<meta property="og:site_name" content="THEJORD" />
<meta property="og:locale" content="it_IT" />
<meta property="og:image" content="https://thejord.it/uploads/og-image.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="article:published_time" content="2025-01-15T10:00:00Z" />
<meta property="article:modified_time" content="2025-01-16T14:30:00Z" />
<meta property="article:author" content="The Jord" />
<meta property="article:tag" content="nextjs" />
<meta property="article:tag" content="seo" />
```

---

### 5. Twitter Card Tags

**File**: `app/blog/[slug]/page.tsx` (linee 64-70)

**Funzionalità**:
- Meta tags per Twitter/X
- Card type: `summary_large_image`
- Immagine ottimizzata

**Meta tags generati**:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Titolo Articolo" />
<meta name="twitter:description" content="Descrizione..." />
<meta name="twitter:image" content="https://thejord.it/uploads/og-image.webp" />
<meta name="twitter:creator" content="@thejord_it" />
```

---

### 6. Canonical URLs

**File**: `app/blog/[slug]/page.tsx` (linea 42)

**Funzionalità**:
- Previene duplicate content
- Campo custom in CMS o auto-generato

**Meta tag generato**:
```html
<link rel="canonical" href="https://thejord.it/blog/slug" />
```

---

### 7. Robots Meta Tags

**File**: `app/blog/[slug]/page.tsx` (linee 71-78)

**Funzionalità**:
- Indicizza solo post pubblicati
- Draft = `noindex, nofollow`
- Published = `index, follow`

**Meta tags generati**:
```html
<!-- Post pubblicato -->
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />

<!-- Post draft -->
<meta name="robots" content="noindex, nofollow" />
<meta name="googlebot" content="noindex, nofollow" />
```

---

## 🧪 Come Testare il SEO

### Test 1: Sitemap

```bash
# Locale (dev)
curl http://localhost:3000/sitemap.xml

# Production
curl https://thejord.it/sitemap.xml
```

**Verifica**:
- ✅ XML ben formato
- ✅ Tutti i post pubblicati presenti
- ✅ URL assoluti (https://thejord.it/...)
- ✅ Date `lastModified` corrette

---

### Test 2: Robots.txt

```bash
# Locale
curl http://localhost:3000/robots.txt

# Production
curl https://thejord.it/robots.txt
```

**Verifica**:
- ✅ `Disallow: /admin/`
- ✅ `Disallow: /api/`
- ✅ `Sitemap:` presente

---

### Test 3: Schema.org Validation

1. Vai a: https://validator.schema.org/
2. Inserisci URL: `https://thejord.it/blog/[slug-post]`
3. Click "Run Test"

**Verifica**:
- ✅ No errors
- ✅ Tipo: `BlogPosting`
- ✅ Tutti i campi required presenti

**Oppure usa Google Rich Results Test:**

1. Vai a: https://search.google.com/test/rich-results
2. Inserisci URL post
3. Click "Test URL"

**Verifica**:
- ✅ "Article" rilevato
- ✅ Immagine, autore, data presenti
- ✅ No warnings/errors

---

### Test 4: Open Graph Tags

**Metodo 1: Facebook Debugger**

1. Vai a: https://developers.facebook.com/tools/debug/
2. Inserisci URL post
3. Click "Debug"

**Verifica**:
- ✅ Immagine OG carica correttamente (1200x630)
- ✅ Titolo e descrizione corretti
- ✅ Type: `article`

**Metodo 2: LinkedIn Post Inspector**

1. Vai a: https://www.linkedin.com/post-inspector/
2. Inserisci URL
3. Click "Inspect"

---

### Test 5: Twitter Card

1. Vai a: https://cards-dev.twitter.com/validator
2. Inserisci URL post
3. Preview della card

**Verifica**:
- ✅ Card type: `summary_large_image`
- ✅ Immagine carica
- ✅ Titolo e description corretti

---

### Test 6: Google Search Console

Dopo deploy production:

1. Vai a: https://search.google.com/search-console
2. Aggiungi proprietà: `https://thejord.it`
3. Verifica ownership (file HTML o DNS)
4. Sitemaps → Aggiungi `https://thejord.it/sitemap.xml`
5. URL Inspection → Testa URL singoli

**Metriche da monitorare**:
- Copertura (coverage)
- Core Web Vitals
- Mobile usability
- Rich results

---

### Test 7: PageSpeed Insights

1. Vai a: https://pagespeed.web.dev/
2. Inserisci URL: `https://thejord.it/blog/[slug]`
3. Analizza mobile + desktop

**Target**:
- ✅ Performance: 90+
- ✅ Accessibility: 95+
- ✅ Best Practices: 95+
- ✅ SEO: 100

---

## 📊 SEO Checklist Completa

### On-Page SEO ✅

- [x] Title tags ottimizzati (<60 caratteri)
- [x] Meta descriptions (<160 caratteri)
- [x] H1 unico per pagina
- [x] Struttura heading gerarchica (H1 > H2 > H3)
- [x] URL SEO-friendly (slug)
- [x] Alt text immagini
- [x] Canonical URL
- [x] Internal linking (← Back to Blog)

### Technical SEO ✅

- [x] Sitemap.xml dinamico
- [x] Robots.txt
- [x] Schema.org JSON-LD
- [x] SSL/HTTPS (da configurare in production)
- [x] Mobile responsive
- [x] Fast loading (WebP, lazy loading)
- [x] Clean URL structure

### Social SEO ✅

- [x] Open Graph tags
- [x] Twitter Card tags
- [x] OG Image (1200x630)
- [x] Social share preview

### i18n SEO ✅

- [x] Canonical URL per ogni pagina (con locale)
- [x] Hreflang tags per alternates linguistici
- [x] Redirect 308 (permanent) invece di 307 (temporary)
- [x] Sitemap multilingue

### Content SEO ✅

- [x] Keywords in meta
- [x] Read time indicator
- [x] Author attribution
- [x] Published/modified dates
- [x] Tags/categories
- [x] Excerpt/description

---

## 🌐 Implementazione i18n SEO

### Struttura URL Multilingue

Il sito supporta italiano (`/it/`) e inglese (`/en/`) con prefisso locale obbligatorio:

```
https://thejord.it/it/blog/articolo-slug   (italiano)
https://thejord.it/en/blog/article-slug    (inglese)
```

### Canonical URL

**IMPORTANTE**: Ogni pagina DEVE definire il proprio canonical in `generateMetadata()`.

**NON** impostare canonical nel layout.tsx - non ha accesso al pathname corrente.

**Esempio corretto** (`app/[locale]/blog/page.tsx`):
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: t('title'),
    alternates: {
      canonical: `https://thejord.it/${locale}/blog`,
      languages: {
        'it': 'https://thejord.it/it/blog',
        'en': 'https://thejord.it/en/blog',
      },
    },
  }
}
```

**Pagine con canonical implementato**:
- `app/[locale]/page.tsx` - Homepage
- `app/[locale]/blog/page.tsx` - Lista blog
- `app/[locale]/blog/[slug]/page.tsx` - Post blog
- `app/[locale]/tools/page.tsx` - Lista tools
- `app/[locale]/tools/[slug]/page.tsx` - Tool singolo
- `app/[locale]/about/page.tsx` - Chi siamo
- `app/[locale]/contact/page.tsx` - Contatti

### Hreflang Tags

Generati automaticamente da `alternates.languages` in metadata:

```html
<link rel="alternate" hreflang="it" href="https://thejord.it/it/blog" />
<link rel="alternate" hreflang="en" href="https://thejord.it/en/blog" />
```

### Redirect 308 (Permanent)

Il middleware (`middleware.ts`) converte i redirect 307 di next-intl in 308:

```typescript
// middleware.ts
if (response.status === 307) {
  const location = response.headers.get('location')
  if (location) {
    return NextResponse.redirect(new URL(location, request.url), {
      status: 308,  // Permanent redirect per SEO
      headers: response.headers
    })
  }
}
```

**Perché 308 invece di 307**:
- 307 = Temporary Redirect - Google non trasferisce PageRank
- 308 = Permanent Redirect - Google trasferisce PageRank e indicizza l'URL finale

### Client Components e Metadata

Per pagine con `'use client'` (es. form), separare in:
1. `components/[name]/[Component].tsx` - Client component con UI
2. `app/[locale]/[path]/page.tsx` - Server component con `generateMetadata()`

**Esempio**: La pagina contact usa `ContactForm` client component importato in un server page.

---

## 🚀 Next Steps Post-Deploy

### 1. Submit Sitemap

**Google Search Console**:
- URL: https://thejord.it/sitemap.xml

**Bing Webmaster Tools**:
- URL: https://thejord.it/sitemap.xml

### 2. Monitor Indexing

```bash
# Check indexed pages
site:thejord.it

# Check specific URL
site:thejord.it/blog/slug
```

### 3. Track Performance

**Tools da configurare**:
- Google Analytics 4
- Google Search Console
- Bing Webmaster Tools

**Metriche chiave**:
- Impressions
- Clicks
- CTR
- Average position
- Core Web Vitals

### 4. Ottimizzazioni Continue

- Monitorare pagine lente
- Aggiungere internal links
- Ottimizzare immagini
- Aggiornare contenuti vecchi
- Rispondere a domande in featured snippets

---

## 🐛 Troubleshooting

### Sitemap non si aggiorna

**Causa**: Cache ISR Next.js

**Fix**:
```bash
# Revalidate cache
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer REVALIDATE_TOKEN" \
  -d '{"path": "/sitemap.xml"}'
```

### Schema.org errori

**Causa comune**: Campi mancanti

**Fix**: Verifica che ogni post abbia:
- Title ✅
- Excerpt ✅
- Author ✅
- Published date ✅
- Image ✅

### OG Image non carica

**Causa**: URL relativo o CORS

**Fix**: Usa sempre URL assoluti:
```typescript
image: `https://thejord.it${post.image}`
```

### Robots.txt non funziona

**Causa**: Cached

**Fix**: Hard refresh (Ctrl+Shift+R) o incognito

---

## 📚 Riferimenti

- [Google Search Central](https://developers.google.com/search)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

**Ultimo aggiornamento**: 15 Dicembre 2025
**Versione**: 1.1 (aggiunta sezione i18n SEO)
**Autore**: Claude Code + The Jord
