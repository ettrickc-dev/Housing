import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Landlord application for a default judgment + warrant when the respondent did
// not answer or appear. Notice of Motion + sworn affidavit (incl. SCRA military
// statement) + proposed judgment language.
export default function MotionDefaultJudgment({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    caseType = 'nonpayment',
    serviceDate,
    serviceMethod = '____________',
    amountDue = 0,
    signerName = '____________',
    signerRole = 'Petitioner',
    returnDate,
    motionDate,
  } = data;

  const nonpay = caseType === 'nonpayment';
  const captionData = {
    courtName, county, indexNumber, petitionerName, petitionerAddress,
    respondentNames, premisesAddress, fictitiousNames: false,
  };

  return (
    <Document title="Motion for Default Judgment">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption data={captionData} docLabel="NOTICE OF MOTION" proceedingType="Default Judgment & Warrant" />

        <Text style={styles.h1}>NOTICE OF MOTION</Text>
        <Text style={styles.para}>
          PLEASE TAKE NOTICE that, upon the annexed affidavit and all prior papers and
          proceedings, the Petitioner will move this Court at {courtName}, County of{' '}
          {county}, on the ____ day of {returnDate ? fmtDate(returnDate) : '__________, 20____'} at
          ____ __.M., or as soon thereafter as counsel may be heard, for an order:
        </Text>
        <View style={{ marginLeft: 18 }}>
          <Text style={styles.small}>(a) granting Petitioner a default judgment of possession of the premises;</Text>
          {nonpay && (
            <Text style={styles.small}>(b) granting Petitioner a money judgment of {fmtMoney(amountDue)};</Text>
          )}
          <Text style={styles.small}>({nonpay ? 'c' : 'b'}) issuing a warrant of eviction; and</Text>
          <Text style={styles.small}>({nonpay ? 'd' : 'c'}) such other relief as the Court deems just.</Text>
        </View>
        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(motionDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{signerName}</Text>
          <Text style={styles.small}>{signerRole}</Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption data={captionData} docLabel="AFFIDAVIT" proceedingType="In Support of Default Judgment" />
        <Text style={styles.h1}>AFFIDAVIT IN SUPPORT</Text>
        <Text style={[styles.small, styles.para]}>STATE OF NEW YORK, COUNTY OF {county} ss.:</Text>
        <Text style={styles.para}>{signerName}, being duly sworn, deposes and says:</Text>

        <Numbered n={1}>
          I am the {signerRole} in this {nonpay ? 'nonpayment' : 'holdover'} summary
          proceeding and am fully familiar with the facts set forth below.
        </Numbered>
        <Numbered n={2}>
          The Notice of Petition and Petition were served on Respondent(s) on{' '}
          {fmtDate(serviceDate)} by {serviceMethod}, and proof of service was duly filed.
        </Numbered>
        <Numbered n={3}>
          The time for Respondent(s) to {nonpay ? 'answer' : 'appear'} has expired, and
          Respondent(s) have failed to {nonpay ? 'answer the Petition' : 'appear or answer'}.
          Respondent(s) are therefore in default.
        </Numbered>
        {nonpay && (
          <Numbered n={4}>
            The amount of rent due and owing, for which a money judgment is sought, is{' '}
            {fmtMoney(amountDue)}.
          </Numbered>
        )}
        <Numbered n={nonpay ? 5 : 4}>
          Upon information and belief, Respondent(s) are not in the active military service
          of the United States or of the State of New York, as defined by the Servicemembers
          Civil Relief Act (50 U.S.C. § 3901 et seq.) and the New York Military Law. This
          belief is based on my knowledge of and dealings with the Respondent(s).
        </Numbered>
        <Numbered n={nonpay ? 6 : 5}>
          No prior application for this relief has been made.
        </Numbered>

        <Text style={[styles.bold, styles.para]}>WHEREFORE</Text>
        <Text style={styles.para}>
          Petitioner respectfully requests a default judgment of possession
          {nonpay ? `, a money judgment of ${fmtMoney(amountDue)},` : ''} and a warrant of
          eviction, together with such other relief as the Court deems just.
        </Text>

        <View style={styles.juratBox}>
          <Text style={styles.small}>
            Sworn to before me this ____ day of __________, 20____{'\n\n'}
            ______________________________{'\n'}Notary Public{'\n\n'}
            ______________________________{'\n'}{signerName} ({signerRole})
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
