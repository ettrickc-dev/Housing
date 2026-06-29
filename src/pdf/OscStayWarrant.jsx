import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { Caption, Numbered } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Order to Show Cause to stay execution of a warrant of eviction + affidavit.
export default function OscStayWarrant({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    reason = '____________',
    reliefRequested = '____________',
    oscDate,
  } = data;

  return (
    <Document title="OSC to Stay Eviction">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption
          data={{ courtName, county, indexNumber, petitionerName, respondentNames, premisesAddress, fictitiousNames: false }}
          docLabel="ORDER TO SHOW CAUSE"
          proceedingType="Stay of Eviction"
        />

        <Text style={styles.h1}>ORDER TO SHOW CAUSE</Text>
        <Text style={styles.para}>
          Upon the annexed affidavit of {respondentNames}, sworn to on {fmtDate(oscDate)},
          and upon all prior papers and proceedings, let the Petitioner show cause before
          this Court at Part ____, Room ____, on the ____ day of __________, 20____ at
          ____ __.M., or as soon thereafter as counsel may be heard, why an order should
          not be entered staying execution of the warrant of eviction and granting the
          relief requested below.
        </Text>
        <Text style={styles.para}>
          SUFFICIENT CAUSE APPEARING, it is ORDERED that, pending the hearing and
          determination of this motion, execution of the warrant of eviction and all
          proceedings to remove Respondent(s) from the premises are STAYED.
        </Text>
        <Text style={[styles.small, styles.para]}>Dated: __________________{'\n'}ENTER:</Text>
        <View style={styles.sigLine}>
          <Text>______________________________</Text>
          <Text style={styles.small}>Judge / Hearing Officer</Text>
        </View>

        <View break />
        <Text style={styles.h1}>AFFIDAVIT IN SUPPORT</Text>
        <Text style={[styles.small, styles.para]}>STATE OF NEW YORK, COUNTY OF {county} ss.:</Text>
        <Text style={styles.para}>{respondentNames}, being duly sworn, deposes and says:</Text>
        <Numbered n={1}>I am the Respondent and reside at the subject premises, {premisesAddress}.</Numbered>
        <Numbered n={2}>A warrant of eviction has been or is about to be issued against me.</Numbered>
        <Numbered n={3}>I ask the Court to stay the eviction because: {reason}.</Numbered>
        <Numbered n={4}>Specifically, I am asking the Court to: {reliefRequested}.</Numbered>
        <Numbered n={5}>
          I respectfully request that execution of the warrant be stayed and that I be
          granted the relief described above.
        </Numbered>

        <View style={styles.sigLine}>
          <Text>{respondentNames}</Text>
          <Text style={styles.small}>Respondent</Text>
        </View>
        <View style={styles.juratBox}>
          <Text style={styles.small}>
            Sworn to before me this ____ day of __________, 20____{'\n\n'}
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
