// Build-time SEO prerender. Netlify's built-in prerendering is deprecated, so
// instead of relying on crawlers executing JS, we bake per-route <head> tags
// (title, description, canonical, Open Graph, JSON-LD structured data) into
// static HTML files. Netlify serves the matching static file before the SPA
// fallback, so each public route ships crawler-ready metadata.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORM_PAGES } from '../src/lib/seoContent.js';
import { GUIDES } from '../src/lib/guidesContent.js';

const SITE = (process.env.SITE_URL || 'https://aesthetic-kitsune-d771d3.netlify.app').replace(/\/$/, '');
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const template = readFileSync(distDir + 'index.html', 'utf8');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const faqLd = (faq) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function head({ path, title, description, jsonLd }) {
  const url = SITE + path;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="PlainRights Court" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  return tags.join('\n    ');
}

function write(path, meta) {
  const html = template.replace(/<title>.*?<\/title>/s, head({ path, ...meta }));
  const out = distDir + (path === '/' ? 'index.html' : path.replace(/^\//, '') + '/index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

const routes = [
  ['/', {
    title: 'New York Housing Court Forms — Eviction & Tenant Documents | PlainRights Court',
    description: 'Prepare New York landlord-tenant court documents in plain English — rent demands, eviction petitions, tenant answers, and more. Free to build and preview; deadlines calculated for you.',
  }],
  ['/forms', {
    title: 'New York Housing Court Forms — Landlord & Tenant | PlainRights Court',
    description: 'Browse New York landlord-tenant court forms — rent demands, eviction petitions, tenant answers, and more. Build and preview free, in plain English.',
  }],
  ['/guides', {
    title: 'New York Eviction & Tenant Guides | PlainRights Court',
    description: 'Plain-English guides to New York housing court: how to evict a tenant, how to respond to an eviction case, deadlines, and where to file.',
  }],
  ['/efile', {
    title: 'File Your NY Eviction Case Online (NYSCEF) — Skip the Line | PlainRights Court',
    description: 'How to e-file your New York landlord-tenant case from home through NYSCEF instead of waiting hours at the courthouse. Step-by-step for NYC and outside NYC.',
  }],
  ['/pricing', {
    title: 'Pricing — Prepare NY Housing Court Documents | PlainRights Court',
    description: 'Affordable New York housing court document preparation. Pay per document or go unlimited with a subscription. Free to build and preview first.',
  }],
  ['/courts', {
    title: 'New York Housing Court Directory — Where to File | PlainRights Court',
    description: 'Find your New York housing court — NYC Housing Court by borough and guidance for courts outside New York City.',
  }],
  ['/terms', { title: 'Terms of Service | PlainRights Court', description: 'Terms of Service for PlainRights Court.' }],
  ['/privacy', { title: 'Privacy Policy | PlainRights Court', description: 'Privacy Policy for PlainRights Court.' }],
  ['/refunds', { title: 'Refund Policy | PlainRights Court', description: 'Refund Policy for PlainRights Court.' }],
];

for (const p of FORM_PAGES) {
  routes.push([`/forms/${p.slug}`, { title: p.title, description: p.metaDescription, jsonLd: faqLd(p.faq) }]);
}
for (const g of GUIDES) {
  routes.push([`/guides/${g.slug}`, {
    title: g.title, description: g.metaDescription,
    jsonLd: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Article', headline: g.h1, description: g.metaDescription, about: 'New York landlord-tenant law' },
      faqLd(g.faq),
    ] },
  }]);
}

for (const [path, meta] of routes) write(path, meta);
console.log(`prerendered ${routes.length} SEO pages (site: ${SITE})`);
