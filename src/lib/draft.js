// Local storage for the "build before you sign up" funnel.
// - Intake answers (role/location/housing) persist in localStorage for anonymous users.
// - An in-progress document's answers are stashed in sessionStorage when we send
//   the user to sign up, then restored after they return.

const INTAKE_KEY = 'pr_intake';
const DRAFT_KEY = 'pr_pending_doc';

export function getLocalIntake() {
  try { return JSON.parse(localStorage.getItem(INTAKE_KEY)) || {}; }
  catch { return {}; }
}
export function setLocalIntake(answers) {
  try { localStorage.setItem(INTAKE_KEY, JSON.stringify(answers || {})); } catch {}
}
export function clearLocalIntake() {
  try { localStorage.removeItem(INTAKE_KEY); } catch {}
}

// Stash the document the user was building so it survives the signup redirect.
export function savePendingDraft(docType, values) {
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ docType, values })); } catch {}
}
export function takePendingDraft(docType) {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    if (d && d.docType === docType) {
      sessionStorage.removeItem(DRAFT_KEY);
      return d.values;
    }
  } catch {}
  return null;
}

// Continuous per-document auto-save (survives refresh / accidental navigation).
const formKey = (docType) => `pr_form_${docType}`;
export function saveFormAutosave(docType, values) {
  try { localStorage.setItem(formKey(docType), JSON.stringify(values || {})); } catch {}
}
export function loadFormAutosave(docType) {
  try { return JSON.parse(localStorage.getItem(formKey(docType))); } catch { return null; }
}
export function clearFormAutosave(docType) {
  try { localStorage.removeItem(formKey(docType)); } catch {}
}
