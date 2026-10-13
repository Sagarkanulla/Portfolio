# Vijay Sagar Kanulla — portfolio rebuild

A complete Next.js starter rebuild with a modern dark editorial UI, responsive layout, searchable/filterable project cards, certificate gallery, career timeline, and Supabase-backed admin dashboard.

## Implementation status

### Included in this source package
- Rebuilt Next.js 15 / React 19 / TypeScript interface.
- Balanced AI/ML, Data Analytics, and Full-Stack positioning.
- Project and certificate starter data based on the uploaded portfolio ZIP and resume.
- Responsive layout, reduced-motion support, metadata, Open Graph basics, and semantic section navigation.
- `/admin` login UI using Supabase Auth; project and certificate CRUD; certificate PDF/image upload.
- Supabase SQL schema, public-read/admin-write Row Level Security policies, and certificate storage policies.
- Link-checking script for supplied portfolio, social, and project URLs.
- The old hardcoded admin credentials and localStorage content editing are not carried forward.

### Requires your own configuration before deployment
- Create a Supabase project and apply `supabase/schema.sql` in the SQL editor.
- Copy `.env.example` to `.env.local` and enter your Supabase project URL and anon/publishable key.
- Create an admin user in Supabase Auth. Assign `{"role":"admin"}` in the user's trusted **app_metadata** using the Supabase dashboard or a trusted server-side admin API. Never use `user_metadata` for authorization and never commit a service-role key.
- Put your approved resume PDF at `public/resume.pdf` (the provided source resume is kept as `source-resume.docx`; Next.js does not automatically serve it as a PDF).
- Add certificate files and credential URLs through `/admin` only after confirming they are safe to publish.
- Run the link checker in an environment with network access: `npm run check:links`.
- Verify project behavior, screenshots, repository links, mobile layout, accessibility, and SEO before launch.

## Run locally

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL and anon/publishable key
npm run dev
```

Open `http://localhost:3000` and `http://localhost:3000/admin`.

## Secure admin model

The browser uses only the Supabase publishable/anon key. Database RLS checks `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'` for writes. The frontend's role check is for user experience; the database policy is the security boundary. Do not expose a service-role key. Review and test the policies in a non-production Supabase project before enabling public deployment.

The certificate bucket is public because uploaded files are intended to be visible on the portfolio. Do not upload private certificates or documents containing sensitive identifiers. If private files are needed, change to a private bucket and generate short-lived signed URLs.

## Data accuracy and link verification

- Starter content is sourced from the uploaded portfolio files and resume. Project and credential URLs are blank unless supplied in the source material.
- SeminarSync (`https://seminardought.vercel.app/`) and TaskFlow (`https://taskflow-production-a420.up.railway.app`) were present in the resume, but their availability and feature behavior still need a live check.
- The supplied resume states CGPA 7.35, while the older portfolio database states 7.04. A prior conversation also mentioned 7.19. This rebuild deliberately shows a verification prompt rather than silently selecting one. Confirm the final figure against the consolidated grade card and update `lib/data.ts` / education record before publishing.
- No certificate credential URLs or actual certificate scans were included in the source ZIP, so the gallery marks them as pending instead of inventing verification links.
- Look2Local was included as a featured project based on project context available to the user; confirm that it belongs in this portfolio and add its exact live demo/repository links.

## Recommended next steps

1. Configure Supabase and run the schema/seed SQL.
2. Verify and correct education/CGPA, project details, dates, and all external URLs.
3. Upload the actual certificate files and credential verification URLs.
4. Add a PDF version of the current resume to `public/resume.pdf`.
5. Run a production build, `npm run check:links`, keyboard/accessibility review, and mobile/browser tests.
6. Deploy to Vercel and set the environment variables in the project settings.

## Validation performed in this workspace

- Source package and resume were inspected and the replacement files were generated.
- External URL checks were attempted with `scripts/check-links.mjs`, but network requests failed in this workspace, so the links remain **unverified** rather than being marked valid.
- Dependency installation did not complete within the available execution window; a Next.js production build has **not** been verified here. Run the setup and build steps above before deploying.
