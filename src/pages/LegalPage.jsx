import { useParams, Link } from 'react-router-dom';
import { getLegalDoc, LEGAL_UPDATED } from '../lib/legalContent.js';
import { useSeo } from '../lib/useSeo.js';

// Renders Terms / Privacy / Refund from a shared slug.
export default function LegalPage({ slug: fixedSlug }) {
  const params = useParams();
  const slug = fixedSlug || params.slug;
  const doc = getLegalDoc(slug);

  useSeo({ title: doc?.title, description: `${doc?.h1} for PlainRights Court.` });

  if (!doc) {
    return (
      <main className="mx-auto max-w-prose px-4 py-16 text-center">
        <h1 className="page-h1">Not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent underline">Home</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="page-h1">{doc.h1}</h1>
      <p className="mt-1 text-xs text-gray-500">Last updated: {LEGAL_UPDATED}</p>
      <div className="prose-legal mt-6 space-y-6">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="section-h2">{s.h}</h2>
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
      </div>
    </main>
  );
}
