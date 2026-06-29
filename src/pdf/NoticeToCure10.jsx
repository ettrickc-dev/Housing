import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { GoodCauseDisclosure } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// 10-Day Notice to Cure a lease violation (predicate to a holdover proceeding
// for breach of lease).
export default function NoticeToCure10({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    tenantNames = '____________________',
    premisesAddress = '____________________',
    landlordName = '____________________',
    landlordAddress = '____________________',
    servedByAgent = false,
    violationDescription = '____________________',
    leaseProvision = '',
    cureDate,
    noticeDate,
    includeSpanish = true,
  } = data;

  return (
    <Document title="10-Day Notice to Cure">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <Text style={styles.h1}>TEN (10) DAY NOTICE TO CURE</Text>
        <Text style={[styles.center, styles.small, styles.para]}>
          Notice to cure a violation of the lease/tenancy
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>TO: </Text>{tenantNames}, Tenant(s) / Occupant(s)
        </Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>PREMISES: </Text>{premisesAddress}
        </Text>

        <View style={styles.hr} />

        <Text style={styles.para}>
          PLEASE TAKE NOTICE that you are violating a substantial obligation of your
          tenancy{leaseProvision ? ` under the following lease provision: ${leaseProvision},` : ','} in
          that: {violationDescription}
        </Text>

        <Text style={styles.para}>
          PLEASE TAKE FURTHER NOTICE that you are required to cure the above condition
          on or before <Text style={styles.bold}>{fmtDate(cureDate)}</Text>, which is at
          least ten (10) days after service of this notice. If you fail to cure within
          that time, the landlord/owner may elect to terminate your tenancy and commence
          a summary holdover proceeding to recover possession of the premises.
        </Text>

        <Text style={[styles.small, styles.para]}>Date of this notice: {fmtDate(noticeDate)}</Text>

        <GoodCauseDisclosure status={data.goodCauseStatus} reason={data.goodCauseReason} />

        <View style={styles.sigLine}>
          <Text>{landlordName}</Text>
          <Text style={styles.small}>
            {servedByAgent ? 'Agent for Landlord/Owner' : 'Landlord/Owner'}
          </Text>
          <Text style={styles.small}>{landlordAddress}</Text>
        </View>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {includeSpanish && (
        <Page size="LETTER" style={styles.page}>
          <PdfWatermark show={watermark} />
          <Text style={styles.h1}>AVISO DE DIEZ (10) DÍAS PARA SUBSANAR</Text>
          <Text style={[styles.center, styles.small, styles.para]}>
            Aviso para corregir una violación del contrato de arrendamiento
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>PARA: </Text>{tenantNames}, Inquilino(s) / Ocupante(s)
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>LOCAL: </Text>{premisesAddress}
          </Text>
          <View style={styles.hr} />
          <Text style={styles.para}>
            TOME AVISO que usted está violando una obligación sustancial de su arrendamiento
            {leaseProvision ? ` bajo la siguiente disposición del contrato: ${leaseProvision},` : ','} en
            que: {violationDescription}
          </Text>
          <Text style={styles.para}>
            TOME AVISO ADEMÁS que usted debe corregir la condición anterior en o antes del{' '}
            <Text style={styles.bold}>{fmtDate(cureDate)}</Text>, que es por lo menos diez (10)
            días después de la entrega de este aviso. Si usted no la corrige dentro de ese
            plazo, el casero/propietario podrá optar por terminar su arrendamiento y comenzar
            un procedimiento sumario de retención para recobrar la posesión del local.
          </Text>
          <Text style={[styles.small, styles.para]}>Fecha de este aviso: {fmtDate(noticeDate)}</Text>
          <View style={styles.sigLine}>
            <Text>{landlordName}</Text>
            <Text style={styles.small}>{servedByAgent ? 'Agente del Casero' : 'Casero / Propietario'}</Text>
            <Text style={styles.small}>{landlordAddress}</Text>
          </View>
          <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
          <PdfPageNumber />
        </Page>
      )}

      {instructions && (
        <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />
      )}
    </Document>
  );
}
