import { supabase } from './supabaseClient.js';

const NYSCEF_CITATION = 'NYSCEF Procedures';

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ---- Statutes ----------------------------------------------------------
export async function getStatutes() {
  const { data, error } = await supabase
    .from('statutes')
    .select('*')
    .order('category', { ascending: true })
    .order('citation', { ascending: true });
  if (error) throw error;
  // Keep the NYSCEF Procedures record out of the statute table view.
  return (data || []).filter((s) => s.citation !== NYSCEF_CITATION);
}

async function logAction({ statuteId, citation, action, note, adminEmail }) {
  await supabase.from('law_review_log').insert({
    statute_id: statuteId || null,
    citation,
    action,
    note: note || null,
    admin_email: adminEmail || null,
  });
}

export async function markVerified(statute, adminEmail) {
  const { data, error } = await supabase
    .from('statutes')
    .update({ last_verified_date: today(), flagged_for_review: false })
    .eq('id', statute.id)
    .select()
    .single();
  if (error) throw error;
  await logAction({
    statuteId: statute.id, citation: statute.citation,
    action: 'verified', note: `Verified current as of ${today()}.`, adminEmail,
  });
  return data;
}

export async function setFlag(statute, flagged, adminEmail) {
  const { data, error } = await supabase
    .from('statutes')
    .update({ flagged_for_review: flagged })
    .eq('id', statute.id)
    .select()
    .single();
  if (error) throw error;
  await logAction({
    statuteId: statute.id, citation: statute.citation,
    action: flagged ? 'flagged' : 'unflagged',
    note: flagged ? 'Flagged for review.' : 'Flag cleared.', adminEmail,
  });
  return data;
}

export async function saveNotes(statute, notes, adminEmail) {
  const { data, error } = await supabase
    .from('statutes')
    .update({ notes })
    .eq('id', statute.id)
    .select()
    .single();
  if (error) throw error;
  await logAction({
    statuteId: statute.id, citation: statute.citation,
    action: 'note', note: 'Notes updated.', adminEmail,
  });
  return data;
}

// ---- Law update log (also shown to users) ------------------------------
export async function getLawLog(limit = 50) {
  const { data, error } = await supabase
    .from('law_review_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// Returns citations (from cited list) that are currently flagged for review.
export async function getFlaggedCitations(citations) {
  if (!citations || !citations.length) return [];
  const { data, error } = await supabase
    .from('statutes')
    .select('citation')
    .in('citation', citations)
    .eq('flagged_for_review', true);
  if (error) return [];
  return (data || []).map((s) => s.citation);
}

// ---- NYSCEF Procedures (stored as a dedicated statutes row) -------------
export async function getNyscefProcedures() {
  const { data } = await supabase
    .from('statutes')
    .select('*')
    .eq('citation', NYSCEF_CITATION)
    .maybeSingle();
  return data;
}

export async function saveNyscefProcedures(text, adminEmail) {
  const existing = await getNyscefProcedures();
  if (existing) {
    const { data, error } = await supabase
      .from('statutes')
      .update({ notes: text, last_verified_date: today() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    await logAction({ statuteId: existing.id, citation: NYSCEF_CITATION, action: 'note', note: 'NYSCEF procedures updated.', adminEmail });
    return data;
  }
  const { data, error } = await supabase
    .from('statutes')
    .insert({
      citation: NYSCEF_CITATION,
      name: 'NYSCEF e-filing procedures',
      category: 'NYSCEF',
      notes: text,
      last_verified_date: today(),
    })
    .select()
    .single();
  if (error) throw error;
  await logAction({ statuteId: data.id, citation: NYSCEF_CITATION, action: 'note', note: 'NYSCEF procedures created.', adminEmail });
  return data;
}
