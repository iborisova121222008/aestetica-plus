# ADR-001: Core System Architecture

- **Status:** Accepted
- **Date:** 2026-08-23
- **Decision owners:** Aestetica Plus project owner

## Context

Aestetica Plus requires a bilingual, image-heavy public website, an appointment system, customer accounts, and a custom administration interface. The system must remain responsive, secure, SEO-friendly, maintainable, and deployable on a SuperHosting VPS.

The project also needs clear ownership boundaries so that incremental and AI-assisted development does not create duplicated business logic, multiple database access paths, or incompatible authentication systems.

## Decision

The project will use a TypeScript monorepo with the following primary applications:

- `apps/web`: Next.js 15 App Router for the public website, customer portal, and custom admin UI;
- `apps/api`: NestJS for the API, business logic, authentication, authorization, and database access.

The supporting architecture is:

- PostgreSQL as the primary relational database;
- Prisma as the only ORM and migration owner, used only by NestJS;
- Cloudinary for image storage, transformations, and CDN delivery;
- explicit `/bg/...` and `/en/...` routes, with Bulgarian as the primary locale;
- NestJS-managed access and refresh tokens, with refresh tokens in secure `HttpOnly` cookies;
- Docker-based deployment behind Nginx on the SuperHosting VPS;
- a custom Next.js admin interface rather than Payload CMS in the approved first version.

NestJS is the authoritative owner of booking rules and protected operations. Booking conflict prevention must use transactions and database-level protection, not only an application-level availability check.

Phase 1 will not implement online payments. The future architecture may support optional Stripe prepayment without making payment mandatory for booking.

Detailed rules remain in the numbered documentation, especially:

- `docs/03-frontend.md`;
- `docs/04-backend.md`;
- `docs/05-database.md`;
- `docs/06-auth.md`;
- `docs/07-images.md`;
- `docs/08-booking-engine.md`;
- `docs/10-deployment.md`;
- `docs/12-internationalization.md`.

## Consequences

### Positive

- One TypeScript language across the frontend and backend.
- Clear separation between presentation and authoritative business logic.
- One controlled database access and migration path.
- Server-rendered public pages can support SEO and mobile performance goals.
- The custom admin can match the product's exact workflows.
- Image growth does not consume VPS disk or application bandwidth.
- The architecture can later support more staff, rooms, devices, and optional payments.

### Trade-offs

- Two applications must be built, deployed, and monitored.
- A custom admin requires more implementation work than a generated CMS interface.
- Booking concurrency protection may require reviewed PostgreSQL-specific SQL alongside Prisma migrations.
- Content changes depend on the custom admin features available at each phase.

## Alternatives Considered

### Next.js as both frontend and sole backend

Not selected because the approved system requires a dedicated modular backend and one clear owner for authentication, booking logic, and database access.

### Payload CMS as the administration layer

Not selected for the first version. A custom Next.js admin gives direct control over services, schedules, resources, appointments, and future workflows without introducing a second application owner for business data.

### Prisma access from both Next.js and NestJS

Rejected because it would blur ownership, duplicate authorization and business rules, and increase the risk of inconsistent writes.

### Storing images on the VPS or in PostgreSQL

Rejected because the project expects a large image library and requires responsive transformations, CDN delivery, and predictable application-server load.

### Mandatory online payment in the first version

Deferred. Booking must work without payment. Optional Stripe prepayment can be evaluated and documented in a later ADR.

## Review Triggers

Create a new ADR before changing any of the following:

- the backend, ORM, database, authentication owner, CMS, or image provider;
- the ownership boundary between Next.js and NestJS;
- the locale URL strategy;
- the custom-admin decision;
- the payment scope;
- the primary deployment model.

Do not rewrite this accepted record to hide a later decision. Supersede it with a new ADR when necessary.
