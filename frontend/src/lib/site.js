// Zentrale Definition der Live-Domain. Später einfach in frontend/.env
// REACT_APP_SITE_URL=https://kupketuning.de setzen (eine Stelle).
export const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://design-322.emergent.host').replace(/\/$/, '');
export const SITE_NAME = 'Kupke Tuning';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const DEFAULT_TITLE = 'Kupke Tuning – Ersatzteile & Tuningteile für Trabant, Wartburg, VW, Opel';
export const DEFAULT_DESCRIPTION = 'DEKRA-geprüfte Tuning- und Ersatzteile für Trabant, Wartburg, Barkas, VW und Opel. Motorsport auf die Straße – seit 1995.';
