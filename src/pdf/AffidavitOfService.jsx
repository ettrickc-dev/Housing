import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Affidavit of Service — supports personal, substitute, and conspicuous
// (nail-and-mail) service descriptions plus the mailing statement.
export default function AffidavitOfService({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK — HOUSING PART',
    county = '____________________',
    indexNumber = '',
    petitionerName = '____________________',
    respondentNames = '____________________',
    affiantName = '____________________',
    documentServed = 'Notice of Petition and Petition',
    servedOn = '____________________',
    serviceDate,
    serviceTime = '________',
    serviceAddress = '____________________',
    method = 'personal',
    mailedDate,
  } = data;

  const methodText = {
    personal:
      'by personally delivering a true copy thereof to the respondent named above, ' +
      'a person of suitable age and discretion.',
    substitute:
      'by delivering a true copy thereof to a person of suitable age and discretion ' +
      'at the premises, and by thereafter mailing a copy as stated below (substituted service).',
    conspicuous:
      'by affixing a true copy thereof upon a conspicuous part of the premises, after ' +
      'reasonable application to effect personal or substituted service, and by ' +
      'thereafter mailing a copy as stated below (conspicuous / “nail and mail” service).',
  }[method] || '';

  const usesMailing = method === 'substitute' || method === 'conspicuous';

  return (
    <Document title="Affidavit of Service">
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
              <Text style={styles.small}>Respondent(s).</Text>
            </View>
            <View style={styles.indexBox}>
              <Text style={styles.small}>Index / L&amp;T No.</Text>
              <Text style={styles.bold}>{indexNumber || '____________'}</Text>
              <Text style={[styles.small, { marginTop: 6 }]}>AFFIDAVIT</Text>
              <Text style={styles.small}>OF SERVICE</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.small, styles.para]}>
          STATE OF NEW YORK, COUNTY OF {county} ss.:
        </Text>

        <Text style={styles.para}>
          {affiantName}, being duly sworn, deposes and says: I am over the age of 18
          years and am not a party to this proceeding.
        </Text>

        <Text style={styles.para}>
          On <Text style={styles.bold}>{fmtDate(serviceDate)}</Text> at approximately{' '}
          {serviceTime}, at {serviceAddress}, I served the within{' '}
          <Text style={styles.bold}>{documentServed}</Text> upon {servedOn}, {methodText}
        </Text>

        {usesMailing && (
          <Text style={styles.para}>
            On {fmtDate(mailedDate)}, I mailed a true copy of the document(s) to the
            respondent(s) at the premises address by first-class mail, and by certified
            or registered mail, in a postpaid properly addressed envelope marked
            “personal and confidential,” deposited in an official depository under the
            exclusive care and custody of the U.S. Postal Service.
          </Text>
        )}

        <View style={styles.sigLine}>
          <Text>{affiantName}</Text>
          <Text style={styles.small}>Affiant / Process Server</Text>
        </View>

        <View style={styles.juratBox}>
          <Text style={styles.small}>
            Sworn to before me this ____ day of __________, 20____{'\n\n'}
            ______________________________{'\n'}
            Notary Public
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
