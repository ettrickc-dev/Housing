import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Preparation worksheet for an owner's DHCR annual rent registration. This is NOT
// the official filing — the annual registration must be filed on DHCR's forms
// (RR-1 / RR-2A) through DHCR's online ARRO system. This organizes the data.
const STATUS_LABEL = {
  rent_stabilized: 'Rent Stabilized',
  rent_controlled: 'Rent Controlled',
  exempt: 'Exempt / Other',
};

function Row({ label, value }) {
  return (
    <View style={[styles.captionRow, { marginTop: 3 }]}>
      <Text style={[styles.small, { width: 200 }]}>{label}</Text>
      <Text style={[styles.small, { flex: 1 }]}>{value || '____________'}</Text>
    </View>
  );
}

export default function DhcrRegistrationWorksheet({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    ownerName = '',
    ownerAddress = '',
    buildingAddress = '',
    numUnits = '',
    registrationYear = '',
    apartment = '',
    tenantName = '',
    status = 'rent_stabilized',
    legalRegRent = 0,
    actualRent = 0,
    prefRent = '',
    leaseStart,
    leaseEnd,
    worksheetDate,
  } = data;

  return (
    <Document title="DHCR Annual Registration Worksheet">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Text style={[styles.bold, styles.center]}>DHCR ANNUAL REGISTRATION — WORKSHEET</Text>
        <Text style={[styles.center, styles.small]}>
          Preparation aid for the owner's annual rent registration
        </Text>

        <View style={[styles.juratBox, { borderColor: '#1a2b4a' }]}>
          <Text style={styles.small}>
            <Text style={styles.bold}>This is not the official filing.</Text> Owners of
            rent-stabilized (and ETPA) units must file the annual registration with DHCR on its
            forms — the Registration Summary (RR-1) and Apartment Registration (RR-2A) — through
            DHCR's online <Text style={styles.bold}>ARRO / Annual Registration</Text> system.
            Use this worksheet to gather and double-check your figures before you file.
          </Text>
        </View>

        <Text style={[styles.bold, styles.para]}>Owner / Building</Text>
        <Row label="Owner name" value={ownerName} />
        <Row label="Owner mailing address" value={ownerAddress} />
        <Row label="Building address" value={buildingAddress} />
        <Row label="Number of units in building" value={String(numUnits || '')} />
        <Row label="Registration year" value={String(registrationYear || '')} />

        <Text style={[styles.bold, styles.para]}>Apartment registration</Text>
        <Row label="Apartment / unit" value={apartment} />
        <Row label="Tenant of record" value={tenantName} />
        <Row label="Regulatory status" value={STATUS_LABEL[status] || status} />
        <Row label="Legal regulated rent (monthly)" value={fmtMoney(legalRegRent)} />
        <Row label="Actual rent charged (monthly)" value={fmtMoney(actualRent)} />
        <Row label="Preferential rent (if any)" value={prefRent ? fmtMoney(prefRent) : 'None'} />
        <Row label="Lease start" value={fmtDate(leaseStart)} />
        <Row label="Lease end" value={fmtDate(leaseEnd)} />

        <Text style={[styles.small, styles.para]}>
          Worksheet prepared: {fmtDate(worksheetDate)}. Repeat the apartment section for each
          regulated unit in the building. After completing this worksheet, log in to DHCR's
          online registration system to file the official RR-1 and RR-2A and serve the tenant
          copy as required.
        </Text>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
