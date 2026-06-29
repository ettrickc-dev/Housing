import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// So-ordered stipulation of settlement resolving a summary proceeding. Supports a
// payment plan, a move-out, or custom terms. Mutual — signed by both parties.
export default function StipulationSettlement({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    settlementType = 'payment',
    totalAmount = 0,
    payByDate,
    moveOutDate,
    otherTerms = '',
    stipDate,
  } = data;

  const captionData = {
    courtName, county, indexNumber, petitionerName, petitionerAddress,
    respondentNames, premisesAddress, fictitiousNames: false,
  };

  // Build the operative terms based on the settlement type.
  const terms = [];
  if (settlementType === 'payment') {
    terms.push(
      `Respondent agrees to pay Petitioner ${fmtMoney(totalAmount)} on or before ${fmtDate(payByDate)}.`,
      'Upon timely payment of the full amount, this proceeding is settled and any judgment and warrant are vacated; the parties exchange general releases for the matters in this proceeding.',
      'If Respondent fails to pay as agreed, Petitioner may, on Respondent’s default, enter a judgment of possession and a money judgment for the unpaid balance, and the warrant may execute after service of a marshal’s notice as required by law.'
    );
  } else if (settlementType === 'moveout') {
    terms.push(
      `Respondent agrees to vacate and surrender the premises, broom-clean, on or before ${fmtDate(moveOutDate)}.`,
      'A final judgment of possession is awarded to Petitioner; issuance of the warrant is permitted, with execution stayed through the agreed move-out date.',
      'If Respondent timely vacates, Petitioner waives any money judgment for use and occupancy through the move-out date. If Respondent does not vacate, the warrant may execute after service of a marshal’s notice as required by law.'
    );
  } else {
    terms.push('The parties agree to the terms set forth below.');
  }

  return (
    <Document title="Stipulation of Settlement">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption data={captionData} docLabel="STIPULATION" proceedingType="of Settlement (So-Ordered)" />

        <Text style={styles.para}>
          The parties, Petitioner {petitionerName} and Respondent {respondentNames}, having
          appeared and wishing to resolve this proceeding, agree as follows:
        </Text>

        {terms.map((t, i) => (
          <Numbered key={i} n={i + 1}>{t}</Numbered>
        ))}
        {otherTerms ? (
          <Numbered n={terms.length + 1}>Additional terms: {otherTerms}</Numbered>
        ) : null}

        <Numbered n={terms.length + (otherTerms ? 2 : 1)}>
          Each party enters into this stipulation freely and voluntarily, after having had
          the opportunity to read it, ask questions, and seek the advice of an attorney; each
          understands that they are giving up the right to a trial on the issues resolved
          here; and each understands the terms and their consequences.
        </Numbered>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(stipDate)}</Text>

        <View style={[styles.captionRow, { marginTop: 18 }]}>
          <Text style={styles.small}>
            ______________________________{'\n'}{petitionerName}{'\n'}Petitioner
          </Text>
          <Text style={styles.small}>
            ______________________________{'\n'}{respondentNames}{'\n'}Respondent
          </Text>
        </View>

        <View style={[styles.juratBox, { marginTop: 18 }]}>
          <Text style={styles.bold}>SO ORDERED:</Text>
          <Text style={[styles.small, { marginTop: 16 }]}>
            ______________________________{'\n'}Judge / Hearing Officer{'   '}Dated: __________
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes={false} />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
