import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Nonpayment Petition + Notice of Petition (summary proceeding).
// Court caption is chosen from the user's location (NYC vs outside).
export default function NonpaymentPetition({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________________',
    indexNumber = '',
    petitionerName = '____________________',
    petitionerAddress = '____________________',
    respondentNames = '____________________',
    premisesAddress = '____________________',
    regulatoryStatus = 'not specified',
    arrearsTotal = 0,
    rentPeriods = '____________________',
    monthlyRent = 0,
    demandServedDate,
    demandMethod = '____________________',
    petitionDate,
  } = data;

  return (
    <Document title="Nonpayment Petition">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        {/* Caption */}
        <View style={styles.captionWrap}>
          <Text style={[styles.bold, styles.center]}>{courtName}</Text>
          <Text style={[styles.center, styles.small]}>COUNTY OF {county}</Text>
          <View style={[styles.captionRow, { marginTop: 6 }]}>
            <View style={{ maxWidth: 280 }}>
              <Text>{petitionerName},</Text>
              <Text style={styles.small}>Petitioner (Landlord/Owner),</Text>
              <Text style={[styles.small, { marginVertical: 4 }]}>-against-</Text>
              <Text>{respondentNames},</Text>
              <Text style={styles.small}>Respondent(s) (Tenant/Occupant).</Text>
            </View>
            <View style={styles.indexBox}>
              <Text style={styles.small}>Index / L&amp;T No.</Text>
              <Text style={styles.bold}>{indexNumber || '____________'}</Text>
              <Text style={[styles.small, { marginTop: 6 }]}>NONPAYMENT</Text>
              <Text style={styles.small}>PETITION</Text>
            </View>
          </View>
        </View>

        <Text style={styles.para}>
          The petition of the above-named Petitioner respectfully shows and alleges:
        </Text>

        <Numbered n={1}>
          Petitioner is the landlord/owner of the premises located at {premisesAddress}{' '}
          (the “Premises”) and is authorized to bring this proceeding.
        </Numbered>
        <Numbered n={2}>
          Respondent(s) entered into possession of the Premises as tenant(s)/occupant(s)
          and remain in possession.
        </Numbered>
        <Numbered n={3}>
          The regulatory status of the Premises is: {regulatoryStatus}.
        </Numbered>
        <Numbered n={4}>
          Respondent(s) have defaulted in the payment of rent. There is now due and
          owing the sum of <Text style={styles.bold}>{fmtMoney(arrearsTotal)}</Text> for
          the period(s): {rentPeriods}
          {monthlyRent ? `, at the monthly rent of ${fmtMoney(monthlyRent)}.` : '.'}
        </Numbered>
        <Numbered n={5}>
          A written fourteen (14) day rent demand was served upon Respondent(s) on or
          about {fmtDate(demandServedDate)} by the following method: {demandMethod}.
          Respondent(s) failed to pay the amount demanded or to surrender possession.
        </Numbered>

        <Text style={[styles.para, styles.bold, { marginTop: 8 }]}>
          WHEREFORE, Petitioner demands a final judgment:
        </Text>
        <Text style={styles.para}>
          (a) awarding possession of the Premises to Petitioner and the issuance of a
          warrant to remove Respondent(s); (b) for a money judgment in the amount of{' '}
          {fmtMoney(arrearsTotal)} plus rent accruing; and (c) for such other relief as
          the Court deems just, together with the costs and disbursements of this
          proceeding.
        </Text>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(petitionDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{petitionerName}</Text>
          <Text style={styles.small}>Petitioner</Text>
          <Text style={styles.small}>{petitionerAddress}</Text>
        </View>

        {/* Verification / jurat */}
        <View style={styles.juratBox}>
          <Text style={styles.bold}>VERIFICATION</Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            STATE OF NEW YORK, COUNTY OF {county} ss.:
          </Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            The undersigned, being duly sworn, deposes and says that deponent is the
            Petitioner herein; that deponent has read the foregoing petition and knows
            the contents thereof; and that the same is true to deponent’s own knowledge,
            except as to matters stated to be alleged on information and belief, and as
            to those matters deponent believes them to be true.
          </Text>
          <View style={[styles.captionRow, { marginTop: 22 }]}>
            <Text style={styles.small}>
              Sworn to before me this ____ day of __________, 20____{'\n\n'}
              ______________________________ (Notary Public)
            </Text>
            <Text style={styles.small}>
              ______________________________{'\n'}
              {petitionerName} (Petitioner)
            </Text>
          </View>
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

function Numbered({ n, children }) {
  return (
    <View style={[styles.para, { flexDirection: 'row' }]}>
      <Text style={[styles.bold, { width: 18 }]}>{n}.</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
}
