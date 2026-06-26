import { StyleSheet } from '@react-pdf/renderer';

// Shared React-PDF stylesheet. Built-in Helvetica only — no external fonts,
// so generation works fully offline / client-side.
export const styles = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingBottom: 90, // room for the fixed disclaimer footer
    paddingHorizontal: 54,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#1a2b4a',
  },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  bold: { fontFamily: 'Helvetica-Bold' },
  h1: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8 },
  small: { fontSize: 9, color: '#4b5563' },
  para: { marginBottom: 10 },
  // court caption box
  captionWrap: { borderWidth: 1, borderColor: '#1a2b4a', padding: 8, marginBottom: 14 },
  captionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  indexBox: { borderWidth: 1, borderColor: '#1a2b4a', padding: 6, minWidth: 150 },
  hr: { borderBottomWidth: 1, borderBottomColor: '#9ca3af', marginVertical: 8 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#1a2b4a', width: 240, marginTop: 28, paddingTop: 3 },
  // jurat / notary block
  juratBox: { borderWidth: 1, borderColor: '#9ca3af', padding: 8, marginTop: 18 },
  // footers
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 54,
    right: 54,
  },
  footerDisclaimer: { fontSize: 7, color: '#6b7280', textAlign: 'justify' },
  footerStatute: { fontSize: 7, color: '#6b7280', marginTop: 4, fontFamily: 'Helvetica-Oblique' },
  pageNum: { position: 'absolute', bottom: 18, right: 54, fontSize: 7, color: '#9ca3af' },
  // watermark
  watermark: {
    position: 'absolute',
    top: 320,
    left: 70,
    fontSize: 46,
    color: '#f59e0b',
    opacity: 0.22,
    transform: 'rotate(-30deg)',
    fontFamily: 'Helvetica-Bold',
  },
});

// Format helpers — kept tiny and dependency-free.
export function fmtMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function fmtDate(d) {
  if (!d) return '__________________';
  const date = typeof d === 'string' ? new Date(d + 'T00:00:00') : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function joinAddress(parts) {
  return parts.filter(Boolean).join(', ');
}
