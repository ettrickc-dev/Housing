import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { getProfile, upsertProfile } from '../lib/profile.js';
import { ROLES, LOCATIONS, HOUSING_TYPES, NEEDS } from './config.js';
import GoodCauseChecker from './GoodCauseChecker.jsx';

const STEP_LABELS = ['Role', 'Location', 'Housing type', 'What you need'];

export default function IntakeWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ role: null, location_type: null, housing_type: null });
  const [loading, setLoading] = useState(true);
  const [showChecker, setShowChecker] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Resume where the user left off based on saved profile answers.
  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await getProfile(user.id).catch(() => null);
      if (!alive) return;
      if (p) {
        const a = {
          role: p.role || null,
          location_type: p.location_type || null,
          housing_type: p.housing_type || null,
        };
        setAnswers(a);
        // jump to the first unanswered step
        if (!a.role) setStep(0);
        else if (!a.location_type) setStep(1);
        else if (!a.housing_type) setStep(2);
        else setStep(3);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  async function choose(field, value, nextStep) {
    const next = { ...answers, [field]: value };
    setAnswers(next);
    setSaveError('');
    try {
      await upsertProfile(user.id, { [field]: value });
    } catch (err) {
      // Persistence may fail without live Supabase; let the user continue locally.
      setSaveError('Could not save your selection to your profile yet. You can continue.');
    }
    if (typeof nextStep === 'number') setStep(nextStep);
  }

  function openDocument(item) {
    if (item.ready) {
      navigate(`/document/${item.key}`);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>;
  }

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <ProgressBar step={step} />

      {saveError && (
        <p className="mt-4 rounded-md bg-warnbanner px-4 py-2 text-sm text-navy">{saveError}</p>
      )}

      {step === 0 && (
        <Section title="Who are you in this matter?">
          {ROLES.map((r) => (
            <BigButton key={r.value} label={r.label} blurb={r.blurb}
              selected={answers.role === r.value}
              onClick={() => choose('role', r.value, 1)} />
          ))}
        </Section>
      )}

      {step === 1 && (
        <Section title="Where is the property located?"
          onBack={() => setStep(0)}>
          {LOCATIONS.map((l) => (
            <BigButton key={l.value} label={l.label} blurb={l.blurb}
              selected={answers.location_type === l.value}
              onClick={() => choose('location_type', l.value, 2)} />
          ))}
        </Section>
      )}

      {step === 2 && (
        <Section title="What type of housing is it?" onBack={() => setStep(1)}>
          {HOUSING_TYPES.map((h) => (
            <div key={h.value}>
              <BigButton label={h.label} blurb={h.blurb}
                selected={answers.housing_type === h.value}
                onClick={() => choose('housing_type', h.value, 3)} />
              {h.explainer && answers.housing_type === h.value && (
                <div className="mt-2">
                  {showChecker ? (
                    <GoodCauseChecker onClose={() => setShowChecker(false)} />
                  ) : (
                    <button onClick={() => setShowChecker(true)}
                      className="text-sm text-accent underline">
                      Open the Good Cause coverage checker
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {step === 3 && (
        <Section title="What do you need to do?" onBack={() => setStep(2)}>
          <NeedMenu role={answers.role} onPick={openDocument} />
        </Section>
      )}
    </main>
  );
}

function ProgressBar({ step }) {
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STEP_LABELS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold ${
            i < step ? 'bg-accent text-white'
            : i === step ? 'bg-navy text-white'
            : 'bg-gray-200 text-gray-500'}`}>
            {i + 1}
          </span>
          <span className={i === step ? 'font-medium text-navy' : 'text-gray-400'}>{label}</span>
          {i < STEP_LABELS.length - 1 && <span className="text-gray-300">→</span>}
        </li>
      ))}
    </ol>
  );
}

function Section({ title, children, onBack }) {
  return (
    <section className="mt-8">
      {onBack && (
        <button onClick={onBack} className="mb-3 text-sm text-gray-500 hover:text-accent">
          ← Back
        </button>
      )}
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function BigButton({ label, blurb, selected, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full rounded-lg border p-5 text-left transition ${
        selected ? 'border-accent ring-2 ring-accent' : 'border-gray-200 hover:border-accent'}`}>
      <span className="block font-semibold text-navy">{label}</span>
      {blurb && <span className="mt-1 block text-sm text-gray-600">{blurb}</span>}
    </button>
  );
}

function NeedMenu({ role, onPick }) {
  const groups = NEEDS[role] || [];
  const [openGroup, setOpenGroup] = useState(null);

  // Level 1: pick a goal. We only show one category's forms at a time so the
  // page isn't an overwhelming wall of legal documents.
  if (openGroup === null) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">First, what do you want to do?</p>
        {groups.map((g, i) => {
          const readyCount = g.items.filter((it) => it.ready).length;
          return (
            <button
              key={g.group}
              onClick={() => setOpenGroup(i)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:border-accent"
            >
              <span>
                <span className="block font-semibold text-navy">{g.group}</span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  {readyCount} {readyCount === 1 ? 'form' : 'forms'} available
                </span>
              </span>
              <span className="text-gray-400">→</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Level 2: the forms inside the chosen goal.
  const g = groups[openGroup];
  return (
    <div>
      <button onClick={() => setOpenGroup(null)} className="mb-3 text-sm text-gray-500 hover:text-accent">
        ← All categories
      </button>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{g.group}</h2>
      <ul className="mt-3 space-y-2">
        {g.items.map((item) => (
          <li key={item.key}>
            <button onClick={() => onPick(item)}
              disabled={!item.ready}
              className={`flex w-full items-center justify-between rounded-md border p-3 text-left text-sm ${
                item.ready ? 'border-gray-200 hover:border-accent'
                : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'}`}>
              <span>{item.label}</span>
              <span className={`ml-3 shrink-0 rounded px-2 py-0.5 text-xs ${
                item.ready ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                {item.ready ? 'Start' : 'Soon'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
