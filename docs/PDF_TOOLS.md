# PDF Tools - Documentazione Completa

## Panoramica

PDF Tools è un modulo completo per la manipolazione di file PDF direttamente nel browser, senza necessità di upload su server esterni. Tutte le operazioni vengono eseguite client-side utilizzando le librerie `pdf-lib` e `pdfjs-dist`.

## Tecnologie Utilizzate

- **pdf-lib**: Libreria per la creazione e modifica di PDF
- **pdfjs-dist**: Libreria Mozilla per il rendering e parsing di PDF
- **Next.js**: Framework React con App Router
- **Tailwind CSS**: Styling
- **next-intl**: Internazionalizzazione (IT/EN)

---

## Funzionalità

### 1. Merge (Unione PDF)

**Descrizione**: Combina più file PDF in un unico documento.

**Caratteristiche**:
- Drag & drop per caricare i file
- Riordinamento dei file tramite drag & drop
- Preview delle pagine con thumbnails
- Rimozione singoli file dalla lista
- Nome file output: `merged_[timestamp].pdf`

**Implementazione**:
```typescript
// Utilizza PDFDocument.load() per caricare ogni PDF
// Copia le pagine con copyPages()
// Salva con pdfDoc.save()
```

**File coinvolti**:
- `components/tools/pages/PdfTools.tsx` - Sezione Merge

---

### 2. Split (Divisione PDF)

**Descrizione**: Divide un PDF in più file separati o estrae pagine specifiche.

**Modalità**:
1. **Estrai tutte le pagine**: Crea un PDF separato per ogni pagina
2. **Intervallo di pagine**: Specifica pagine da estrarre (es: "1-3, 5, 7-10")
3. **Dividi ogni N pagine**: Crea file con N pagine ciascuno

**Caratteristiche**:
- Preview con thumbnails di tutte le pagine
- Selezione visuale delle pagine da estrarre
- Eliminazione pagine dal documento
- Download multiplo come ZIP (usando JSZip)
- Download singolo per ogni file risultante

**File coinvolti**:
- `components/tools/pages/PdfTools.tsx` - Sezione Split

---

### 3. Edit (Editor PDF Avanzato)

**Descrizione**: Editor completo per modificare PDF con annotazioni, disegni e compilazione form.

#### 3.1 Strumenti Disponibili

| Strumento | Icona | Descrizione |
|-----------|-------|-------------|
| Select | Cursore | Seleziona e sposta annotazioni |
| Text | T | Aggiunge caselle di testo |
| Draw | Matita | Disegno a mano libera |
| Form | Documento | Compila campi form esistenti |

#### 3.2 Annotazioni di Testo

**Creazione**:
- Click sulla pagina con strumento Text attivo
- Appare input per digitare il testo
- Doppio click per modificare testo esistente

**Formattazione** (toolbar principale e contestuale):
- **Font Family**: Helvetica, Times-Roman, Courier + Google Fonts (Roboto, Open Sans, Lato, Montserrat, Poppins, Oswald, Raleway, Playfair Display, Arimo/Arial)
- **Font Size**: 8-72pt con dropdown e pulsanti A (piccolo/grande)
- **Bold/Italic**: Toggle buttons
- **Colore**: Color picker integrato

**Manipolazione**:
- **Selezione**: Click sull'annotazione
- **Spostamento**:
  - Drag handle nella toolbar contestuale
  - Trascinamento dai bordi tratteggiati
- **Eliminazione**: Pulsante cestino nella toolbar

**Toolbar Contestuale** (appare sopra l'annotazione selezionata):
```
[Drag] | [Font▼] | [Size▼][A][A] | [B][I] | [Color] | [Edit][Delete]
```

#### 3.3 Disegno a Mano Libera

- Colore stroke configurabile
- Spessore linea: 1-10px
- Path SVG overlay sulla pagina
- Salvataggio come linee nel PDF finale

#### 3.4 Compilazione Form

- Rilevamento automatico campi form nel PDF
- Supporto tipi:
  - Text fields
  - Checkboxes
  - Dropdowns
  - Radio buttons
- Overlay visuale sui campi

#### 3.5 Navigazione e Zoom

**Navigazione pagine**:
- Footer con pulsanti prev/next
- Indicatore pagina corrente / totale

**Zoom**:
- Pulsanti +/- nella toolbar (step 25%)
- **Alt + Scroll**: Zoom con rotella mouse
- Range: 25% - 300%
- Indicatore percentuale zoom

**Comportamento zoom**:
- Le annotazioni mantengono la posizione relativa
- Font size scala proporzionalmente
- Container scrollabile quando supera viewport

#### 3.6 Undo/Redo

**Implementazione**:
- History stack con stato completo (annotations, paths, form fields)
- Max history: illimitato nella sessione

**Controlli**:
- Pulsanti toolbar (frecce curve)
- `Ctrl+Z`: Undo
- `Ctrl+Y` o `Ctrl+Shift+Z`: Redo

**Stati tracciati**:
- Aggiunta/rimozione annotazioni
- Modifica testo/formattazione
- Spostamento annotazioni
- Disegni
- Valori form fields

#### 3.7 Salvataggio

- Pulsante "Save & Download" nell'header
- Nome file: `[original]_edited.pdf`
- Embedding font Google Fonts nel PDF
- Conversione coordinate zoom-independent

**File coinvolti**:
- `components/tools/PdfEditor.tsx` - Componente principale editor
- `lib/tools/pdf-renderer.ts` - Funzioni rendering pdfjs

---

### 4. Convert (Conversione)

#### 4.1 Immagini → PDF

**Input supportati**: JPG, JPEG, PNG, WebP, GIF, BMP

**Caratteristiche**:
- Upload multiplo
- Riordinamento immagini
- Preview thumbnails
- Rimozione singole immagini
- Output: `images_to_pdf_[timestamp].pdf`

#### 4.2 PDF → Immagini

**Output**: PNG ad alta risoluzione

**Caratteristiche**:
- Conversione tutte le pagine
- Preview risultato
- Download singolo o ZIP completo
- Scale factor configurabile

**File coinvolti**:
- `components/tools/pages/PdfTools.tsx` - Sezioni Convert

---

### 5. Compress (Compressione)

**Descrizione**: Riduce la dimensione del file PDF.

**Livelli di compressione**:
| Livello | Scale | Qualità | Uso |
|---------|-------|---------|-----|
| Low | 0.9 | 80% | Minima riduzione, alta qualità |
| Medium | 0.75 | 60% | Bilanciato |
| High | 0.5 | 40% | Massima riduzione |

**Processo**:
1. Rendering pagine come immagini
2. Compressione JPEG con qualità specificata
3. Ricostruzione PDF con immagini compresse

**Output**: `[original]_compressed.pdf`

**File coinvolti**:
- `components/tools/pages/PdfTools.tsx` - Sezione Compress

---

## Architettura Componenti

```
components/tools/
├── pages/
│   └── PdfTools.tsx      # Container principale con tabs
├── PdfEditor.tsx         # Editor avanzato standalone
└── ToolWrapper.tsx       # Wrapper comune per tutti i tools

lib/tools/
└── pdf-renderer.ts       # Utility pdfjs (loadPdfDocument, renderPageToDataUrl)
```

---

## Configurazione

### Content Security Policy (next.config.ts)

```typescript
// CSP headers per permettere:
"script-src 'self' ... blob:"           // Worker pdfjs
"worker-src 'self' blob:"               // PDF.js web worker
"connect-src '...' https://fonts.googleapis.com https://fonts.gstatic.com"
"style-src '...' https://fonts.googleapis.com"
"font-src '...' https://fonts.gstatic.com"
```

### Dynamic Import per SSR

```typescript
// pdf-renderer.ts usa dynamic import per evitare errori SSR
// pdfjs-dist usa DOMMatrix che non esiste server-side
const getPdfRenderer = () => import('@/lib/tools/pdf-renderer')
```

---

## Traduzioni

Le traduzioni sono in `messages/[locale].json` sotto la chiave `toolPages.pdfTools`:

```json
{
  "toolPages": {
    "pdfTools": {
      "title": "PDF Tools",
      "tabs": { "merge": "...", "split": "...", ... },
      "merge": { ... },
      "split": { ... },
      "edit": { ... },
      "convert": { ... },
      "compress": { ... },
      "editor": { ... },
      "common": { ... }
    }
  }
}
```

---

## Costanti e Configurazioni

### Base Scale (PdfEditor.tsx)
```typescript
const BASE_SCALE = 1.5  // Scala base per rendering (senza zoom)
```

### Font Disponibili
```typescript
const standardFonts = [
  { name: 'Helvetica', css: 'Helvetica, Arial, sans-serif' },
  { name: 'Times-Roman', css: 'Times New Roman, Times, serif' },
  { name: 'Courier', css: 'Courier New, Courier, monospace' },
]

const googleFonts = [
  { name: 'Arimo (Arial)', css: 'Arimo, sans-serif', urlName: 'Arimo' },
  { name: 'Roboto', css: 'Roboto, sans-serif' },
  // ... altri font
]
```

### Dimensioni Font Disponibili
```typescript
[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72]
```

### Spessori Linea Disegno
```typescript
[1, 2, 3, 4, 5, 8, 10] // pixels
```

---

## Gestione Coordinate e Zoom

### Sistema di Coordinate

1. **Coordinate PDF**: Sistema nativo del documento (origine in basso-sinistra)
2. **Coordinate Screen**: Pixel sullo schermo (origine in alto-sinistra)
3. **Coordinate Base**: Coordinate screen a zoom=1 (BASE_SCALE=1.5)

### Conversione al Salvataggio

```typescript
// Da coordinate base a coordinate PDF:
x_pdf = annotation.x / BASE_SCALE
y_pdf = pageHeight - (annotation.y / BASE_SCALE)
```

### Gestione Zoom

```typescript
// Dimensioni pagina: sempre in coordinate base
const baseViewport = page.getViewport({ scale: BASE_SCALE })
setPageDimensions({ width: baseViewport.width, height: baseViewport.height })

// Container: base * zoom
width: pageDimensions.width * zoom

// Annotazione creata: click / zoom (per ottenere coordinate base)
const x = (e.clientX - rect.left) / zoom

// Annotazione renderizzata: base * zoom
left: annotation.x * zoom
fontSize: annotation.fontSize * zoom
```

---

## Gestione History (Undo/Redo)

### Struttura State

```typescript
interface HistoryState {
  textAnnotations: TextAnnotation[]
  drawPaths: DrawPath[]
  formFields: FormField[]
}

const [history, setHistory] = useState<HistoryState[]>([])
const [historyIndex, setHistoryIndex] = useState(-1)
const isUndoRedoAction = useRef(false)
```

### Logica Push

```typescript
// Triggered da useEffect quando annotations/paths/fields cambiano
// Ignora se è un'azione undo/redo (isUndoRedoAction.current = true)
// Tronca history futura se non siamo all'ultimo stato
```

### Undo/Redo

```typescript
const handleUndo = () => {
  if (historyIndex > 0) {
    isUndoRedoAction.current = true
    const prevState = history[historyIndex - 1]
    // Restore state con deep clone
    setHistoryIndex(prev => prev - 1)
  }
}
```

---

## Interfacce TypeScript

```typescript
interface TextAnnotation {
  id: string
  pageNum: number
  x: number           // Coordinate base (senza zoom)
  y: number
  text: string
  fontSize: number    // Dimensione base (senza zoom)
  color: string       // Hex color
  fontFamily: string
  isBold: boolean
  isItalic: boolean
}

interface DrawPath {
  id: string
  pageNum: number
  points: { x: number; y: number }[]  // Coordinate base
  color: string
  lineWidth: number
}

interface FormField {
  name: string
  type: 'text' | 'checkbox' | 'dropdown' | 'radio'
  pageNum: number
  rect: { x: number; y: number; width: number; height: number }
  value: string | boolean
  options?: string[]  // Per dropdown
}
```

---

## Shortcuts Tastiera

| Shortcut | Azione |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+Shift+Z` | Redo (alternativo) |
| `Alt+Scroll` | Zoom in/out |
| `Enter` | Conferma editing testo |
| `Escape` | Annulla editing testo |

---

## UI/UX Design

### Tema

- **Dark theme** per toolbar e controlli
- **Background**: `bg-bg-darkest`, `bg-bg-dark`, `bg-bg-elevated`
- **Bordi**: `border-border`
- **Testo**: `text-text-primary`, `text-text-muted`
- **Accent**: `bg-primary` (blu)

### Toolbar Principale

```
[Undo][Redo] | [Select][Text][Draw][Form] | [Font▼] | [Size▼][A][A] | [B][I] | [Color] | --- | [Zoom- ][100%][Zoom+]
```

### Toolbar Contestuale (30% più grande)

- Appare sopra l'annotazione selezionata
- Altezza elementi: 32px (h-8)
- Font size: text-sm
- Icone: 16x16px (w-4 h-4)

### Download Area Uniforme

```
[PDF Icon] | [Filename]          | [Download Button]
           | Ready to download   |
```

---

## Limitazioni Note

1. **Modifica testo esistente**: Non supportata (solo aggiunta nuove annotazioni)
2. **OCR**: Non implementato
3. **Password protection**: Non supportata
4. **Digital signatures**: Non supportate
5. **Form creation**: Solo compilazione form esistenti
6. **Layers/Bookmarks**: Non gestiti

---

## Dipendenze

```json
{
  "pdf-lib": "^1.17.1",
  "pdfjs-dist": "^4.x",
  "jszip": "^3.x"  // Per download multipli
}
```

---

## Performance Notes

- Rendering lazy delle pagine (solo pagina corrente)
- Cache dei font Google caricati
- Throttling eventi mouse per disegno fluido
- Dynamic import per code splitting
