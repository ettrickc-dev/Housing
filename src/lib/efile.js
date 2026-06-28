// Content for the "file your case online (NYSCEF)" walkthrough — the key reason
// to use this over the court's in-person DIY tool. Verified against NYS Courts
// guidance: NYC Civil Court L&T cases are MANDATORY e-filing citywide as of
// Feb 23, 2026. Outside NYC (e.g., Nassau/Suffolk District Courts), L&T is filed
// on paper. Always confirm the current process for your court.

export const NYSCEF_URL = 'https://iapps.courts.state.ny.us/nyscef/HomePage';
export const NYSCEF_UNREPRESENTED =
  'https://www.nycourts.gov/courthelp/goingtocourt/efiling.shtml';

export const WHY_EFILE = [
  'File from home, 24/7 — no traveling to the courthouse and no waiting in line for hours.',
  'No coming back a second time. In person you often have to file the Notice of Petition and Petition, then return; online you upload them together in one sitting.',
  'You get an immediate electronic record and index number confirmation.',
  'In NYC, landlord-tenant cases are now e-filed through NYSCEF — this is how cases are filed.',
];

// Step-by-step for NYC (mandatory e-filing).
export const NYC_STEPS = [
  {
    h: 'Create your free NYSCEF account',
    b: 'Go to the NYSCEF site and sign up (or log in). You do NOT need a lawyer — choose the unrepresented/self-represented option.',
  },
  {
    h: 'Start a new case',
    b: 'Select “Commence (start) a new case,” then choose Civil Court → Housing Part → your county (borough), and the case type: Landlord-Tenant Nonpayment or Holdover.',
  },
  {
    h: 'Upload your documents together',
    b: 'Upload the Notice of Petition AND the Petition together (they must be filed together to start the case), plus your predicate notice (e.g., 14-day demand or termination notice) and its affidavit/proof of service as exhibits. Use the clean, filing-ready PDFs you generated here.',
  },
  {
    h: 'Pay the filing fee (or ask for a waiver)',
    b: 'Pay the index/filing fee by card. If you cannot afford it, you can file a fee-waiver (Poor Person) application instead. After payment, the system assigns your index number.',
  },
  {
    h: 'Get your index number, then serve',
    b: 'Save the index number and the filing confirmation. The court will process the case and (for holdovers) set a return date. You then must have the papers served on the tenant and file the Affidavit of Service — which you can also prepare here.',
  },
];

// Outside NYC — generally paper filing.
export const OUTSIDE_STEPS = [
  {
    h: 'Find your court',
    b: 'Outside New York City, landlord-tenant cases are usually filed at your local City, District, Town, or Village Court — most are NOT on NYSCEF and are filed on paper.',
  },
  {
    h: 'Bring your documents to the clerk',
    b: 'Bring the Notice of Petition and Petition (filed together), plus the predicate notice and proof of service, to the court clerk. Ask the clerk for the exact filing steps and fee for your court.',
  },
  {
    h: 'Pay the fee and get your index number',
    b: 'Pay the filing fee (or ask about a fee waiver). The clerk assigns your index number and tells you the next steps for service and your court date.',
  },
];
