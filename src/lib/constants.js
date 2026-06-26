// =====================================================================
// PlainRights Court — shared constants
// Single source of truth for brand strings, the mandated legal
// disclaimer (used VERBATIM everywhere), and the statute footer note.
// =====================================================================

export const APP_NAME = 'PlainRights Court';
export const OPERATOR_NAME = 'PlainRights'; // disclaimer business name (no LLC/Inc.)

// The verbatim disclaimer required on EVERY page, document, and email.
// Do not edit the wording — it is the legal positioning of the product.
export const LEGAL_DISCLAIMER =
  'This platform is a document preparation and legal education service only. ' +
  'It does not provide legal advice. No attorney-client relationship is formed ' +
  'by use of this service. The documents generated are based on publicly available ' +
  'New York State law and court forms and are provided for informational and ' +
  'self-help purposes only. Laws change frequently. You are strongly encouraged ' +
  'to consult a licensed New York attorney before filing any document in court. ' +
  'This service is not a substitute for legal representation.';

// Footer note for any document that cites a specific statute.
// `lawReviewDate` comes from the admin panel (statutes / settings).
export function statuteFooterNote(lawReviewDate) {
  const date = lawReviewDate || '[pending first admin law review]';
  return (
    'Note: New York landlord-tenant law is subject to frequent legislative and ' +
    'regulatory change. Verify that all cited statutes and procedures are current ' +
    `before filing. Last platform law review date: ${date}.`
  );
}

// Pricing defaults (operator can override in the admin panel later).
export const PRICING = {
  perDocument: { min: 9.99, max: 24.99 },
  monthly: 39.99,
  annual: 299,
};
