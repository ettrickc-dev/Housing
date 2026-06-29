// Terms of Service, Privacy Policy, and Refund Policy content.
// Standard, plain-language drafts tailored to a NY self-help document-prep service.
// The operator should have these reviewed/customized before relying on them.

import { OPERATOR_NAME, APP_NAME } from './constants.js';

export const LEGAL_UPDATED = 'June 2026';
export const SUPPORT_EMAIL = 'support@plainrights.com'; // update to your real support address

export const LEGAL_DOCS = {
  terms: {
    slug: 'terms',
    title: `Terms of Service | ${APP_NAME}`,
    h1: 'Terms of Service',
    sections: [
      { h: '1. What this service is', body: [
        `${APP_NAME} ("we," "us") is a self-help document-preparation and legal-education service for New York landlord-tenant (housing court) matters. We are NOT a law firm, we do NOT provide legal advice, and no attorney-client relationship is created by using this service. The documents we help you prepare are based on publicly available New York law and court forms and are provided for informational and self-help purposes only.`,
        'You are responsible for the accuracy of the information you enter and for deciding whether and how to use any document. You are strongly encouraged to consult a licensed New York attorney before filing anything in court.',
      ]},
      { h: '2. Eligibility & accounts', body: [
        'You must be at least 18 years old and able to form a binding contract. You are responsible for keeping your account credentials secure and for all activity under your account. Provide accurate information and keep it current.',
      ]},
      { h: '3. Payments, pricing & subscriptions', body: [
        'You can build and preview documents for free. Payment is required to download a final, non-watermarked document, or you may purchase an unlimited subscription. Prices are shown before purchase and are in U.S. dollars. Payments are processed by Stripe; we do not store your full card number.',
        'Subscriptions renew automatically at the then-current price until you cancel. You can cancel anytime from your Account page; cancellation stops future renewals and takes effect at the end of the current billing period. See our Refund Policy for refunds.',
      ]},
      { h: '4. Acceptable use', body: [
        'Do not use the service for any unlawful purpose, to infringe others\' rights, to upload malicious code, or to resell or redistribute our documents or content without permission. We may suspend or terminate accounts that violate these terms.',
      ]},
      { h: '5. No guarantee of outcome', body: [
        'We do not guarantee that any court will accept a document, that you will win or avoid any case, or that any document is suitable for your specific situation. Laws and court rules change and vary by locality. You assume responsibility for verifying current requirements before filing.',
      ]},
      { h: '6. Intellectual property', body: [
        `The service, its templates, and its content are owned by ${OPERATOR_NAME} and protected by law. You receive a limited, personal license to use documents you generate for your own matter.`,
      ]},
      { h: '7. Disclaimers & limitation of liability', body: [
        'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages, and our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.',
      ]},
      { h: '8. Governing law', body: [
        'These terms are governed by the laws of the State of New York, without regard to conflict-of-laws rules. Any dispute will be brought in the state or federal courts located in New York.',
      ]},
      { h: '9. Changes & contact', body: [
        `We may update these terms; material changes will be posted here with a new "last updated" date. Questions: ${SUPPORT_EMAIL}.`,
      ]},
    ],
  },

  privacy: {
    slug: 'privacy',
    title: `Privacy Policy | ${APP_NAME}`,
    h1: 'Privacy Policy',
    sections: [
      { h: '1. Information we collect', body: [
        'Account information (name, email). Profile and case information you enter to prepare documents (such as names, addresses, rent amounts, and case details). Payment information is collected and processed by Stripe — we receive confirmation of payment, not your full card number. Basic usage and device information.',
      ]},
      { h: '2. How we use it', body: [
        'To prepare your documents, auto-fill your information across forms, calculate deadlines, store your documents for you, process payments, send transactional emails (reminders, receipts, law-update alerts), and operate and improve the service.',
      ]},
      { h: '3. Who we share it with (service providers)', body: [
        'We use trusted processors to run the service: Supabase (database, authentication, document storage), Stripe (payments), Resend (email), and Netlify (hosting). They process data on our behalf under their own terms. We do not sell your personal information.',
      ]},
      { h: '4. Storage & security', body: [
        'Your data is stored with row-level security so you can only access your own records, and documents are kept in private storage. No system is perfectly secure; we cannot guarantee absolute security.',
      ]},
      { h: '5. Retention', body: [
        'We keep your account and documents while your account is active and as needed to provide the service and meet legal obligations. You may request deletion of your account and data.',
      ]},
      { h: '6. Your choices', body: [
        'You can edit your profile, download or delete your documents, turn off reminder emails, and request access to or deletion of your data by contacting us. Because your documents may concern sensitive legal matters, keep your account secure.',
      ]},
      { h: '7. Cookies', body: [
        'We use only the cookies/local storage needed to keep you signed in and to remember your in-progress work. We do not use third-party advertising trackers.',
      ]},
      { h: '8. Children', body: [
        'The service is not directed to anyone under 18 and we do not knowingly collect their information.',
      ]},
      { h: '9. Contact', body: [
        `Privacy questions: ${SUPPORT_EMAIL}.`,
      ]},
    ],
  },

  refunds: {
    slug: 'refunds',
    title: `Refund Policy | ${APP_NAME}`,
    h1: 'Refund Policy',
    sections: [
      { h: 'Preview before you pay', body: [
        'You can build and preview every document for free before paying. Because of this, we encourage you to review the watermarked preview carefully before purchasing the final copy.',
      ]},
      { h: 'Single documents', body: [
        'Single-document purchases deliver a digital product immediately upon payment. If a document failed to generate or you were charged in error, contact us within 7 days and we will fix the issue or refund that purchase.',
      ]},
      { h: 'Subscriptions', body: [
        'Subscriptions renew automatically until canceled. You can cancel anytime from your Account page to stop future charges. If you were charged for a renewal you did not intend, contact us within 7 days of that charge and we will review a refund. We generally do not refund partial subscription periods after documents have been downloaded.',
      ]},
      { h: 'How to request a refund', body: [
        `Email ${SUPPORT_EMAIL} from your account email with your name and the charge date. We aim to respond within a few business days.`,
      ]},
      { h: 'Chargebacks', body: [
        'Please contact us first — we can usually resolve issues faster than a card dispute.',
      ]},
    ],
  },
};

export function getLegalDoc(slug) {
  return LEGAL_DOCS[slug] || null;
}
