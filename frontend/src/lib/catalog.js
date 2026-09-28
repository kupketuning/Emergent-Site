// Katalog-Struktur: Fahrzeug -> Typ -> Baugruppe

export const VEHICLES = [
  { slug: 'trabant', code: 'TRABANT', name: 'Trabant', primary: true, image: 'https://images.pexels.com/photos/27453017/pexels-photo-27453017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { slug: 'wartburg', code: 'WARTBURG', name: 'Wartburg', image: 'https://images.pexels.com/photos/15660477/pexels-photo-15660477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { slug: 'b1000', code: 'B1000', name: 'Barkas', image: 'https://images.pexels.com/photos/9293956/pexels-photo-9293956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { slug: 'vw', code: 'VW', name: 'VW', image: 'https://images.unsplash.com/photo-1574581501439-6405a98bd76c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940' },
  { slug: 'opel', code: 'OPEL', name: 'Opel', image: 'https://images.pexels.com/photos/32173335/pexels-photo-32173335.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
];

export const TYPES = [
  { slug: 'original', code: 'ORIGINAL', name: 'Original' },
  { slug: 'tuning', code: 'TUNING', name: 'Tuning' },
];

export const ASSEMBLIES = [
  { slug: 'motor', code: 'MOTOR', name: 'Motor' },
  { slug: 'bremse', code: 'BREMSE', name: 'Bremse' },
  { slug: 'fahrwerk', code: 'FAHRWERK', name: 'Fahrwerk' },
  { slug: 'abgas', code: 'ABGAS', name: 'Abgas' },
  { slug: 'elektrik', code: 'ELEKTRIK', name: 'Elektrik' },
  { slug: 'karosserie', code: 'KAROSSERIE', name: 'Karosserie' },
];

// Fahrzeug-Typen (Zwischenebene) — aktuell nur für Trabant gepflegt
export const MODELS = {
  TRABANT: [
    { slug: 'p601', code: 'P601', name: 'P601' },
    { slug: '1-1', code: '1.1', name: '1.1' },
  ],
};

export const vehicleBySlug = (s) => VEHICLES.find((v) => v.slug === s);
export const typeBySlug = (s) => TYPES.find((t) => t.slug === s);
export const assemblyBySlug = (s) => ASSEMBLIES.find((a) => a.slug === s);
export const modelBySlug = (vehicleCode, s) => (MODELS[vehicleCode] || []).find((m) => m.slug === s);
