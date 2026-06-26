import { Page, Text, View } from '@react-pdf/renderer';
import { styles } from './pdfTheme.js';
import { PdfFooter, PdfPageNumber } from './PdfShared.jsx';

// Appended as the final page of every generated document: plain-language
// filing & service steps, NYSCEF e-filing basics, fees, and citations.
// `instructions` = { title, serviceInstructions[], nextSteps, statutes[] }.
export default function InstructionsPage({ instructions = {}, lawReviewDate }) {
  const {
    title = 'this document',
    serviceInstructions = [],
    nextSteps = '',
    statutes = [],
  } = instructions;

  return (
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.h1}>How to file &amp; serve</Text>
      <Text style={[styles.center, styles.small, styles.para]}>
        Instruction sheet for: {title} — do not file this page with the court.
      </Text>

      <Section heading="Step-by-step">
        {serviceInstructions.length ? (
          serviceInstructions.map((s, i) => (
            <Bullet key={i} n={i + 1}>{s}</Bullet>
          ))
        ) : (
          <Text style={styles.small}>Follow your court's filing instructions.</Text>
        )}
      </Section>

      {nextSteps ? (
        <Section heading="What to do next">
          <Text>{nextSteps}</Text>
        </Section>
      ) : null}

      <Section heading="Electronic filing (NYSCEF)">
        <Text style={styles.para}>
          Many New York courts use the New York State Courts Electronic Filing System
          (NYSCEF) for filing and serving documents. Whether e-filing is required,
          permitted by consent, or unavailable depends on the court and case type —
          some landlord-tenant matters are still filed in person at the clerk's office.
        </Text>
        <Text style={styles.para}>
          Before filing: (1) confirm with your specific court whether the case is
          e-filed or filed in person; (2) if e-filing, create or log in to your NYSCEF
          account and follow the prompts to upload this document; (3) keep the
          confirmation/notice of receipt the system generates.
        </Text>
        <Text style={[styles.small, { color: '#92400e' }]}>
          NYSCEF availability and procedures change. Verify the current rules for your
          county and court before relying on this summary.
        </Text>
      </Section>

      <Section heading="Filing fees">
        <Text>
          Filing fees vary by court, county, and document type, and change over time.
          Confirm the current fee with the clerk before filing. If you cannot afford the
          fee, ask the clerk about a fee waiver (Poor Person application).
        </Text>
      </Section>

      {statutes.length ? (
        <Section heading="Authorities cited in this document">
          <Text style={styles.small}>{statutes.join('  •  ')}</Text>
        </Section>
      ) : null}

      <PdfFooter lawReviewDate={lawReviewDate} hasStatutes={statutes.length > 0} />
      <PdfPageNumber />
    </Page>
  );
}

function Section({ heading, children }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.bold, { marginBottom: 4 }]}>{heading}</Text>
      {children}
    </View>
  );
}

function Bullet({ n, children }) {
  return (
    <View style={[styles.para, { flexDirection: 'row' }]}>
      <Text style={[styles.bold, { width: 16 }]}>{n}.</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
}
