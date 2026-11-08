# User Guide — AADALA.MA

## Navigation
Home, Legal Library, Search, AADALA AI, MIYAR, Real Estate, Jurisprudence, Legal Services, Criminal Lab, Student, Founder, Dashboard.

## AADALA AI
Ask legal questions. Answers include: facts assumed, legal issue, legal basis, analysis, possible applications, references, certainty, missing info. Not a final professional consultation.

## MIYAR
Inheritance calculator (experimental). Requires complete heir data; otherwise requests expert review.

## Legal Library
7 verified PDF sources. Text extracted; verify against official gazette.

## Account
- Register / sign in with email + password at `/ar/register` and `/ar/login`.
- Your role (`user` by default; `legal_editor` / `legal_reviewer` / `admin` by administrators) is stored in `profiles` (RLS) — never in browser storage.
- The header shows your email and a logout button when signed in.
- Admins (role `admin`) open the Control Center at `/ar/admin`; other accounts see an access-denied page.
