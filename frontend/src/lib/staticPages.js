// Konfiguration der statischen Seiten (Platzhalter-Inhalte, später ersetzbar)

const PLACEHOLDER = 'Dieser Inhalt wird in Kürze ergänzt. Bitte tragen Sie hier den finalen, rechtssicheren Text ein.';

export const STATIC_PAGES = {
  impressum: {
    slug: 'impressum',
    title: 'Impressum',
    metaTitle: 'Impressum',
    metaDescription: 'Impressum und Anbieterkennzeichnung von Kupke Tuning gemäß § 5 TMG.',
    sections: [
      { heading: 'Angaben gemäß § 5 TMG', paragraphs: ['Kupke Tuning', 'Nadezhda Kupke', '[Straße & Hausnummer]', '[PLZ Ort]', PLACEHOLDER] },
      { heading: 'Kontakt', paragraphs: ['Telefon: [Platzhalter]', 'E-Mail: shop@kupketuning.de', 'Web: www.kupketuning.de'] },
      { heading: 'Umsatzsteuer-ID / Steuernummer', paragraphs: ['[Platzhalter]'] },
    ],
  },
  agb: {
    slug: 'agb',
    title: 'Allgemeine Geschäftsbedingungen',
    metaTitle: 'AGB – Allgemeine Geschäftsbedingungen',
    metaDescription: 'Allgemeine Geschäftsbedingungen (AGB) für Bestellungen bei Kupke Tuning.',
    sections: [
      { heading: '§ 1 Geltungsbereich', paragraphs: [PLACEHOLDER] },
      { heading: '§ 2 Vertragsschluss', paragraphs: [PLACEHOLDER] },
      { heading: '§ 3 Preise und Versandkosten', paragraphs: [PLACEHOLDER] },
      { heading: '§ 4 Lieferung', paragraphs: [PLACEHOLDER] },
    ],
  },
  widerruf: {
    slug: 'widerruf',
    title: 'Widerrufsbelehrung',
    metaTitle: 'Widerrufsbelehrung & Widerrufsrecht',
    metaDescription: 'Informationen zum Widerrufsrecht und zur Widerrufsbelehrung bei Kupke Tuning.',
    sections: [
      { heading: 'Widerrufsrecht', paragraphs: [PLACEHOLDER] },
      { heading: 'Folgen des Widerrufs', paragraphs: [PLACEHOLDER] },
      { heading: 'Muster-Widerrufsformular', paragraphs: [PLACEHOLDER] },
    ],
  },
  datenschutz: {
    slug: 'datenschutz',
    title: 'Datenschutzerklärung',
    metaTitle: 'Datenschutzerklärung',
    metaDescription: 'Datenschutzerklärung von Kupke Tuning gemäß DSGVO.',
    sections: [
      { heading: '1. Datenschutz auf einen Blick', paragraphs: [PLACEHOLDER] },
      { heading: '2. Verantwortliche Stelle', paragraphs: [PLACEHOLDER] },
      { heading: '3. Cookies', paragraphs: ['Wir setzen technisch notwendige Cookies (z. B. für den Warenkorb) sowie – nur mit Deiner Einwilligung – Analyse-Cookies zur Reichweitenmessung ein. Deine Einwilligung kannst Du jederzeit über den Link „Cookie-Einstellungen" im Footer widerrufen oder anpassen.', PLACEHOLDER] },
      { heading: '4. Ihre Rechte', paragraphs: [PLACEHOLDER] },
    ],
  },
  batterieverordnung: {
    slug: 'batterieverordnung',
    title: 'Hinweise zur Batterieverordnung',
    metaTitle: 'Hinweise zur Batterieverordnung (BattG)',
    metaDescription: 'Pflichthinweise zur Rücknahme und Entsorgung von Batterien nach dem Batteriegesetz.',
    sections: [
      { heading: 'Rücknahme von Altbatterien', paragraphs: [PLACEHOLDER] },
      { heading: 'Bedeutung der Symbole', paragraphs: [PLACEHOLDER] },
    ],
  },
  verpackungsverordnung: {
    slug: 'verpackungsverordnung',
    title: 'Hinweise zum Verpackungsgesetz',
    metaTitle: 'Hinweise zum Verpackungsgesetz (VerpackG)',
    metaDescription: 'Informationen zu unseren Pflichten nach dem Verpackungsgesetz (VerpackG).',
    sections: [
      { heading: 'Verpackungsgesetz (VerpackG)', paragraphs: [PLACEHOLDER] },
    ],
  },
  'ueber-uns': {
    slug: 'ueber-uns',
    title: 'Über uns — Kupke Tuning seit 1995',
    metaTitle: 'Über uns – Kupke Tuning seit 1995',
    metaDescription: 'Die Geschichte von Kupke Tuning: Trabant-Tuning und Motorsport aus Lengenfeld seit 1995.',
    sections: [
      { heading: 'Unsere Geschichte', paragraphs: ['[Platzhalter für Firmengeschichte] – Kupke Tuning steht seit 1995 für hochwertige Trabant-Ersatzteile und Motorsport-Eigenentwicklungen.', PLACEHOLDER] },
      { heading: 'Motorsport im Blut', paragraphs: [PLACEHOLDER] },
      { heading: 'Eigenentwicklung & Fertigung', paragraphs: [PLACEHOLDER] },
    ],
  },
  dekra: {
    slug: 'dekra',
    title: 'DEKRA-geprüfte Qualität',
    metaTitle: 'DEKRA-geprüfte Qualität',
    metaDescription: 'Was bedeutet DEKRA-geprüft bei Kupke Tuning? Antworten rund um Prüfung und Zulassung unserer Teile.',
    faq: [
      { q: 'Was bedeutet „DEKRA-geprüft" bei uns?', a: PLACEHOLDER },
      { q: 'Sind die Teile eintragungsfrei?', a: PLACEHOLDER },
      { q: 'Erhalte ich ein Prüfgutachten?', a: PLACEHOLDER },
    ],
  },
};

export const staticPageBySlug = (slug) => STATIC_PAGES[slug];
