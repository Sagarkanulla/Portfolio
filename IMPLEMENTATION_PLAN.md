# Portfolio rebuild — implementation plan and acceptance criteria

## Phase 1 — Foundation and correctness (P0)
- [x] Replace the legacy multi-page HTML structure with a single Next.js app-router application.
- [x] Remove the client-visible hardcoded admin credential approach.
- [x] Remove `localStorage` as the source of truth for content edits.
- [x] Add consistent navigation, shared global styles, responsive breakpoints, and correct root-relative routes.
- [ ] Run a production build in a network-enabled development environment.
- [ ] Confirm final CGPA against the official consolidated grade card before public release.

## Phase 2 — Modern portfolio experience (P1)
- [x] Build a modern, responsive hero and profile section.
- [x] Present AI/ML, Data Analytics, and Full-Stack Development as balanced career pillars.
- [x] Add project search and category filters.
- [x] Add experience, education, achievements, certificates, and contact sections.
- [x] Add SEO metadata and reduced-motion support.
- [ ] Review keyboard navigation, contrast, screen-reader labels, and mobile rendering.

## Phase 3 — Shared backend and admin (P1)
- [x] Add Supabase Auth sign-in UI.
- [x] Add project and certificate CRUD screens.
- [x] Add PDF/image upload for certificates.
- [x] Add PostgreSQL schema, seed records, triggers, RLS, and storage policies.
- [x] Gate admin mutations using trusted `app_metadata.role = admin` and database RLS.
- [ ] Create Supabase project, apply schema, create admin user, and set trusted app metadata.
- [ ] Test read/write/delete access as anonymous, regular authenticated, and admin users.
- [ ] Verify storage upload and intended public visibility.

## Phase 4 — Content verification (P0 before launch)
- [x] Carry forward the supplied resume and source portfolio's project/certificate content.
- [x] Include known SeminarSync and TaskFlow demo URLs supplied in the resume.
- [x] Add a repeatable external link checker.
- [ ] Confirm every live demo and GitHub repository manually; add exact repo links and screenshots.
- [ ] Upload original certificates and credential verification URLs; no verification links were invented.
- [ ] Confirm project descriptions match deployed functionality and add only reproducible metrics.
- [ ] Resolve CGPA conflict: resume says 7.35; old portfolio database says 7.04; prior conversation mentioned 7.19. Use the official final record.
- [ ] Place the approved resume PDF at `public/resume.pdf` after updating the CGPA and resume content if needed.

## Phase 5 — Release
- [ ] `npm install`, `npm run build`, and `npm run check:links` in an environment with network access.
- [ ] Test direct navigation to `/` and `/admin`, refresh behavior, form validation, and all external links.
- [ ] Set Supabase environment variables in Vercel and deploy a preview.
- [ ] Verify production logs, metadata, resume download, responsive layout, and RLS behavior.

## Definition of done
- A recruiter can understand the candidate's focus within one screen.
- All listed projects and credentials have accurate descriptions and working links or are explicitly marked pending.
- Content edits persist centrally through Supabase and appear to other visitors.
- Only a trusted admin can create/update/delete portfolio records; public visitors can only read published records.
- No service-role key or admin password is committed to source control.
