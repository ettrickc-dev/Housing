import { useEffect, useState } from 'react';
import { getLawLog } from '../lib/admin.js';
import Disclaimer from '../components/Disclaimer.jsx';

// Public (to signed-in users) view of the law update log.
export default function LawUpdates() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLawLog(100).then((l) => { setLog(l); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Law update log</h1>
      <p className="mt-1 text-sm text-gray-600">
        A running record of when the statutes and procedures behind our documents were
        last reviewed or flagged for change. NY landlord-tenant law changes often —
        always confirm current law before filing.
      </p>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading…</p>
      ) : log.length === 0 ? (
        <p className="mt-6 text-gray-500">No law updates recorded yet.</p>
      ) : (
        <ul className="mt-6 space-y-2 text-sm">
          {log.map((e) => (
            <li key={e.id} className="rounded-md border border-gray-200 px-3 py-2">
              <span className="font-medium capitalize">{e.action}</span>
              {e.citation ? ` — ${e.citation}` : ''}
              {e.note ? <span className="text-gray-600"> · {e.note}</span> : ''}
              <span className="ml-2 text-xs text-gray-400">
                {new Date(e.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
