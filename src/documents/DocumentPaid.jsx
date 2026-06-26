import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { getDocConfig } from './registry.jsx';
import { verifyCheckoutSession } from '../lib/api.js';
import { getDocumentById, replacePdf, getLawReviewDate } from '../lib/documents.js';
import Disclaimer from '../components/Disclaimer.jsx';

// Landing page after Stripe Checkout. Confirms payment, then regenerates and
// stores the clean (un-watermarked) filing-ready PDF.
export default function DocumentPaid() {
  const [params] = useSearchParams();
  const documentId = params.get('doc');
  const sessionId = params.get('session_id');

  const [status, setStatus] = useState('confirming'); // confirming | unlocking | done | error
  const [message, setMessage] = useState('Confirming your payment…');
  const [doc, setDoc] = useState(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // guard against StrictMode double-run
    ranRef.current = true;
    (async () => {
      try {
        // 1) Confirm payment (also marks the doc paid server-side).
        if (sessionId) {
          const res = await verifyCheckoutSession(sessionId);
          if (!res.paid) {
            setStatus('error');
            setMessage('Payment was not completed. You can try again from the document.');
            return;
          }
        }
        // 2) Load the document; if the webhook beat us, it's already paid.
        let record = await getDocumentById(documentId);
        if (!record.paid) {
          setStatus('error');
          setMessage('We could not confirm payment yet. If you were charged, refresh in a moment.');
          return;
        }

        // 3) Regenerate the CLEAN PDF from saved field data and replace the file.
        setStatus('unlocking');
        setMessage('Unlocking your filing-ready document…');
        const config = getDocConfig(record.doc_type);
        if (config) {
          const lawReviewDate = await getLawReviewDate().catch(() => null);
          const data = config.derive(record.field_data || {});
          const Pdf = config.Pdf;
          const instructions = {
            title: config.title,
            serviceInstructions: config.serviceInstructions,
            nextSteps: config.nextSteps,
            statutes: config.statutes,
          };
          const blob = await pdf(
            <Pdf
              data={data}
              watermark={false}
              lawReviewDate={lawReviewDate}
              instructions={instructions}
            />
          ).toBlob();
          record = await replacePdf(record, blob);
        }
        setDoc(record);
        setStatus('done');
        setMessage('Your filing-ready document is ready.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Something went wrong unlocking your document.');
      }
    })();
  }, [documentId, sessionId]);

  return (
    <main className="mx-auto max-w-prose px-4 py-12">
      {status !== 'done' && status !== 'error' && (
        <p className="text-gray-600">{message}</p>
      )}

      {status === 'error' && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">We hit a problem</p>
          <p className="mt-1">{message}</p>
          <Link to="/dashboard" className="mt-3 inline-block text-accent underline">
            Back to dashboard
          </Link>
        </div>
      )}

      {status === 'done' && (
        <div>
          <div className="rounded-md bg-green-50 p-5">
            <h1 className="text-xl font-bold text-green-800">Payment confirmed ✓</h1>
            <p className="mt-2 text-sm text-gray-700">
              The watermark has been removed and your clean, filing-ready PDF is saved
              to your account.
            </p>
            {doc?.download_url && (
              <a
                href={doc.download_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                Download filing-ready PDF
              </a>
            )}
          </div>
          <Link to="/dashboard" className="mt-6 inline-block text-accent underline">
            Go to your dashboard
          </Link>
        </div>
      )}

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
