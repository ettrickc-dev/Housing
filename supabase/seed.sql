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

-- Additional citations referenced by the expanded document library (so each
-- appears in the Admin Law Review dashboard for verification). Strings match the
-- `statutes` arrays in src/documents/registry.jsx exactly.
insert into public.statutes (citation, name, category, description, last_verified_date, flagged_for_review, notes) values
  ('CPLR § 4102', 'Demand for trial by jury', 'CPLR', 'Demand and waiver of jury trial.', null, true, 'VERIFY jury demand timing and any lease waiver effect.'),
  ('CPLR § 5015', 'Relief from judgment / vacate default', 'CPLR', 'Grounds to vacate a default judgment (excusable default + meritorious defense).', null, true, 'VERIFY.'),
  ('CPLR § 5020', 'Satisfaction of judgment', 'CPLR', 'Execution and form of a satisfaction piece.', null, true, 'VERIFY acknowledgment requirements.'),
  ('CPLR § 5021', 'Entry of satisfaction by the clerk', 'CPLR', 'Clerk marks the judgment satisfied of record.', null, true, 'VERIFY filing procedure.'),
  ('RPAPL § 732', 'Nonpayment procedure / time to answer', 'RPAPL', 'Special rules for nonpayment proceedings, including default.', null, true, 'VERIFY time-to-answer and default mechanics.'),
  ('RPAPL § 747', 'Judgment in summary proceeding', 'RPAPL', 'Final judgment of possession and money judgment.', null, true, 'VERIFY.'),
  ('RPAPL § 768', 'Unlawful eviction', 'RPAPL', 'Prohibition on self-help / unlawful eviction.', null, true, 'VERIFY scope and penalties.'),
  ('RPAPL § 853', 'Action for forcible/unlawful eviction (treble damages)', 'RPAPL', 'Damages for unlawful eviction; basis for restoration.', null, true, 'VERIFY treble-damages availability.'),
  ('NYC Admin Code § 26-521', 'Unlawful eviction (NYC)', 'NYC', 'NYC unlawful eviction protections (30-day occupancy).', null, true, 'VERIFY current NYC provisions.'),
  ('NYC Housing Maintenance Code', 'NYC Housing Maintenance Code', 'NYC', 'HP action basis; repair obligations and violations.', null, true, 'VERIFY relevant HMC sections.'),
  ('Multiple Dwelling Law', 'Multiple Dwelling Law', 'NYC/State', 'Habitability and maintenance standards for multiple dwellings.', null, true, 'VERIFY applicable sections.'),
  ('Servicemembers Civil Relief Act', 'Servicemembers Civil Relief Act', 'Federal', 'Military-status protections; default-judgment affidavit requirement.', null, true, 'VERIFY current SCRA affidavit requirements.'),
  ('Rent Stabilization Code § 2522.5', 'RSC — renewal lease offers', 'Rent Regulation', 'Renewal lease form, terms, and timing (RTP-8).', null, true, 'VERIFY renewal window and RA-LR1 rider.'),
  ('Rent Stabilization Code § 2524.2', 'RSC — notice of non-renewal', 'Rent Regulation', 'Notice requirements to refuse renewal (Golub window).', null, true, 'VERIFY 90–150 day window.'),
  ('Rent Stabilization Code § 2524.4', 'RSC — grounds for refusal to renew', 'Rent Regulation', 'Owner-use, demolition, and other permitted grounds.', null, true, 'VERIFY grounds and DHCR approval where required.'),
  ('Rent Stabilization Code § 2528', 'RSC — annual registration', 'Rent Regulation', 'Owner annual rent registration with DHCR (RR-1/RR-2A).', null, true, 'VERIFY current registration procedure (ARRO).'),
  ('RGB Order (current)', 'Rent Guidelines Board order (current)', 'Rent Regulation', 'Annual RGB renewal increase percentages — change yearly.', null, true, 'VERIFY current RGB order each year before offering renewals.')
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
