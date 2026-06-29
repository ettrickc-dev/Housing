import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Verification, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Illegal lockout (unlawful eviction) proceeding (tenant -> owner) to be restored
// to possession. Verified Petition + Order to Show Cause for restoration.
export default function IllegalLockout({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    apartment = '',
    occupancyLength = '____________',
    lockoutDate,
    lockoutMethod = '____________',
    isNyc = 'yes',
    petitionDate,
  } = data;

  const captionData = {
    courtName, county, indexNumber, petitionerName, petitionerAddress,
    respondentNames, premisesAddress, fictitiousNames: false,
  };
  const where = premisesAddress + (apartment ? `, Apartment ${apartment}` : '');

  return (
    <Document title="Illegal Lockout Petition">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={captionData}
          docLabel="VERIFIED PETITION"
          proceedingType="Illegal Lockout — Restoration to Possession"
          petitionerLabel="Petitioner (Tenant/Occupant),"
          respondentLabel="Respondent (Owner/Landlord),"
          petitionerAddressLabel="Address:"
        />

        <Text style={styles.para}>
          The Petitioner, who was unlawfully removed from the premises, respectfully alleges:
        </Text>
        <Numbered n={1}>
          Petitioner was in actual occupancy and possession of {where} (the "premises") as a
          tenant or lawful occupant for approximately {occupancyLength} before the lockout.
        </Numbered>
        <Numbered n={2}>
          On or about {fmtDate(lockoutDate)}, Respondent unlawfully removed and excluded
          Petitioner from the premises without a court order and without the use of a
          marshal or sheriff acting under a warrant, by the following means: {lockoutMethod}.
        </Numbered>
        <Numbered n={3}>
          Petitioner did not voluntarily surrender possession of the premises and has been
          deprived of access to the premises and belongings.
        </Numbered>
        <Numbered n={4}>
          Respondent's conduct is an unlawful eviction prohibited by RPAPL §§ 711, 768, and
          853{isNyc === 'yes' ? ', and by N.Y.C. Administrative Code § 26-521' : ''}. A
          person in occupancy for 30 consecutive days or longer may not be removed except by
          court process.
        </Numbered>

        <Text style={[styles.bold, styles.para]}>WHEREFORE</Text>
        <Text style={styles.para}>
          Petitioner requests an Order restoring Petitioner to immediate possession of the
          premises; directing Respondent to provide keys and cease any interference with
          Petitioner's occupancy; awarding damages as permitted by law; and granting such
          other relief as the Court deems just.
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
          proceedingType="Restoration to Possession"
          petitionerLabel="Petitioner (Tenant/Occupant),"
          respondentLabel="Respondent (Owner/Landlord),"
          petitionerAddressLabel="Address:"
        />
        <Text style={styles.h1}>ORDER TO SHOW CAUSE</Text>
        <Text style={styles.para}>
          Upon the annexed verified petition of {petitionerName}, sworn to on{' '}
          {fmtDate(petitionDate)}, let the Respondent show cause before this Court at Part
          ____, Room ____, on the ____ day of __________, 20____ at ____ __.M., why an order
          should not be made restoring Petitioner to possession of the premises and granting
          the relief requested in the petition.
        </Text>
        <Text style={styles.para}>
          Pending the hearing, Respondent is directed to take no further action to keep
          Petitioner out of the premises.
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
