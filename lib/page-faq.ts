// FAQ for non-tool pages (home, tools index, about, contact, blog, changelog).
// Used to render a visible FAQ section + emit FAQPage JSON-LD (AEO: schema_answer
// + heading_domanda). Visible content and schema stay in sync (Google guideline).

export interface FAQ {
  question: string
  answer: string
}

export interface PageFAQs {
  it: FAQ[]
  en: FAQ[]
}

export const PAGE_FAQ: Record<string, PageFAQs> = {
  home: {
    it: [
      { question: 'Gli strumenti di THEJORD sono gratuiti?', answer: 'Sì, tutti gli strumenti sono gratuiti e non richiedono registrazione né account.' },
      { question: 'I miei dati sono al sicuro?', answer: 'Sì: ogni strumento gira al 100% nel tuo browser, nessun file o dato viene mai caricato o inviato a un server.' },
      { question: 'Serve installare qualcosa per usare i tool?', answer: 'No, funziona tutto online direttamente dal browser, anche da smartphone e tablet.' },
    ],
    en: [
      { question: 'Are THEJORD tools free?', answer: 'Yes, every tool is free and requires no sign-up or account.' },
      { question: 'Is my data safe?', answer: 'Yes: every tool runs 100% in your browser, no file or data is ever uploaded or sent to a server.' },
      { question: 'Do I need to install anything to use the tools?', answer: 'No, everything works online straight from the browser, including on phones and tablets.' },
    ],
  },
  tools: {
    it: [
      { question: 'Gli strumenti per sviluppatori sono gratis?', answer: 'Sì, tutti gratuiti, senza account e senza limiti di utilizzo.' },
      { question: 'I tool funzionano offline?', answer: 'Molti sì: l\'elaborazione è client-side, quindi una volta caricata la pagina lo strumento funziona anche senza connessione.' },
      { question: 'I miei dati vengono inviati a un server?', answer: 'No, tutto viene elaborato nel tuo browser e non lascia mai il dispositivo.' },
    ],
    en: [
      { question: 'Are the developer tools free?', answer: 'Yes, all of them are free, with no account and no usage limits.' },
      { question: 'Do the tools work offline?', answer: 'Many do: processing is client-side, so once the page has loaded the tool keeps working without a connection.' },
      { question: 'Is my data sent to a server?', answer: 'No, everything is processed in your browser and never leaves your device.' },
    ],
  },
  about: {
    it: [
      { question: 'Chi c\'è dietro THEJORD?', answer: 'THEJORD è un progetto solo-founder creato e mantenuto da Domenico Giordano.' },
      { question: 'Perché THEJORD è privacy-first?', answer: 'Perché gli strumenti girano interamente nel browser: i tuoi dati non lasciano mai il dispositivo e non vengono inviati ad alcun server.' },
    ],
    en: [
      { question: 'Who is behind THEJORD?', answer: 'THEJORD is a solo-founder project built and maintained by Domenico Giordano.' },
      { question: 'Why is THEJORD privacy-first?', answer: 'Because the tools run entirely in the browser: your data never leaves your device and is never sent to any server.' },
    ],
  },
  contact: {
    it: [
      { question: 'Quanto tempo ci vuole per ricevere una risposta?', answer: 'Di norma rispondo personalmente entro un paio di giorni lavorativi.' },
      { question: 'Come posso segnalare un bug?', answer: 'Puoi usare il form di contatto in questa pagina oppure aprire una issue sul repository GitHub di THEJORD.' },
    ],
    en: [
      { question: 'How long does it take to get a reply?', answer: 'I usually reply personally within a couple of business days.' },
      { question: 'How can I report a bug?', answer: 'You can use the contact form on this page or open an issue on the THEJORD GitHub repository.' },
    ],
  },
  blog: {
    it: [
      { question: 'Di cosa parla il blog di THEJORD?', answer: 'Guide tecniche e tutorial pratici per sviluppatori: automazione, tooling, SEO, Linux e sviluppo web, con esempi pronti all\'uso.' },
      { question: 'Gli articoli sono disponibili in italiano e inglese?', answer: 'Sì, i contenuti del blog sono bilingui: puoi leggerli sia in italiano che in inglese.' },
    ],
    en: [
      { question: 'What is the THEJORD blog about?', answer: 'Hands-on technical guides and tutorials for developers: automation, tooling, SEO, Linux and web development, with ready-to-use examples.' },
      { question: 'Are the articles available in both Italian and English?', answer: 'Yes, the blog content is bilingual: you can read it in both Italian and English.' },
    ],
  },
  changelog: {
    it: [
      { question: 'Ogni quanto viene aggiornato THEJORD?', answer: 'Gli aggiornamenti sono continui; questa pagina elenca ogni rilascio in ordine cronologico, dal più recente.' },
      { question: 'Dove trovo le novità più recenti?', answer: 'In cima a questa pagina, dove la versione più recente è sempre elencata per prima.' },
    ],
    en: [
      { question: 'How often is THEJORD updated?', answer: 'Updates are continuous; this page lists every release in chronological order, newest first.' },
      { question: 'Where can I find the latest changes?', answer: 'At the top of this page, where the most recent version is always listed first.' },
    ],
  },
}

export function getPageFAQs(pageKey: string, locale: string): FAQ[] {
  const faqs = PAGE_FAQ[pageKey]
  if (!faqs) return []
  return locale === 'it' ? faqs.it : faqs.en
}
