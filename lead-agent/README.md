# Standard Building Company — Namecheap Lead Agent (prototype)

This is a standalone Node.js service. It does **not** change DNS, forward email, or modify the existing website. Incoming email remains at Namecheap Private Email.

## Features implemented
- Secure IMAP connection to `mail.privateemail.com:993`
- Periodic polling of INBOX (minimum 60 seconds)
- SQLite message index with unique IMAP UIDs (deduplicated per mailbox)
- Simple subject-line triage: potential-lead / review
- Token-protected read-only leads API: `GET /leads`
- Token-protected manual poll: `POST /check`
- Unauthenticated `GET /health` (no customer data)

## Setup
1. Use a persistent Node.js 22+ host (VM/container). This is **not** suitable for GitHub Pages, and a sleeping/free web instance will not monitor continuously.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env`. Set `EMAIL_USER`, `EMAIL_PASSWORD`, and a randomly generated `ADMIN_TOKEN` of at least 24 characters. Enter credentials **only** in the host's encrypted secrets manager; never commit them or paste them into ChatGPT.
4. Provide a persistent volume for `DB_PATH` (SQLite) and restrict access to the admin API (HTTPS, authentication, network policy).
5. Run `npm start` under a process supervisor with restart-on-failure.
6. Test `/health`, run a mailbox check, and inspect `/leads` using a Bearer token.

## Important limitations / work before production
- This is an **initial implementation, not a deployed or tested production service**.
- Subject-only classification is a basic heuristic; it does not read message bodies, generate AI replies, or send emails.
- Mailbox UID validity and retention/rotation handling need to be added before relying on the index long term.
- The polling loop currently fetches the last 250 message sequence numbers per run; implement incremental UID scanning and bounded recovery for larger inboxes.
- SMTP sending is deliberately disabled until sender authentication, opt-in approval, rate limits, audit logging, and delivery tests are implemented.
- Add alerts for new leads, health checks, backups, logging without personal data, and secret rotation.
- For reliable 24/7 operation, provision always-on hosting and a monitoring/alerting mechanism.
