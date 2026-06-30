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
  jury_demand: {
    flow: 'Asking for a jury trial (tenant)',
    why:
      'If you want a jury (not just a judge) to decide your case, you ask for one with a ' +
      'jury demand — usually filed together with your answer. Right now you are preparing ' +
      'that demand. Note: there may be a jury fee, and some leases waive jury trials.',
    steps: ['File your Answer', 'File this Jury Demand (with the answer)', 'Pay any jury fee', 'Your case is set for a jury'],
    current: 1,
  },
  fee_waiver: {
    flow: "Asking the court to waive fees you can't afford (CPLR § 1101)",
    why:
      "Court fees can be waived if you can't afford them. You file a short sworn application " +
      '(a "poor person" application) explaining your finances. Right now you are preparing ' +
      'that application; you file it with the document you need the fee waived for.',
    steps: ['Fill out this fee-waiver application', 'Sign it before a notary', 'File it with your other papers', 'The court decides on the waiver'],
    current: 0,
  },
  osc_stay_warrant: {
    flow: 'Pausing an eviction (tenant emergency)',
    why:
      "If a warrant of eviction has been or is about to be issued, you can ask the judge to " +
      'pause (stay) it — for example because you can pay, have assistance pending, or need a ' +
      'little time. Act fast. Right now you are preparing that request; next, a judge reviews ' +
      'it and sets a hearing.',
    steps: ['A warrant of eviction is issued / about to issue', 'File this Order to Show Cause to stay it', 'A judge signs it and sets a hearing', 'At the hearing, the court decides'],
    current: 1,
  },
  motion_default_judgment: {
    flow: 'Finishing a case the tenant ignored (landlord)',
    why:
      'If your tenant was properly served but never answered or appeared, you can ask the ' +
      'court for a default judgment — possession, a money judgment for unpaid rent, and a ' +
      'warrant of eviction. Right now you are preparing that motion and sworn affidavit ' +
      '(including the required military-service statement); next, you file it and the court ' +
      'enters the judgment.',
    steps: ['You served the petition and the tenant didn’t respond', 'File this motion + affidavit for a default judgment', 'The court enters the judgment and warrant', 'A marshal/sheriff serves the eviction notice'],
    current: 1,
  },
  stipulation_settlement: {
    flow: 'Settling the case in writing (either side)',
    why:
      'Most housing cases end in a written agreement called a stipulation — for example, a ' +
      'payment plan or a move-out date — which the judge "so-orders" to make it binding. ' +
      'Right now you are putting the agreed terms in writing; both sides sign and the judge ' +
      'so-orders it on your court date.',
    steps: ['Both sides agree on terms', 'Put the terms in this stipulation', 'Both parties sign it', 'The judge so-orders it on your court date'],
    current: 1,
  },
  renewal_lease_rs: {
    flow: 'Renewing a rent-stabilized lease (landlord)',
    why:
      'For a rent-stabilized apartment, the owner must offer the tenant a renewal lease in the ' +
      'window before the current lease ends, at the rent increase set by the Rent Guidelines ' +
      'Board. Right now you are preparing the renewal offer with the 1- and 2-year figures; the ' +
      'tenant then picks a term and signs.',
    steps: ['Look up the current RGB increase %', 'Prepare the renewal offer (RTP-8) with both terms', 'Serve it 90–150 days before the lease ends', 'Tenant chooses a term and returns it within 60 days'],
    current: 1,
  },
  notice_nonrenewal_rs: {
    flow: 'Declining to renew a rent-stabilized lease (landlord)',
    why:
      'You normally must renew a rent-stabilized lease — you can only decline on specific legal ' +
      'grounds (like owner’s own use), and the notice must be served in a strict 90-to-150-day ' +
      'window before the lease ends. Right now you are preparing that non-renewal notice; if the ' +
      'tenant stays, it becomes the basis for a holdover case.',
    steps: ['Confirm you have a valid legal ground', 'Serve this non-renewal notice in the 90–150 day window', 'Tenant’s lease expires', 'If they stay, file a Holdover Petition citing this notice'],
    current: 1,
  },
  dhcr_registration: {
    flow: 'Filing your annual DHCR registration (landlord)',
    why:
      'Owners of rent-stabilized units must register every apartment with DHCR each year and ' +
      'give the tenant a copy. The official filing happens on DHCR’s own forms through their ' +
      'online system — right now you are using this worksheet to gather and double-check your ' +
      'figures before you file.',
    steps: ['Gather each unit’s rent and lease data (this worksheet)', 'Log in to DHCR’s online registration (ARRO)', 'File the official RR-1 + RR-2A', 'Serve the tenant copy of the registration'],
    current: 0,
  },
  marshal_requisition: {
    flow: 'Carrying out the eviction after you win (landlord)',
    why:
      'After you have a judgment of possession and a warrant of eviction, you cannot remove ' +
      'the tenant yourself. You give the warrant to a city marshal (NYC) or the sheriff, who ' +
      'serves a 14-day Notice of Eviction and then carries it out. Right now you are preparing ' +
      'the requisition that instructs the officer.',
    steps: ['You have a judgment + warrant of eviction', 'Give the warrant + this requisition to the marshal/sheriff', 'The officer serves a 14-day Notice of Eviction', 'The officer carries out the eviction'],
    current: 1,
  },
  satisfaction_judgment: {
    flow: 'Closing out a paid money judgment (landlord)',
    why:
      'When the tenant pays a money judgment, you must file a Satisfaction of Judgment so the ' +
      'court marks it paid — it’s required, and it clears the debtor’s record. Right now you ' +
      'are preparing that document; you sign it before a notary and file it with the court.',
    steps: ['A money judgment was entered and then paid', 'Fill out this Satisfaction of Judgment', 'Sign it before a notary', 'File it with the court clerk'],
    current: 1,
  },
  hp_action_repairs: {
    flow: 'Making your landlord do repairs (HP case, tenant)',
    why:
      'If your landlord won’t fix bad conditions, you can start an HP case — you (the tenant) ' +
      'bring the landlord to Housing Court and ask the judge to order repairs. The city (HPD) ' +
      'inspects. Right now you are preparing the petition and order to show cause; next, you ' +
      'file them at the courthouse and the court sets an inspection and hearing.',
    steps: ['List the conditions that need repair', 'File the HP petition + OSC at Housing Court', 'HPD inspects and places violations', 'Hearing — the court can order repairs (and penalties)'],
    current: 0,
  },
  illegal_lockout: {
    flow: 'Getting back in after an illegal lockout (tenant emergency)',
    why:
      'A landlord cannot lock you out without going to court — if they changed the locks or ' +
      'removed your things, that’s an illegal eviction. You can ask the court to order the ' +
      'landlord to let you back in. Act immediately. Right now you are preparing the petition ' +
      'and order to show cause; next, a judge reviews it and can order your restoration.',
    steps: ['You were locked out without a court order', 'File this petition + OSC at Housing Court right away', 'A judge signs it and sets a fast hearing', 'The court can order the landlord to let you back in'],
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

// "Have these handy" checklist shown at the top of each interview (RocketLawyer-style,
// but better — paired with examples in every field). Reduces "do I have everything?" drop-off.
export const WHAT_YOU_NEED = {
  rent_demand_14day: [
    'The tenant name(s) on the lease',
    'The rental (premises) address with unit number',
    'Which months are unpaid and the total amount owed',
    'The date you plan to deliver the notice',
  ],
  notice_cure_10day: [
    'The tenant name(s) and premises address',
    'What lease rule was broken (and the lease paragraph if you have it)',
    'A short description of the problem',
    'The date you plan to deliver the notice',
  ],
  notice_termination: [
    'The tenant name(s) and premises address',
    'How long the tenant has lived there (sets 30/60/90 days)',
    'The date you plan to deliver the notice',
  ],
  nonpayment_petition: [
    'Your court (NYC: Civil Court, Housing Part) and county',
    'Petitioner (landlord) and respondent (tenant) names + addresses',
    'Months owed and total amount',
    'The date your 14-day demand was served and how',
    'Regulatory status & Good Cause coverage of the unit',
  ],
  holdover_petition: [
    'Your court and county',
    'Petitioner (landlord) and respondent (tenant) names + addresses',
    'The predicate notice you served and the date',
    'The ground for the holdover',
    'Regulatory status & Good Cause coverage of the unit',
  ],
  affidavit_of_service: [
    'The index number from your court papers',
    'Who served the papers (an adult who is not a party)',
    'What was served, and the date, time, and place',
    'How it was served (personal, substitute, or nail-and-mail)',
  ],
  answer_nonpayment: [
    'Your court papers (for the index number and court)',
    'Your landlord’s name',
    'Which defenses apply to you (we list them with explanations)',
  ],
  answer_holdover: [
    'Your court papers (for the index number and court)',
    'Your landlord’s name',
    'Which defenses apply to you (we list them with explanations)',
  ],
  osc_vacate_default: [
    'Your court papers and the index number',
    'The date the default judgment/warrant was entered',
    'Why you missed court, in 1–2 sentences',
    'Your defense to the case, in 1–2 sentences',
  ],
  jury_demand: [
    'Your court papers (index number and court)',
    'Your name and the landlord’s name',
  ],
  fee_waiver: [
    'Your court (and index number, if you have one)',
    'Whether you get public assistance (and which program)',
    'Your approximate monthly income and number of dependents',
    'A sentence on why you can’t afford the fees',
  ],
  osc_stay_warrant: [
    'Your court papers and the index number',
    'Why the eviction should be paused (payment, assistance pending, time to move)',
    'Exactly what you’re asking the court to do',
  ],
  motion_default_judgment: [
    'Your index / L&T number and the court',
    'The date and method the petition was served (and the proof of service)',
    'For nonpayment: the total rent owed for the money judgment',
    'Who is signing (petitioner, agent, or attorney)',
  ],
  stipulation_settlement: [
    'Your index / L&T number and the court',
    'What you both agreed: a payment amount + date, or a move-out date',
    'Any other terms (repairs, waived fees, withdrawn claims)',
  ],
  renewal_lease_rs: [
    'The tenant name(s), apartment, and building address',
    'The current legal regulated rent and lease expiration date',
    'The current Rent Guidelines Board 1- and 2-year increase percentages',
    'The applicable RGB order number',
  ],
  notice_nonrenewal_rs: [
    'The tenant name(s), apartment, and building address',
    'The current lease expiration date',
    'Your legal ground for non-renewal (and the details)',
  ],
  dhcr_registration: [
    'Owner and building info (address, number of units)',
    'The registration year',
    'For each unit: tenant, status, legal + actual rent, lease dates',
  ],
  marshal_requisition: [
    'Your index / L&T number and the court',
    'The dates the judgment and the warrant of eviction were entered',
    'The premises address and apartment number',
    'Your contact phone number for the officer',
  ],
  satisfaction_judgment: [
    'Your index / L&T number and the court',
    'The date the money judgment was entered and the amount',
    'Whether it was paid in full or in part (and how much)',
    'The judgment debtor’s name',
  ],
  hp_action_repairs: [
    'The building address and your apartment number',
    'The owner/landlord’s name (and managing agent if any)',
    'A list of the conditions that need repair',
    'Dates and times you can give access for repairs',
  ],
  illegal_lockout: [
    'The address you were locked out of',
    'The landlord’s name',
    'The date you were locked out and how it happened',
    'Proof you lived there (lease, mail, ID) for the hearing',
  ],
};

export function whatYouNeedFor(docType) {
  return WHAT_YOU_NEED[docType] || null;
}
