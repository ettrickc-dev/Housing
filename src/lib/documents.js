import { supabase } from './supabaseClient.js';

// Most recent admin-verified statute date, formatted for document footers.
// Returns null if nothing has been verified yet (all seed rows start NULL).
export async function getLawReviewDate() {
  const { data, error } = await supabase
    .from('statutes')
    .select('last_verified_date')
    .not('last_verified_date', 'is', null)
    .order('last_verified_date', { ascending: false })
    .limit(1);
  if (error || !data || !data.length) return null;
  const d = data[0].last_verified_date;
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Insert the document row, upload the PDF blob to Storage (path: <uid>/<id>.pdf),
// then save the storage path + a signed download URL. Returns the saved record.
export async function saveDocument({ userId, docType, title, statutes, fieldData, blob, paid = false }) {
  // 1) create the row to get an id
  const { data: row, error: insErr } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      doc_type: docType,
      title,
      status: paid ? 'paid' : 'preview',
      paid,
      cited_statutes: statutes || [],
      field_data: fieldData || {},
    })
    .select()
    .single();
  if (insErr) throw insErr;

  // 2) upload the PDF
  const path = `${userId}/${row.id}.pdf`;
  const { error: upErr } = await supabase.storage
    .from('documents')
    .upload(path, blob, { contentType: 'application/pdf', upsert: true });
  if (upErr) throw upErr;

  // 3) signed URL (7 days) + persist path
  const { data: signed } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  const { data: updated, error: updErr } = await supabase
    .from('documents')
    .update({ storage_path: path, download_url: signed?.signedUrl || null })
    .eq('id', row.id)
    .select()
    .single();
  if (updErr) throw updErr;

  return updated;
}

export async function getDocumentById(id) {
  const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// After payment: overwrite the stored PDF with the clean (un-watermarked) copy
// and refresh the signed download URL.
export async function replacePdf(doc, blob) {
  const path = doc.storage_path || `${doc.user_id}/${doc.id}.pdf`;
  const { error: upErr } = await supabase.storage
    .from('documents')
    .upload(path, blob, { contentType: 'application/pdf', upsert: true });
  if (upErr) throw upErr;

  const { data: signed } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  const { data: updated, error } = await supabase
    .from('documents')
    .update({ storage_path: path, download_url: signed?.signedUrl || null })
    .eq('id', doc.id)
    .select()
    .single();
  if (error) throw error;
  return updated;
}

// Create / advance a workflow so the dashboard + reminders can track next steps.
export async function upsertWorkflow({ userId, workflowType, stage, nextActionDate, nextActionLabel }) {
  const { data, error } = await supabase
    .from('workflows')
    .insert({
      user_id: userId,
      workflow_type: workflowType,
      stage,
      next_action_date: nextActionDate || null,
      next_action_label: nextActionLabel || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
