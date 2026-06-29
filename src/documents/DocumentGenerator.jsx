import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { useAuth } from '../lib/AuthContext.jsx';
import { getProfile } from '../lib/profile.js';
import { getLocalIntake, savePendingDraft, takePendingDraft } from '../lib/draft.js';
import { getDocConfig, addDays } from './registry.jsx';
import { bigPictureFor } from './bigPicture.js';
import { getLawReviewDate, saveDocument, upsertWorkflow } from '../lib/documents.js';
import { createCheckoutSession, createSubscriptionSession } from '../lib/api.js';
import {
  priceForDoc, formatPrice, hasActiveSubscription, SUBSCRIPTION_PLANS, ANCHOR,
} from '../lib/pricing.js';
import { fetchPricing, resolveDocPrice } from '../lib/pricingDb.js';
import { fmtDate } from '../pdf/pdfTheme.js';
import Disclaimer from '../components/Disclaimer.jsx';

const TONE_ICON = { must: '⏳', cannot: '🚫', info: '✅', warn: '⚠️' };

export default function DocumentGenerator() {
  const { docType } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = getDocConfig(docType);
  const bigPicture = bigPictureFor(docType);

  const [values, setValues] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [lawReviewDate, setLawReviewDate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [price, setPrice] = useState(priceForDoc(docType));

  // Load profile -> seed default field values; fetch law review date.
  // NOTE: depend on the stable user.id string, NOT the user object. A Supabase
  // token refresh emits onAuthStateChange with a NEW session/user object; keying
  // on the object would re-run this effect and wipe a just-saved document's UI.
  const userId = user?.id;
  useEffect(() => {
    if (!config) return;
    let alive = true;
    // Reset transient state when switching between documents.
    setSaved(null);
    setError('');
    (async () => {
      // Signed-in: pull the profile. Anonymous: seed from local intake answers
      // so the form still pre-fills role/location-derived bits.
      const p = userId
        ? await getProfile(userId).catch(() => ({}))
        : getLocalIntake();
      const lrd = await getLawReviewDate().catch(() => null);
      if (!alive) return;
      let defaults = config.defaults(p || {});
      // Restore a document the user was building before they signed up.
      const pending = takePendingDraft(docType);
      if (pending) defaults = { ...defaults, ...pending };
      setValues(defaults);
      setPreviewData(config.derive(defaults));
      setLawReviewDate(lrd);
      setSubscribed(hasActiveSubscription(p));
      fetchPricing().then((ov) => { if (alive) setPrice(resolveDocPrice(ov, docType)); });
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType, userId]);

  // Debounce preview updates so typing doesn't re-render the PDF every keystroke.
  useEffect(() => {
    if (!values) return;
    const t = setTimeout(() => setPreviewData(config.derive(values)), 600);
    return () => clearTimeout(t);
  }, [values, config]);

  const PdfDoc = config?.Pdf;
  const instructions = config
    ? {
        title: config.title,
        serviceInstructions: config.serviceInstructions,
        nextSteps: config.nextSteps,
        statutes: config.statutes,
      }
    : null;
  const previewEl = useMemo(() => {
    if (!PdfDoc || !previewData) return null;
    return (
      <PdfDoc
        data={previewData}
        watermark
        lawReviewDate={lawReviewDate}
        instructions={instructions}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PdfDoc, previewData, lawReviewDate]);

  if (!config) {
    return (
      <main className="mx-auto max-w-prose px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Unknown document</h1>
        <Link to="/start" className="mt-4 inline-block text-accent underline">← Back to the wizard</Link>
      </main>
    );
  }
  if (!values) {
    return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>;
  }

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleGenerate() {
    // Build-before-signup: anonymous users complete the form, then create an
    // account to download. We stash their answers so nothing is lost.
    if (!user) {
      savePendingDraft(docType, values);
      navigate('/login', { state: { from: `/document/${docType}` } });
      return;
    }
    setSaving(true);
    setError('');
    try {
      const data = config.derive(values);
      // Subscribers get the clean, un-watermarked PDF immediately (no payment).
      const blob = await pdf(
        <PdfDoc data={data} watermark={!subscribed} lawReviewDate={lawReviewDate} instructions={instructions} />
      ).toBlob();
      const rec = await saveDocument({
        userId: user.id,
        docType,
        title: config.title,
        statutes: config.statutes,
        fieldData: values,
        blob,
        paid: subscribed,
      });
      // Start/advance a workflow when the doc implies a next dated step.
      if (config.workflowType && data.expiresDate) {
        await upsertWorkflow({
          userId: user.id,
          workflowType: config.workflowType,
          stage: `${config.title} prepared`,
          nextActionDate: data.expiresDate,
          nextActionLabel: 'Notice period expires',
        }).catch(() => {});
      }
      setSaved(rec);
    } catch (err) {
      setError(err.message || 'Could not generate the document.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUnlock() {
    setUnlocking(true);
    setError('');
    try {
      const { url, alreadyPaid } = await createCheckoutSession(saved.id);
      if (alreadyPaid) {
        window.location.href = `/document-paid?doc=${saved.id}`;
        return;
      }
      window.location.href = url; // hand off to Stripe Checkout
    } catch (err) {
      setError(err.message || 'Could not start checkout.');
      setUnlocking(false);
    }
  }

  async function handleUpsell() {
    setUnlocking(true);
    setError('');
    try {
      const { url } = await createSubscriptionSession('monthly');
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not start checkout.');
      setUnlocking(false);
    }
  }

  const dateInfo = config.dateInfo(values);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/start" className="text-sm text-gray-500 hover:text-accent">← Back to the wizard</Link>
      <h1 className="mt-2 text-2xl font-bold text-navy">{config.title}</h1>
      <p className="mt-1 text-sm text-gray-500">New York State landlord–tenant form</p>

      {bigPicture && <BigPicture bp={bigPicture} />}

      <p className="mt-3 rounded-md bg-panel px-4 py-2 text-sm text-gray-700">
        <strong>How this works:</strong> Answer the questions below. Your form fills in
        and updates on the right as you type. When it looks right, download it — we'll
        include a page telling you exactly where and how to file.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* LEFT: questions */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Step 1 · Answer these questions
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            We've filled in what we can from your profile — change anything you need to.
            Not sure what to write? Read the 💡 example under each box.
          </p>
          <div className="mt-4 space-y-4">
            {config.fields.map((f) => (
              <Field key={f.key} field={f} value={values[f.key]} onChange={setField} />
            ))}
          </div>

          {dateInfo && dateInfo.items && (
            <div className="mt-6 rounded-md border border-deadline bg-amber-50 p-4 text-sm">
              <p className="font-semibold text-navy">📅 Your dates &amp; deadlines</p>
              <ul className="mt-2 space-y-2">
                {dateInfo.items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span>{TONE_ICON[it.tone] || 'ℹ️'}</span>
                    <span className={it.tone === 'cannot' ? 'font-medium text-navy' : 'text-gray-700'}>
                      {it.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-md bg-panel p-4 text-sm">
            <p className="font-semibold text-navy">How to serve / file this</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
              {config.serviceInstructions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <p className="mt-3 font-semibold text-navy">What to do next</p>
            <p className="mt-1 text-gray-700">{config.nextSteps}</p>
          </div>
        </section>

        {/* RIGHT: live preview + generate */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Step 2 · Preview, then download
            </h2>
            <span className="text-xs text-gray-400">Updates as you type</span>
          </div>
          <div className="mt-3 h-[600px] w-full overflow-hidden rounded-md border border-gray-300">
            {previewEl && (
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                {previewEl}
              </PDFViewer>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {saved ? (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-sm">
              <p className="font-semibold text-green-800">Saved to your account ✓</p>
              {saved.paid ? (
                <>
                  <p className="mt-1 text-gray-700">
                    Included in your subscription — your clean, filing-ready PDF (no
                    watermark) is ready.
                  </p>
                  <div className="mt-3 flex gap-4">
                    {saved.download_url && (
                      <a href={saved.download_url} target="_blank" rel="noreferrer"
                        className="font-medium text-accent underline">
                        Download filing-ready PDF
                      </a>
                    )}
                    <Link to="/dashboard" className="text-accent underline">Go to dashboard</Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-gray-700">
                    Your preview is ready. Unlock the clean, filing-ready PDF (no watermark)
                    for {formatPrice(price)}.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    An attorney charges ${ANCHOR.attorneyMin}+ and document services up to
                    ${ANCHOR.serviceMax} for this.
                  </p>
                  <button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="mt-3 w-full rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {unlocking ? 'Starting…' : `Unlock this document — ${formatPrice(price)}`}
                  </button>

                  {/* Subscription upsell at the moment of payment */}
                  <div className="mt-3 rounded-md border border-accent bg-blue-50 p-3">
                    <p className="text-sm font-medium text-navy">
                      Filing more than one paper?
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600">
                      Unlock <strong>this and every document</strong> for{' '}
                      {formatPrice(SUBSCRIPTION_PLANS.monthly.amountCents)}/month — most
                      evictions and defenses need 2–3 forms. Cancel anytime.
                    </p>
                    <button
                      onClick={handleUpsell}
                      disabled={unlocking}
                      className="mt-2 w-full rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-60"
                    >
                      Go unlimited — {formatPrice(SUBSCRIPTION_PLANS.monthly.amountCents)}/mo
                    </button>
                  </div>

                  <div className="mt-3 flex gap-4">
                    {saved.download_url && (
                      <a href={saved.download_url} target="_blank" rel="noreferrer"
                        className="text-accent underline">
                        Open watermarked preview
                      </a>
                    )}
                    <Link to="/dashboard" className="text-accent underline">Go to dashboard</Link>
                  </div>
                </>
              )}

              {config.courtFiled && (
                <div className="mt-4 rounded-md border border-accent bg-blue-50 p-3">
                  <p className="text-sm font-semibold text-navy">📤 File this from home — skip the courthouse line</p>
                  <p className="mt-0.5 text-xs text-gray-700">
                    In NYC, you file the Notice of Petition and Petition together online
                    through NYSCEF. We walk you through every step.
                  </p>
                  <Link to="/efile" className="mt-1 inline-block text-sm font-medium text-accent underline">
                    See how to file online →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={handleGenerate}
                disabled={saving}
                className="mt-4 w-full rounded-md bg-accent px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving
                  ? 'Generating…'
                  : user
                  ? 'Generate & save document'
                  : 'Create a free account to download'}
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                {!user
                  ? "It's free to build and preview. Create a free account to download — your answers are saved."
                  : subscribed
                  ? 'Included in your subscription — generates the filing-ready PDF with no watermark.'
                  : `Free to preview. Unlock the filing-ready PDF for ${formatPrice(price)} after generating.`}
              </p>
            </>
          )}
        </section>
      </div>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}

function Field({ field, value, onChange }) {
  const { key, label, tip, type = 'text', options } = field;

  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(key, e.target.checked)} />
        {label}
      </label>
    );
  }

  if (type === 'checklist') {
    const selected = Array.isArray(value) ? value : [];
    function toggle(optVal) {
      const next = selected.includes(optVal)
        ? selected.filter((v) => v !== optVal)
        : [...selected, optVal];
      onChange(key, next);
    }
    return (
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-navy">
          {label}
          {tip && <span className="ml-1 cursor-help text-gray-400" title={tip}>ⓘ</span>}
        </legend>
        <div className="space-y-1.5 rounded-md border border-gray-200 p-3">
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return (
              <label key={val} className="flex items-start gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={selected.includes(val)}
                  onChange={() => toggle(val)}
                />
                <span>{lab}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (type === 'textarea') {
    return (
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-navy">
          {label}
          {tip && <span className="ml-1 cursor-help text-gray-400" title={tip}>ⓘ</span>}
        </span>
        <textarea
          rows={3}
          className="input"
          placeholder={field.placeholder || ''}
          value={value ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
        />
        <Example text={field.example} />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-navy">
        {label}
        {tip && <span className="ml-1 cursor-help text-gray-400" title={tip}>ⓘ</span>}
      </span>
      {type === 'select' ? (
        <select className="input" value={value ?? ''} onChange={(e) => onChange(key, e.target.value)}>
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
      ) : (
        <input
          type={type}
          className="input"
          placeholder={field.placeholder || ''}
          value={value ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
        />
      )}
      <Example text={field.example} />
    </label>
  );
}

// Bold, calming orientation panel: the whole process with "you are here".
function BigPicture({ bp }) {
  return (
    <div className="mt-4 rounded-lg border-2 border-accent bg-blue-50 p-4">
      <p className="text-sm font-bold uppercase tracking-wide text-accent">
        The big picture: {bp.flow}
      </p>
      <p className="mt-1 text-base font-semibold leading-snug text-navy">{bp.why}</p>
      <ol className="mt-3 space-y-1.5">
        {bp.steps.map((s, i) => {
          const done = i < bp.current;
          const here = i === bp.current;
          return (
            <li key={i} className={`flex items-start gap-2 text-sm ${here ? 'font-bold text-navy' : done ? 'text-gray-500' : 'text-gray-500'}`}>
              <span className="mt-0.5">{here ? '➡️' : done ? '✅' : '⬜'}</span>
              <span>
                {s}
                {here && <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-white">YOU ARE HERE</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Small plain-language helper shown under a field so users know what to write.
function Example({ text }) {
  if (!text) return null;
  return <span className="mt-1 block text-xs text-gray-500">💡 {text}</span>;
}
