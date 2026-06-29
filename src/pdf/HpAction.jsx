import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Verification, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// HP proceeding (tenant -> owner) to compel repairs of code violations, with
// HPD as a statutory co-respondent. Verified Petition + Order to Show Cause.
export default function HpAction({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    apartment = '',
    managingAgent = '',
    conditions = '',
    hazardous = 'no',
    accessDates = '',
    petitionDate,
  } = data;

  const items = String(conditions).split('\n').map((s) => s.trim()).filter(Boolean);
  const captionData = {
    courtName, county, indexNumber, petitionerName, petitionerAddress,
    respondentNames, premisesAddress, fictitiousNames: false,
  };

  return (
    <Document title="HP Repair Petition">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={captionData}
          docLabel="VERIFIED PETITION"
          proceedingType="HP Proceeding — Order to Correct"
          petitionerLabel="Petitioner (Tenant),"
          respondentLabel="Respondent (Owner), and the Dept. of Housing Preservation & Development (HPD)"
          petitionerAddressLabel="Address:"
        />

        <Text style={styles.para}>
          The Petitioner, a tenant/occupant of the premises, respectfully alleges:
        </Text>
        <Numbered n={1}>
          Petitioner resides at and is a lawful occupant of {premisesAddress}
          {apartment ? `, Apartment ${apartment}` : ''} (the "premises").
        </Numbered>
        <Numbered n={2}>
          Respondent {respondentNames} is the owner/landlord responsible for the
          maintenance of the premises{managingAgent ? `; the managing agent is ${managingAgent}` : ''}.
        </Numbered>
        <Numbered n={3}>
          The following conditions exist in the premises and require correction:
        </Numbered>
        <View style={{ marginLeft: 18 }}>
          {(items.length ? items : ['____________________']).map((c, i) => (
            <Text key={i} style={styles.small}>• {c}</Text>
          ))}
        </View>
        <Numbered n={4}>
          These conditions violate the New York City Housing Maintenance Code and/or the
          Multiple Dwelling Law and breach the warranty of habitability (Real Property Law
          § 235-b). Petitioner requests that HPD inspect the premises and place violations.
        </Numbered>
        {hazardous === 'yes' && (
          <Numbered n={5}>
            One or more of these conditions are immediately hazardous to health and safety
            and require emergency correction.
          </Numbered>
        )}
        {accessDates ? (
          <Numbered n={hazardous === 'yes' ? 6 : 5}>
            Petitioner can provide access for inspection and repairs on: {accessDates}.
          </Numbered>
        ) : null}

        <Text style={[styles.bold, styles.para]}>WHEREFORE</Text>
        <Text style={styles.para}>
          Petitioner requests an Order directing Respondent to correct the conditions
          described above and to comply with the Housing Maintenance Code and Multiple
          Dwelling Law; directing HPD to inspect the premises and certify correction;
          imposing civil penalties for the violations; and granting such other relief as the
          Court deems just.
        </Text>

        <Verification county={county} signerName={petitionerName} role="Petitioner" docWord="petition" />

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={captionData}
          docLabel="ORDER TO SHOW CAUSE"
          proceedingType="HP Proceeding"
          petitionerLabel="Petitioner (Tenant),"
          respondentLabel="Respondent (Owner), and HPD"
          petitionerAddressLabel="Address:"
        />
        <Text style={styles.h1}>ORDER TO SHOW CAUSE</Text>
        <Text style={styles.para}>
          Upon the annexed verified petition of {petitionerName}, sworn to on{' '}
          {fmtDate(petitionDate)}, let the Respondent and HPD show cause before this Court at
          Part ____, Room ____, on the ____ day of __________, 20____ at ____ __.M., why an
          order should not be made directing the Respondent to correct the conditions and
          violations at the premises and granting the relief requested in the petition.
        </Text>
        <Text style={styles.para}>
          It is further ORDERED that HPD inspect the premises for the conditions alleged and
          report its findings to the Court.
        </Text>
        <Text style={[styles.small, styles.para]}>Dated: __________________{'\n'}ENTER:</Text>
        <View style={styles.sigLine}>
          <Text>______________________________</Text>
          <Text style={styles.small}>Judge / Hearing Officer, Housing Part</Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />}
    </Document>
  );
}
