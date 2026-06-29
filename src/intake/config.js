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
  { value: 'rent_stabilized', label: 'Rent Stabilized',
    blurb: 'Rent is regulated by the government. Increases are capped each year and the ' +
      'tenant usually has the right to renew the lease. Common in many NYC apartments.' },
  { value: 'rent_controlled', label: 'Rent Controlled',
    blurb: 'An older, stricter form of rent regulation for tenants (or their family) who ' +
      'have lived there continuously since around 1971. Fairly rare today.' },
  { value: 'market_rate', label: 'Market Rate / Unregulated',
    blurb: 'A regular private rental with no rent regulation — the rent is whatever the ' +
      'lease says. Most apartments outside NYC, and many newer NYC buildings, are like this. ' +
      'If your rent is not government-controlled and there are no special rules, pick this.' },
  { value: 'nycha', label: 'NYCHA / Public Housing',
    blurb: 'Government-owned or subsidized public housing (e.g., NYCHA). Special rules and ' +
      'procedures apply.' },
  { value: 'good_cause', label: 'Good Cause Eviction coverage',
    explainer: true,
    blurb: 'A 2024 law that limits evictions and big rent increases for many ' +
      'unregulated tenants — but only where it is in effect, with exceptions. ' +
      'Not sure if it applies? Use the coverage checker.' },
  { value: 'not_sure', label: "Not sure / I don't know",
    blurb: "That's okay — most people aren't sure. Pick this and we'll keep things general; " +
      'you can change it later in your profile.' },
];

// Role-specific menus. Each category has a plain-English `plainTitle` (what the
// user sees) plus the formal `group` name (small, for reference) and `help`.
export const NEEDS = {
  landlord: [
    {
      plainTitle: 'Send a required notice before court',
      group: 'Pre-court notices (predicate notices)',
      help: 'Before you can start an eviction case, the law usually requires you to give the tenant a written notice first.',
      items: [
        { key: 'rent_demand_14day', label: 'Demand unpaid rent (14-day notice)', ready: true },
        { key: 'notice_cure_10day', label: 'Tell a tenant to fix a lease problem (10-day notice)', ready: true },
        { key: 'notice_termination', label: 'Tell a tenant to move out (30/60/90-day notice)', ready: true },
        { key: 'notice_nonrenewal_rs', label: "Don't renew a rent-stabilized lease" },
      ],
    },
    {
      plainTitle: 'Start a case in housing court',
      group: 'Court petitions',
      help: 'The papers that open your eviction case and ask the court for possession (and any money owed).',
      items: [
        { key: 'nonpayment_petition', label: 'Take a tenant to court for unpaid rent (nonpayment case)', ready: true },
        { key: 'holdover_petition', label: 'Take a tenant to court to remove them (holdover case)', ready: true },
      ],
    },
    {
      plainTitle: 'Prove you delivered the papers',
      group: 'Affidavits & service',
      help: 'After you give a notice or court papers, the court needs proof of how and when they were delivered.',
      items: [
        { key: 'affidavit_of_service', label: 'Prove I delivered the papers (affidavit of service)', ready: true },
        { key: 'affidavit_due_diligence', label: 'Show I tried hard to find the tenant (due diligence)' },
        { key: 'military_affidavit', label: 'State whether the tenant is in the military (required affidavit)' },
      ],
    },
  ],
  tenant: [
    {
      plainTitle: 'Respond to a case against me',
      group: 'Responding to a case',
      help: 'Your landlord started a case. File your answer and raise any defenses you have.',
      items: [
        { key: 'answer_nonpayment', label: 'Answer a case about unpaid rent (with my defenses)', ready: true },
        { key: 'answer_holdover', label: 'Answer a case to remove me (with my defenses)', ready: true },
        { key: 'jury_demand', label: 'Ask for a jury trial', ready: true },
        { key: 'fee_waiver', label: "Ask the court to waive fees (I can't afford them)", ready: true },
      ],
    },
    {
      plainTitle: 'Get urgent help to stop or undo an eviction',
      group: 'Emergency relief',
      help: "For example, to undo a decision the court made when you weren't there, or to pause an eviction.",
      items: [
        { key: 'osc_vacate_default', label: 'Undo a decision the court made without me', ready: true },
        { key: 'osc_stay_warrant', label: 'Ask the court to pause my eviction', ready: true },
      ],
    },
    {
      plainTitle: 'Start my own case against my landlord',
      group: 'Starting a case',
      help: 'Bring your landlord to court — for repairs, or to get back in after an illegal lockout.',
      items: [
        { key: 'hp_action_repairs', label: 'Make my landlord do repairs (HP case)' },
        { key: 'illegal_lockout', label: 'Get back in after an illegal lockout' },
      ],
    },
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
