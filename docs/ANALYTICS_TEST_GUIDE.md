# Google Analytics Testing Guide

**Measurement ID configurato:** `G-1LDVSZHTTB`
**Property:** thejord.it
**Stream ID:** 12992087063

---

## ✅ Setup Completato

- [x] GoogleAnalytics component creato
- [x] CookieConsent banner implementato
- [x] Analytics utilities disponibili
- [x] Layout integrato con componenti
- [x] Measurement ID configurato in `.env.local`
- [x] js-cookie installato

---

## 🧪 Come Testare Analytics in Development

### 1. Avvia il Dev Server

```bash
cd "C:\Users\domen\OneDrive\Documenti\Python Projects\thejord-web"
npm run dev
```

### 2. Verifica Caricamento Script

1. Apri http://localhost:3000
2. Apri **DevTools** (F12)
3. Vai su **Network** tab
4. Filtra per "google" o "gtag"
5. Dovresti vedere:
   - ✅ `gtag/js?id=G-1LDVSZHTTB` (script caricato)
   - ✅ Richieste a `google-analytics.com` o `analytics.google.com`

### 3. Verifica gtag nel Console

Nel browser console, esegui:

```javascript
// Verifica che gtag sia caricato
console.log(typeof window.gtag) // dovrebbe essere "function"

// Verifica dataLayer
console.log(window.dataLayer) // dovrebbe essere un array con eventi
```

### 4. Testa Cookie Consent Banner

1. **Prima visita:**
   - ✅ Banner appare dopo 1 secondo
   - ✅ Slide-up animation smooth
   - ✅ Bottoni "Reject Optional" e "Accept All" visibili

2. **Clicca "Accept All":**
   - ✅ Banner scompare
   - ✅ Cookie `cookie_consent=accepted` salvato (vedi DevTools → Application → Cookies)
   - ✅ Google Analytics attivo (vedi Network tab)

3. **Ricarica pagina:**
   - ✅ Banner NON appare più (cookie salvato)

4. **Testa "Reject Optional":**
   - Cancella cookie `cookie_consent`
   - Ricarica pagina
   - Clicca "Reject Optional"
   - ✅ Cookie `cookie_consent=rejected` salvato
   - ✅ Analytics disabilitato via consent API

### 5. Test Real-Time in Google Analytics

1. Vai su [Google Analytics](https://analytics.google.com)
2. Seleziona la property **thejord** (ID: 513242999)
3. Vai su **Reports** → **Realtime**
4. Nel browser, visita http://localhost:3000
5. Dovresti vedere:
   - ✅ 1 utente attivo (tu)
   - ✅ Page view registrato
   - ✅ Location: tua città/paese

**Nota:** I dati real-time possono avere delay di 5-10 secondi.

### 6. Test Eventi Custom

Nel browser console, esegui:

```javascript
// Test evento custom
if (window.gtag) {
  gtag('event', 'test_event', {
    event_category: 'Test',
    event_label: 'Manual Test',
    value: 1
  })
}
```

Poi vai su GA4 → Realtime → Events e verifica che appaia `test_event`.

### 7. Test Tracking Functions

Apri il console e prova le funzioni di tracking:

```javascript
// Importa (se hai access alla funzione in window)
// Oppure vai su una pagina con un tool che usa tracking

// Esempio tracking manuale
window.gtag('event', 'button_click', {
  event_category: 'Engagement',
  event_label: 'Test Button'
})
```

---

## 🐛 Troubleshooting

### Analytics NON carica

**Problema:** Script gtag.js non viene caricato

**Soluzioni:**
1. Verifica che `.env.local` contenga `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1LDVSZHTTB`
2. Restart del dev server (Ctrl+C e `npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R)
4. Controlla browser console per errori

### Banner NON appare

**Problema:** Cookie consent banner non visibile

**Soluzioni:**
1. Cancella cookie `cookie_consent` da DevTools
2. Ricarica pagina in incognito mode
3. Verifica componente `<CookieConsent />` in layout.tsx

### Eventi NON registrati in GA

**Problema:** Eventi custom non appaiono in Google Analytics

**Soluzioni:**
1. Verifica `window.gtag` sia definito (console)
2. Controlla Network tab per richieste a `collect?v=2`
3. Usa GA4 DebugView invece di Reports (più veloce)
4. Aspetta 24-48h per eventi in Reports standard

### Ad Blocker Blocca Analytics

**Problema:** uBlock Origin o altri ad blocker bloccano GA

**Soluzione:**
- Per testing, disabilita temporaneamente ad blocker
- Oppure whitelista `localhost` e `google-analytics.com`

---

## 📊 Eventi da Monitorare

### Eventi Automatici (GA4)
- ✅ `page_view` - ogni navigazione
- ✅ `first_visit` - primo accesso utente
- ✅ `session_start` - inizio sessione
- ✅ `scroll` - scroll pagina (90%)
- ✅ `click` - click su link esterni

### Eventi Custom (quando implementati nei tool)
- 🔜 `tool_usage` - uso di un tool
- 🔜 `button_click` - click su bottoni
- 🔜 `copy_to_clipboard` - copy azioni
- 🔜 `file_upload` - upload file
- 🔜 `error` - errori applicazione

---

## 🎯 Prossimi Passi

### Development
1. ✅ Test analytics in localhost
2. ✅ Verifica cookie consent
3. 🔜 Implementare tracking nei tool esistenti
4. 🔜 Test tracking copy/paste azioni
5. 🔜 Test tracking errori

### Production
1. 🔜 Aggiungere `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1LDVSZHTTB` a variabili env K8s
2. 🔜 Deploy su staging
3. 🔜 Test produzione con DebugView
4. 🔜 Monitorare per 1 settimana
5. 🔜 Creare dashboard custom in GA4

---

## 📝 Note Importanti

1. **Stesso Measurement ID di production** - Quando andremo live, sostituiremo completamente thejord-tools, quindi i dati saranno continuativi

2. **Privacy-First** - IP anonymization attivo, cookie consent GDPR-compliant

3. **Test vs Prod Data** - I test in localhost inviano dati alla stessa property. Considera:
   - Filtrare hostname in GA4 (localhost vs thejord.it)
   - Oppure creare test property separato (sconsigliato per continuità)

4. **Data Retention** - Google Analytics conserva dati per 14 mesi (default)

5. **Cross-Domain Tracking** - Se in futuro servirà tracking tra domini, va configurato

---

## 📚 Risorse

- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [GA4 Realtime Reports](https://support.google.com/analytics/answer/9271392)
- [Cookie Consent Best Practices](https://developers.google.com/tag-platform/security/guides/consent)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

---

**Ultimo aggiornamento:** 24 Novembre 2025
**Status:** ✅ Pronto per test
