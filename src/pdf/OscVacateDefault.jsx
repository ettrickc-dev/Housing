import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Order to Show Cause to vacate a default judgment + supporting affidavit.
export default function OscVacateDefault({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________________',
    indexNumber = '',
    petitionerName = '____________________',
    respondentNames = '____________________',
    premisesAddress = '____________________',
    judgmentDate,
    defaultReason = '____________________',
    meritoriousDefense = '____________________',
    oscDate,
  } = data;

  return (
    <Document title="OSC to Vacate Default">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <View style={styles.captionWrap}>
          <Text style={[styles.bold, styles.center]}>{courtName}</Text>
          <Text style={[styles.center, styles.small]}>COUNTY OF {county}</Text>
          <View style={[styles.captionRow, { marginTop: 6 }]}>
            <View style={{ maxWidth: 280 }}>
              <Text>{petitionerName},</Text>
              <Text style={styles.small}>Petitioner,</Text>
              <Text style={[styles.small, { marginVertical: 4 }]}>-against-</Text>
              <Text>{respondentNames},</Text>
              <Text style={styles.small}>Respondent.</Text>
            </View>
            <View style={styles.indexBox}>
              <Text style={styles.small}>Index / L&amp;T No.</Text>
              <Text style={styles.bold}>{indexNumber || '____________'}</Text>
              <Text style={[styles.small, { marginTop: 6 }]}>ORDER TO</Text>
              <Text style={styles.small}>SHOW CAUSE</Text>
            </View>
          </View>
        </View>

        <Text style={styles.h1}>ORDER TO SHOW CAUSE</Text>
        <Text style={styles.para}>
          Upon the annexed affidavit of {respondentNames}, sworn to on{' '}
          {fmtDate(oscDate)}, and upon all prior papers and proceedings had herein, let
          the Petitioner show cause before this Court at the Courthouse, Part ____, Room
          ____, on the ____ day of __________, 20____, at ____ __.M., or as soon
          thereafter as counsel may be heard, why an order should not be entered:
        </Text>
        <Text style={styles.para}>
          (a) vacating the default judgment and any warrant of eviction entered against
          Respondent on or about {fmtDate(judgmentDate)}; (b) restoring this proceeding
          to the calendar for a hearing on the merits; and (c) granting such other
          relief as the Court deems just and proper.
        </Text>
        <Text style={styles.para}>
          SUFFICIENT CAUSE APPEARING, it is ORDERED that pending the hearing and
          determination of this motion, all proceedings on the part of the Petitioner,
          including the execution of any warrant of eviction, are STAYED.
        </Text>

        <Text style={[styles.small, styles.para]}>
          Dated: __________________{'\n'}ENTER:
        </Text>
        <View style={styles.sigLine}>
          <Text>______________________________</Text>
          <Text style={styles.small}>Judge / Hearing Officer</Text>
        </View>

        {/* Affidavit in support — starts on a new page for clarity */}
        <View break />
        <Text style={styles.h1}>AFFIDAVIT IN SUPPORT</Text>
        <Text style={[styles.small, styles.para]}>
          STATE OF NEW YORK, COUNTY OF {county} ss.:
        </Text>
        <Text style={styles.para}>
          {respondentNames}, being duly sworn, deposes and says:
        </Text>
        <Numbered n={1}>
          I am the Respondent in this proceeding and reside at the subject premises,
          {' '}{premisesAddress}.
        </Numbered>
        <Numbered n={2}>
          A default judgment and/or warrant was entered against me on or about{' '}
          {fmtDate(judgmentDate)}.
        </Numbered>
        <Numbered n={3}>
          I did not appear / defend because: {defaultReason}.
        </Numbered>
        <Numbered n={4}>
          I have a meritorious defense to this proceeding, namely: {meritoriousDefense}.
        </Numbered>
        <Numbered n={5}>
          I respectfully request that the default be vacated, the warrant stayed, and
          the matter restored to the calendar so that I may be heard on the merits.
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
