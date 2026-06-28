import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber, PdfWatermark } from './PdfShared.jsx';
import InstructionsPage from './InstructionsPage.jsx';
import {
  Caption, TenantNoticeSection, GoodCauseDisclosure, Verification, Numbered,
} from './PdfBlocks.jsx';

// Full Notice of Petition + Petition (Holdover), modeled on the NYC L&T form.
export default function HoldoverPetition({ data = {}, watermark = false, lawReviewDate, instructions }) {
  const d = {
    courtName: 'CIVIL COURT OF THE CITY OF NEW YORK',
    county: '____________',
    indexNumber: '',
    petitionerName: '____________',
    petitionerAddress: '____________',
    respondentNames: '____________',
    premisesAddress: '____________',
    isNyc: true,
    tenancyType: 'written',
    termExpiredDate: null,
    groundType: 'the tenancy was terminated by notice',
    noticeType: 'Notice of Termination',
    noticeServedDate: null,
    noticeDays: '90',
    useOccupancy: 0,
    regulatoryStatus: 'market_rate',
    exemptionReason: '',
    goodCauseStatus: 'not_covered',
    goodCauseReason: '',
    attorneyFees: 0,
    petitionDate: null,
    signerName: '____________',
    signerRole: 'Petitioner',
    ...data,
    moneyJudgment: data.useOccupancy ? 0 : 0,
  };
  const regLine = regulatoryClause(d.regulatoryStatus, d.exemptionReason);

  return (
    <Document title="Notice of Petition and Petition (Holdover)">
      {/* ---------- NOTICE OF PETITION ---------- */}
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption data={d} docLabel="NOTICE OF PETITION" proceedingType="Holdover — Dwelling" />
        <TenantNoticeSection data={d} caseType="holdover" />
        <Text style={[styles.small, styles.para, { marginTop: 8 }]}>Dated: {fmtDate(d.petitionDate)}</Text>
        <View style={styles.sigLine}>
          <Text>______________________________</Text>
          <Text style={styles.small}>Clerk of the Court / {d.signerRole}</Text>
          <Text style={styles.small}>{d.petitionerName} · {d.petitionerAddress}</Text>
        </View>
        <Text style={[styles.small, { marginTop: 10, fontFamily: 'Helvetica-Oblique' }]}>
          IMPORTANT TO TENANT — If you or a person you depend on is in the military
          service, tell the Clerk of the Court immediately to protect your rights.
        </Text>
        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {/* ---------- PETITION ---------- */}
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Caption data={d} docLabel="PETITION" proceedingType="Holdover — Dwelling" />
        <Text style={styles.para}>
          The petition of {d.petitionerName}, the owner and landlord of the Premises,
          respectfully shows and alleges:
        </Text>
        <Numbered n={1}>Petitioner is the owner and landlord of the Premises and is authorized to bring this proceeding.</Numbered>
        <Numbered n={2}>
          Respondent(s) {d.respondentNames} entered into possession under a {d.tenancyType}{' '}
          rental agreement and have continued in possession.
        </Numbered>
        <Numbered n={3}>
          The Premises are: {d.premisesAddress}, situated within the territorial
          jurisdiction of this Court.
        </Numbered>
        <Numbered n={4}>
          Respondent(s)' right to possession has ended because {d.groundType}
          {d.termExpiredDate ? `; the term expired on ${fmtDate(d.termExpiredDate)}.` : '.'}
        </Numbered>
        <Numbered n={5}>
          Respondent(s) hold over and continue in possession of the Premises without the
          permission of the landlord after the expiration/termination of their term.
        </Numbered>
        <Numbered n={6}>{regLine}</Numbered>
        <Numbered n={7}>
          At least {d.noticeDays} days before the expiration of the term, Respondent(s)
          were served, in the manner provided by law, with a {d.noticeType} on or about{' '}
          {fmtDate(d.noticeServedDate)} (a copy of which, with proof of service, is annexed
          and made part of this petition), electing to terminate the tenancy.
        </Numbered>
        {d.useOccupancy ? (
          <Numbered n={8}>
            The reasonable value of use and occupancy of the Premises is{' '}
            {fmtMoney(d.useOccupancy)} per month for the holdover period.
          </Numbered>
        ) : null}

        <GoodCauseDisclosure status={d.goodCauseStatus} reason={d.goodCauseReason} />

        <Text style={[styles.bold, styles.para, { marginTop: 8 }]}>WHEREFORE, Petitioner requests a final judgment:</Text>
        <Text style={styles.para}>
          (a) awarding possession of the Premises to Petitioner and the issuance of a
          warrant to remove Respondent(s); (b) for the fair value of use and occupancy;
          {d.attorneyFees ? ` (c) for attorneys' fees of ${fmtMoney(d.attorneyFees)};` : ''}{' '}
          and for the costs and disbursements of this proceeding.
        </Text>
        <Text style={[styles.small, styles.para]}>Dated: {fmtDate(d.petitionDate)}</Text>
        <View style={styles.sigLine}>
          <Text>{d.signerName}</Text>
          <Text style={styles.small}>{d.signerRole}</Text>
        </View>
        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {/* ---------- VERIFICATION ---------- */}
      <Page size="LETTER" style={styles.page}>
        <PdfWatermark show={watermark} />
        <Verification county={d.county} signerName={d.signerName} role={d.signerRole} />
        <PdfFooter lawReviewDate={lawReviewDate} hasStatutes />
        <PdfPageNumber />
      </Page>

      {instructions && (
        <InstructionsPage instructions={instructions} lawReviewDate={lawReviewDate} />
      )}
    </Document>
  );
}

function regulatoryClause(status, exemptionReason) {
  if (status === 'rent_stabilized')
    return 'The Premises ARE subject to the Rent Stabilization Law, and Petitioner has complied with its requirements.';
  if (status === 'rent_controlled')
    return 'The Premises ARE subject to rent control, and Petitioner has complied with the applicable requirements.';
  if (status === 'nycha')
    return 'The Premises are part of a public-housing / NYCHA tenancy subject to applicable requirements.';
  return (
    'The Premises are NOT subject to rent control or the Rent Stabilization Law' +
    (exemptionReason ? `, by reason of ${exemptionReason}.` : '.')
  );
}
