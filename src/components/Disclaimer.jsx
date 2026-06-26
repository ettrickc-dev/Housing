import { LEGAL_DISCLAIMER } from '../lib/constants.js';

// Mandated verbatim disclaimer. Rendered prominently on every page.
// `variant="banner"` for top-of-page; `variant="footer"` for page bottoms.
export default function Disclaimer({ variant = 'footer' }) {
  const base =
    'text-sm leading-relaxed border rounded-md px-4 py-3 bg-panel border-gray-300';
  const emphasis = variant === 'banner' ? 'font-medium text-navy' : 'text-gray-700';
  return (
    <aside role="note" aria-label="Legal disclaimer" className={`${base} ${emphasis}`}>
      <p>
        <span className="font-semibold uppercase tracking-wide text-xs text-deadline">
          Important —{' '}
        </span>
        {LEGAL_DISCLAIMER}
      </p>
    </aside>
  );
}
