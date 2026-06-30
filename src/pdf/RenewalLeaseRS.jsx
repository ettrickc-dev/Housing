import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Owner's offer of a rent-stabilized renewal lease (DHCR RTP-8 style). The owner
// enters the applicable Rent Guidelines Board percentages (they change yearly and
// by RGB order), and we compute the 1- and 2-year offered rents.
export default function RenewalLeaseRS({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    ownerName = '____________',
    ownerAddress = '____________',
    tenantNames = '____________',
    apartment = '',
    premisesAddress = '____________',
    currentLegalRent = 0,
    currentLeaseExpiry,
    oneYearPct = 0,
    twoYearPct = 0,
    guidelinesOrderRef = '',
    offerDate,
  } = data;

  const base = Number(currentLegalRent || 0);
  const oneYr = base * (1 + Number(oneYearPct || 0) / 100);
  const twoYr = base * (1 + Number(twoYearPct || 0) / 100);
  const where = premisesAddress + (apartment ? `, Apartment ${apartment}` : '');

  return (
    <Document title="Rent-Stabilized Renewal Lease Offer">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Text style={[styles.bold, styles.center]}>RENEWAL LEASE OFFER</Text>
        <Text style={[styles.center, styles.small]}>
          Rent-Stabilized Apartment — Owner's Offer to Renew (RTP-8)
        </Text>

        <Text style={[styles.small, styles.para]}>Date of offer: {fmtDate(offerDate)}</Text>
        <Text style={styles.small}>To (Tenant): {tenantNames}</Text>
        <Text style={styles.small}>Apartment: {where}</Text>
        <Text style={styles.small}>From (Owner): {ownerName}, {ownerAddress}</Text>

        <Text style={styles.para}>
          Your present lease expires on {fmtDate(currentLeaseExpiry)}. As required by the Rent
          Stabilization Law, the Owner offers to renew your lease on the same terms and
          conditions as your current lease, except for the lawful rent increase shown below.
          Your current legal regulated rent is {fmtMoney(base)} per month.
        </Text>

        <Text style={[styles.bold, styles.para]}>Choose ONE renewal term:</Text>
        <View style={[styles.juratBox, { marginTop: 4 }]}>
          <Text style={styles.small}>
            ☐ ONE-YEAR renewal — Guidelines increase {oneYearPct}% → new legal rent{' '}
            {fmtMoney(oneYr)} per month.
          </Text>
          <Text style={[styles.small, { marginTop: 6 }]}>
            ☐ TWO-YEAR renewal — Guidelines increase {twoYearPct}% → new legal rent{' '}
            {fmtMoney(twoYr)} per month.
          </Text>
          <Text style={[styles.small, { marginTop: 6 }]}>
            Applicable Rent Guidelines Board order: {guidelinesOrderRef || '____________'}.
          </Text>
        </View>

        <Text style={[styles.small, styles.para]}>
          You have <Text style={styles.bold}>60 days</Text> from the date this offer is served
          to choose a term and return one signed copy to the Owner. The renewal lease will
          begin no earlier than 90 days after the date this offer is served (or at the
          expiration of your current lease, whichever is later). If you do not respond, the
          Owner may decline to renew and may begin a proceeding after the lease expires.
        </Text>
        <Text style={[styles.small, styles.para]}>
          The Owner must attach the DHCR Rent Stabilization Lease Rider (Form RA-LR1) to this
          renewal. This offer must be made on the official DHCR Renewal Lease Form (RTP-8);
          use this document to prepare and double-check your figures.
        </Text>

        <View style={[styles.captionRow, { marginTop: 18 }]}>
          <Text style={styles.small}>
            ______________________________{'\n'}{ownerName}{'\n'}Owner / Agent{'   '}Date: ________
          </Text>
          <Text style={styles.small}>
            Tenant selection — term chosen: ☐ 1 year ☐ 2 years{'\n\n'}
            ______________________________{'\n'}{tenantNames}{'\n'}Tenant{'   '}Date: ________
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
