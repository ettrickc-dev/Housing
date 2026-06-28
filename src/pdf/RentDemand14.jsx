import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import { GoodCauseDisclosure } from './PdfBlocks.jsx';
import InstructionsPage from './InstructionsPage.jsx';

// 14-Day Rent Demand packet (predicate notice for a nonpayment proceeding):
//  - English 14-day demand
//  - Spanish version (bilingual) when includeSpanish
//  - RPL § 235-e(d) certified-mail notice when include235e (HSTPA 2019)
export default function RentDemand14({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const {
    tenantNames = '____________________',
    premisesAddress = '____________________',
    landlordName = '____________________',
    landlordAddress = '____________________',
    servedByAgent = false,
    arrearsTotal = 0,
    rentPeriods = '____________________',
    monthlyRent = 0,
    demandDate,
    expiresDate,
    includeSpanish = true,
    include235e = true,
  } = data;

  return (
    <Document title="14-Day Rent Demand">
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />

        <Text style={styles.h1}>FOURTEEN (14) DAY NOTICE / RENT DEMAND</Text>
        <Text style={[styles.center, styles.small, styles.para]}>
          Notice to pay rent or surrender possession — RPAPL § 711(2)
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>TO: </Text>
          {tenantNames}, Tenant(s) / Occupant(s)
        </Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>PREMISES: </Text>
          {premisesAddress}
        </Text>

        <View style={styles.hr} />

        <Text style={styles.para}>
          PLEASE TAKE NOTICE that you are justly indebted to the landlord/owner
          ({landlordName}) for rent due and owing for the premises you occupy, in the
          total amount of <Text style={styles.bold}>{fmtMoney(arrearsTotal)}</Text>, for
          the following rental period(s): {rentPeriods}
          {monthlyRent ? `, at the monthly rent of ${fmtMoney(monthlyRent)}.` : '.'}
        </Text>

        <Text style={styles.para}>
          PLEASE TAKE FURTHER NOTICE that demand is hereby made that you pay the total
          amount due within <Text style={styles.bold}>fourteen (14) days</Text> after
          service of this notice (on or by <Text style={styles.bold}>{fmtDate(expiresDate)}</Text>),
          or that you surrender possession of the premises to the landlord/owner. If you
          fail to do so, the landlord/owner will commence summary proceedings under the
          statute to recover possession and a judgment for the amount due.
        </Text>

        <Text style={[styles.para, styles.small]}>Date of this notice: {fmtDate(demandDate)}</Text>

        <GoodCauseDisclosure status={data.goodCauseStatus} reason={data.goodCauseReason} />

        <View style={styles.sigLine}>
          <Text>{landlordName}</Text>
          <Text style={styles.small}>{servedByAgent ? 'Agent for Landlord/Owner' : 'Landlord/Owner'}</Text>
          <Text style={styles.small}>{landlordAddress}</Text>
        </View>

        <Text style={[styles.small, styles.para, { marginTop: 10 }]}>
          If you receive public assistance, bring this notice to the worker handling your
          case immediately. If you do not and need help, apply at your local Income
          Maintenance Center; showing this notice may entitle you to emergency assistance.
        </Text>

        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {/* ---------- Spanish version ---------- */}
      {includeSpanish && (
        <Page size="LETTER" style={styles.page}>
          <PdfWatermark show={watermark} />
          <Text style={styles.h1}>AVISO DE 14 DÍAS / DEMANDA DE RENTA</Text>
          <Text style={[styles.center, styles.small, styles.para]}>
            Aviso para pagar la renta o entregar la posesión — RPAPL § 711(2)
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>PARA: </Text>{tenantNames}, Inquilino(s) / Ocupante(s)
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>LOCAL: </Text>{premisesAddress}
          </Text>
          <View style={styles.hr} />
          <Text style={styles.para}>
            TOME AVISO que usted adeuda al casero ({landlordName}) la suma de{' '}
            <Text style={styles.bold}>{fmtMoney(arrearsTotal)}</Text> por concepto de renta
            del local arriba mencionado, por el/los siguiente(s) período(s): {rentPeriods}.
          </Text>
          <Text style={styles.para}>
            TOME AVISO ADEMÁS que usted debe pagar la cantidad total adeudada dentro de los{' '}
            <Text style={styles.bold}>catorce (14) días</Text> a partir de la entrega de este
            aviso (en o antes del <Text style={styles.bold}>{fmtDate(expiresDate)}</Text>), o
            entregar la posesión del local al casero. En caso de incumplimiento, el casero
            comenzará un juicio sumario de acuerdo con la ley para recobrar la posesión.
          </Text>
          <Text style={[styles.para, styles.small]}>Fecha de este aviso: {fmtDate(demandDate)}</Text>
          <View style={styles.sigLine}>
            <Text>{landlordName}</Text>
            <Text style={styles.small}>{servedByAgent ? 'Agente del Casero' : 'Casero / Propietario'}</Text>
          </View>
          <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
          <PdfPageNumber />
        </Page>
      )}

      {/* ---------- RPL § 235-e(d) certified-mail notice ---------- */}
      {include235e && (
        <Page size="LETTER" style={styles.page}>
          <PdfWatermark show={watermark} />
          <Text style={styles.h1}>NOTICE TO TENANT — BY CERTIFIED MAIL</Text>
          <Text style={[styles.center, styles.small, styles.para]}>
            Notice of non-payment of rent — RPL § 235-e(d) (HSTPA 2019)
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>TO: </Text>{tenantNames}
          </Text>
          <Text style={styles.para}>
            <Text style={styles.bold}>PREMISES: </Text>{premisesAddress}
          </Text>
          <View style={styles.hr} />
          <Text style={styles.para}>
            The landlord/owner of the above-described premises has failed to receive your
            rent payment, in the total sum of <Text style={styles.bold}>{fmtMoney(arrearsTotal)}</Text>,
            for the following rental period(s): {rentPeriods}.
          </Text>
          <Text style={[styles.para, styles.small]}>Dated: {fmtDate(demandDate)}</Text>
          <View style={styles.sigLine}>
            <Text>{landlordName}</Text>
            <Text style={styles.small}>{servedByAgent ? 'Agent for Landlord/Owner' : 'Landlord/Owner'}</Text>
          </View>
          <View style={[styles.juratBox, { marginTop: 18 }]}>
            <Text style={styles.bold}>Important — how to use this notice</Text>
            <Text style={[styles.small, { marginTop: 4 }]}>
              Under RPL § 235-e(d) (added by HSTPA 2019), if a landlord does not receive a
              rent payment within five days of the date it is due, the landlord must send
              the tenant, by certified mail, a written notice stating the failure to
              receive the payment. <Text style={styles.bold}>Send this notice by certified
              mail and keep the mailing receipt.</Text> This is separate from, and in
              addition to, the 14-day rent demand. Requirements in this area have been the
              subject of differing court interpretations — verify the current rule before
              relying on it.
            </Text>
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
