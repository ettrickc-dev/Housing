// Public, SEO-focused content for per-document landing pages (/forms/:slug).
// Plain data only — NO React-PDF imports — so these pages stay in the light bundle
// and are cheap to crawl. `docType` links each page to the builder.

export const FORM_PAGES = [
  {
    slug: 'new-york-14-day-rent-demand',
    docType: 'rent_demand_14day',
    audience: 'Landlords',
    title: '14-Day Rent Demand (New York) — Free to Build | PlainRights Court',
    metaDescription:
      'Prepare a New York 14-day rent demand notice for unpaid rent. Plain-English questions, automatic deadline calculation, and a court-ready PDF. Free to build and preview.',
    h1: 'New York 14-Day Rent Demand Notice',
    intro:
      'Before you can start a nonpayment eviction case in New York, you generally must serve the tenant a written 14-day rent demand. PlainRights Court walks you through it in plain English, fills it in from your answers, and calculates the date you can file if the rent still is not paid.',
    whenToUse: [
      'Your tenant owes rent and you want to begin the process to recover it.',
      'You have not yet started a court case and need the required notice first.',
      'You want the deadline counted for you so you do not file too early.',
    ],
    faq: [
      { q: 'How long does the tenant have to pay?', a: 'A 14-day rent demand gives the tenant 14 days after service to pay everything owed or move out. If they do not, you may be able to file a nonpayment case.' },
      { q: 'Do I have to give this notice before going to court?', a: 'For a nonpayment case in New York, a written rent demand is generally required before filing. Always confirm current requirements for your court.' },
      { q: 'Is this an official court form?', a: 'No. PlainRights Court is an independent self-help service. We prepare your document from your answers; the courts are separate.' },
    ],
  },
  {
    slug: 'new-york-nonpayment-petition',
    docType: 'nonpayment_petition',
    audience: 'Landlords',
    title: 'NY Nonpayment Eviction Petition — Prepare It Online | PlainRights Court',
    metaDescription:
      'Build a New York nonpayment petition and notice of petition to recover unpaid rent. Guided questions, the correct court caption, and a filing instruction sheet included.',
    h1: 'New York Nonpayment Petition',
    intro:
      'After your 14-day rent demand expires unpaid, the nonpayment petition is the court paper that opens your case and asks the court for the rent owed and possession of the apartment. We assemble it with the right caption for your court and attach step-by-step filing instructions.',
    whenToUse: [
      'You served a 14-day rent demand and the tenant still has not paid.',
      'You are ready to file a case in housing court to recover rent and possession.',
      'You want the petition, verification, and filing steps prepared together.',
    ],
    faq: [
      { q: 'What do I do after preparing the petition?', a: 'File it with the court clerk to get an index number and court date, then have it served and file an affidavit of service. Your document includes an instruction sheet.' },
      { q: 'Which court do I file in?', a: 'In NYC it is the Housing Part of Civil Court; outside NYC it is your local City, District, Town, or Village Court. We let you set the exact court on the form.' },
    ],
  },
  {
    slug: 'new-york-holdover-petition',
    docType: 'holdover_petition',
    audience: 'Landlords',
    title: 'New York Holdover Petition — Build Online | PlainRights Court',
    metaDescription:
      'Prepare a New York holdover petition to remove a tenant after a lease ends, a notice expires, or a lease violation. Correct caption and filing instructions included.',
    h1: 'New York Holdover Petition',
    intro:
      'A holdover petition is how a landlord asks the court to remove a tenant who stays after their lease or tenancy has ended — for example after a termination notice, a lease expiration, or an uncured lease violation. We prepare it with the right grounds and court caption.',
    whenToUse: [
      'You served a termination or cure notice and the tenant did not leave or fix the issue.',
      'A lease has expired and the tenant remains.',
      'You need to start a holdover case in housing court.',
    ],
    faq: [
      { q: 'Do I need a notice before a holdover case?', a: 'Most holdover cases require a predicate notice first (such as a termination or cure notice). Confirm what your situation requires before filing.' },
    ],
  },
  {
    slug: 'new-york-notice-to-cure',
    docType: 'notice_cure_10day',
    audience: 'Landlords',
    title: 'New York 10-Day Notice to Cure — Free to Build | PlainRights Court',
    metaDescription:
      'Prepare a New York 10-day notice to cure a lease violation. Plain-English questions with examples, deadline calculated, court-ready PDF.',
    h1: 'New York 10-Day Notice to Cure',
    intro:
      'When a tenant is violating the lease (for example unauthorized pets, subletting, or a nuisance), a notice to cure tells them what to fix and gives them time to fix it before you can move to end the tenancy. We help you describe the violation clearly with examples.',
    whenToUse: [
      'A tenant is breaking a lease rule and you want them to correct it.',
      'You may need this notice before a holdover case based on a lease violation.',
    ],
    faq: [
      { q: 'What if the tenant fixes the problem?', a: 'If the tenant cures within the time given, you generally cannot evict on that ground.' },
    ],
  },
  {
    slug: 'new-york-notice-of-termination',
    docType: 'notice_termination',
    audience: 'Landlords',
    title: 'NY 30/60/90-Day Notice of Termination — Build Online | PlainRights Court',
    metaDescription:
      'Prepare a New York 30, 60, or 90-day notice of termination based on how long the tenant has lived there. Deadline calculated; court-ready PDF.',
    h1: 'New York Notice of Termination (30/60/90-Day)',
    intro:
      'To end a month-to-month or expired tenancy in New York, the law requires advance written notice — 30, 60, or 90 days depending on how long the tenant has lived there. We pick the right period and calculate the earliest valid move-out date.',
    whenToUse: [
      'You want a month-to-month tenant to move out.',
      'A lease has ended and you are not renewing.',
    ],
    faq: [
      { q: 'How much notice do I have to give?', a: 'Generally 30 days if the tenant has lived there under a year, 60 days for 1–2 years, and 90 days for more than 2 years.' },
    ],
  },
  {
    slug: 'new-york-affidavit-of-service',
    docType: 'affidavit_of_service',
    audience: 'Landlords',
    title: 'New York Affidavit of Service — Build Online | PlainRights Court',
    metaDescription:
      'Prepare a New York affidavit of service proving how and when you delivered court papers or a notice. Supports personal, substituted, and nail-and-mail service.',
    h1: 'New York Affidavit of Service',
    intro:
      'The court needs proof of how your notice or court papers were delivered. An affidavit of service, signed by the person who served them in front of a notary, provides that proof. We support personal, substituted, and conspicuous (nail-and-mail) service.',
    whenToUse: [
      'You served a notice or petition and need to file proof with the court.',
    ],
    faq: [
      { q: 'Who can sign the affidavit?', a: 'The person who actually served the papers — someone 18 or older who is not a party to the case. It must be notarized.' },
    ],
  },
  {
    slug: 'new-york-tenant-answer-nonpayment',
    docType: 'answer_nonpayment',
    audience: 'Tenants',
    title: 'Answer a NY Nonpayment Case — Free Tenant Form | PlainRights Court',
    metaDescription:
      'Respond to a New York nonpayment eviction case. Build a written answer with built-in defenses (improper service, conditions, overcharge, and more). Affordable and guided.',
    h1: 'Answer a New York Nonpayment Case (Tenant)',
    intro:
      'If your landlord filed a nonpayment case, you can respond with a written answer that raises your defenses — for example improper service, a warranty-of-habitability (conditions) defense, rent already paid, or rent overcharge. We make selecting your defenses simple.',
    whenToUse: [
      'You received nonpayment court papers from your landlord.',
      'You have defenses such as bad conditions, wrong amount, or improper service.',
    ],
    faq: [
      { q: 'Does filing an answer mean I do not have to go to court?', a: 'No — always appear on every court date. The answer states your side; it does not replace appearing.' },
      { q: 'I cannot afford much. Is this expensive?', a: 'Tenant forms are kept low-cost on purpose, and you can build and preview free before paying.' },
    ],
  },
  {
    slug: 'new-york-tenant-answer-holdover',
    docType: 'answer_holdover',
    audience: 'Tenants',
    title: 'Answer a NY Holdover Case — Free Tenant Form | PlainRights Court',
    metaDescription:
      'Respond to a New York holdover eviction case with a written answer and defenses (defective notice, rent regulation, succession, retaliation, and more).',
    h1: 'Answer a New York Holdover Case (Tenant)',
    intro:
      'If your landlord is trying to remove you in a holdover case, a written answer lets you raise defenses such as a defective predicate notice, rent-regulation protections, succession rights, or retaliation. We help you pick the defenses that fit your situation.',
    whenToUse: [
      'You received holdover court papers.',
      'You believe the notice was defective or you have other defenses.',
    ],
    faq: [
      { q: 'What is a defective notice defense?', a: 'If the required notice before the case was missing, late, or legally insufficient, that can be a defense. Confirm the specifics for your case.' },
    ],
  },
  {
    slug: 'new-york-order-to-show-cause-vacate-default',
    docType: 'osc_vacate_default',
    audience: 'Tenants',
    title: 'NY Order to Show Cause to Vacate a Default — Free to Build | PlainRights Court',
    metaDescription:
      'Missed your housing court date in New York? Build an Order to Show Cause to vacate a default judgment and ask to pause the eviction. Guided, with examples.',
    h1: 'Order to Show Cause to Vacate a Default (New York)',
    intro:
      'If the court ruled against you because you missed your court date, an Order to Show Cause asks the judge to undo that default, restore your case, and pause an eviction while it is decided. We help you explain why you missed court and your defense.',
    whenToUse: [
      'A judgment or warrant was entered because you did not appear.',
      'You need to ask the court to reopen your case quickly.',
    ],
    faq: [
      { q: 'How fast should I act?', a: 'Very quickly — there are short deadlines after a default and an eviction may be scheduled. Bring it to the courthouse as soon as possible.' },
    ],
  },
];

export function getFormPage(slug) {
  return FORM_PAGES.find((p) => p.slug === slug) || null;
}
