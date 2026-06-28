import { Link, useParams } from 'react-router-dom';
import { getFormPage, FORM_PAGES } from '../lib/seoContent.js';
import { useSeo } from '../lib/useSeo.js';
import { LEGAL_DISCLAIMER } from '../lib/constants.js';

export default function FormLanding() {
  const { slug } = useParams();
  const page = getFormPage(slug);

  // FAQ structured data → eligible for Google rich results (higher click-through).
  const jsonLd = page
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  useSeo({ title: page?.title, description: page?.metaDescription, jsonLd });

  // A few related forms for the same audience (internal links = SEO + funnel).
  const related = page
    ? FORM_PAGES.filter((p) => p.audience === page.audience && p.slug !== page.slug).slice(0, 3)
    : [];

  if (!page) {
    return (
      <main className="mx-auto max-w-prose px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Form not found</h1>
        <Link to="/forms" className="mt-4 inline-block text-accent underline">
          Browse all forms
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        New York · {page.audience}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy">{page.h1}</h1>
      <p className="mt-4 text-gray-700">{page.intro}</p>

      <div className="mt-6">
        <Link
          to={`/document/${page.docType}`}
          className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Build this document — free to start
        </Link>
        <p className="mt-2 text-xs text-gray-500">
          Free to build and preview. No account needed until you download.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">When to use this</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
          {page.whenToUse.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">Common questions</h2>
        <dl className="mt-3 space-y-4">
          {page.faq.map((f, i) => (
            <div key={i}>
              <dt className="font-medium text-navy">{f.q}</dt>
              <dd className="mt-1 text-gray-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10">
        <Link
          to={`/document/${page.docType}`}
          className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Start your {page.h1.replace('New York ', '')}
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-navy">Related forms</h2>
          <ul className="mt-2 space-y-1">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/forms/${r.slug}`} className="text-accent underline">
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 rounded-md bg-panel px-4 py-3 text-xs leading-relaxed text-gray-500">
        {LEGAL_DISCLAIMER}
      </p>

      <p className="mt-4 text-sm">
        <Link to="/forms" className="text-accent underline">← All New York housing court forms</Link>
      </p>
    </main>
  );
}
