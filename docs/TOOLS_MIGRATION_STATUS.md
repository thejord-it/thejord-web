# Tools Migration - Status & Next Steps

## ✅ Completato

1. **Tool Configuration** (`lib/tools-config.ts`)
   - 11 tools configurati con metadata SEO completi

2. **Dynamic Routing** (`app/tools/[slug]/page.tsx`)
   - SSR con metadata perfetto
   - Schema.org JSON-LD

3. **Tool Wrapper** (`components/ToolWrapper.tsx`)
   - Lazy loading components
   - Breadcrumbs e footer

4. **Sitemap Updated** (`app/sitemap.ts`)
   - Include tutti i tools

5. **Import Paths Fixed**
   - `sed` commands eseguiti per fixare imports

## ⚠️ Da Completare

### 1. Riavvia Server

C'è un problema con processi multipli sulla porta 3000.

**Fix:**
```bash
# 1. Killa tutti i processi Node
tasklist | findstr node
taskkill /IM node.exe /F

# 2. Riavvia server
cd thejord-web
npm run dev
```

### 2. Possibili Errori Rimanenti

**i18next** - Serve stub o install:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**react-ga4** - Analytics:
```bash
# Opzione A: Install
npm install react-ga4

# Opzione B: Stub component
# Crea components/tools/analytics-stub.ts
```

**react-router-dom** - Già fixato con stubs

### 3. Test Checklist

Quando server parte:

```
✅ http://localhost:3000/tools
✅ http://localhost:3000/tools/json-formatter
✅ http://localhost:3000/tools/base64
✅ http://localhost:3000/sitemap.xml (verifica tools inclusi)
```

## 📝 Comandi Rapidi

```bash
# Kill all Node processes
taskkill /IM node.exe /F

# Start API
cd thejord-api && npm run dev

# Start Web (porta 3000)
cd thejord-web && npm run dev

# Test tools page
curl http://localhost:3000/tools

# Test sitemap
curl http://localhost:3000/sitemap.xml | grep tools
```

## 🐛 Troubleshooting

### Error: Module not found 'react-router-dom'

**Fix**: Già creati stubs in `components/tools/`

### Error: Module not found 'i18next'

**Fix**:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

Oppure crea stub:
```typescript
// lib/tools/i18n-stub.ts
export function useTranslation() {
  return { t: (key: string) => key, i18n: { language: 'it' } }
}
```

### Error: Can't resolve '../components/X'

**Fix**: Import paths già fixati con sed, ma se serve:
```bash
cd components/tools/pages
sed -i "s|from '../components/|from '@/components/tools/|g" *.tsx
sed -i "s|from '../lib/|from '@/lib/tools/|g" *.tsx
```

## 🎯 Prossimi Step

1. **Riavvia server pulito**
2. **Testa /tools page**
3. **Testa 1-2 tools specifici**
4. **Fix errori rimanenti** (probabilmente i18next)
5. **Deploy!**

## 📊 Struttura Finale

```
thejord-web/
├── app/
│   ├── tools/
│   │   ├── page.tsx (index tools)
│   │   └── [slug]/
│   │       └── page.tsx (dynamic route + SEO)
│   ├── sitemap.ts (include tools)
│   └── robots.ts
├── components/
│   ├── ToolWrapper.tsx (wrapper Next.js)
│   └── tools/ (copiati da the-jord-project)
│       ├── pages/ (11 tool components)
│       ├── Layout.tsx (stub)
│       ├── SEO.tsx (stub)
│       └── ... (altri components)
└── lib/
    ├── tools-config.ts (metadata SEO)
    └── tools/ (utilities copiate)
```

## ✅ SEO Status

- [x] Sitemap include tools
- [x] Robots.txt configurato
- [x] Schema.org WebApplication
- [x] Open Graph tags
- [x] Meta descriptions ottimizzate
- [x] Keywords per tool

**Ultimo aggiornamento**: 20 Novembre 2025, 02:15
