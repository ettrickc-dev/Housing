import RentDemand14 from '../pdf/RentDemand14.jsx';
import NonpaymentPetition from '../pdf/NonpaymentPetition.jsx';
import AffidavitOfService from '../pdf/AffidavitOfService.jsx';
import AnswerNonpayment from '../pdf/AnswerNonpayment.jsx';
import OscVacateDefault from '../pdf/OscVacateDefault.jsx';
import TerminationNotice from '../pdf/TerminationNotice.jsx';
import NoticeToCure10 from '../pdf/NoticeToCure10.jsx';
import HoldoverPetition from '../pdf/HoldoverPetition.jsx';
import AnswerHoldover from '../pdf/AnswerHoldover.jsx';
import JuryDemand from '../pdf/JuryDemand.jsx';
import PoorPersonApplication from '../pdf/PoorPersonApplication.jsx';
import OscStayWarrant from '../pdf/OscStayWarrant.jsx';
import HpAction from '../pdf/HpAction.jsx';
import IllegalLockout from '../pdf/IllegalLockout.jsx';
import MotionDefaultJudgment from '../pdf/MotionDefaultJudgment.jsx';
import StipulationSettlement from '../pdf/StipulationSettlement.jsx';
import MarshalRequisition from '../pdf/MarshalRequisition.jsx';
import SatisfactionOfJudgment from '../pdf/SatisfactionOfJudgment.jsx';
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

const REGULATORY_OPTIONS = [
  { value: 'market_rate', label: 'Market rate / unregulated' },
  { value: 'rent_stabilized', label: 'Rent stabilized' },
  { value: 'rent_controlled', label: 'Rent controlled' },
  { value: 'nycha', label: 'NYCHA / public housing' },
];
const GOOD_CAUSE_STATUS = [
  { value: 'not_covered', label: 'NOT covered by Good Cause Eviction' },
  { value: 'covered', label: 'Covered by Good Cause Eviction' },
];
const SIGNER_ROLES = ['Petitioner', 'Agent for Petitioner', 'Attorney for Petitioner'];

// Good Cause disclosure fields for predicate notices (required in legal notices).
const NOTICE_GOODCAUSE_FIELDS = [
  { key: 'goodCauseStatus', label: 'Good Cause Eviction coverage (required disclosure)', type: 'select',
    options: GOOD_CAUSE_STATUS,
    example: 'The 2024 law requires legal notices to state whether the unit is covered. Unsure? Use the Good Cause checker in the intake wizard.' },
  { key: 'goodCauseReason', label: 'If NOT covered, the reason',
    placeholder: 'e.g., small landlord (owns 10 or fewer units statewide)',
    example: 'Leave blank if covered.' },
];
const NOTICE_GOODCAUSE_DEFAULTS = { goodCauseStatus: 'not_covered', goodCauseReason: '' };

// Maps the intake housing type to the petition's regulatory-status field.
function regFromHousing(h) {
  if (h === 'rent_stabilized' || h === 'rent_controlled' || h === 'nycha') return h;
  return 'market_rate';
}

// Shared field set for the new robust petitions (regulatory + Good Cause + signer).
const REG_GOODCAUSE_FIELDS = [
  { key: 'tenancyType', label: 'Was the rental agreement written or oral?', type: 'select',
    options: [{ value: 'written', label: 'Written lease' }, { value: 'oral', label: 'Oral / month-to-month' }] },
  { key: 'regulatoryStatus', label: "The apartment's regulation status", type: 'select',
    options: REGULATORY_OPTIONS,
    example: 'Market rate = a normal private rental with no rent regulation.' },
  { key: 'exemptionReason', label: 'If unregulated, why? (for the petition)',
    placeholder: 'e.g., the building is a four-family dwelling',
    example: 'Common reasons: "the building has fewer than 6 units", "a two-family owner-occupied home", "built after 1974 without tax benefits". Leave blank if regulated.' },
  { key: 'goodCauseStatus', label: 'Good Cause Eviction coverage (required disclosure)', type: 'select',
    options: GOOD_CAUSE_STATUS,
    example: 'The law (2024) requires every legal notice to state whether the unit is covered. If unsure, use the Good Cause checker in the intake wizard.' },
  { key: 'goodCauseReason', label: 'If NOT covered by Good Cause, the reason',
    placeholder: 'e.g., the landlord is a small landlord (owns 10 or fewer units statewide)',
    example: 'Common exemptions: small landlord (≤10 units statewide); owner-occupied building with ≤10 units; the unit is already rent-regulated; rent above the local high-rent threshold; the locality has not opted in. Leave blank if covered.' },
  { key: 'signerName', label: 'Who is signing the petition?', placeholder: 'Full name of the person signing' },
  { key: 'signerRole', label: 'Signing as', type: 'select', options: SIGNER_ROLES },
  { key: 'attorneyFees', label: "Attorneys' fees claimed ($, optional)", type: 'number', placeholder: '0' },
];

function petitionDefaults(p) {
  const court = deriveCourt(p);
  return {
    courtName: court.courtName,
    county: court.county,
    isNyc: p.location_type === 'nyc',
    indexNumber: p.court_index_number || '',
    petitionerName: p.full_name || '',
    petitionerAddress: fullAddress(p),
    respondentNames: p.landlord_name || '',
    premisesAddress: fullAddress(p),
    tenancyType: 'written',
    regulatoryStatus: regFromHousing(p.housing_type),
    exemptionReason: '',
    goodCauseStatus: 'not_covered',
    goodCauseReason: '',
    signerName: p.full_name || '',
    signerRole: 'Petitioner',
    attorneyFees: '',
    petitionDate: '',
  };
}

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
      { key: 'includeSpanish', label: 'Include a Spanish-language copy', type: 'checkbox',
        example: 'Adds a Spanish version of the demand for the tenant.' },
      { key: 'include235e', label: 'Include the certified-mail notice (RPL § 235-e)', type: 'checkbox',
        example: 'HSTPA 2019 requires a separate certified-mail notice when rent is not received. Recommended.' },
      ...NOTICE_GOODCAUSE_FIELDS,
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
      includeSpanish: true,
      include235e: true,
      ...NOTICE_GOODCAUSE_DEFAULTS,
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
    courtFiled: true,
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
      ...REG_GOODCAUSE_FIELDS,
      { key: 'petitionDate', label: 'Date of this petition', type: 'date' },
    ],
    defaults: (p) => ({
      ...petitionDefaults(p),
      rentPeriods: '',
      monthlyRent: p.rent_amount ?? '',
      arrearsTotal: p.arrears_amount ?? '',
      demandServedDate: '',
      demandMethod: 'Personal delivery',
    }),
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'File the Notice of Petition and Petition TOGETHER to start the case and get an ' +
        'index number. In NYC you file online through NYSCEF — from home, no line.',
      'Include your 14-day rent demand and its affidavit of service as exhibits.',
      'After the court processes the filing, the papers must be served on the ' +
        'respondent and an Affidavit of Service filed.',
    ],
    nextSteps:
      'File online from home through NYSCEF (we walk you through it at /efile) — the ' +
      'Notice of Petition and Petition are filed together. Then serve the papers and ' +
      'generate an Affidavit of Service.',
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
      { key: 'includeSpanish', label: 'Include a Spanish-language copy', type: 'checkbox' },
      ...NOTICE_GOODCAUSE_FIELDS,
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
      includeSpanish: true,
      ...NOTICE_GOODCAUSE_DEFAULTS,
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
      { key: 'includeSpanish', label: 'Include a Spanish-language copy', type: 'checkbox' },
      ...NOTICE_GOODCAUSE_FIELDS,
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
      includeSpanish: true,
      ...NOTICE_GOODCAUSE_DEFAULTS,
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
    courtFiled: true,
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
        placeholder: 'e.g., 90-Day Notice of Termination',
        example: 'The notice you gave before filing, e.g. "90-Day Notice of Termination" or "10-Day Notice to Cure".' },
      { key: 'noticeDays', label: 'Notice period given', type: 'select',
        options: [{ value: '10', label: '10 days' }, { value: '30', label: '30 days' }, { value: '60', label: '60 days' }, { value: '90', label: '90 days' }] },
      { key: 'noticeServedDate', label: 'Date the predicate notice was served', type: 'date' },
      { key: 'termExpiredDate', label: 'Date the tenancy/term ended', type: 'date' },
      { key: 'useOccupancy', label: 'Monthly use & occupancy value ($)', type: 'number', placeholder: '2000' },
      ...REG_GOODCAUSE_FIELDS,
      { key: 'petitionDate', label: 'Date of this petition', type: 'date' },
    ],
    defaults: (p) => ({
      ...petitionDefaults(p),
      groundType: 'the tenancy was terminated by notice',
      noticeType: '',
      noticeDays: '90',
      noticeServedDate: '',
      termExpiredDate: '',
      useOccupancy: p.rent_amount ?? '',
    }),
    derive: (v) => v,
    dateInfo: () => null,
    serviceInstructions: [
      'File the Notice of Petition and Petition TOGETHER to start the case and get an ' +
        'index number. In NYC you file online through NYSCEF — from home, no line.',
      'Include your predicate notice (termination/cure) and its affidavit of service as exhibits.',
      'After the court processes the filing and sets a return date, serve the papers and ' +
        'file an Affidavit of Service.',
    ],
    nextSteps:
      'File online from home through NYSCEF (we walk you through it at /efile) — the ' +
      'Notice of Petition and Petition are filed together. Then serve the papers and ' +
      'generate an Affidavit of Service.',
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

  jury_demand: {
    title: 'Jury Demand',
    workflowType: 'tenant_defense',
    statutes: ['CPLR § 4102'],
    Pdf: JuryDemand,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number', placeholder: 'From your court papers' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'demandedByName', label: 'Your name (the person demanding a jury)' },
      { key: 'demandedByRole', label: 'You are the', type: 'select', options: ['Respondent', 'Petitioner'] },
      { key: 'demandDate', label: 'Date of this demand', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '', respondentNames: p.full_name || '',
        premisesAddress: fullAddress(p), demandedByName: p.full_name || '', demandedByRole: 'Respondent', demandDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'A jury demand is usually filed with your answer and may require a jury fee — ask the clerk.',
      'Some leases waive the right to a jury, and some issues are not triable by jury.',
    ],
    nextSteps: 'File this with your answer and ask the clerk about any jury fee.',
  },

  fee_waiver: {
    title: 'Fee Waiver (Poor Person) Application',
    workflowType: 'tenant_defense',
    statutes: ['CPLR § 1101'],
    Pdf: PoorPersonApplication,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number (if any)', placeholder: 'Leave blank if none yet' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'applicantName', label: 'Your name (the applicant)' },
      { key: 'applicantRole', label: 'You are the', type: 'select', options: ['Respondent', 'Petitioner'] },
      { key: 'onPublicAssistance', label: 'Do you receive public assistance?', type: 'select',
        options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] },
      { key: 'assistanceType', label: 'If yes, which program?', placeholder: 'e.g., SNAP, Cash Assistance, SSI' },
      { key: 'monthlyIncome', label: 'Your approximate monthly income ($)', type: 'number', placeholder: '0' },
      { key: 'dependents', label: 'How many dependents do you support?', placeholder: '0' },
      { key: 'reason', label: 'Why you cannot afford the fees', type: 'textarea',
        placeholder: 'A sentence or two…',
        example: 'Examples: "My income only covers rent and food." · "I am unemployed and have no savings."' },
      { key: 'appDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '', respondentNames: p.full_name || '', premisesAddress: fullAddress(p),
        applicantName: p.full_name || '', applicantRole: 'Respondent', onPublicAssistance: 'no',
        assistanceType: '', monthlyIncome: '', dependents: '0', reason: '', appDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'File this affidavit with the clerk along with the document you cannot afford the fee for.',
      'Sign it in front of a notary (the clerk often has one).',
    ],
    nextSteps: 'File it with the court and ask the clerk to process your fee waiver.',
  },

  osc_stay_warrant: {
    title: 'OSC to Stay an Eviction',
    workflowType: 'tenant_emergency',
    statutes: ['RPAPL § 749'],
    Pdf: OscStayWarrant,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number', placeholder: 'From your court papers' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'respondentNames', label: 'Your name (respondent)' },
      { key: 'premisesAddress', label: 'Premises address (your home)' },
      { key: 'reason', label: 'Why the eviction should be paused', type: 'textarea',
        placeholder: 'A sentence or two…',
        example: 'Examples: "I have an ERAP/rental-assistance application pending." · "I have the money and can pay now." · "I need a short time to move and have nowhere to go yet."' },
      { key: 'reliefRequested', label: 'What you are asking the court to do', type: 'textarea',
        placeholder: 'A sentence or two…',
        example: 'Examples: "Give me until the end of the month to move." · "Let me pay the rent and stay." · "Pause the eviction while my assistance application is decided."' },
      { key: 'oscDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || '', respondentNames: p.full_name || '', premisesAddress: fullAddress(p),
        reason: '', reliefRequested: '', oscDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'Bring this to the clerk as soon as possible — a judge must sign it and set a hearing.',
      'Sign the affidavit in front of a notary. Ask the clerk about an immediate stay.',
    ],
    nextSteps: 'Take this to the courthouse right away; the judge sets the hearing and how it must be served.',
  },

  hp_action_repairs: {
    title: 'HP Action (Repairs)',
    workflowType: 'tenant_offense',
    statutes: ['NYC Housing Maintenance Code', 'Multiple Dwelling Law', 'RPL § 235-b'],
    Pdf: HpAction,
    fields: [
      ...COURT_FIELDS,
      { key: 'petitionerName', label: 'Your name (the tenant/petitioner)' },
      { key: 'petitionerAddress', label: 'Your mailing address' },
      { key: 'respondentNames', label: 'Owner / landlord name (respondent)' },
      { key: 'premisesAddress', label: 'Building address' },
      { key: 'apartment', label: 'Apartment / unit', placeholder: 'e.g., 4B' },
      { key: 'managingAgent', label: 'Managing agent (if any)', placeholder: 'Leave blank if none' },
      { key: 'conditions', label: 'Conditions that need repair (one per line)', type: 'textarea',
        example: 'Examples (one per line): "No heat or hot water" · "Leaking ceiling in bathroom" · "Broken front-door lock" · "Mold in bedroom" · "Roach/mice infestation"' },
      { key: 'hazardous', label: 'Are any conditions immediately hazardous?', type: 'select',
        options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes — emergency' }] },
      { key: 'accessDates', label: 'Dates/times you can give access for repairs', placeholder: 'e.g., weekday mornings' },
      { key: 'petitionDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, petitionerName: p.full_name || '',
        petitionerAddress: fullAddress(p), respondentNames: p.landlord_name || '',
        premisesAddress: fullAddress(p), apartment: p.unit_number || '', managingAgent: '',
        conditions: '', hazardous: 'no', accessDates: '', petitionDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'File the petition + Order to Show Cause at your borough Housing Court (HP Part) clerk.',
      'There is a small fee (often a few dollars) — ask the clerk, or file a fee-waiver application.',
      'HPD will be directed to inspect; provide access on the dates you listed.',
    ],
    nextSteps: 'File at the HP clerk’s window; the court sets an inspection and a hearing date.',
  },

  illegal_lockout: {
    title: 'Illegal Lockout (Restoration)',
    workflowType: 'tenant_emergency',
    statutes: ['RPAPL § 853', 'RPAPL § 768', 'NYC Admin Code § 26-521'],
    Pdf: IllegalLockout,
    fields: [
      ...COURT_FIELDS,
      { key: 'petitionerName', label: 'Your name (the locked-out tenant)' },
      { key: 'petitionerAddress', label: 'Where to reach you now (mailing address)' },
      { key: 'respondentNames', label: 'Owner / landlord name (respondent)' },
      { key: 'premisesAddress', label: 'Address you were locked out of' },
      { key: 'apartment', label: 'Apartment / unit', placeholder: 'e.g., 2R' },
      { key: 'occupancyLength', label: 'How long you lived there before the lockout', placeholder: 'e.g., 3 years' },
      { key: 'lockoutDate', label: 'Date of the lockout', type: 'date' },
      { key: 'lockoutMethod', label: 'How you were locked out', type: 'textarea',
        example: 'Examples: "Landlord changed the locks while I was at work." · "Removed my belongings and refused to give keys." · "Blocked the entrance and threatened me."' },
      { key: 'isNyc', label: 'Is the building in New York City?', type: 'select',
        options: [{ value: 'yes', label: 'Yes (NYC)' }, { value: 'no', label: 'No (outside NYC)' }] },
      { key: 'petitionDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, petitionerName: p.full_name || '',
        petitionerAddress: fullAddress(p), respondentNames: p.landlord_name || '',
        premisesAddress: fullAddress(p), apartment: p.unit_number || '', occupancyLength: '',
        lockoutDate: '', lockoutMethod: '', isNyc: p.location_type === 'nyc' ? 'yes' : 'no', petitionDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'Take this to your borough Housing Court clerk right away — ask for an illegal-lockout (restoration) OSC.',
      'A judge must sign the Order to Show Cause; it will say how to serve the landlord.',
      'Bring proof you lived there (lease, mail, ID, photos) to the hearing.',
    ],
    nextSteps: 'Go to the courthouse immediately; the judge can order the landlord to let you back in.',
  },

  motion_default_judgment: {
    title: 'Motion for Default Judgment',
    workflowType: 'landlord_motion',
    statutes: ['RPAPL § 732', 'RPAPL § 747', 'Servicemembers Civil Relief Act'],
    Pdf: MotionDefaultJudgment,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'petitionerAddress', label: 'Petitioner business address' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'caseType', label: 'What kind of case is this?', type: 'select',
        options: [{ value: 'nonpayment', label: 'Nonpayment (unpaid rent)' }, { value: 'holdover', label: 'Holdover' }] },
      { key: 'serviceDate', label: 'Date the petition was served', type: 'date' },
      { key: 'serviceMethod', label: 'How it was served', placeholder: 'e.g., conspicuous service (nail & mail)' },
      { key: 'amountDue', label: 'Rent owed for money judgment ($) — nonpayment only', type: 'number', placeholder: '0' },
      { key: 'returnDate', label: 'Motion return date (if required)', type: 'date' },
      { key: 'signerName', label: 'Who is signing the affidavit' },
      { key: 'signerRole', label: 'Signing as the', type: 'select',
        options: ['Petitioner', 'Agent', 'Attorney for Petitioner'] },
      { key: 'motionDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || p.full_name || '', petitionerAddress: fullAddress(p),
        respondentNames: '', premisesAddress: fullAddress(p), caseType: 'nonpayment',
        serviceDate: '', serviceMethod: '', amountDue: '', returnDate: '',
        signerName: p.landlord_name || p.full_name || '', signerRole: 'Petitioner', motionDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'File the Notice of Motion + affidavit with the court; some clerks take default applications at the window.',
      'Attach the proof of service of the Notice of Petition and Petition.',
      'A money judgment for rent is available in nonpayment cases; a warrant issues on the default.',
    ],
    nextSteps: 'File with the court (or present at the clerk’s window); the court enters the judgment and warrant.',
  },

  stipulation_settlement: {
    title: 'Stipulation of Settlement',
    workflowType: 'court_settlement',
    statutes: [],
    Pdf: StipulationSettlement,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'petitionerAddress', label: 'Petitioner address' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'settlementType', label: 'How are you settling?', type: 'select',
        options: [
          { value: 'payment', label: 'Tenant pays what is owed (payment plan)' },
          { value: 'moveout', label: 'Tenant moves out by a date' },
          { value: 'other', label: 'Other / custom terms' },
        ] },
      { key: 'totalAmount', label: 'Amount tenant will pay ($) — payment settlements', type: 'number', placeholder: '0' },
      { key: 'payByDate', label: 'Pay-by date — payment settlements', type: 'date' },
      { key: 'moveOutDate', label: 'Move-out date — move-out settlements', type: 'date' },
      { key: 'otherTerms', label: 'Any other agreed terms', type: 'textarea',
        example: 'Examples: "Landlord will repair the bathroom leak by July 15." · "Tenant withdraws the counterclaim." · "Petitioner waives late fees."' },
      { key: 'stipDate', label: 'Date of this agreement', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || p.full_name || '', petitionerAddress: fullAddress(p),
        respondentNames: '', premisesAddress: fullAddress(p), settlementType: 'payment',
        totalAmount: '', payByDate: '', moveOutDate: '', otherTerms: '', stipDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'Both parties sign. Bring it to your court date so the judge can "so-order" it.',
      'A stipulation is a binding agreement — make sure every term is one you can live with.',
      'Each side should keep a signed, so-ordered copy.',
    ],
    nextSteps: 'Both parties sign and present it to the judge to be so-ordered on your court date.',
  },

  marshal_requisition: {
    title: 'Requisition to Marshal / Sheriff',
    workflowType: 'landlord_postjudgment',
    statutes: ['RPAPL § 749'],
    Pdf: MarshalRequisition,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number' },
      { key: 'petitionerName', label: 'Petitioner (landlord) name' },
      { key: 'petitionerAddress', label: 'Your address' },
      { key: 'petitionerPhone', label: 'Your phone number' },
      { key: 'respondentNames', label: 'Respondent (tenant) name(s)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'apartment', label: 'Apartment / unit', placeholder: 'e.g., 3R' },
      { key: 'officerType', label: 'Who will enforce it?', type: 'select',
        options: ['City Marshal', 'Sheriff'] },
      { key: 'officerName', label: 'Officer name (if known)', placeholder: 'Leave blank if unknown' },
      { key: 'judgmentDate', label: 'Date judgment of possession was entered', type: 'date' },
      { key: 'warrantDate', label: 'Date the warrant of eviction issued', type: 'date' },
      { key: 'reqDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        petitionerName: p.landlord_name || p.full_name || '', petitionerAddress: fullAddress(p),
        petitionerPhone: p.phone || '', respondentNames: '', premisesAddress: fullAddress(p),
        apartment: p.unit_number || '', officerType: p.location_type === 'nyc' ? 'City Marshal' : 'Sheriff',
        officerName: '', judgmentDate: '', warrantDate: '', reqDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'In NYC, give the original warrant and this requisition to a licensed City Marshal; elsewhere, the Sheriff.',
      'The officer serves a Notice of Eviction (at least 14 days) before executing — RPAPL § 749(2).',
      'Never remove a tenant or change locks yourself — only the officer may execute the warrant.',
    ],
    nextSteps: 'Deliver the warrant + this requisition to the marshal/sheriff; they schedule and execute the eviction.',
  },

  satisfaction_judgment: {
    title: 'Satisfaction of Judgment',
    workflowType: 'landlord_postjudgment',
    statutes: ['CPLR § 5020', 'CPLR § 5021'],
    Pdf: SatisfactionOfJudgment,
    fields: [
      ...COURT_FIELDS,
      { key: 'indexNumber', label: 'Index / L&T number' },
      { key: 'creditorName', label: 'Judgment creditor (who was owed the money)' },
      { key: 'creditorAddress', label: 'Judgment creditor address' },
      { key: 'debtorName', label: 'Judgment debtor (who owed the money)' },
      { key: 'premisesAddress', label: 'Premises address' },
      { key: 'judgmentDate', label: 'Date the money judgment was entered', type: 'date' },
      { key: 'amount', label: 'Judgment amount ($)', type: 'number', placeholder: '0' },
      { key: 'satisfactionType', label: 'Full or partial payment?', type: 'select',
        options: [{ value: 'full', label: 'Fully paid (full satisfaction)' }, { value: 'partial', label: 'Partly paid (partial satisfaction)' }] },
      { key: 'paidAmount', label: 'Amount paid ($) — partial only', type: 'number', placeholder: '0' },
      { key: 'signerName', label: 'Who is signing' },
      { key: 'signerRole', label: 'Signing as the', type: 'select',
        options: ['Judgment Creditor', 'Attorney for Judgment Creditor'] },
      { key: 'satDate', label: 'Date you are signing', type: 'date' },
    ],
    defaults: (p) => {
      const c = deriveCourt(p);
      return { courtName: c.courtName, county: c.county, indexNumber: p.court_index_number || '',
        creditorName: p.landlord_name || p.full_name || '', creditorAddress: fullAddress(p),
        debtorName: '', premisesAddress: fullAddress(p), judgmentDate: '', amount: '',
        satisfactionType: 'full', paidAmount: '',
        signerName: p.landlord_name || p.full_name || '', signerRole: 'Judgment Creditor', satDate: '' };
    },
    derive: (v) => v, dateInfo: () => null,
    serviceInstructions: [
      'Sign in front of a notary (the acknowledgment must be completed).',
      'File the original with the clerk of the court that entered the judgment so it is marked satisfied.',
      'Give the judgment debtor a copy for their records.',
    ],
    nextSteps: 'Notarize and file with the court clerk so the judgment is marked satisfied of record.',
  },
};

export function getDocConfig(docType) {
  return DOCUMENTS[docType] || null;
}
