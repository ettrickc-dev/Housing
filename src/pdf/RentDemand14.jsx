import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// 14-Day Rent Demand (predicate notice for a nonpayment proceeding).
// Self-help template — wording is plain and the statute footer flags that
// citations must be verified as current before filing.
export default function RentDemand14({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    tenantNames = '____________________',
    premisesAddress = '____________________',
    landlordName = '____________________',
    landlordAddress = '____________________',
    servedByAgent = false,
    arrearsTotal = 0,
    rentPeriods = '____________________',
    monthlyRent = 0,
    demandDate,
    expiresDate,
  } = data;

  return (
    <Document title="14-Day Rent Demand">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <Text style={styles.h1}>FOURTEEN (14) DAY NOTICE / RENT DEMAND</Text>
        <Text style={[styles.center, styles.small, styles.para]}>
          Notice to pay rent or surrender possession — RPAPL § 711(2)
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>TO: </Text>
          {tenantNames}, Tenant(s) / Occupant(s)
        </Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>PREMISES: </Text>
          {premisesAddress}
        </Text>

        <View style={styles.hr} />

        <Text style={styles.para}>
          PLEASE TAKE NOTICE that you are justly indebted to the landlord/owner for
          rent due and owing for the premises you occupy, in the total amount of{' '}
          <Text style={styles.bold}>{fmtMoney(arrearsTotal)}</Text>, for the following
          rental period(s): {rentPeriods}
          {monthlyRent ? `, at the monthly rent of ${fmtMoney(monthlyRent)}.` : '.'}
        </Text>

        <Text style={styles.para}>
          PLEASE TAKE FURTHER NOTICE that demand is hereby made that you pay the total
          amount due within <Text style={styles.bold}>fourteen (14) days</Text> after
          service of this notice upon you, or that you surrender possession of the
          premises to the landlord/owner.
        </Text>

        <Text style={styles.para}>
          The 14-day period, calculated from the date of service shown below, is
          presently estimated to expire on{' '}
          <Text style={styles.bold}>{fmtDate(expiresDate)}</Text>. If you fail to pay
          the amount demanded or surrender possession within that period, the
          landlord/owner may commence a summary nonpayment proceeding against you to
          recover possession of the premises and a judgment for the amount due,
          together with any costs allowed by law.
        </Text>

        <Text style={styles.para}>
          Payment should be made or arranged with the landlord/owner identified below.
        </Text>

        <Text style={[styles.para, styles.small]}>
          Date of this notice: {fmtDate(demandDate)}
        </Text>

        <View style={styles.sigLine}>
          <Text>{landlordName}</Text>
          <Text style={styles.small}>
            {servedByAgent ? 'Agent for Landlord/Owner' : 'Landlord/Owner'}
          </Text>
          <Text style={styles.small}>{landlordAddress}</Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>
      {instructions && (
        <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />
      )}
    </Document>
  );
}
