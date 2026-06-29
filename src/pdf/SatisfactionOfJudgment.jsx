import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Satisfaction of Judgment (CPLR §§ 5020, 5021) — filed by the judgment creditor
// once a money judgment is paid, directing the clerk to mark it satisfied.
export default function SatisfactionOfJudgment({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    creditorName = '____________',
    creditorAddress = '____________',
    debtorName = '____________',
    premisesAddress = '____________',
    judgmentDate,
    amount = 0,
    satisfactionType = 'full',
    paidAmount = 0,
    signerName = '____________',
    signerRole = 'Judgment Creditor',
    satDate,
  } = data;

  const partial = satisfactionType === 'partial';
  const captionData = {
    courtName, county, indexNumber,
    petitionerName: creditorName, petitionerAddress: creditorAddress,
    respondentNames: debtorName, premisesAddress, fictitiousNames: false,
  };

  return (
    <Document title="Satisfaction of Judgment">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={captionData}
          docLabel={partial ? 'PARTIAL SATISFACTION' : 'SATISFACTION OF JUDGMENT'}
          proceedingType="(CPLR §§ 5020, 5021)"
          petitionerLabel="Petitioner / Judgment Creditor,"
          respondentLabel="Respondent / Judgment Debtor,"
        />

        <Numbered n={1}>
          A money judgment was entered in this proceeding on {fmtDate(judgmentDate)} in favor
          of {creditorName} (Judgment Creditor) and against {debtorName} (Judgment Debtor) in
          the amount of {fmtMoney(amount)}.
        </Numbered>
        {partial ? (
          <Numbered n={2}>
            The Judgment Creditor acknowledges receipt of {fmtMoney(paidAmount)} in partial
            payment of the judgment and consents to the entry of a partial satisfaction in
            that amount.
          </Numbered>
        ) : (
          <Numbered n={2}>
            The judgment has been fully paid and satisfied. The Judgment Creditor
            acknowledges full payment.
          </Numbered>
        )}
        <Numbered n={3}>
          The Judgment Creditor authorizes and directs the Clerk to enter
          {partial ? ' a partial satisfaction' : ' satisfaction'} of the judgment of record,
          under CPLR §§ 5020 and 5021.
        </Numbered>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(satDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{signerName}</Text>
          <Text style={styles.small}>{signerRole}</Text>
        </View>

        <View style={styles.juratBox}>
          <Text style={styles.bold}>ACKNOWLEDGMENT</Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            STATE OF NEW YORK, COUNTY OF {county} ss.:
          </Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            On the ____ day of __________, 20____, before me, the undersigned, personally
            appeared {signerName}, personally known to me or proved to me on the basis of
            satisfactory evidence to be the individual whose name is subscribed to the within
            instrument, and acknowledged that he/she executed the same.
          </Text>
          <Text style={[styles.small, { marginTop: 16 }]}>
            ______________________________{'\n'}Notary Public
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
