import RentDemand14 from '../pdf/RentDemand14.jsx';
import NonpaymentPetition from '../pdf/NonpaymentPetition.jsx';
import AffidavitOfService from '../pdf/AffidavitOfService.jsx';
import AnswerNonpayment from '../pdf/AnswerNonpayment.jsx';
import OscVacateDefault from '../pdf/OscVacateDefault.jsx';
import TerminationNotice from '../pdf/TerminationNotice.jsx';
import NoticeToCure10 from '../pdf/NoticeToCure10.jsx';
import HoldoverPetition from '../pdf/HoldoverPetition.jsx';
import AnswerHoldover from '../pdf/AnswerHoldover.jsx';
import { joinAddress, fmtDate } from '../pdf/pdfTheme.js';

// Reusable example/help snippets.
export const DOE_HELP =
  "Don't know a name? You can write \"John Doe\" (man), \"Jane Doe\" (woman), or " +
  '"John Doe and Jane Doe" to cover any unknown adult occupants.';

export const HOLDOVER_DEFENSES = [
  { value: 'improper_service', title: 'Improper service',
    body: 'The predicate notice and/or petition were not served in the manner required by law.' },
  { value: 'defective_notice', title: 'Defective predicate notice',
    body: 'The predicate notice was legally insufficient (wrong notice period, vague, or inaccurate).' },
  { value: 'rent_regulated', title: 'Rent-regulated tenancy',
    body: 'The premises are rent stabilized/controlled and Respondent may not be evicted on the grounds alleged.' },
  { value: 'succession', title: 'Succession rights',
    body: 'Respondent is entitled to succeed to the tenancy and is not subject to eviction.' },
  { value: 'waiver', title: 'Waiver / acceptance of rent',
    body: 'Petitioner accepted rent after the alleged termination, waiving the right to proceed.' },
  { value: 'retaliation', title: 'Retaliatory eviction',
    body: 'This proceeding is retaliatory for Respondent exercising a lawful right (RPL § 223-b).' },
  { value: 'cured', title: 'Violation cured',
    body: 'Any alleged lease violation was cured within the time allowed by the notice.' },
  { value: 'good_cause', title: 'Good Cause Eviction defense',
    body: 'Respondent is protected by the Good Cause Eviction Law and Petitioner lacks good cause.' },
];

// Affirmative defenses to a nonpayment petition. `body` is the plain template
// language printed when the tenant selects the defense.
export const NONPAYMENT_DEFENSES = [
  { value: 'improper_service', title: 'Improper service',
    body: 'The notice and/or petition were not properly served upon Respondent in the manner required by law.' },
  { value: 'tendered_refused', title: 'Rent tendered and refused',
    body: 'Respondent tendered the rent claimed and Petitioner refused to accept it.' },
  { value: 'amount_wrong', title: 'Rent is not the amount claimed',
    body: 'The amount of rent demanded in the petition is incorrect and is not actually due and owing.' },
  { value: 'habitability', title: 'Warranty of habitability (RPL § 235-b)',
    body: 'Petitioner has breached the implied warranty of habitability, entitling Respondent to an abatement of rent.' },
  { value: 'retaliation', title: 'Retaliatory eviction',
    body: 'This proceeding is brought in retaliation for Respondent exercising a lawful right, in violation of RPL § 223-b.' },
  { value: 'overcharge', title: 'Rent overcharge',
    body: 'Respondent has been charged rent in excess of the legal regulated rent.' },
  { value: 'succession', title: 'Succession rights',
    body: 'Respondent is entitled to succeed to the tenancy and is not subject to eviction.' },
  { value: 'good_cause', title: 'Good Cause Eviction defense',
    body: 'Respondent is protected by the Good Cause Eviction Law and Petitioner lacks good cause as defined by that law.' },
  { value: 'erap_pending', title: 'ERAP / rental assistance pending',
    body: 'An application for emergency rental assistance is pending, which may stay this proceeding pending determination.' },
];

const HOUSING_LABEL = {
  rent_stabilized: 'Rent Stabilized',
  rent_controlled: 'Rent Controlled',
  market_rate: 'Market Rate / Unregulated',
  nycha: 'NYCHA / Public Housing',
  good_cause: 'Good Cause (subject to coverage)',
  not_sure: 'not specified',
};

// Derive court name + county/borough from the user's location answer.
export function deriveCourt(profile = {}) {
  if (profile.location_type === 'nyc') {
    return {
      courtName: 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
      county: (profile.borough || '____________________').toUpperCase(),
    };
  }
  return {
    // Outside NYC the right court depends on the municipality, so we leave it
    // blank for the user to enter (the field example guides them).
    courtName: '',
    county: (profile.county || '').toUpperCase(),
  };
}

// Editable caption fields shared by every court-filed document (fixes wrong
// captions, especially outside NYC). Prepended to those documents' field lists.
const COURT_FIELDS = [
  { key: 'courtName', label: 'Court name',
    placeholder: 'e.g., Civil Court of the City of New York — Housing Part',
    example:
      'In NYC this is the Civil Court (Housing Part). Outside NYC, enter your local ' +
      'court, e.g., "Yonkers City Court", "Nassau County District Court", or ' +
      '"Town of Greenburgh Justice Court".' },
  { key: 'county', label: 'County',
    placeholder: 'e.g., Kings, Queens, Westchester, Erie',
    example: 'The county where the property is located.' },
];

function fullAddress(p = {}) {
  return joinAddress([
    p.address_line1,
    p.unit_number ? `Unit ${p.unit_number}` : '',
    p.city,
    p.state,
    p.zip,
  ]);
}

// Add N calendar days to an ISO date string (yyyy-mm-dd); returns same format.
export function addDays(isoDate, n) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// ---- The registry -------------------------------------------------------
// Each entry: title, statutes, Pdf, fields[], defaults(profile), derive(values),
// dateInfo(values), serviceInstructions, nextSteps.
export const DOCUMENTS = {
  rent_demand_14day: {
    title: '14-Day Rent Demand',
    workflowType: 'nonpayment',
    statutes: ['RPAPL § 711', 'RPAPL § 735'],
    Pdf: RentDemand14,
    fields: [
      { key: 'tenantNames', label: 'Tenant name(s)',
        placeholder: 'e.g., Maria Gonzalez (and any other adults named on the lease)',
        example: `List everyone on the lease, separated by "and". ${DOE_HELP}` },
      { key: 'premisesAddress', label: 'Premises address (the rented home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456',
        example: 'Include unit/apartment number, city, state, and ZIP.' },
      { key: 'landlordName', label: 'Landlord / owner name',
        placeholder: 'e.g., Riverside Property Management LLC (or your own name)' },
      { key: 'landlordAddress', label: 'Landlord / owner address',
        placeholder: 'e.g., 88 Pinehurst Avenue, Suite 200, New York, NY 10033',
        example: 'Where the tenant can reach you or pay rent.' },
      { key: 'servedByAgent', label: 'I am signing as an agent (not the owner)', type: 'checkbox' },
      { key: 'rentPeriods', label: 'Which months/rent are owed?',
        placeholder: 'e.g., March 2026 through June 2026',
        example: 'Describe the months and the rent that went unpaid.' },
      { key: 'monthlyRent', label: 'Monthly rent ($)', type: 'number', placeholder: '2000' },
      { key: 'arrearsTotal', label: 'Total amount owed ($)', type: 'number', placeholder: '8000',
        example: 'Add up everything currently unpaid.' },
      { key: 'demandDate', label: 'Date you will give this notice', type: 'date',
        example: 'Usually today or the day you plan to serve it.' },
    ],
    defaults: (p) => ({
      tenantNames: p.landlord_name || '',
      premisesAddress: fullAddress(p),
      landlordName: p.full_name || '',
      landlordAddress: fullAddress(p),
      servedByAgent: false,
      rentPeriods: '',
      monthlyRent: p.rent_amount ?? '',
      arrearsTotal: p.arrears_amount ?? '',
      demandDate: '',
    }),
    derive: (v) => ({ ...v, expiresDate: addDays(v.demandDate, 14) }),
    dateInfo: (v) => {
      if (!v.demandDate) return null;
      const expires = addDays(v.demandDate, 14);
      return {
        items: [
          { tone: 'info', text: `Give this notice to your tenant on or about ${fmtDate(v.demandDate)}.` },
          { tone: 'must', text: `Your tenant has until ${fmtDate(expires)} to pay everything owed or move out.` },
          { tone: 'cannot', text: `You cannot file a nonpayment case in court until after ${fmtDate(expires)} — the full 14 days must pass first.` },
          { tone: 'warn', text: 'If you mail the notice, add a few extra days before filing. When in doubt, ask the court clerk.' },
        ],
      };
    },
    serviceInstructions: [
      'Serve the demand on the tenant. It may be served by personal delivery, by ' +
        'substituted service (to a person of suitable age plus mailing), or by ' +
        'conspicuous "nail and mail" after reasonable attempts.',
      'Keep proof of service — you will need an Affidavit of Service for court.',
      'Do NOT serve it yourself if you are a party; have someone 18+ who is not a ' +
        'party serve it, or use a licensed process server.',
    ],
    nextSteps:
      'After the 14-day period expires with no payment, you may generate a Nonpayment ' +
      'Petition. We can remind you by email on the expiration date.',
  },

  nonpayment_petition: {
    title: 'Nonpayment Petition + Notice of Petition',
    workflowType: 'nonpayment',
    statutes: ['RPAPL § 711', 'RPAPL § 735'],
    Pdf: NonpaymentPetition,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number (if you have one yet)',
        placeholder: 'Leave blank if none yet',
        example: 'The clerk assigns this when you file. Leave blank if you have not filed yet.' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: 'e.g., Riverside Property Management LLC, or your own name' },
      { key: 'petitionerAddress', label: 'Petitioner address', placeholder: 'e.g., 88 Pinehurst Avenue, Suite 200, New York, NY 10033' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)',
        placeholder: 'e.g., Maria Gonzalez (and any other adults named on the lease)', example: DOE_HELP },
      { key: 'premisesAddress', label: 'Premises address (the rented home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'rentPeriods', label: 'Which months/rent are owed?', placeholder: 'e.g., March 2026 through June 2026' },
      { key: 'monthlyRent', label: 'Monthly rent ($)', type: 'number', placeholder: '2000' },
      { key: 'arrearsTotal', label: 'Total amount owed ($)', type: 'number', placeholder: '8000' },
      { key: 'demandServedDate', label: 'Date the 14-day demand was served', type: 'date',
        example: 'The day your rent demand was actually given to the tenant.' },
      { key: 'demandMethod', label: 'How was the demand delivered?', type: 'select',
        options: ['Personal delivery', 'Substituted service + mailing', 'Conspicuous (nail and mail) + mailing'] },
      { key: 'petitionDate', label: 'Date of this petition', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.full_name || '',
        petitionerAddress: fullAddress(p),
        respondentNames: p.landlord_name || '',
        premisesAddress: fullAddress(p),
        regulatoryStatus: HOUSING_LABEL[p.housing_type] || 'not specified',
        rentPeriods: '',
        monthlyRent: p.rent_amount ?? '',
        arrearsTotal: p.arrears_amount ?? '',
        demandServedDate: '',
        demandMethod: 'Personal delivery',
        petitionDate: '',
      };
    },
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'File the Petition and Notice of Petition with the clerk to obtain an index ' +
        'number and a court date.',
      'After filing, the Notice of Petition and Petition must be served on the ' +
        'respondent within the timeframe set by law, and an Affidavit of Service filed.',
      'Bring your rent ledger and proof the 14-day demand was served.',
    ],
    nextSteps:
      'Once the court papers are served, generate an Affidavit of Service to file ' +
      'with the court.',
  },

  affidavit_of_service: {
    title: 'Affidavit of Service',
    workflowType: 'nonpayment',
    statutes: ['RPAPL § 735'],
    Pdf: AffidavitOfService,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number', placeholder: 'From your court papers' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: 'e.g., Riverside Property Management LLC, or your own name' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)',
        placeholder: 'e.g., Maria Gonzalez', example: DOE_HELP },
      { key: 'affiantName', label: 'Who served the papers?',
        placeholder: 'Full name of the person who delivered them',
        example: 'Must be someone 18 or older who is NOT a party to the case (not you).' },
      { key: 'documentServed', label: 'Document(s) served', type: 'select',
        options: ['Notice of Petition and Petition', '14-Day Rent Demand', 'Other'] },
      { key: 'servedOn', label: 'Person served', tip: 'Name/description of who received it.' },
      { key: 'serviceAddress', label: 'Address where served' },
      { key: 'serviceDate', label: 'Date of service', type: 'date' },
      { key: 'serviceTime', label: 'Approximate time of service' },
      { key: 'method', label: 'Method of service', type: 'select',
        options: [
          { value: 'personal', label: 'Personal delivery' },
          { value: 'substitute', label: 'Substituted service (+ mailing)' },
          { value: 'conspicuous', label: 'Conspicuous / nail and mail (+ mailing)' },
        ] },
      { key: 'mailedDate', label: 'Date copies were mailed (if applicable)', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.full_name || '',
        respondentNames: p.landlord_name || '',
        affiantName: '',
        documentServed: 'Notice of Petition and Petition',
        servedOn: p.landlord_name || '',
        serviceAddress: fullAddress(p),
        serviceDate: '',
        serviceTime: '',
        method: 'personal',
        mailedDate: '',
      };
    },
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'The affiant (the person who served the papers) must sign this in front of a ' +
        'notary public.',
      'File the notarized affidavit with the court clerk for the proceeding.',
    ],
    nextSteps:
      'File the notarized Affidavit of Service with the court. Keep a copy for your ' +
      'records.',
  },

  answer_nonpayment: {
    title: 'Written Answer — Nonpayment',
    workflowType: 'nonpayment_defense',
    statutes: ['RPL § 235-b', 'CPLR § 1101'],
    Pdf: AnswerNonpayment,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number',
        placeholder: 'Look on the papers you were served',
        example: 'It is printed near the top of the court papers you received.' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: "Your landlord's name, from the papers" },
      { key: 'respondentNames', label: 'Your name (respondent)', placeholder: 'e.g., Sarah Williams' },
      { key: 'premisesAddress', label: 'Premises address (your home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'defenses', label: 'Which defenses apply to you?', type: 'checklist',
        tip: 'Select all that apply. Each becomes a numbered affirmative defense.',
        options: NONPAYMENT_DEFENSES.map((d) => ({ value: d.value, label: d.title })) },
      { key: 'habitabilityDetails', label: 'Habitability problems (if selected above)', type: 'textarea',
        tip: 'e.g. "no heat or hot water since January; broken window in bedroom."' },
      { key: 'answerDate', label: 'Date of this answer', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '',
        respondentNames: p.full_name || '',
        premisesAddress: fullAddress(p),
        defenses: [],
        habitabilityDetails: '',
        answerDate: '',
      };
    },
    derive: (v) => ({
      ...v,
      defenseList: NONPAYMENT_DEFENSES.filter((d) => (v.defenses || []).includes(d.value))
        .map((d) => ({ title: d.title, body: d.body })),
    }),
    dateInfo: () => null,
    serviceInstructions: [
      'You may file a written Answer with the clerk of the court where the case is ' +
        'pending, or in many courts you may answer orally on your court date.',
      'Filing an Answer does not replace appearing in court — go to every court date.',
      'Bring evidence for your defenses (receipts, photos, texts, repair complaints).',
    ],
    nextSteps:
      'Bring this Answer to the clerk to file, keep a stamped copy, and appear on your ' +
      'court date. If you have already missed a court date, you may need an Order to ' +
      'Show Cause instead.',
  },

  osc_vacate_default: {
    title: 'OSC to Vacate Default Judgment',
    workflowType: 'tenant_emergency',
    statutes: ['CPLR § 5015', 'CPLR § 1101'],
    Pdf: OscVacateDefault,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number', placeholder: 'From your court papers' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: "Your landlord's name" },
      { key: 'respondentNames', label: 'Your name (respondent)', placeholder: 'e.g., Sarah Williams' },
      { key: 'premisesAddress', label: 'Premises address (your home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'judgmentDate', label: 'Date the default judgment / warrant was entered', type: 'date',
        example: 'Roughly when you learned the court ruled against you without you there.' },
      { key: 'defaultReason', label: 'Why did you miss your court date?', type: 'textarea',
        placeholder: 'Explain in 1–2 honest sentences…',
        example:
          'Examples: "I never received the court papers." · "I was in the hospital that day." · ' +
          '"I went to the wrong courtroom." · "I had a work emergency and could not get there."' },
      { key: 'meritoriousDefense', label: 'Why should you win, or get another chance?', type: 'textarea',
        placeholder: 'Your side of the story…',
        example:
          'Examples: "I already paid the rent — I have receipts." · ' +
          '"There is no heat or hot water and the apartment is unsafe." · ' +
          '"The amount the landlord claims is wrong."' },
      { key: 'oscDate', label: 'Date you are signing this', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '',
        respondentNames: p.full_name || '',
        premisesAddress: fullAddress(p),
        judgmentDate: '',
        defaultReason: '',
        meritoriousDefense: '',
        oscDate: '',
      };
    },
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'Bring this Order to Show Cause and affidavit to the clerk. A judge must sign ' +
        'the OSC and will set the hearing date and how it must be served.',
      'The affidavit must be signed in front of a notary (the clerk often has one).',
      'Ask the clerk about an immediate stay of eviction pending the hearing.',
    ],
    nextSteps:
      'Take this to the courthouse as soon as possible — there are deadlines after a ' +
      'default. The judge sets the hearing date and serves/stays the matter.',
  },

  notice_termination: {
    title: 'Notice of Termination (30/60/90-day)',
    workflowType: 'holdover',
    statutes: ['RPL § 226-c'],
    Pdf: TerminationNotice,
    fields: [
      { key: 'tenantNames', label: 'Tenant name(s)',
        placeholder: 'e.g., Maria Gonzalez', example: DOE_HELP },
      { key: 'premisesAddress', label: 'Premises address (the rented home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'landlordName', label: 'Landlord / owner name', placeholder: 'e.g., Riverside Property Management LLC, or your own name' },
      { key: 'landlordAddress', label: 'Landlord / owner address',
        placeholder: 'e.g., 88 Pinehurst Avenue, Suite 200, New York, NY 10033' },
      { key: 'servedByAgent', label: 'I am signing as an agent (not the owner)', type: 'checkbox' },
      { key: 'noticeDays', label: 'How long has the tenant lived there?', type: 'select',
        example: 'This sets how much notice the law requires.',
        options: [
          { value: '30', label: 'Less than 1 year → 30 days notice' },
          { value: '60', label: '1 to 2 years → 60 days notice' },
          { value: '90', label: 'More than 2 years → 90 days notice' },
        ] },
      { key: 'noticeDate', label: 'Date you will give this notice', type: 'date',
        example: 'Usually today or when you plan to serve it.' },
      { key: 'terminationDate', label: 'Date the tenant must move out by', type: 'date',
        example: 'Pick a date on or after the earliest date shown in the deadline box.' },
    ],
    defaults: (p) => ({
      tenantNames: p.landlord_name || '',
      premisesAddress: fullAddress(p),
      landlordName: p.full_name || '',
      landlordAddress: fullAddress(p),
      servedByAgent: false,
      noticeDays: '30',
      noticeDate: '',
      terminationDate: '',
    }),
    derive: (v) => v,
    dateInfo: (v) => {
      if (!v.noticeDate) return null;
      const earliest = addDays(v.noticeDate, Number(v.noticeDays || 30));
      return {
        items: [
          { tone: 'info', text: `Give this notice to your tenant on or about ${fmtDate(v.noticeDate)}.` },
          { tone: 'cannot', text: `The move-out date you set must be ${earliest ? `on or after ${fmtDate(earliest)}` : `at least ${v.noticeDays} days away`} — that's the earliest the law allows.` },
          { tone: 'must', text: `The tenant must move out by the date you set (the "move-out by" date).` },
          { tone: 'warn', text: 'If you mail the notice, add a few extra days. You can only start a holdover case after the move-out date passes.' },
        ],
      };
    },
    serviceInstructions: [
      'Serve the notice on the tenant by personal, substituted, or conspicuous ' +
        '(nail-and-mail) service, and keep proof of service.',
      'Do not serve it yourself if you are a party — use someone 18+ who is not a party.',
      'Choose the notice period based on how long the tenant has occupied the unit.',
    ],
    nextSteps:
      'If the tenant does not vacate by the termination date, you may generate a ' +
      'Holdover Petition. We can remind you on the termination date.',
  },

  notice_cure_10day: {
    title: '10-Day Notice to Cure',
    workflowType: 'holdover',
    statutes: ['RPAPL § 753'],
    Pdf: NoticeToCure10,
    fields: [
      { key: 'tenantNames', label: 'Tenant name(s)',
        placeholder: 'e.g., Maria Gonzalez', example: DOE_HELP },
      { key: 'premisesAddress', label: 'Premises address (the rented home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'landlordName', label: 'Landlord / owner name', placeholder: 'e.g., Riverside Property Management LLC, or your own name' },
      { key: 'landlordAddress', label: 'Landlord / owner address',
        placeholder: 'e.g., 88 Pinehurst Avenue, Suite 200, New York, NY 10033' },
      { key: 'servedByAgent', label: 'I am signing as an agent (not the owner)', type: 'checkbox' },
      { key: 'leaseProvision', label: 'Which lease rule was broken? (optional)',
        placeholder: 'e.g., Paragraph 12 — No Pets',
        example: 'If you know the lease paragraph or rule, name it. You can leave this blank.' },
      { key: 'violationDescription', label: 'Describe what the tenant is doing wrong', type: 'textarea',
        placeholder: 'Describe the problem in 1–3 plain sentences…',
        example:
          'Be specific. Examples: "Keeping a dog despite the no-pets clause." · ' +
          '"Subletting the apartment on Airbnb without permission." · ' +
          '"Repeated loud parties after midnight despite warnings on 3/1 and 3/15." · ' +
          '"Storing junk in the hallway, blocking the fire exit."' },
      { key: 'noticeDate', label: 'Date you will give this notice', type: 'date',
        example: 'Usually today or when you plan to serve it.' },
      { key: 'cureDate', label: 'Deadline for the tenant to fix it', type: 'date',
        example: 'Pick a date on or after the earliest date shown in the deadline box.' },
    ],
    defaults: (p) => ({
      tenantNames: p.landlord_name || '',
      premisesAddress: fullAddress(p),
      landlordName: p.full_name || '',
      landlordAddress: fullAddress(p),
      servedByAgent: false,
      leaseProvision: '',
      violationDescription: '',
      noticeDate: '',
      cureDate: '',
    }),
    derive: (v) => v,
    dateInfo: (v) => {
      if (!v.noticeDate) return null;
      const earliest = addDays(v.noticeDate, 10);
      return {
        items: [
          { tone: 'info', text: `Give this notice to your tenant on or about ${fmtDate(v.noticeDate)}.` },
          { tone: 'must', text: `The tenant has at least 10 days — until about ${fmtDate(earliest)} — to fix the problem.` },
          { tone: 'cannot', text: `If the tenant fixes the problem in time, you generally cannot evict over it.` },
          { tone: 'warn', text: 'If you mail the notice, add a few extra days before the cure deadline.' },
        ],
      };
    },
    serviceInstructions: [
      'Serve the notice on the tenant and keep proof of service.',
      'Describe the violation specifically — vague notices are often rejected by courts.',
      'If the tenant cures within the period, you generally may not proceed on that ground.',
    ],
    nextSteps:
      'If the tenant fails to cure by the deadline, a Notice of Termination and then a ' +
      'Holdover Petition may follow. Verify the current sequence before proceeding.',
  },

  holdover_petition: {
    title: 'Holdover Petition + Notice of Petition',
    workflowType: 'holdover',
    statutes: ['RPAPL § 711', 'RPAPL § 735'],
    Pdf: HoldoverPetition,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number (if you have one yet)',
        placeholder: 'Leave blank if none yet' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: 'e.g., Riverside Property Management LLC, or your own name' },
      { key: 'petitionerAddress', label: 'Petitioner address', placeholder: 'e.g., 88 Pinehurst Avenue, Suite 200, New York, NY 10033' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)',
        placeholder: 'e.g., Maria Gonzalez', example: DOE_HELP },
      { key: 'premisesAddress', label: 'Premises address (the rented home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'groundType', label: 'Why is the tenant being asked to leave?', type: 'select',
        options: [
          'the tenancy was terminated by notice',
          'the lease expired and was not renewed',
          'the tenant failed to cure a lease violation',
          'the tenant is committing a nuisance',
          'the tenant illegally sublet the premises',
          'the owner seeks the unit for personal/family use',
        ] },
      { key: 'noticeType', label: 'Predicate notice that was served',
        tip: 'e.g. "90-Day Notice of Termination" or "10-Day Notice to Cure".' },
      { key: 'noticeServedDate', label: 'Date the predicate notice was served', type: 'date' },
      { key: 'useOccupancy', label: 'Monthly use & occupancy value ($)', type: 'number' },
      { key: 'petitionDate', label: 'Date of this petition', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.full_name || '',
        petitionerAddress: fullAddress(p),
        respondentNames: p.landlord_name || '',
        premisesAddress: fullAddress(p),
        regulatoryStatus: HOUSING_LABEL[p.housing_type] || 'not specified',
        groundType: 'the tenancy was terminated by notice',
        noticeType: '',
        noticeServedDate: '',
        useOccupancy: p.rent_amount ?? '',
        petitionDate: '',
      };
    },
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'File the Holdover Petition and Notice of Petition with the clerk to get an ' +
        'index number and court date.',
      'Serve the papers on the respondent within the timeframe set by law and file an ' +
        'Affidavit of Service.',
      'Bring proof that the predicate notice was properly served.',
    ],
    nextSteps:
      'Once the papers are served, generate an Affidavit of Service to file with the court.',
  },

  answer_holdover: {
    title: 'Written Answer — Holdover',
    workflowType: 'holdover_defense',
    statutes: ['RPAPL § 711', 'CPLR § 1101'],
    Pdf: AnswerHoldover,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number', placeholder: 'From your court papers' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name', placeholder: "Your landlord's name" },
      { key: 'respondentNames', label: 'Your name (respondent)', placeholder: 'e.g., Sarah Williams' },
      { key: 'premisesAddress', label: 'Premises address (your home)',
        placeholder: 'e.g., 1245 Grand Concourse, Apt 5C, Bronx, NY 10456' },
      { key: 'defenses', label: 'Which defenses apply to you?', type: 'checklist',
        tip: 'Select all that apply. Each becomes a numbered affirmative defense.',
        options: HOLDOVER_DEFENSES.map((d) => ({ value: d.value, label: d.title })) },
      { key: 'answerDate', label: 'Date of this answer', type: 'date' },
    ],
    defaults: (p) => {
      const court = deriveCourt(p);
      return {
        courtName: court.courtName,
        county: court.county,
        indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '',
        respondentNames: p.full_name || '',
        premisesAddress: fullAddress(p),
        defenses: [],
        answerDate: '',
      };
    },
    derive: (v) => ({
      ...v,
      defenseList: HOLDOVER_DEFENSES.filter((d) => (v.defenses || []).includes(d.value))
        .map((d) => ({ title: d.title, body: d.body })),
    }),
    dateInfo: () => null,
    serviceInstructions: [
      'File the Answer with the clerk, or answer orally on your court date if the court allows.',
      'Appear at every court date — filing an Answer does not replace appearing.',
      'Bring evidence supporting your defenses.',
    ],
    nextSteps:
      'Bring this Answer to the clerk, keep a stamped copy, and appear on your court date.',
  },
};

export function getDocConfig(docType) {
  return DOCUMENTS[docType] || null;
}
