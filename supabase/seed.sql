-- =====================================================================
-- PlainRights Court — seed data (statutes catalog)
-- Run AFTER schema.sql.
--
-- IMPORTANT / HONESTY NOTE:
--   last_verified_date is intentionally NULL for every row. These citations
--   are pre-loaded from the build spec and have NOT yet been independently
--   verified by a platform admin against current NY statutes and court rules.
--   The admin must verify each in the Law Review Dashboard, which stamps the
--   date that then appears in document footers. NY landlord-tenant law changed
--   substantially with HSTPA (2019) and the Good Cause Eviction Law (2024);
--   several section numbers and form numbers below should be confirmed.
-- =====================================================================

insert into public.statutes (citation, name, category, description, last_verified_date, flagged_for_review, notes) values
  ('RPAPL § 711', 'Grounds for special proceeding (nonpayment/holdout)', 'RPAPL', 'Summary proceeding to recover possession; § 711(2) nonpayment 14-day demand.', null, true, 'VERIFY: confirm 14-day rent demand requirement post-HSTPA.'),
  ('RPAPL § 713', 'Holdover grounds (no landlord-tenant relationship)', 'RPAPL', 'Ten-day notice grounds for certain holdover proceedings.', null, true, 'VERIFY current 10-day notice language.'),
  ('RPAPL § 735', 'Manner of service of notice of petition', 'RPAPL', 'Personal, substituted, and conspicuous (nail-and-mail) service rules.', null, true, 'VERIFY mailing requirements (regular + certified).'),
  ('RPAPL § 749', 'Warrant of eviction / 14-day notice', 'RPAPL', '14-day notice before execution of warrant.', null, true, 'VERIFY 14-day pre-execution notice post-HSTPA.'),
  ('RPAPL § 753', 'Stay in NYC holdover proceedings', 'RPAPL', 'Court discretionary stay; cure period for lease violations.', null, true, 'VERIFY cure-period mechanics.'),
  ('RPL § 226-c', 'Notice of rent increase / non-renewal', 'RPL', '30/60/90-day advance notice based on tenancy length (HSTPA).', null, true, 'VERIFY 30/60/90-day tiers and triggers.'),
  ('RPL § 235-b', 'Warranty of habitability', 'RPL', 'Implied warranty of habitability; rent abatement defense.', null, true, 'VERIFY.'),
  ('RPL § 235-d', 'Harassment of tenants', 'RPL', 'Tenant harassment cause of action.', null, true, 'VERIFY scope/coverage.'),
  ('CPLR § 1101', 'Poor person / fee waiver application', 'CPLR', 'Application to proceed as a poor person (fee waiver).', null, true, 'VERIFY.'),
  ('NYC Admin Code — Housing Maintenance Code', 'NYC Housing Maintenance Code', 'NYC', 'HP action basis; repair obligations and violations.', null, true, 'VERIFY relevant sections for HP actions.'),
  ('Rent Stabilization Law & Code (RSL/RSC)', 'Rent Stabilization Law & Code', 'Rent Regulation', 'Stabilized tenancy renewals, registration, succession.', null, true, 'VERIFY.'),
  ('Rent Stabilization Code § 2524 et seq.', 'RSC grounds for refusal to renew / eviction', 'Rent Regulation', 'Owner-use and other grounds; DHCR procedures.', null, true, 'VERIFY § 2524 grounds and RA-54 procedure.'),
  ('HSTPA 2019', 'Housing Stability & Tenant Protection Act of 2019', 'Legislation', 'Sweeping 2019 reform of notice periods, fees, and procedures.', null, true, 'Cross-cuts many sections above.'),
  ('Good Cause Eviction Law (L. 2024, ch. 56)', 'Good Cause Eviction Law (2024)', 'Legislation', 'Statewide good-cause framework with local opt-outs; track by county.', null, true, 'VERIFY coverage thresholds and county opt-in/opt-out status.'),
  ('Servicemembers Civil Relief Act (federal)', 'Servicemembers Civil Relief Act', 'Federal', 'Military-status protections; default judgment affidavit requirement.', null, true, 'VERIFY current SCRA affidavit requirements.'),
  ('NYC Local Law 53 (Right to Counsel)', 'NYC Right to Counsel', 'NYC', 'Right to counsel for eligible NYC tenants in housing court.', null, true, 'VERIFY current coverage / income eligibility.'),
  ('ERAP successor programs', 'Emergency Rental Assistance (successor programs)', 'Assistance', 'Pending-application stay implications.', null, true, 'VERIFY current program status.')
on conflict (citation) do nothing;

-- Which statutes the first MVP documents cite (drives in-app banners).
insert into public.document_statutes (doc_type, citation) values
  ('rent_demand_14day', 'RPAPL § 711'),
  ('rent_demand_14day', 'RPAPL § 735'),
  ('nonpayment_petition', 'RPAPL § 711'),
  ('nonpayment_petition', 'RPAPL § 735'),
  ('affidavit_of_service', 'RPAPL § 735'),
  ('answer_nonpayment', 'RPL § 235-b'),
  ('answer_nonpayment', 'CPLR § 1101'),
  ('osc_vacate_default', 'CPLR § 1101')
on conflict do nothing;
