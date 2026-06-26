import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Holdover Petition + Notice of Petition (summary holdover proceeding).
export default function HoldoverPetition({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________________',
    indexNumber = '',
    petitionerName = '____________________',
    petitionerAddress = '____________________',
    respondentNames = '____________________',
    premisesAddress = '____________________',
    regulatoryStatus = 'not specified',
    groundType = 'the tenancy was terminated by notice',
    noticeServedDate,
    noticeType = '____________________',
    useOccupancy = 0,
    petitionDate,
  } = data;

  return (
    <Document title="Holdover Petition">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

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
              <Text style={[styles.small, { marginTop: 6 }]}>HOLDOVER</Text>
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
          Respondent(s) entered into possession of the Premises and continue to hold
          over and remain in possession after the expiration/termination of their term.
        </Numbered>
        <Numbered n={3}>
          The regulatory status of the Premises is: {regulatoryStatus}.
        </Numbered>
        <Numbered n={4}>
          Respondent(s)’ right to possession has ended because {groundType}.
        </Numbered>
        <Numbered n={5}>
          The required predicate notice ({noticeType}) was served upon Respondent(s) on
          or about {fmtDate(noticeServedDate)}, and the time to comply or vacate has
          expired without the premises being surrendered.
        </Numbered>
        {useOccupancy ? (
          <Numbered n={6}>
            The reasonable value of use and occupancy of the Premises is{' '}
            {fmtMoney(useOccupancy)} per month, for which Respondent(s) are liable for
            the period of the holdover.
          </Numbered>
        ) : null}

        <Text style={[styles.para, styles.bold, { marginTop: 8 }]}>
          WHEREFORE, Petitioner demands a final judgment:
        </Text>
        <Text style={styles.para}>
          (a) awarding possession of the Premises to Petitioner and the issuance of a
          warrant to remove Respondent(s); (b) for use and occupancy as proven; and
          (c) for such other relief as the Court deems just, together with the costs and
          disbursements of this proceeding.
        </Text>

        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(petitionDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{petitionerName}</Text>
          <Text style={styles.small}>Petitioner</Text>
          <Text style={styles.small}>{petitionerAddress}</Text>
        </View>

        <View style={styles.juratBox}>
          <Text style={styles.bold}>VERIFICATION</Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            STATE OF NEW YORK, COUNTY OF {county} ss.:
          </Text>
          <Text style={[styles.small, { marginTop: 4 }]}>
            The undersigned, being duly sworn, deposes and says that deponent is the
            Petitioner herein; has read the foregoing petition and knows the contents
            thereof; and that the same is true to deponent’s own knowledge, except as to
            matters stated on information and belief, and as to those deponent believes
            them to be true.
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
