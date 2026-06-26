// County / court directory data.
//
// HONESTY NOTE: court locations, hours, and procedures change. The addresses
// below are the long-standing NYC Civil Court (Housing Part) locations, but they
// MUST be confirmed against the official court website before relying on them.
// Outside NYC, the correct court depends on the municipality — we point users to
// the official locator rather than guessing among hundreds of local courts.

export const OFFICIAL_LINKS = {
  nycHousing: 'https://www.nycourts.gov/courts/nyc/housing/',
  courtLocator: 'https://www.nycourts.gov/courts/',
  courtHelp: 'https://www.nycourts.gov/courthelp/',
};

// NYC Housing Court (Civil Court — Housing Part), by borough/county.
export const NYC_HOUSING_COURTS = [
  { borough: 'Bronx', county: 'Bronx', address: '1118 Grand Concourse, Bronx, NY 10456' },
  { borough: 'Brooklyn', county: 'Kings', address: '141 Livingston Street, Brooklyn, NY 11201' },
  { borough: 'Manhattan', county: 'New York', address: '111 Centre Street, New York, NY 10013' },
  { borough: 'Queens', county: 'Queens', address: '89-17 Sutphin Boulevard, Jamaica, NY 11435' },
  { borough: 'Staten Island', county: 'Richmond', address: '927 Castleton Avenue, Staten Island, NY 10310' },
];

// Outside NYC, landlord-tenant matters are heard in District, City, Town, or
// Village courts depending on where the property is located.
export const OUTSIDE_NYC_GUIDANCE = {
  intro:
    'Outside New York City, landlord-tenant cases are usually heard in the local ' +
    'District Court, City Court, Town Court, or Village Court for the municipality ' +
    'where the property is located — not a single county-wide housing court.',
  howToFind:
    'Use the official New York State court locator to find the correct court and ' +
    'clerk for your town, village, or city, then confirm its filing procedures and hours.',
  examplesByRegion: [
    { region: 'Nassau & Suffolk (Long Island)', note: 'District Courts handle most L&T matters.' },
    { region: 'Cities (e.g., Yonkers, Buffalo, Rochester, Albany)', note: 'City Court, landlord-tenant part.' },
    { region: 'Towns & villages', note: 'Town or Village Justice Court for that municipality.' },
  ],
};
