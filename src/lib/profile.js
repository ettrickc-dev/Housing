import { supabase } from './supabaseClient.js';

// Profile read/update helpers. The row is auto-created by a DB trigger on signup,
// so getProfile normally finds an existing row; we upsert defensively anyway.

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(userId, fields) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...fields }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Fields editable on the Profile page, grouped for the form UI.
export const PROFILE_FIELDS = [
  { group: 'Your information', fields: [
    { key: 'full_name', label: 'Full name' },
    { key: 'email', label: 'Email', type: 'email', readOnly: true },
  ]},
  { group: 'Premises / mailing address', fields: [
    { key: 'address_line1', label: 'Street address' },
    { key: 'address_line2', label: 'Address line 2' },
    { key: 'unit_number', label: 'Apartment / unit' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip', label: 'ZIP' },
    { key: 'borough', label: 'Borough (if NYC)', tip: 'Bronx, Brooklyn, Manhattan, Queens, or Staten Island' },
    { key: 'county', label: 'County (if outside NYC)' },
  ]},
  { group: 'The other party', fields: [
    { key: 'landlord_name', label: 'Landlord / tenant name', tip: 'The opposing party in your case' },
    { key: 'landlord_address', label: 'Their address' },
  ]},
  { group: 'Case & lease facts', fields: [
    { key: 'court_index_number', label: 'Court index number', tip: 'Assigned by the clerk once a case is filed. Leave blank if none yet.' },
    { key: 'lease_type', label: 'Lease type' },
    { key: 'rent_amount', label: 'Monthly rent ($)', type: 'number' },
    { key: 'arrears_amount', label: 'Amount owed / arrears ($)', type: 'number' },
  ]},
];

// Numeric fields that must be coerced before sending to Postgres.
export const NUMERIC_PROFILE_KEYS = ['rent_amount', 'arrears_amount'];
