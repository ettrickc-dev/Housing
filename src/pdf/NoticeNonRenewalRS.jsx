import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Notice of Intention Not to Renew a rent-stabilized lease ("Golub notice"). Must
// be served in the 90–150 day window before the lease expires, and only on a
// ground permitted by the Rent Stabilization Code. Strong caveats included.
const GROUND_TEXT = {
  owner_use: 'the Owner seeks to recover the apartment in good faith for the personal use and occupancy of the Owner or the Owner’s immediate family as a primary residence',
  demolition: 'the Owner intends to demolish the building (subject to DHCR approval)',
  other: 'the ground stated below',
};

export default function NoticeNonRenewalRS({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    ownerName = '____________',
    ownerAddress = '____________',
    tenantNames = '____________',
    apartment = '',
    premisesAddress = '____________',
    leaseExpiry,
    ground = 'owner_use',
    groundDetail = '',
    noticeDate,
  } = data;

  const where = premisesAddress + (apartment ? `, Apartment ${apartment}` : '');
  const groundText = GROUND_TEXT[ground] || GROUND_TEXT.other;

  return (
    <Document title="Notice of Non-Renewal (Rent-Stabilized)">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Text style={[styles.bold, styles.center]}>
          NOTICE OF INTENTION NOT TO RENEW LEASE
        </Text>
        <Text style={[styles.center, styles.small]}>
          Rent-Stabilized Apartment (Rent Stabilization Code)
        </Text>

        <Text style={[styles.small, styles.para]}>Date: {fmtDate(noticeDate)}</Text>
        <Text style={styles.small}>To (Tenant): {tenantNames}</Text>
        <Text style={styles.small}>Apartment: {where}</Text>
        <Text style={styles.small}>From (Owner): {ownerName}, {ownerAddress}</Text>

        <Text style={styles.para}>
          PLEASE TAKE NOTICE that the Owner will <Text style={styles.bold}>not</Text> offer you
          a renewal of your rent-stabilized lease, which expires on {fmtDate(leaseExpiry)}, on
          the following ground: {groundText}.
        </Text>
        {(ground === 'other' || groundDetail) && (
          <Text style={styles.para}>Details of the ground: {groundDetail || '____________'}.</Text>
        )}
        <Text style={styles.para}>
          PLEASE TAKE FURTHER NOTICE that, unless you vacate and surrender the apartment by the
          expiration of your lease, the Owner intends to commence a holdover summary proceeding
          to recover possession after the lease expires, and will rely on this notice as a
          predicate to that proceeding.
        </Text>

        <View style={[styles.juratBox, { borderColor: '#1a2b4a' }]}>
          <Text style={styles.bold}>IMPORTANT — strict timing &amp; grounds</Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            For a rent-stabilized apartment, this notice generally must be served during the
            window of <Text style={styles.bold}>at least 90 and not more than 150 days</Text>{' '}
            before the lease expires. Non-renewal is allowed only on specific grounds under the
            Rent Stabilization Code, and some grounds (such as demolition) require DHCR
            approval before you proceed. Confirm the current requirements and your service
            window before relying on this notice.
          </Text>
        </View>

        <View style={styles.sigLine}>
          <Text>{ownerName}</Text>
          <Text style={styles.small}>Owner / Agent</Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
