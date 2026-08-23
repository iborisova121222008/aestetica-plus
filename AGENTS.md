# Estetica Plus — Instructions for Coding Agents

## 1. Source of Truth

Before changing code, read:

1. `README.md`;
2. `ARCHITECTURE.md`;
3. the numbered documents relevant to the requested task;
4. the applicable Architecture Decision Records in `docs/decisions/`.

The approved documentation is the source of truth. If documents conflict, stop and explain the conflict before editing. Do not silently choose a different architecture.

## 2. Scope and Approval

- Work on one bounded task at a time.
- Inspect the current repository and existing changes before editing.
- Preserve unrelated user changes.
- Do not rename approved top-level files, folders, applications, modules, routes, or domain concepts without explicit approval.
- Do not introduce a new framework, infrastructure service, state library, ORM, CMS, authentication provider, payment provider, or major dependency without explicit approval.
- Do not change an approved business rule merely because another implementation appears simpler.
- Ask before making a decision that is missing from the documentation and would materially affect architecture, data, security, booking behavior, or the admin workflow.

## 3. Approved Boundaries

### Next.js — `apps/web`

Next.js owns the public website, BG/EN presentation, customer portal, custom admin UI, metadata, structured data, and browser interactions.

- Use the App Router.
- Use Server Components by default.
- Add Client Components only where browser state or interaction requires them.
- Do not import Prisma or access PostgreSQL directly.
- Do not implement authoritative authorization or booking rules only in the frontend.
- Do not store access or refresh tokens in `localStorage` or `sessionStorage`.

### NestJS — `apps/api`

NestJS is the only application backend and owns authentication, authorization, validation, business rules, database access, signed uploads, and protected operations.

- Organize code by the approved business modules.
- Validate all external input at the API boundary.
- Use Guards for authoritative role and resource authorization.
- Never trust client-calculated availability, duration, price, role, or ownership.

### Prisma and PostgreSQL

- Prisma is used only by NestJS.
- Use versioned Prisma migrations for schema changes.
- Do not use unsafe production schema synchronization.
- Reviewed custom SQL migrations are allowed when PostgreSQL-specific booking constraints require them.
- Store money as integer minor units or an exact database decimal; never use JavaScript floating-point arithmetic for money.

### Images

- Cloudinary stores and delivers image binaries.
- PostgreSQL stores Cloudinary public IDs and image metadata.
- Do not commit production images or route original uploads through the VPS.

## 4. Stable Product Rules

- Public routes use explicit `/bg/...` and `/en/...` prefixes.
- Bulgarian is the primary locale; both locales are first-class.
- The custom admin UI is part of Next.js; Payload CMS is not used in the approved first version.
- A specialist may override the default duration and booking duration of a service.
- `bookingDurationMinutes` is the complete calendar-blocking time; there are no separate buffer fields.
- A selected slot can be held server-side for 10 minutes according to `docs/08-booking-engine.md`.
- Staff, rooms, and limited devices may participate as booking resources.
- Guest booking is allowed, while the system should encourage account creation and support treatment history.
- Online payment is out of scope for phase 1. The architecture may later support optional Stripe prepayment, but do not add it now.

## 5. Implementation Quality

- Keep changes small, typed, readable, and aligned with existing conventions.
- Prefer straightforward code over premature abstractions.
- Do not create empty shared packages or speculative modules.
- Preserve accessibility, mobile-first behavior, SEO, and performance requirements.
- Add or update tests for changed behavior at the appropriate level.
- Run the narrowest relevant checks first, then the broader project checks required by the task.
- Never add real secrets, credentials, personal data, or production tokens to the repository.
- Update `.env.example` only with safe placeholder names and document new variables.

## 6. Git Safety

- Do not commit, push, merge, rebase, or create a pull request unless the user explicitly asks.
- Do not discard or overwrite unrelated working-tree changes.
- Avoid destructive Git commands.
- When asked for a commit, make it focused and propose a conventional commit message.

## 7. Completion Report

At the end of every implementation task, report:

- what changed;
- which files changed;
- which checks and tests ran and their results;
- any assumptions, open decisions, or remaining risks;
- a suggested focused commit message.

Do not claim a check passed unless it was actually run.
