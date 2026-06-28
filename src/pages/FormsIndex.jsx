import { Link } from 'react-router-dom';
import { FORM_PAGES } from '../lib/seoContent.js';
import { useSeo } from '../lib/useSeo.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function FormsIndex() {
  useSeo(
    'New York Housing Court Forms — Landlord & Tenant | PlainRights Court',
    'Browse New York landlord-tenant court forms — rent demands, eviction petitions, tenant answers, and more. Build and preview free, in plain English.'
  );

  const landlord = FORM_PAGES.filter((p) => p.audience === 'Landlords');
  const tenant = FORM_PAGES.filter((p) => p.audience === 'Tenants');

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-navy">New York housing court forms</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Plain-English New York landlord-tenant documents you can build and preview for
        free. Pick the form you need to learn what it does and prepare it step by step.
      </p>

      <Group title="For landlords & owners" pages={landlord} />
      <Group title="For tenants & occupants" pages={tenant} />

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}

function Group({ title, pages }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/forms/${p.slug}`}
              className="block h-full rounded-lg border border-gray-200 p-4 hover:border-accent"
            >
              <span className="block font-semibold text-navy">{p.h1}</span>
              <span className="mt-1 block text-sm text-gray-600">{p.metaDescription}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
