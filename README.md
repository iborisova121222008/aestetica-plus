# Estetica Plus

Production-ready bilingual website and appointment platform for the Estetica Plus beauty and aesthetics studio.

- Domain: `esteticaplus.bg`
- Primary locale: Bulgarian (`bg`)
- Secondary locale: English (`en`)
- Hosting target: SuperHosting VPS
- Architecture: Next.js + NestJS + Prisma + PostgreSQL
- Image delivery: Cloudinary

## Project Goals

The platform must provide:

- a premium, luxury visual experience;
- excellent mobile, tablet, and desktop responsiveness;
- fast loading and strong Core Web Vitals;
- technically correct multilingual SEO;
- online appointment booking;
- customer accounts and a customer portal;
- a custom admin panel;
- management of services, categories, prices, durations, staff, working hours, appointments, reviews, content, and images;
- support for hundreds or thousands of images over time;
- maintainable and testable code;
- safe deployment and straightforward future scaling.

## Approved Architecture

### Next.js

Next.js is responsible for:

- the public website;
- Bulgarian and English routes;
- the customer portal;
- the custom admin interface;
- page rendering, metadata, structured data, sitemap, and frontend interactions.

### NestJS

NestJS is the only application backend and is responsible for:

- authentication and authorization;
- users and customer profiles;
- services and prices;
- staff and working hours;
- appointment availability and booking;
- reviews;
- gallery metadata;
- notifications;
- admin operations.

### PostgreSQL and Prisma

- PostgreSQL is the primary relational database.
- Prisma is the only ORM and migration owner.
- Only the NestJS application accesses Prisma.
- The Next.js application must not import or use Prisma directly.
- Booking conflicts must be prevented transactionally and at database level.

### Cloudinary

- Original images are uploaded directly from the browser using signed upload parameters issued by NestJS.
- Image binaries do not pass through or live on the VPS.
- PostgreSQL stores image metadata and Cloudinary public IDs, not image files.
- Public pages use responsive Cloudinary transformations and CDN delivery.

## Authentication Summary

- NestJS owns registration, login, logout, password reset, token refresh, and role checks.
- Access tokens are short-lived.
- Refresh tokens are stored in `HttpOnly`, `Secure`, appropriately configured `SameSite` cookies.
- Tokens must never be stored in `localStorage`.
- Supported roles:
  - `CUSTOMER`
  - `STAFF`
  - `ADMIN`
  - `SUPER_ADMIN` when required
- Next.js middleware may provide initial route protection and redirects.
- NestJS Guards always perform the authoritative authorization check.

## Internationalization Summary

All public routes use an explicit locale prefix:

```text
/bg/...
/en/...
```

Bulgarian is the primary content locale. Both locales require:

- translated content;
- locale-specific slugs where appropriate;
- locale-specific metadata;
- canonical URLs;
- `hreflang` alternates;
- locale-aware sitemap entries;
- translated image alternative text.

Detailed rules belong in `docs/12-internationalization.md`.

## Repository Structure

The approved documentation structure is:

```text
estetica-plus/
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
├── apps/
│   ├── web/
│   └── api/
├── packages/
├── docs/
│   ├── 01-content-model.md
│   ├── 02-design-system.md
│   ├── 03-frontend.md
│   ├── 04-backend.md
│   ├── 05-database.md
│   ├── 06-auth.md
│   ├── 07-images.md
│   ├── 08-booking-engine.md
│   ├── 09-admin-panel.md
│   ├── 10-deployment.md
│   ├── 11-seo-performance.md
│   ├── 12-internationalization.md
│   ├── 13-security.md
│   ├── 14-testing.md
│   ├── 15-observability.md
│   └── decisions/
└── prompts/
```

This is the target structure. Directories and applications are created gradually, only when their implementation phase begins.

## Documentation Index

| File | Purpose |
| --- | --- |
| `ARCHITECTURE.md` | System boundaries, applications, data ownership, and deployment shape |
| `docs/01-content-model.md` | Services, categories, translations, pricing, durations, and content fields |
| `docs/02-design-system.md` | Colors, typography, spacing, components, and motion |
| `docs/03-frontend.md` | Next.js conventions, routing, Server and Client Components |
| `docs/04-backend.md` | NestJS modules, DTOs, validation, API conventions |
| `docs/05-database.md` | Prisma schema, migrations, indexes, constraints, and seed data |
| `docs/06-auth.md` | NestJS authentication, cookies, tokens, roles, and protected routes |
| `docs/07-images.md` | Cloudinary uploads, metadata, transformations, and image policies |
| `docs/08-booking-engine.md` | Availability, resources, conflicts, cancellation, and booking lifecycle |
| `docs/09-admin-panel.md` | Admin capabilities, forms, permissions, and workflows |
| `docs/10-deployment.md` | Docker, Nginx, CI/CD, VPS, SSL, and backups |
| `docs/11-seo-performance.md` | Metadata, structured data, sitemap, Core Web Vitals |
| `docs/12-internationalization.md` | Bulgarian/English routing and content rules |
| `docs/13-security.md` | Application, infrastructure, and personal-data security |
| `docs/14-testing.md` | Unit, integration, end-to-end, and acceptance testing |
| `docs/15-observability.md` | Logs, health checks, errors, metrics, and operational alerts |
| `docs/decisions/` | Architecture Decision Records for important approved choices |
| `AGENTS.md` | Mandatory rules for AI-assisted changes |
| `prompts/` | Reusable, phase-specific prompts for VS Code agents |

## Development Phases

### Phase 0 — Documentation and Decisions

- approve system architecture;
- define the service and content model;
- define the design system;
- answer the booking business questions;
- document security, testing, deployment, and AI-agent rules.

### Phase 1 — Public Website

- create the monorepo foundation;
- build the Next.js application;
- implement BG/EN routing;
- implement the design system;
- build the homepage, services, gallery, about, and contact pages;
- integrate optimized Cloudinary delivery;
- establish SEO and performance baselines.

### Phase 2 — API and Booking

- build the NestJS application;
- add Prisma and PostgreSQL;
- implement services, staff, working hours, availability, and appointments;
- add transactional conflict protection;
- add confirmation and reminder notifications.

### Phase 3 — Authentication and Portals

- add customer and admin authentication;
- build the customer portal;
- build the custom admin panel;
- add role-based permissions.

### Phase 4 — Launch

- complete end-to-end tests;
- perform accessibility, SEO, and Core Web Vitals audits;
- configure Docker, Nginx, SSL, backups, and monitoring;
- deploy through GitHub Actions;
- connect Search Console and production analytics.

## Current Status

The project is currently in **Phase 0 — Documentation and Decisions**.

Approved:

- Next.js public website, customer portal, and custom admin UI;
- NestJS as the only application backend;
- Prisma as the only ORM and migration owner;
- PostgreSQL as the primary database;
- Cloudinary for image storage, transformations, and CDN delivery;
- NestJS-managed authentication;
- explicit `/bg/...` and `/en/...` routes;
- SuperHosting VPS deployment target;
- monorepo direction with `apps/web`, `apps/api`, and shared `packages`.

Not yet finalized:

- detailed service and category relationships;
- exact working-hour values and service-to-device assignments;
- which services require manual confirmation;
- final booking lead time and booking window;
- final production payment-provider decision for a future phase.

Approved booking direction:

- one service may be performed by multiple specialists;
- a specialist may override the service duration and booking duration;
- there is no separate before/after buffer; `bookingDurationMinutes` is the complete blocked time;
- a selected slot is held for 10 minutes after the customer clicks “Continue” to open the details form;
- staff, rooms, and limited devices are reservable resources;
- guest booking is allowed;
- online payments are not included in phase 1; optional Stripe prepayment may be evaluated later.

The exact Prisma schema is created only after these approved rules are reflected in the booking and database documents.

## Quick Start

The applications have not been scaffolded yet. Setup commands will be added only after the documentation and initial architecture decisions are approved.

Until then:

1. Read `README.md`.
2. Read `ARCHITECTURE.md`.
3. Read the task-specific file in `docs/`.
4. Read `AGENTS.md` before any AI-assisted implementation.
5. Work on one bounded change at a time.
6. Run the required verification commands.
7. Commit one completed logical change.

## Git Workflow

Use short-lived feature branches:

```text
feat/project-foundation
feat/design-system
feat/i18n-routing
feat/services-catalog
feat/booking-engine
```

Use conventional, focused commits:

```text
docs: define system architecture
feat(web): add locale-aware routing
feat(api): add services module
test(api): cover appointment conflicts
fix(web): correct mobile navigation focus
```

Do not commit:

- secrets;
- production environment files;
- temporary exports;
- local uploads;
- generated build output;
- unrelated changes in the same commit.

## Definition of Done

A change is complete only when:

- it follows the approved documentation;
- its scope is limited and understandable;
- validation and authorization exist where required;
- relevant tests pass;
- lint and type checking pass;
- the production build passes;
- documentation is updated when behavior or architecture changes;
- no secrets or personal data are exposed;
- the result is committed with a clear message.
