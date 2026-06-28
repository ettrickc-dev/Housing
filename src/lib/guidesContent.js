// Informational SEO guides — target high-volume "how to…" searches and funnel
// readers into the document builder. Plain data only (no heavy imports).
// Keep guidance general; documents and statutes carry their own caveats.

export const GUIDES = [
  {
    slug: 'how-to-evict-a-tenant-in-new-york',
    audience: 'Landlords',
    title: 'How to Evict a Tenant in New York — Step-by-Step (2026) | PlainRights Court',
    metaDescription:
      'A plain-English, step-by-step guide to the New York eviction process for landlords: notices, petitions, serving papers, court, and after judgment.',
    h1: 'How to Evict a Tenant in New York (Step by Step)',
    intro:
      'Evicting a tenant in New York follows a specific legal sequence, and skipping a step can get your case dismissed. This plain-English guide walks through the process from notice to judgment. It is general information, not legal advice — confirm the current rules for your court.',
    sections: [
      { heading: '1. Identify your grounds', body: 'Most cases are either "nonpayment" (the tenant owes rent) or "holdover" (the tenancy ended or a lease term was violated). The grounds determine which notice and petition you need.' },
      { heading: '2. Serve the required notice first', body: 'You generally cannot go straight to court. Nonpayment usually requires a 14-day rent demand; holdovers usually require a termination or cure notice. Keep proof of how and when you served it.' },
      { heading: '3. File the petition', body: 'If the notice period passes without the tenant paying or leaving, file a petition with the court to get an index number and a court date.' },
      { heading: '4. Serve the court papers and file proof', body: 'The notice of petition and petition must be served properly, and an affidavit of service filed with the court.' },
      { heading: '5. Go to court', body: 'Both sides appear. Many cases settle with a written agreement (stipulation); others go before a judge.' },
      { heading: '6. After a judgment', body: 'If you win, the court can issue a judgment and warrant. There are additional notice requirements before an eviction can actually be carried out.' },
    ],
    relatedForms: ['rent_demand_14day', 'nonpayment_petition', 'holdover_petition', 'affidavit_of_service'],
    faq: [
      { q: 'How long does an eviction take in New York?', a: 'It varies widely by court, case type, and whether the tenant raises defenses — often weeks to several months. Notice periods alone can be 14 to 90 days.' },
      { q: 'Can I change the locks or remove the tenant myself?', a: 'No. Self-help evictions (lockouts, removing belongings) are illegal in New York. You must go through the court.' },
    ],
  },
  {
    slug: 'how-to-respond-to-an-eviction-notice-in-new-york',
    audience: 'Tenants',
    title: 'How to Respond to an Eviction Case in New York (Tenant Guide) | PlainRights Court',
    metaDescription:
      'Got eviction papers in New York? A plain-English guide for tenants: how to answer, what defenses you may have, going to court, and what to do if you missed a date.',
    h1: 'How to Respond to an Eviction Case in New York',
    intro:
      'If your landlord started an eviction case, doing nothing is the worst option — you can lose by default. This guide explains how tenants respond in New York. It is general information, not legal advice.',
    sections: [
      { heading: "1. Don't ignore the papers", body: 'There are short deadlines. Read the papers to find your court, index number, and date.' },
      { heading: '2. Know what kind of case it is', body: 'A "nonpayment" case is about unpaid rent; a "holdover" case seeks to remove you for another reason. Your defenses differ.' },
      { heading: '3. File an answer and raise your defenses', body: 'An answer is your written response. Common defenses include improper service, a warranty-of-habitability (bad conditions) defense, rent already paid, the wrong amount, rent overcharge, or a defective notice.' },
      { heading: '4. Go to every court date', body: 'Filing an answer does not replace appearing. Bring evidence — receipts, photos, texts, repair complaints.' },
      { heading: '5. If you already missed a court date', body: 'You may be able to file an Order to Show Cause to undo a default and ask the court to pause an eviction. Act fast.' },
      { heading: '6. Get help if you can', body: 'Many New York tenants qualify for free legal help. Ask the court clerk about right-to-counsel and local legal services.' },
    ],
    relatedForms: ['answer_nonpayment', 'answer_holdover', 'osc_vacate_default'],
    faq: [
      { q: 'What happens if I do nothing?', a: 'The landlord can ask the court for a default judgment against you, which can lead to eviction. Always respond and appear.' },
      { q: 'Do I need a lawyer?', a: 'You are not required to have one, and many tenants represent themselves — but free legal help is often available and worth seeking.' },
    ],
  },
  {
    slug: 'new-york-eviction-timeline-and-deadlines',
    audience: 'Everyone',
    title: 'New York Eviction Timeline & Deadlines Explained | PlainRights Court',
    metaDescription:
      'Understand New York eviction deadlines: rent demand periods, termination notice periods (30/60/90 days), filing, court, and post-judgment notice — in plain English.',
    h1: 'New York Eviction Timeline & Deadlines',
    intro:
      'Eviction in New York is deadline-driven for both sides. Missing or miscounting a deadline can cost you the case. Here are the key timeframes in plain English. General information only — confirm current rules.',
    sections: [
      { heading: 'Rent demand (nonpayment)', body: 'A 14-day written rent demand generally must be served before a nonpayment case can be filed.' },
      { heading: 'Termination notices (holdover)', body: 'Ending a month-to-month or expired tenancy usually requires 30, 60, or 90 days notice depending on how long the tenant has lived there.' },
      { heading: 'Cure notices', body: 'For a lease violation, a notice to cure typically gives the tenant at least 10 days to fix the problem.' },
      { heading: 'After the notice period', body: 'Only after the notice expires (and mailing adds days) can the case be filed. The court then sets a date.' },
      { heading: 'After a judgment', body: 'Even after a judgment and warrant, additional notice is required before an eviction is carried out.' },
    ],
    relatedForms: ['rent_demand_14day', 'notice_termination', 'notice_cure_10day'],
    faq: [
      { q: 'Do mailed notices add time?', a: 'Yes — when a notice is mailed, additional days are generally added before the period is considered complete. Count carefully or ask the clerk.' },
    ],
  },
];

export function getGuide(slug) {
  return GUIDES.find((g) => g.slug === slug) || null;
}
