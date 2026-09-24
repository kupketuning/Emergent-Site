// Static content for Kupke-Tuning shop. Products come from the Supabase-backed API.

export const IMG = {
  hero_race: 'https://images.unsplash.com/photo-1547025603-ef800f02690e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwzfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwY2FyfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85',
};

// Fallback used when a Supabase product has no image
export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxjYXIlMjBwYXJ0c3xlbnwwfHx8fDE3ODYxOTgwMDZ8MA&ixlib=rb-4.1.0&q=85';

// Category ids match the Supabase assembly_group values
export const categories = [
  { id: 'MOTOR', name: 'Motor & Tuning', sub: ['Original', 'Tuning', 'Rennsport'] },
  { id: 'BREMSE', name: 'Bremsen', sub: ['Original', 'Tuning', 'Rennsport'] },
  { id: 'FAHRWERK', name: 'Fahrwerk & Räder', sub: ['Original', 'Tuning', 'Rennsport'] },
  { id: 'ABGAS', name: 'Abgasanlagen', sub: ['Original', 'Tuning', 'Rennsport'] },
  { id: 'KAROSSERIE', name: 'Karosserie & Sicherheit', sub: ['Original', 'Tuning', 'Rennsport'] },
  { id: 'ELEKTRIK', name: 'Elektrik', sub: ['Original', 'Tuning', 'Rennsport'] },
];

// Options for the admin product form
export const VEHICLE_OPTIONS = [
  { value: 'TRABANT', label: 'Trabant' },
  { value: 'WARTBURG', label: 'Wartburg' },
  { value: 'B1000', label: 'Barkas B1000' },
  { value: 'VW', label: 'VW' },
  { value: 'OPEL', label: 'Opel' },
];
export const TYPE_OPTIONS = [
  { value: 'ORIGINAL', label: 'Original' },
  { value: 'TUNING', label: 'Tuning' },
  { value: 'RENNSPORT', label: 'Rennsport' },
];
export const ASSEMBLY_OPTIONS = [
  { value: 'MOTOR', label: 'Motor & Tuning' },
  { value: 'BREMSE', label: 'Bremsen' },
  { value: 'FAHRWERK', label: 'Fahrwerk & Räder' },
  { value: 'ABGAS', label: 'Abgasanlagen' },
  { value: 'KAROSSERIE', label: 'Karosserie & Sicherheit' },
  { value: 'ELEKTRIK', label: 'Elektrik' },
];
export const MODEL_OPTIONS = [
  { value: '', label: '– kein spezifischer Typ –' },
  { value: 'P601', label: 'P601' },
  { value: '1.1', label: '1.1' },
];
export const SPECIAL_CATEGORY_OPTIONS = [
  { value: '', label: 'Standard-Katalog (Fahrzeug / Typ / Baugruppe)' },
  { value: 'NORMTEIL', label: 'Normteil (ohne Fahrzeugzuordnung)' },
  { value: 'ABVERKAUF', label: 'Abverkauf / Einzelstück' },
];

const VEHICLE_LABELS = { TRABANT: 'Trabant', WARTBURG: 'Wartburg', B1000: 'Barkas B1000', VW: 'VW', OPEL: 'Opel' };
const TYPE_LABELS = { ORIGINAL: 'Original', TUNING: 'Tuning', RENNSPORT: 'Rennsport' };

// Maps a Supabase product record into the shape the shop UI expects
export const adaptProduct = (p) => {
  const net = Number(p.price_net) || 0;
  const gross = net > 0 ? (p.price_gross != null ? Number(p.price_gross) : Math.round(net * (1 + (Number(p.tax_rate) || 0) / 100) * 100) / 100) : null;
  return {
    id: p.id,
    art_nr: p.sku || '',
    sku: p.sku || '',
    name: p.name,
    description: p.description || '',
    category: p.assembly_group,
    vehicle_code: p.vehicle,
    type_code: p.product_type,
    assembly_code: p.assembly_group,
    sub: TYPE_LABELS[p.product_type] || '',
    brand: '',
    price: gross,
    price_net: net,
    tax_rate: Number(p.tax_rate) || 0,
    image: (p.images && p.images[0]) || FALLBACK_IMG,
    images: p.images || [],
    fahrzeug: VEHICLE_LABELS[p.vehicle] || p.vehicle || '',
    vehicle_model: p.vehicle_model || '',
    special_category: p.special_category || '',
    badge: p.product_type === 'RENNSPORT' ? 'Rennsport' : (p.is_set ? 'Komplettset' : (p.product_type === 'TUNING' ? 'Tuning' : null)),
    delivery: '1-2 Tage',
    variants: [],
    stock_quantity: p.stock_quantity,
    is_active: p.is_active,
    is_set: p.is_set,
    dekra_certified: !!p.dekra_certified,
    youtube_url: p.youtube_url || '',
    sort_order: p.sort_order ?? 100,
  };
};

export const brands = ['KONI', 'SPAX', 'EIBACH', 'H&R', 'K&N', 'BORBET', 'AZEV', 'HEIGO', 'WIECHERS', 'SANDTLER', 'ISA-RACING', 'RH'];

export const teams = [
  { name: 'Team Kupke', ort: 'Heinsdorfergrund', disziplin: 'Bergrennen / Slalom', rennserie: 'Bergrennen / Slalom', fahrzeug: 'Audi S3', text: '1,8-Liter-Turbomotor, ca. 270 PS, 6-Gang-Getriebe mit Allradantrieb – unser gelber S3 als Blickfang.', instagram: '', youtube: '' },
  { name: 'Team Rudolph', ort: 'Chemnitz', disziplin: 'Rallye', rennserie: 'Rallye', fahrzeug: 'Trabant 1300 RS', text: '1,3-Liter-Motor, ca. 75 PS, 5-Gang-VW-Getriebe, GTI-Bremse. Sehr gleichmäßiger Fahrer mit starken Gesamtresultaten.', instagram: '', youtube: '' },
  { name: 'Team Heide', ort: 'Greiz', disziplin: 'Rundstrecke / Slalom / Bergrennen', rennserie: 'Rundstrecke / Slalom / Bergrennen', fahrzeug: 'Trabant 1300', text: 'ca. 130 PS, extreme Gewichtserleichterung – fahrfertig nur 580 kg, KUPKE-KONI-Fahrwerk, Gruppe-A-Abgasanlage.', instagram: '', youtube: '' },
  { name: 'Team Werner', ort: 'Zeulenroda', disziplin: 'Rundstrecke / Slalom / Bergrennen', rennserie: 'Rundstrecke / Slalom / Bergrennen', fahrzeug: 'Trabant 1300', text: 'ca. 100 PS, Gruppe-A-Abgasanlage, KUPKE-KONI-Gewindefahrwerk, 601-er Optik, Gewichtserleichterung.', instagram: '', youtube: '' },
  { name: 'Frauenteam', ort: 'Heinsdorfergrund', disziplin: 'Motorsport', rennserie: 'Motorsport', fahrzeug: 'Trabant mit Scheibenbremse', text: 'Ein reines Frauenteam am Steuer eines Trabant mit KUPKE-Scheibenbremsen-Umrüstung – Motorsport-Power ganz ohne Vorurteile.', instagram: '', youtube: '' },
];

// Soziales Engagement, kein aktives Renn-Team
export const socialEngagement = {
  name: 'Herztakt-Sponsoring',
  fahrzeug: 'Wartburg',
  text: 'Mit unserem gesponserten Wartburg unterstützen wir die Aktion „Herztakt" für krebskranke Kinder – Motorsport, der etwas bewegt.',
};

export const topbarItems = [
  { icon: 'Truck', text: 'Versand deutschlandweit & Selbstabholung in Heinsdorfergrund' },
  { icon: 'Wrench', text: 'Eigenentwickelte Trabant-Tuningteile' },
  { icon: 'Trophy', text: 'Erprobt im aktiven Motorsport' },
];

export const features = [
  { icon: 'Flag', title: 'Über drei Jahrzehnte Motorsport-Erfahrung', text: 'Der Trabant im Rennsport: Ralley, Berg & Slalom – seit 1995.' },
  { icon: 'Wrench', title: 'Eigenentwicklung & Fertigung', text: 'Spezialteile für Trabant 1.1 & 601 – entwickelt und gefertigt in Heinsdorfergrund.' },
  { icon: 'Award', title: 'Starke Marken-Partner', text: 'KONI, EIBACH, H&R, BORBET, K&N, SANDTLER u.v.m. – schnell und unkompliziert.' },
  { icon: 'Car', title: 'Komplettfahrzeug-Aufbau', text: 'Rennfahrzeuge nach Kundenwunsch und nach ONS-Vorgaben.' },
];

export const formatPrice = (n) => {
  if (n === null || n === undefined || n === 0) return 'Preis auf Anfrage';
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00a0€';
};

// Always format as Euro amount (used for cart totals)
export const formatEuro = (n) =>
  (Number(n) || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00a0€';

// A product can be bought only if it has a concrete price
export const isPurchasable = (p) => p && p.price !== null && p.price !== undefined && p.price > 0;
