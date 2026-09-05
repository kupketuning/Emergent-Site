// Generiert public/robots.txt und public/sitemap.xml aus der zentralen Domain.
// Läuft automatisch vor jedem Build (prebuild). Domain-Quelle: frontend/.env REACT_APP_SITE_URL
const fs = require('fs');
const path = require('path');

let site = process.env.REACT_APP_SITE_URL;
if (!site) {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const m = env.match(/^REACT_APP_SITE_URL=(.+)$/m);
    if (m) site = m[1].trim();
  } catch (e) { /* ignore */ }
}
site = (site || 'https://design-322.emergent.host').replace(/\/$/, '');

const routes = [
  '/', '/katalog/trabant', '/katalog/wartburg', '/katalog/b1000', '/katalog/vw', '/katalog/opel',
  '/ueber-uns', '/dekra', '/kontakt',
  '/impressum', '/agb', '/widerruf', '/datenschutz', '/batterieverordnung', '/verpackungsverordnung',
];

const today = new Date().toISOString().slice(0, 10);
const urls = routes.map((r) => `  <url>\n    <loc>${site}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`;

const pub = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pub, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(pub, 'robots.txt'), robots);
console.log('[gen-seo] sitemap.xml & robots.txt generated for', site);
