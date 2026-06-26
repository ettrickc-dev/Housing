// =====================================================================
// Intake wizard configuration: the role -> location -> housing -> need tree.
// Document `key` values must match doc_type used in documents + seed.sql.
// `ready: true` means a generator exists; otherwise we show "coming soon".
// =====================================================================

export const ROLES = [
  { value: 'landlord', label: 'I am a LANDLORD / PROPERTY OWNER',
    blurb: 'Rent demands, holdover notices, petitions, affidavits, motions.' },
  { value: 'tenant', label: 'I am a TENANT / OCCUPANT',
    blurb: 'Answers, defenses, orders to show cause, repair (HP) actions.' },
];

export const LOCATIONS = [
  { value: 'nyc', label: 'New York City (five boroughs)',
    blurb: 'NYC Housing Court (Civil Court — Housing Part).' },
  { value: 'outside_nyc', label: 'Outside NYC',
    blurb: 'District, City, Town, or Village Court depending on your county.' },
];

export const HOUSING_TYPES = [
  { value: 'rent_stabilized', label: 'Rent Stabilized' },
  { value: 'rent_controlled', label: 'Rent Controlled' },
  { value: 'market_rate', label: 'Market Rate / Unregulated' },
  { value: 'nycha', label: 'NYCHA / Public Housing' },
  { value: 'good_cause', label: 'Good Cause Eviction coverage',
    explainer: true,
    blurb: 'A 2024 law that limits evictions and rent increases for many ' +
      'unregulated tenants — but with local opt-outs. Coverage is fact-specific.' },
  { value: 'not_sure', label: 'Not sure',
    blurb: "We'll help you figure it out — your housing type changes which forms apply." },
];

// Role-specific "what do you need to do?" menus. Only the MVP docs are ready.
export const NEEDS = {
  landlord: [
    { group: 'Pre-court notices (predicate notices)', items: [
      { key: 'rent_demand_14day', label: '14-Day Rent Demand (nonpayment)', ready: true,
        statute: 'RPAPL § 711(2)' },
      { key: 'notice_cure_10day', label: '10-Day Notice to Cure (lease violation)', ready: true,
        statute: 'RPAPL § 753' },
      { key: 'notice_termination', label: 'Notice of Termination (30/60/90-day)', ready: true,
        statute: 'RPL § 226-c' },
      { key: 'notice_nonrenewal_rs', label: 'Notice of Non-Renewal (rent stabilized)' },
    ]},
    { group: 'Court petitions', items: [
      { key: 'nonpayment_petition', label: 'Nonpayment Petition + Notice of Petition', ready: true,
        statute: 'RPAPL § 711' },
      { key: 'holdover_petition', label: 'Holdover Petition + Notice of Petition', ready: true,
        statute: 'RPAPL § 711' },
    ]},
    { group: 'Affidavits & service', items: [
      { key: 'affidavit_of_service', label: 'Affidavit of Service', ready: true,
        statute: 'RPAPL § 735' },
      { key: 'affidavit_due_diligence', label: 'Affidavit of Due Diligence' },
      { key: 'military_affidavit', label: 'Military Service Affidavit (SCRA)' },
    ]},
  ],
  tenant: [
    { group: 'Responding to a case', items: [
      { key: 'answer_nonpayment', label: 'Written Answer — Nonpayment (with defenses)', ready: true,
        statute: 'RPL § 235-b' },
      { key: 'answer_holdover', label: 'Written Answer — Holdover (with defenses)', ready: true,
        statute: 'RPAPL § 711' },
      { key: 'jury_demand', label: 'Jury Demand' },
    ]},
    { group: 'Emergency relief', items: [
      { key: 'osc_vacate_default', label: 'OSC to Vacate Default Judgment', ready: true,
        statute: 'CPLR § 5015' },
      { key: 'osc_stay_warrant', label: 'OSC to Stay Execution of Warrant' },
    ]},
    { group: 'Starting a case', items: [
      { key: 'hp_action_repairs', label: 'HP Action — Petition for Repairs' },
      { key: 'illegal_lockout', label: 'Illegal Lockout Petition + OSC (emergency)' },
    ]},
  ],
};

// Plain-language Good Cause coverage checker. Results are guidance, not advice.
export const GOOD_CAUSE_QUESTIONS = [
  { key: 'unregulated', q: 'Is your apartment market-rate (NOT rent stabilized/controlled or public housing)?',
    coversIfNo: 'Good Cause generally does not apply to already-regulated or public housing — different rules cover you.' },
  { key: 'localOptIn', q: 'Are you in NYC or a locality that has opted IN to Good Cause?',
    coversIfNo: 'Good Cause only applies where the state law is in effect or a locality opted in. Many localities opted out.' },
  { key: 'smallLandlordExempt', q: 'Does your landlord own MORE than the small-landlord exemption threshold of units?',
    coversIfNo: 'Small landlords below the unit threshold are typically exempt.' },
];
