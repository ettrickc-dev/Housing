// Generates public/sitemap.xml from the SEO form pages at build time.
// Set SITE_URL in the environment when you have a custom domain.
import { writeFileSync } from 'node:fs';
import { FORM_PAGES } from '../src/lib/seoContent.js';
import { GUIDES } from '../src/lib/guidesContent.js';

const SITE = (process.env.SITE_URL || 'https://aesthetic-kitsune-d771d3.netlify.app').replace(/\/$/, '');

const staticPaths = ['/', '/forms', '/guides', '/efile', '/pricing', '/courts'];
const formPaths = FORM_PAGES.map((p) => `/forms/${p.slug}`);
const guidePaths = GUIDES.map((g) => `/guides/${g.slug}`);
const all = [...staticPaths, ...formPaths, ...guidePaths];

const urls = all
  .map((u) => `  <url><loc>${SITE}${u}</loc><changefreq>monthly</changefreq></url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml generated with ${all.length} urls (site: ${SITE})`);
