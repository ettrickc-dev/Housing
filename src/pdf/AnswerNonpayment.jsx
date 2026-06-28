import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Verification } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Written Answer to a Nonpayment Petition, with selected affirmative defenses.
// `data.defenseList` is an array of { title, body } produced by the registry.
export default function AnswerNonpayment({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________________',
    indexNumber = '',
    petitionerName = '____________________',
    respondentNames = '____________________',
    premisesAddress = '____________________',
    defenseList = [],
    habitabilityDetails = '',
    answerDate,
  } = data;

  return (
    <Document title="Answer — Nonpayment">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <Caption
          data={{ courtName, county, indexNumber, petitionerName, respondentNames, premisesAddress, fictitiousNames: false }}
          docLabel="ANSWER"
          proceedingType="Nonpayment"
        />

        <Text style={styles.para}>
          Respondent {respondentNames}, in answer to the petition concerning the
          premises at {premisesAddress}, states:
        </Text>

        <Text style={[styles.bold, { marginBottom: 4 }]}>General denial</Text>
        <Text style={styles.para}>
          Respondent denies each and every allegation of the petition except those
          admitted herein, and demands that Petitioner prove the allegations of the
          petition at trial.
        </Text>

        <Text style={[styles.bold, { marginBottom: 4 }]}>Affirmative defenses</Text>
        {defenseList.length === 0 ? (
          <Text style={[styles.para, styles.small]}>
            (No affirmative defenses selected.)
          </Text>
        ) : (
          defenseList.map((d, i) => (
            <View key={i} style={[styles.para, { flexDirection: 'row' }]}>
              <Text style={[styles.bold, { width: 18 }]}>{i + 1}.</Text>
              <Text style={{ flex: 1 }}>
                <Text style={styles.bold}>{d.title}. </Text>
                {d.body}
                {d.title.startsWith('Warranty of habitability') && habitabilityDetails
                  ? ` Specifically: ${habitabilityDetails}`
                  : ''}
              </Text>
            </View>
          ))
        )}

        <Text style={[styles.para, { marginTop: 8 }]}>
          WHEREFORE, Respondent requests that the petition be dismissed, or for such
          other relief as the Court deems just, including an abatement of rent where
          the warranty of habitability has been breached.
        </Text>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(answerDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{respondentNames}</Text>
          <Text style={styles.small}>Respondent (Tenant)</Text>
        </View>

        <Verification county={county} signerName={respondentNames} role="Respondent" docWord="answer" />

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>
      {instructions && (
        <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />
      )}
    </Document>
  );
}
