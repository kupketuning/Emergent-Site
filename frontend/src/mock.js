// Static content for Kupke-Tuning shop. Products now come from the backend API.

export const IMG = {
  hero_race: 'https://images.unsplash.com/photo-1547025603-ef800f02690e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwzfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwY2FyfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85',
};

export const categories = [
  { id: 'abgasanlagen', name: 'Abgasanlagen', sub: ['Gruppe A', 'Edelstahl-Auspuff', 'Fächerkrümmer', 'Schalldämpfer'] },
  { id: 'bremsen', name: 'Bremsen', sub: ['GTI-Umbau', 'Rennsport', 'Stahlflex', 'Bremsscheiben'] },
  { id: 'fahrwerke', name: 'Fahrwerke', sub: ['Gewindefahrwerk', 'Sportfahrwerk', 'Tieferlegung', 'Stoßdämpfer', 'Zubehör'] },
  { id: 'raeder', name: 'Räder', sub: ['Alufelgen', 'Stahlfelgen', 'Lochkreisumbau', 'Spurverbreiterung', 'Radbolzen'] },
  { id: 'sicherheit', name: 'Sicherheit', sub: ['Überrollbügel', 'Überrollkäfig', 'Domstreben', 'Versteifung'] },
  { id: 'tuning', name: 'Tuning', sub: ['Ansaugung', 'Luftfilter', 'Getriebe', 'Leistungssteigerung', 'Nockenwellen', 'Kühlung'] },
  { id: 'design', name: 'Design', sub: ['Innenraum', 'Zierteile'] },
  { id: 'motorsport', name: 'Motorsport', sub: ['Schalensitze', 'Lenkräder', 'Sicherheitstechnik'] },
];

export const brands = ['KONI', 'SPAX', 'EIBACH', 'H&R', 'K&N', 'BORBET', 'AZEV', 'HEIGO', 'WIECHERS', 'SANDTLER', 'ISA-RACING', 'RH'];

export const teams = [
  { name: 'Team Rudolph', ort: 'Chemnitz', disziplin: 'Ralley', fahrzeug: 'Trabant 1300 RS', text: '1,3-Liter-Motor, ca. 75 PS, 5-Gang-VW-Getriebe, GTI-Bremse. Sehr gleichmäßiger Fahrer mit starken Gesamtresultaten.' },
  { name: 'Team Heide', ort: 'Greiz', disziplin: 'Rundstrecke / Slalom / Bergrennen', fahrzeug: 'Trabant 1300', text: 'ca. 130 PS, extreme Gewichtserleichterung – fahrfertig nur 580 kg, KUPKE-KONI-Fahrwerk, Gruppe-A-Abgasanlage.' },
  { name: 'Team Werner', ort: 'Zeulenroda', disziplin: 'Rundstrecke / Slalom / Bergrennen', fahrzeug: 'Trabant 1300', text: 'ca. 100 PS, Gruppe-A-Abgasanlage, KUPKE-KONI-Gewindefahrwerk, 601-er Optik, Gewichtserleichterung.' },
  { name: 'Team Kupke', ort: 'Lengenfeld', disziplin: 'Bergrennen / Slalom', fahrzeug: 'Audi S3', text: '1,8-Liter-Turbomotor, ca. 270 PS, 6-Gang-Getriebe mit Allradantrieb – unser gelber S3 als Blickfang.' },
];

export const topbarItems = [
  { icon: 'Truck', text: 'Versand deutschlandweit & Selbstabholung in Lengenfeld' },
  { icon: 'Wrench', text: 'Eigenentwickelte Trabant-Tuningteile' },
  { icon: 'Trophy', text: 'Erprobt im aktiven Motorsport' },
];

export const features = [
  { icon: 'Flag', title: '20+ Jahre Motorsport-Erfahrung', text: 'Der Trabant im Rennsport: Ralley, Berg & Slalom – seit über zwei Jahrzehnten.' },
  { icon: 'Wrench', title: 'Eigenentwicklung & Fertigung', text: 'Spezialteile für Trabant 1.1 & 601 – entwickelt und gefertigt in Lengenfeld.' },
  { icon: 'Award', title: 'Starke Marken-Partner', text: 'KONI, EIBACH, H&R, BORBET, K&N, SANDTLER u.v.m. – schnell und unkompliziert.' },
  { icon: 'Car', title: 'Komplettfahrzeug-Aufbau', text: 'Rennfahrzeuge nach Kundenwunsch und nach ONS-Vorgaben.' },
];

export const formatPrice = (n) => {
  if (n === null || n === undefined || n === 0) return 'Preis auf Anfrage';
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00a0€';
};
