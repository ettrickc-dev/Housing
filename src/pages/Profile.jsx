import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext.jsx';
import {
  getProfile,
  upsertProfile,
  PROFILE_FIELDS,
  NUMERIC_PROFILE_KEYS,
} from '../lib/profile.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | saving | saved | error
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getProfile(user.id);
        if (!alive) return;
        setForm({ email: user.email, ...(data || {}) });
        setStatus('ready');
      } catch (err) {
        if (!alive) return;
        setError(err.message);
        setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (status === 'saved') setStatus('ready');
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const payload = {};
      for (const section of PROFILE_FIELDS) {
        for (const field of section.fields) {
          if (field.readOnly) continue;
          let val = form[field.key];
          if (val === '' || val === undefined) val = null;
          if (NUMERIC_PROFILE_KEYS.includes(field.key) && val !== null) {
            val = Number(val);
            if (Number.isNaN(val)) val = null;
          }
          payload[field.key] = val;
        }
      }
      await upsertProfile(user.id, payload);
      setStatus('saved');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'loading' || !form) {
    return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading your profile…</p>;
  }

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Your profile</h1>
      <p className="mt-1 text-sm text-gray-600">
        This information auto-fills into every document you create. You can edit any
        field before generating a document. Saved securely to your account.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        {PROFILE_FIELDS.map((section) => (
          <fieldset key={section.group}>
            <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {section.group}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-sm font-medium text-navy">
                    {field.label}
                    {field.tip && (
                      <span className="ml-1 cursor-help text-gray-400" title={field.tip}>
                        ⓘ
                      </span>
                    )}
                  </span>
                  <input
                    type={field.type || 'text'}
                    value={form[field.key] ?? ''}
                    readOnly={field.readOnly}
                    onChange={(e) => update(field.key, e.target.value)}
                    className={`input ${field.readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset>
          <label className="flex items-center gap-2 text-sm text-navy">
            <input
              type="checkbox"
              checked={!!form.reminder_emails}
              onChange={(e) => update('reminder_emails', e.target.checked)}
            />
            Email me reminders about notice-expiration and filing deadlines
          </label>
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="rounded-md bg-accent px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : 'Save profile'}
          </button>
          {status === 'saved' && <span className="text-sm text-green-700">Saved ✓</span>}
        </div>
      </form>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
