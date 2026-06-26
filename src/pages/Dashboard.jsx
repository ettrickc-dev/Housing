import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { getProfile } from '../lib/profile.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, docs, wf] = await Promise.all([
        getProfile(user.id).catch(() => null),
        supabase
          .from('documents')
          .select('id,title,doc_type,status,paid,created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('workflows')
          .select('id,workflow_type,stage,next_action_date,next_action_label')
          .order('created_at', { ascending: false }),
      ]);
      if (!alive) return;
      setProfile(p);
      setDocuments(docs.data || []);
      setWorkflows(wf.data || []);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const needsProfile = !profile?.full_name || !profile?.role;

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Your dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">{user.email}</p>

      {needsProfile && (
        <div className="mt-6 rounded-md bg-warnbanner px-4 py-3 text-sm text-navy">
          Finish setting up:{' '}
          <Link to="/profile" className="font-medium underline">
            complete your profile
          </Link>{' '}
          so we can auto-fill your documents.
        </div>
      )}

      {/* Active workflows */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Your active matters</h2>
        {loading ? (
          <p className="mt-2 text-sm text-gray-500">Loading…</p>
        ) : workflows.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            No active matters yet. Start one from the intake wizard.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {workflows.map((w) => (
              <li key={w.id} className="rounded-md border border-gray-200 p-3 text-sm">
                <span className="font-medium capitalize">{w.workflow_type}</span> —{' '}
                {w.stage}
                {w.next_action_date && (
                  <span className="ml-1 text-deadline">
                    · {w.next_action_label} on {w.next_action_date}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Documents */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Your documents</h2>
        {loading ? (
          <p className="mt-2 text-sm text-gray-500">Loading…</p>
        ) : documents.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No documents yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {documents.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-3 text-sm"
              >
                <span>{d.title}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    d.paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {d.paid ? 'Paid' : d.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 flex gap-3">
        <Link
          to="/start"
          className="rounded-md bg-accent px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          Start a document
        </Link>
        <Link
          to="/profile"
          className="rounded-md border border-gray-300 px-5 py-2 font-medium text-navy hover:bg-gray-50"
        >
          Edit profile
        </Link>
      </div>
    </main>
  );
}
