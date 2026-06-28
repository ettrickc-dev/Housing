import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { getProfile, upsertProfile } from '../lib/profile.js';
import { getLocalIntake, setLocalIntake } from '../lib/draft.js';
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

  // Resume where the user left off. Signed-in: from their profile. Anonymous:
  // from localStorage (so people can use the wizard before creating an account).
  const userId = user?.id;
  useEffect(() => {
    let alive = true;
    (async () => {
      const src = userId
        ? await getProfile(userId).catch(() => null)
        : getLocalIntake();
      if (!alive) return;
      if (src) {
        const a = {
          role: src.role || null,
          location_type: src.location_type || null,
          housing_type: src.housing_type || null,
        };
        setAnswers(a);
        if (!a.role) setStep(0);
        else if (!a.location_type) setStep(1);
        else if (!a.housing_type) setStep(2);
        else setStep(3);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [userId]);

  async function choose(field, value, nextStep) {
    const next = { ...answers, [field]: value };
    setAnswers(next);
    setSaveError('');
    if (userId) {
      try {
        await upsertProfile(userId, { [field]: value });
      } catch (err) {
        setSaveError('Could not save your selection yet. You can continue.');
      }
    } else {
      // Anonymous: keep answers locally until they sign up.
      setLocalIntake(next);
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
          <div className="-mt-2 mb-4 rounded-md bg-panel px-4 py-3 text-sm text-gray-700">
            New to this? You don't need to know legal terms. Pick the option that sounds
            like your situation in plain words, and we'll prepare the right court document
            and tell you exactly what to do next — including how to{' '}
            <Link to="/efile" className="text-accent underline">file online from home</Link>.
            Want background first? Read a{' '}
            <Link to="/guides" className="text-accent underline">free step-by-step guide</Link>.
          </div>
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
        <p className="text-sm text-gray-600">Pick the one that sounds like your situation:</p>
        {groups.map((g, i) => (
          <button
            key={g.group}
            onClick={() => setOpenGroup(i)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 text-left hover:border-accent"
          >
            <span>
              <span className="block font-semibold text-navy">{g.plainTitle || g.group}</span>
              <span className="mt-0.5 block text-sm text-gray-500">{g.help}</span>
            </span>
            <span className="shrink-0 text-gray-400">→</span>
          </button>
        ))}
      </div>
    );
  }

  // Level 2: the forms inside the chosen goal.
  const g = groups[openGroup];
  return (
    <div>
      <button onClick={() => setOpenGroup(null)} className="mb-3 text-sm text-gray-500 hover:text-accent">
        ← Back to all options
      </button>
      <h2 className="font-semibold text-navy">{g.plainTitle || g.group}</h2>
      <p className="mt-1 text-sm text-gray-500">{g.help}</p>
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
