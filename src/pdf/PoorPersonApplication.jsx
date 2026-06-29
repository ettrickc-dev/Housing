import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Affidavit in support of an application to proceed as a poor person and waive
// court fees (CPLR § 1101).
export default function PoorPersonApplication({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    applicantName = '____________',
    applicantRole = 'Respondent',
    onPublicAssistance = 'no',
    assistanceType = '',
    monthlyIncome = 0,
    dependents = '0',
    reason = '____________',
    appDate,
  } = data;

  return (
    <Document title="Application to Proceed as a Poor Person">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={{ courtName, county, indexNumber, petitionerName, respondentNames, premisesAddress, fictitiousNames: false }}
          docLabel="POOR PERSON APPLICATION"
          proceedingType="(Fee Waiver — CPLR § 1101)"
        />

        <Text style={[styles.small, styles.para]}>STATE OF NEW YORK, COUNTY OF {county} ss.:</Text>
        <Text style={styles.para}>
          {applicantName}, being duly sworn, deposes and says:
        </Text>

        <Numbered n={1}>
          I am the {applicantRole} in this proceeding and I make this application to
          proceed as a poor person and to waive the court fees, under CPLR § 1101.
        </Numbered>
        <Numbered n={2}>
          {onPublicAssistance === 'yes'
            ? `I currently receive public assistance${assistanceType ? ` (${assistanceType})` : ''}.`
            : 'I do not currently receive public assistance.'}
        </Numbered>
        <Numbered n={3}>
          My approximate total monthly income is {fmtMoney(monthlyIncome)}, and I support{' '}
          {dependents} dependent(s).
        </Numbered>
        <Numbered n={4}>
          Because of my financial circumstances, I am unable to pay the court fees and
          costs of this proceeding. Specifically: {reason}.
        </Numbered>
        <Numbered n={5}>
          No other person is beneficially interested in this proceeding. I respectfully
          request that the Court grant me permission to proceed as a poor person and
          waive the filing and other fees.
        </Numbered>

        <View style={styles.sigLine}>
          <Text>{applicantName}</Text>
          <Text style={styles.small}>{applicantRole}</Text>
        </View>
        <View style={styles.juratBox}>
          <Text style={styles.small}>
            Sworn to before me this ____ day of __________, 20____{'\n\n'}
            ______________________________{'\n'}Notary Public
          </Text>
        </View>
        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(appDate)}</Text>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>
      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
