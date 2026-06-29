import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Demand for a trial by jury in a summary proceeding.
export default function JuryDemand({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    demandedByName = '____________',
    demandedByRole = 'Respondent',
    demandDate,
  } = data;

  return (
    <Document title="Jury Demand">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={{ courtName, county, indexNumber, petitionerName, respondentNames, premisesAddress, fictitiousNames: false }}
          docLabel="DEMAND FOR"
          proceedingType="TRIAL BY JURY"
        />

        <Text style={styles.para}>
          {demandedByName}, the {demandedByRole} in this proceeding, hereby demands a
          trial by jury of all issues in this proceeding that are triable of right by a
          jury.
        </Text>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(demandDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{demandedByName}</Text>
          <Text style={styles.small}>{demandedByRole}</Text>
        </View>

        <View style={[styles.juratBox, { marginTop: 18 }]}>
          <Text style={styles.small}>
            Note: A jury demand usually must be filed with your answer and may require a
            jury fee. Some leases contain a jury-trial waiver, and some claims are not
            triable by jury. Confirm the current rules and any fee with the court clerk
            before relying on this.
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>
      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
