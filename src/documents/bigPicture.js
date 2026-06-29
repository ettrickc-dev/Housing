// Plain-language "where this fits" orientation shown ABOVE the form on each
// document page. Calms novices: explains the whole process (A → B → C), what
// they're doing right now ("you are here"), and what comes next. A+ conversion.

export const BIG_PICTURE = {
  rent_demand_14day: {
    flow: 'Evicting for unpaid rent (nonpayment)',
    why:
      "To evict a tenant for unpaid rent in New York, you take a few steps in order. " +
      "First you give a written 14-day rent demand. If the tenant still doesn't pay, you " +
      "file a case in court, serve the papers, and go to court. Right now you're on the " +
      "first step — and that's the right place to start.",
    steps: [
      'Give the tenant a 14-Day Rent Demand',
      'Tenant gets 14 days to pay or move out',
      'If unpaid, file the Notice of Petition + Petition (together)',
      'Serve the court papers + file the Affidavit of Service',
      'Go to court',
    ],
    current: 0,
  },
  nonpayment_petition: {
    flow: 'Evicting for unpaid rent (nonpayment)',
    why:
      "You've already given the 14-day rent demand and the tenant still hasn't paid. Now " +
      "you actually start the court case. These are the Notice of Petition and Petition — " +
      "the papers that open your case. You'll file them together (online in NYC), then serve " +
      "the tenant and file proof. Right now you're preparing those court papers.",
    steps: [
      'Give the 14-Day Rent Demand',
      'Tenant gets 14 days to pay',
      'File the Notice of Petition + Petition (together)',
      'Serve the court papers + file the Affidavit of Service',
      'Go to court',
    ],
    current: 2,
  },
  notice_termination: {
    flow: 'Removing a tenant (holdover)',
    why:
      'To remove a tenant whose lease ended or who is month-to-month, you first give a ' +
      'written termination notice (30, 60, or 90 days, based on how long they have lived ' +
      'there). If they do not leave by the deadline, you file a holdover case and serve the ' +
      "papers. Right now you're on the first step — the termination notice.",
    steps: [
      'Give a Notice of Termination (30/60/90 days)',
      'The notice period passes',
      'If they stay, file the Notice of Petition + Petition (holdover)',
      'Serve the court papers + file the Affidavit of Service',
      'Go to court',
    ],
    current: 0,
  },
  notice_cure_10day: {
    flow: 'Removing a tenant for a lease violation (holdover)',
    why:
      'When a tenant breaks the lease, the first step is usually a notice to cure — telling ' +
      'them what to fix and giving them at least 10 days to fix it. If they do not, you can ' +
      'give a termination notice and then file a holdover case. Right now you are on the first ' +
      'step — the notice to cure.',
    steps: [
      'Give a 10-Day Notice to Cure',
      'Tenant gets at least 10 days to fix it',
      'If not fixed, give a Notice of Termination',
      'If they stay, file the Notice of Petition + Petition (holdover)',
      'Serve the papers + go to court',
    ],
    current: 0,
  },
  holdover_petition: {
    flow: 'Removing a tenant (holdover)',
    why:
      "You've already served your notice (termination or cure) and the tenant didn't leave " +
      'or fix the problem. Now you start the court case. These are the Notice of Petition and ' +
      'Petition for a holdover. You file them together, then serve the tenant and file proof. ' +
      "Right now you're preparing those court papers.",
    steps: [
      'Give your predicate notice (termination/cure)',
      'The notice period passes',
      'File the Notice of Petition + Petition (together)',
      'Serve the court papers + file the Affidavit of Service',
      'Go to court',
    ],
    current: 2,
  },
  affidavit_of_service: {
    flow: 'Proving you delivered the papers',
    why:
      'After you deliver a notice or court papers, the court needs proof of how and when they ' +
      'were delivered. That proof is this Affidavit of Service — signed in front of a notary ' +
      "by the person who delivered them. Right now you're creating that proof so it can be " +
      'filed with the court.',
    steps: [
      'Notice or court papers are served on the tenant',
      'The server fills out this Affidavit of Service',
      'A notary signs it',
      'File it with the court',
    ],
    current: 1,
  },
  answer_nonpayment: {
    flow: 'Responding to a nonpayment case (tenant)',
    why:
      "Your landlord filed a nonpayment case against you. Do not ignore it — that's how people " +
      'lose by default. The next step is to answer: tell the court your side and your defenses, ' +
      "then appear on your court date. Right now you're preparing your written Answer. For " +
      'nonpayment cases you generally must answer within 10 days.',
    steps: [
      'You received nonpayment court papers',
      'File your Answer and raise your defenses (within ~10 days)',
      'Appear on your court date',
      'Trial or settlement',
    ],
    current: 1,
  },
  answer_holdover: {
    flow: 'Responding to a holdover case (tenant)',
    why:
      'Your landlord filed a holdover case to remove you. Do not ignore it. The next step is to ' +
      'answer with your defenses and come to court on your court date. Right now you are ' +
      'preparing your written Answer.',
    steps: [
      'You received holdover court papers',
      'File your Answer and raise your defenses',
      'Come to court on your court date',
      'Trial or settlement',
    ],
    current: 1,
  },
  osc_vacate_default: {
    flow: 'Undoing a default & pausing an eviction (tenant)',
    why:
      "The court ruled against you because you weren't there — that's called a default. You can " +
      'ask the judge to undo it and pause the eviction by filing an Order to Show Cause. Act ' +
      "fast — there are short deadlines. Right now you're preparing that request; next, a judge " +
      'reviews it and sets a hearing.',
    steps: [
      'A default judgment / warrant was entered against you',
      'File an Order to Show Cause to vacate it (and pause the eviction)',
      'A judge signs it and sets a hearing date',
      'At the hearing, your case may be restored',
    ],
    current: 1,
  },
};

export function bigPictureFor(docType) {
  return BIG_PICTURE[docType] || null;
}
