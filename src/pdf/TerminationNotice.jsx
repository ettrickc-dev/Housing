import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { GoodCauseDisclosure } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// Notice of Termination of a month-to-month / expired tenancy. The required
// notice period (30/60/90 days) depends on how long the tenant has occupied
// (RPL § 226-c). The user selects the period; we print it.
export default function TerminationNotice({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    tenantNames = '____________________',
    premisesAddress = '____________________',
    landlordName = '____________________',
    landlordAddress = '____________________',
    servedByAgent = false,
    noticeDays = '30',
    terminationDate,
    noticeDate,
    includeSpanish = true,
  } = data;

  return (
    <Document title={`${noticeDays}-Day Notice of Termination`}>
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <Text style={styles.h1}>
          {noticeDays}-DAY NOTICE OF TERMINATION OF TENANCY
        </Text>
        <Text style={[styles.center, styles.small, styles.para]}>
          Notice that tenancy will not be renewed / will be terminated — RPL § 226-c
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>TO: </Text>{tenantNames}, Tenant(s) / Occupant(s)
        </Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>PREMISES: </Text>{premisesAddress}
        </Text>

        <View style={styles.hr} />

        <Text style={styles.para}>
          PLEASE TAKE NOTICE that the landlord/owner elects to terminate your tenancy
          of the above premises. You are required to vacate and surrender possession of
          the premises on or before{' '}
          <Text style={styles.bold}>{fmtDate(terminationDate)}</Text>, which is at least{' '}
          <Text style={styles.bold}>{noticeDays} days</Text> after service of this notice.
        </Text>

        <Text style={styles.para}>
          PLEASE TAKE FURTHER NOTICE that if you fail to vacate by that date, the
          landlord/owner may commence a summary holdover proceeding to recover
          possession of the premises, together with any costs allowed by law.
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
          <Text style={styles.h1}>AVISO DE TERMINACIÓN DE {noticeDays} DÍAS DE ARRENDAMIENTO</Text>
          <Text style={[styles.center, styles.small, styles.para]}>
            Aviso de que el arrendamiento no será renovado / será terminado — RPL § 226-c
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>PARA: </Text>{tenantNames}, Inquilino(s) / Ocupante(s)
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>LOCAL: </Text>{premisesAddress}
          </Text>
          <View style={styles.hr} />
          <Text style={styles.para}>
            TOME AVISO que el casero/propietario ({landlordName}) elige terminar su
            arrendamiento del local arriba descrito. Usted debe desalojar y entregar la
            posesión del local en o antes del{' '}
            <Text style={styles.bold}>{fmtDate(terminationDate)}</Text>, que es por lo menos{' '}
            <Text style={styles.bold}>{noticeDays} días</Text> después de la entrega de este aviso.
          </Text>
          <Text style={styles.para}>
            TOME AVISO ADEMÁS que si usted no desaloja para esa fecha, el casero/propietario
            podrá comenzar un procedimiento sumario de retención (holdover) para recobrar la
            posesión del local, junto con cualquier costo permitido por la ley.
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
