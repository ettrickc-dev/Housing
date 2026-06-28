import { Link, useParams } from 'react-router-dom';
import { getGuide } from '../lib/guidesContent.js';
import { FORM_PAGES } from '../lib/seoContent.js';
import { useSeo } from '../lib/useSeo.js';
import { LEGAL_DISCLAIMER } from '../lib/constants.js';

const formByDocType = (docType) => FORM_PAGES.find((p) => p.docType === docType);

export default function GuideLanding() {
  const { slug } = useParams();
  const guide = getGuide(slug);

  const jsonLd = guide
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: guide.h1,
            description: guide.metaDescription,
            about: 'New York landlord-tenant law',
          },
          {
            '@type': 'FAQPage',
            mainEntity: guide.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
      }
    : null;

  useSeo({ title: guide?.title, description: guide?.metaDescription, jsonLd });

  if (!guide) {
    return (
      <main className="mx-auto max-w-prose px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Guide not found</h1>
        <Link to="/guides" className="mt-4 inline-block text-accent underline">All guides</Link>
      </main>
    );
  }

  const relatedForms = (guide.relatedForms || []).map(formByDocType).filter(Boolean);

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        New York · {guide.audience}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy">{guide.h1}</h1>
      <p className="mt-4 text-gray-700">{guide.intro}</p>

      {guide.sections.map((s) => (
        <section key={s.heading} className="mt-6">
          <h2 className="text-lg font-semibold text-navy">{s.heading}</h2>
          <p className="mt-1 text-gray-700">{s.body}</p>
        </section>
      ))}

      {relatedForms.length > 0 && (
        <section className="mt-10 rounded-lg border border-accent bg-blue-50 p-5">
          <h2 className="font-semibold text-navy">Ready to prepare your document?</h2>
          <p className="mt-1 text-sm text-gray-700">
            Build any of these in plain English — free to start, no account until you download.
          </p>
          <ul className="mt-3 space-y-1">
            {relatedForms.map((f) => (
              <li key={f.slug}>
                <Link to={`/document/${f.docType}`} className="font-medium text-accent underline">
                  {f.h1} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">Common questions</h2>
        <dl className="mt-3 space-y-4">
          {guide.faq.map((f, i) => (
            <div key={i}>
              <dt className="font-medium text-navy">{f.q}</dt>
              <dd className="mt-1 text-gray-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-10 rounded-md bg-panel px-4 py-3 text-xs leading-relaxed text-gray-500">
        {LEGAL_DISCLAIMER}
      </p>
      <p className="mt-4 text-sm">
        <Link to="/guides" className="text-accent underline">← All guides</Link>
      </p>
    </main>
  );
}
