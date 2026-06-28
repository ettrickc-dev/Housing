import { Text, View } from '@react-pdf/renderer';
import { styles, fmtMoney, fmtDate } from './pdfTheme.js';

// ---- Court caption shared by petitions / notices of petition ----------------
export function Caption({ data, docLabel, proceedingType }) {
  const {
    courtName = 'CIVIL COURT OF THE CITY OF NEW YORK',
    county = '____________',
    indexNumber = '',
    petitionerName = '____________',
    petitionerAddress = '____________',
    respondentNames = '____________',
    premisesAddress = '____________',
    fictitiousNames = true,
  } = data;
  return (
    <View style={styles.captionWrap}>
      <Text style={[styles.bold, styles.center]}>{courtName}</Text>
      <Text style={[styles.center, styles.small]}>COUNTY OF {county}</Text>
      <Text style={styles.small}>{'-'.repeat(44)}X</Text>
      <View style={styles.captionRow}>
        <View style={{ maxWidth: 300 }}>
          <Text style={styles.bold}>{petitionerName},</Text>
          <Text style={styles.small}>Petitioner (Landlord),</Text>
          <Text style={[styles.small, { marginTop: 2 }]}>
            Business address: {petitionerAddress}
          </Text>
          <Text style={[styles.small, { marginVertical: 4 }]}>- against -</Text>
          <Text style={styles.bold}>{respondentNames},</Text>
          <Text style={styles.small}>Respondent(s) (Tenant(s)),</Text>
          <Text style={styles.small}>Address: {premisesAddress}</Text>
          {fictitiousNames && (
            <Text style={[styles.small, { marginTop: 2, fontFamily: 'Helvetica-Oblique' }]}>
              The names of any unknown respondents being fictitious and unknown to
              Petitioner, the persons intended being in possession of the premises
              described herein.
            </Text>
          )}
        </View>
        <View style={styles.indexBox}>
          <Text style={styles.small}>Index / L&amp;T No.</Text>
          <Text style={styles.bold}>{indexNumber || '____________'}</Text>
          <Text style={[styles.small, { marginTop: 6 }]}>{docLabel}</Text>
          <Text style={styles.small}>{proceedingType}</Text>
        </View>
      </View>
      <Text style={styles.small}>{'-'.repeat(44)}X</Text>
    </View>
  );
}

// ---- Good Cause Eviction disclosure (required in legal notices) -------------
// L. 2024, ch. 56. Every covered notice/petition must state whether the unit is
// subject to Good Cause, and if not, the reason. VERIFY current requirements.
export function GoodCauseDisclosure({ status, reason }) {
  const covered = status === 'covered';
  return (
    <View style={[styles.juratBox, { borderColor: '#1a2b4a' }]}>
      <Text style={styles.bold}>NOTICE REGARDING THE GOOD CAUSE EVICTION LAW</Text>
      {covered ? (
        <Text style={[styles.small, { marginTop: 4 }]}>
          The housing accommodation that is the subject of this notice/proceeding IS
          subject to the Good Cause Eviction Law (L. 2024, ch. 56). The good cause for
          this proceeding is set forth in this document.
        </Text>
      ) : (
        <Text style={[styles.small, { marginTop: 4 }]}>
          The housing accommodation that is the subject of this notice/proceeding is NOT
          subject to the Good Cause Eviction Law for the following reason:{' '}
          {reason || '____________________'}.
        </Text>
      )}
    </View>
  );
}

// ---- "Notice of Petition" tenant-information / resources section ------------
export function TenantNoticeSection({ data, caseType }) {
  const {
    premisesAddress = '____________',
    moneyJudgment = 0,
    isNyc = true,
  } = data;
  return (
    <View>
      <Text style={[styles.bold, styles.para]}>Your landlord is suing you for eviction.</Text>

      <Numbered n={1}>
        Your landlord has started a {caseType === 'holdover' ? 'holdover' : 'nonpayment'}{' '}
        eviction case against you.{' '}
        {caseType === 'holdover'
          ? 'That means the landlord says you should be evicted for a reason other than not paying rent. The reasons are in the attached Petition.'
          : 'That means the landlord says you owe rent. The details are in the attached Petition.'}
      </Numbered>
      <Numbered n={2}>
        Your landlord is asking this Court for permission to evict you from your home at{' '}
        {premisesAddress}
        {moneyJudgment ? `, and for a money judgment of ${fmtMoney(moneyJudgment)}.` : '.'}
      </Numbered>
      <Numbered n={3}>
        You must come to court on the date and at the time and place shown on this Notice.{' '}
        <Text style={styles.bold}>Warning!</Text> If you do not come to court, a judgment
        may be entered against you and the landlord may have the right to evict you. You
        have the right to ask the court to postpone the case for 14 days, but you must come
        to court to ask for that.
      </Numbered>
      <Numbered n={4}>
        In court you may tell the judge the legal reasons you should be allowed to stay
        (your defenses) and any claims you have against the landlord. You may also give
        your Answer in writing. Help is available at www.nycourts.gov/housingnyc.
      </Numbered>
      <Numbered n={5}>
        If your name is not on this Notice but you live in the home above, you have the
        right to come to court and tell the judge why you should be allowed to stay.
      </Numbered>

      <Text style={[styles.bold, { marginTop: 6 }]}>Available resources</Text>
      {isNyc ? (
        <View>
          <Text style={styles.small}>• Free legal help (NYC Right to Counsel): 718-557-1379 · www.nycourts.gov/nyc-freelawyer</Text>
          <Text style={styles.small}>• Free interpreter: tell the Clerk or call 646-386-5670</Text>
          <Text style={styles.small}>• ADA accommodation: 646-386-5300 or 711 (TTY)</Text>
          <Text style={styles.small}>• Rent help (HRA Infoline): 718-557-1399</Text>
          <Text style={styles.small}>• A Help Center is available at the courthouse.</Text>
        </View>
      ) : (
        <Text style={styles.small}>
          Ask your local court clerk about free legal help, free interpreters, disability
          accommodations, and rental-assistance resources in your county.
        </Text>
      )}

      <Text style={[styles.small, styles.para, { marginTop: 6 }]}>
        If your case is not finished within 60 days, or you ask to postpone it again, the
        court may order you to deposit rent (RPAPL § 745). After a judgment, you will
        receive a Notice of Eviction from a marshal/sheriff giving you at least 14 days to
        leave (RPAPL § 749(2)).
      </Text>
    </View>
  );
}

// ---- Verification (sworn) ---------------------------------------------------
export function Verification({ county, signerName, role = 'Petitioner' }) {
  return (
    <View style={styles.juratBox}>
      <Text style={styles.bold}>VERIFICATION</Text>
      <Text style={[styles.small, { marginTop: 4 }]}>STATE OF NEW YORK, COUNTY OF {county} ss.:</Text>
      <Text style={[styles.small, { marginTop: 4 }]}>
        The undersigned, being duly sworn, deposes and says that deponent is the {role}{' '}
        in this proceeding; that deponent has read the foregoing petition and knows the
        contents thereof; and that the same is true to deponent's own knowledge, except as
        to matters stated upon information and belief, and as to those matters deponent
        believes them to be true.
      </Text>
      <View style={[styles.captionRow, { marginTop: 22 }]}>
        <Text style={styles.small}>
          Sworn to before me this ____ day of __________, 20____{'\n\n'}
          ______________________________{'\n'}Notary Public
        </Text>
        <Text style={styles.small}>
          ______________________________{'\n'}
          {signerName} ({role})
        </Text>
      </View>
    </View>
  );
}

export function Numbered({ n, children }) {
  return (
    <View style={[styles.para, { flexDirection: 'row' }]}>
      <Text style={[styles.bold, { width: 18 }]}>{n}.</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
}

export { fmtMoney, fmtDate };
