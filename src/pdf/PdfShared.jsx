import { Text, View } from '@react-pdf/renderer';
import { styles } from './pdfTheme.js';
import { LEGAL_DISCLAIMER, statuteFooterNote } from '../lib/constants.js';

// Fixed footer on every page: verbatim disclaimer + (optional) statute note.
// `fixed` makes it repeat on all pages.
export function PdfFooter({ lawReviewDate, hasStatutes }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerDisclaimer}>{LEGAL_DISCLAIMER}</Text>
      {hasStatutes && (
        <Text style={styles.footerStatute}>{statuteFooterNote(lawReviewDate)}</Text>
      )}
    </View>
  );
}

export function PdfPageNumber() {
  return (
    <Text
      style={styles.pageNum}
      fixed
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    />
  );
}

// Diagonal PREVIEW watermark shown until the document is paid/unlocked.
export function PdfWatermark({ show }) {
  if (!show) return null;
  return (
    <Text style={styles.watermark} fixed>
      PREVIEW — NOT FOR FILING
    </Text>
  );
}
