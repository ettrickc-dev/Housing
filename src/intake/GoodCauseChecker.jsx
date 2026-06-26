import { useState } from 'react';
import { GOOD_CAUSE_QUESTIONS } from './config.js';

// Plain-language coverage checker. Output is educational guidance, NOT a legal
// determination — coverage is fact-specific and the law has local opt-outs.
export default function GoodCauseChecker({ onClose }) {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  function setAnswer(key, val) {
    setAnswers((a) => ({ ...a, [key]: val }));
  }

  const allAnswered = GOOD_CAUSE_QUESTIONS.every((q) => answers[q.key] !== undefined);

  // "Likely covered" only if every gating question is answered "yes".
  const likelyCovered = GOOD_CAUSE_QUESTIONS.every((q) => answers[q.key] === 'yes');
  const reasons = GOOD_CAUSE_QUESTIONS.filter((q) => answers[q.key] === 'no').map(
    (q) => q.coversIfNo
  );

  return (
    <div className="rounded-lg border border-gray-300 bg-panel p-5">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-navy">Good Cause coverage checker</h3>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-accent">
          Close
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Answer a few questions. This is a rough guide only — coverage depends on
        facts and your locality, and the law (L. 2024, ch. 56) is new and changing.
      </p>

      {!done ? (
        <div className="mt-4 space-y-4">
          {GOOD_CAUSE_QUESTIONS.map((q) => (
            <div key={q.key} className="text-sm">
              <p className="font-medium text-navy">{q.q}</p>
              <div className="mt-1 flex gap-2">
                {['yes', 'no', 'unsure'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(q.key, opt)}
                    className={`rounded border px-3 py-1 capitalize ${
                      answers[q.key] === opt
                        ? 'border-accent bg-accent text-white'
                        : 'border-gray-300 bg-white text-navy hover:border-accent'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            disabled={!allAnswered}
            onClick={() => setDone(true)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            See result
          </button>
        </div>
      ) : (
        <div className="mt-4 text-sm">
          {likelyCovered ? (
            <p className="rounded-md bg-green-50 px-4 py-3 text-green-800">
              Based on your answers, you may be <strong>covered</strong> by Good Cause
              Eviction protections. Confirm with current law and a NY attorney before
              relying on this.
            </p>
          ) : (
            <div className="rounded-md bg-warnbanner px-4 py-3 text-navy">
              <p>
                Based on your answers, you may <strong>not</strong> be covered, or
                coverage is unclear. Reasons flagged:
              </p>
              <ul className="mt-2 list-disc pl-5">
                {reasons.length ? (
                  reasons.map((r, i) => <li key={i}>{r}</li>)
                ) : (
                  <li>One or more answers were "unsure" — coverage cannot be estimated.</li>
                )}
              </ul>
            </div>
          )}
          <button
            onClick={() => setDone(false)}
            className="mt-3 text-accent underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
