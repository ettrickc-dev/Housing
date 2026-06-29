import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Landlord requisition / letter of instruction to a city marshal or sheriff to
// execute a warrant of eviction after judgment. Reminds the officer of the
// statutory notice of eviction (RPAPL § 749(2)).
export default function MarshalRequisition({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    petitionerPhone = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    apartment = '',
    officerType = 'City Marshal',
    officerName = '',
    judgmentDate,
    warrantDate,
    reqDate,
  } = data;

  const where = premisesAddress + (apartment ? `, Apartment ${apartment}` : '');

  return (
    <Document title="Requisition to Marshal/Sheriff">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={{ courtName, county, indexNumber, petitionerName, petitionerAddress, respondentNames, premisesAddress, fictitiousNames: false }}
          docLabel="REQUISITION"
          proceedingType="Execute Warrant of Eviction"
        />

        <Text style={styles.h1}>REQUISITION TO {officerType.toUpperCase()}</Text>
        <Text style={styles.para}>
          To the {officerType}{officerName ? `, ${officerName}` : ''}, County of {county}:
        </Text>

        <Numbered n={1}>
          A judgment of possession was entered in favor of Petitioner and against
          Respondent(s) {respondentNames} on {fmtDate(judgmentDate)} in the above
          proceeding.
        </Numbered>
        <Numbered n={2}>
          A warrant of eviction was issued by {courtName} on {fmtDate(warrantDate)}. The
          warrant is delivered herewith for execution.
        </Numbered>
        <Numbered n={3}>
          The premises to be recovered are: {where}.
        </Numbered>
        <Numbered n={4}>
          Petitioner requests and authorizes you to execute the warrant and restore
          Petitioner to possession of the premises.
        </Numbered>
        <Numbered n={5}>
          Before executing the warrant, please serve the Notice of Eviction required by law,
          giving the occupant(s) at least fourteen (14) days as required by RPAPL § 749(2).
        </Numbered>
        <Numbered n={6}>
          Petitioner / contact for this matter: {petitionerName}, {petitionerAddress},
          telephone {petitionerPhone}.
        </Numbered>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(reqDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{petitionerName}</Text>
          <Text style={styles.small}>Petitioner / Authorized Representative</Text>
        </View>

        <View style={[styles.juratBox, { marginTop: 16 }]}>
          <Text style={styles.small}>
            Note: Only a public enforcement officer (in New York City, a licensed City
            Marshal; elsewhere, the Sheriff) may execute a warrant of eviction. A landlord
            may never remove a tenant personally or change the locks. Confirm the officer's
            current fees and scheduling before delivery.
          </Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
