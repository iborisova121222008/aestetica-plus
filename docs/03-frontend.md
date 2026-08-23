# Frontend

## 1. Purpose

This document defines the frontend conventions for the Estetica Plus Next.js application.

The frontend includes:

- the public BG/EN website;
- the online booking flow;
- the customer portal;
- the custom admin interface.

It does not own business logic, authorization, Prisma, or the database.

## 2. Approved Technology

- Next.js 15 App Router
- TypeScript with strict mode
- React Server Components by default
- Tailwind CSS
- shadcn/ui primitives, fully restyled
- Framer Motion only where purposeful
- Cloudinary-based responsive images

Exact dependency versions are pinned during project scaffolding and changed only through reviewed upgrades.

## 3. Application Location

```text
apps/web/
```

Initial direction:

```text
apps/web/
├── app/
├── components/
├── features/
├── lib/
├── public/
├── styles/
└── tests/
```

Do not create folders only to match this document. Add them when the first real file needs them.

## 4. Routing

All public and customer-facing routes use an explicit locale segment:

```text
app/
└── [locale]/
    ├── page.tsx
    ├── uslugi/
    ├── galeriya/
    ├── za-nas/
    ├── kontakti/
    ├── rezervatsiya/
    └── profil/
```

English routes resolve locale-specific slugs:

```text
/bg/uslugi/...
/en/services/...
```

Admin routes may live under:

```text
/admin/...
```

The exact admin locale policy is finalized in `docs/09-admin-panel.md`.

Route rules:

- route names and slugs follow `docs/12-internationalization.md`;
- locale validation happens at the route boundary;
- invalid or unpublished slugs return the correct not-found response;
- old published slugs redirect to the current localized URL;
- no essential public content exists only behind client-side navigation.

## 5. Server and Client Components

### Server Components — Default

Use Server Components for:

- page layouts;
- service and category pages;
- public content fetching;
- metadata-dependent content;
- gallery shells;
- footer and static navigation content;
- customer and admin pages before interactive boundaries.

Benefits:

- less browser JavaScript;
- direct server-side API access;
- improved initial rendering;
- easier SEO;
- safer handling of server-only configuration.

### Client Components — Explicit Exception

Use Client Components for:

- menu open/close state;
- interactive booking steps;
- date and slot selection;
- dialogs, drawers, and tabs;
- form state requiring browser interaction;
- before-and-after slider interaction;
- carefully selected motion;
- browser-only APIs.

Rules:

- add `"use client"` only at the smallest necessary boundary;
- do not mark layouts or entire pages as Client Components for convenience;
- Client Component props must remain serializable;
- browser components must not import server-only modules;
- do not duplicate server-fetched data into unnecessary global state.

## 6. Data Access

Next.js communicates with NestJS through a typed API client.

Allowed:

```text
Next.js Server Component → NestJS API
Next.js Client Component → NestJS API
Thin Server Action → NestJS API
```

Forbidden:

```text
Next.js → Prisma
Next.js → PostgreSQL
Client → trusted price calculation
Client → authoritative availability decision
```

Data-access rules:

- one shared API-client convention;
- base URLs come from validated environment configuration;
- public, authenticated, and admin clients are clearly separated;
- API errors are normalized before reaching UI components;
- responses are treated as untrusted external data at the boundary;
- sensitive tokens are never logged;
- server-only secrets are never exposed with public environment prefixes.

## 7. Fetching and Caching

### Public Content

Services, categories, public reviews, and homepage content may use caching and controlled revalidation.

Rules:

- cache behavior is explicit;
- published admin changes trigger appropriate revalidation;
- a cached response must never leak personalized content;
- a cache key includes locale and relevant query parameters;
- preview content bypasses public caches;
- content revalidation failures are observable.

### Dynamic Data

Do not use long-lived public caching for:

- appointment availability;
- active slot holds;
- customer profiles;
- customer appointments;
- admin dashboards;
- unpublished content;
- role and permission data.

Availability shown to a customer is provisional. NestJS revalidates it when creating the appointment.

After the customer selects a slot and clicks “Continue”, the frontend requests a 10-minute hold from NestJS before opening the personal-details step.

The booking UI:

- displays the server-provided expiry and a countdown;
- treats server time and hold status as authoritative;
- never extends a hold by resetting a browser timer;
- releases the hold on explicit abandonment where practical;
- handles expiry by returning to refreshed availability with a clear localized message;
- submits the opaque hold token when finalizing the appointment;
- never exposes internal allocation IDs.

### Loading and Streaming

- use route-level loading UI where it improves perceived performance;
- use Suspense boundaries around independently loading sections;
- do not create many visually unstable skeletons;
- skeleton dimensions must match final content;
- critical hero and primary page content should not wait behind noncritical sections.

## 8. Mutations

NestJS remains the mutation authority.

Server Actions may be used as a thin frontend orchestration layer for:

- form integration;
- secure server-side API calls;
- redirects after successful operations;
- targeted revalidation.

Server Actions must not:

- contain appointment conflict logic;
- contain hold expiry, availability, or hold-to-appointment conversion logic;
- access Prisma;
- replace NestJS validation;
- perform authorization only in Next.js;
- become a second backend.

Client-side mutations may call NestJS directly when appropriate. The chosen approach must remain consistent within one feature.

Every mutation requires:

- pending state;
- duplicate-submission protection;
- success feedback;
- recoverable error handling;
- server-side validation;
- authorization when protected;
- accessible status feedback.

## 9. State Management

Prefer the smallest state scope:

1. URL state for navigation, filters, pagination, and shareable selections;
2. server-fetched data for authoritative state;
3. local component state for isolated interaction;
4. feature-level context only for a true multi-component workflow;
5. external state library only after a documented need.

Do not add a global state library during scaffolding without an actual use case.

Booking draft state must:

- preserve valid choices between steps;
- distinguish server-confirmed data from local selections;
- expire or reset safely;
- never imply that a slot is reserved unless NestJS confirms a hold.

## 10. Forms

Forms use accessible shadcn/ui-compatible primitives styled through the approved design system.

Rules:

- visible labels;
- field-level validation;
- form-level error summary for complex forms;
- server errors mapped to useful messages;
- correct input types and autocomplete attributes;
- no placeholder-only labels;
- unsaved-change warning for complex admin forms;
- keyboard and screen-reader usability;
- no loss of entered data after a recoverable validation error.

Frontend validation improves experience. NestJS validation remains authoritative.

## 11. Styling

All visual implementation follows `docs/02-design-system.md`.

Rules:

- use semantic design tokens;
- avoid arbitrary HEX colors in components;
- avoid arbitrary spacing when an approved token exists;
- public pages use the ivory, matte-white, dusty-rose, and near-black system;
- component variants are explicit;
- shadcn/ui default styling is not accepted as the final brand;
- CSS specificity remains low and predictable;
- no `!important` without a documented reason.

## 12. Responsive Design

The frontend is mobile first.

Every page and component must be reviewed at:

- small mobile;
- large mobile;
- tablet;
- common laptop;
- wide desktop.

Requirements:

- no accidental horizontal scrolling;
- touch targets approximately 44×44px or larger;
- responsive typography without clipping;
- booking actions remain reachable;
- navigation works with keyboard and touch;
- images preserve their focal points;
- admin workflows remain usable on mobile, even when desktop is more efficient.

## 13. Homepage Hero

The homepage hero follows `docs/01-content-model.md` and `docs/02-design-system.md`.

Implementation requirements:

- editable text and image metadata;
- temporary licensed placeholder during development;
- final approved original portrait before launch;
- art-directed mobile and desktop crops;
- Cloudinary focal point;
- white or soft-white text with contrast-safe overlay;
- primary booking action visible without scrolling;
- no copied Criterion assets or layout;
- image replacement without code changes;
- preload only the actual above-the-fold hero image.

## 14. Images

- use the approved Cloudinary component abstraction;
- store only public IDs and metadata in application data;
- always provide width and height or a stable aspect ratio;
- use responsive `sizes`;
- priority/preload is reserved for true above-the-fold imagery;
- lazy-load below-the-fold galleries;
- alt text is localized;
- decorative images use empty alt text;
- before-and-after images must not receive misleading transformations;
- avoid loading original multi-megabyte assets in the browser.

Detailed rules belong in `docs/07-images.md`.

## 15. Motion

- Framer Motion only in intentionally interactive Client Components;
- prefer transform and opacity;
- avoid layout-shifting animation;
- no required content hidden behind delayed animation;
- no heavy mobile parallax;
- support `prefers-reduced-motion`;
- reduced-motion mode receives the final visual state immediately.

## 16. Metadata and SEO

Every indexable page provides:

- localized title;
- localized description;
- canonical URL;
- locale alternates;
- Open Graph metadata;
- appropriate structured data;
- stable social image when applicable.

Metadata is generated from approved content, not from client-side effects.

Detailed rules belong in `docs/11-seo-performance.md`.

## 17. Authentication Boundary

NestJS owns authentication.

Frontend rules:

- never store access or refresh tokens in `localStorage`;
- refresh cookies are `HttpOnly`;
- route middleware improves navigation and redirects but is not authoritative security;
- protected API calls are always verified by NestJS;
- unauthorized and expired-session states have explicit UI;
- logout clears the server-managed session;
- do not render sensitive content from stale public caches.

Detailed rules belong in `docs/06-auth.md`.

## 18. Error Handling

Required route states:

- loading;
- empty;
- recoverable error;
- not found;
- unauthorized;
- forbidden;
- unexpected failure.

Rules:

- messages explain what happened in user language;
- do not expose stack traces, database details, or internal identifiers;
- booking errors suggest the next safe action;
- retry buttons are used only for retryable operations;
- unexpected frontend errors are reported through observability tooling.

## 19. Accessibility

Target WCAG 2.2 AA.

Frontend acceptance includes:

- semantic HTML;
- logical heading order;
- visible focus;
- keyboard navigation;
- accessible dialogs and menus;
- form labels and error associations;
- status announcements;
- adequate contrast;
- meaningful alt text;
- reduced-motion support;
- zoom and text resizing;
- language attributes matching rendered content.

## 20. Testing

Frontend tests include:

- unit tests for pure formatting and mapping utilities;
- component tests for complex interactive components;
- accessibility checks;
- Playwright end-to-end tests for essential flows;
- visual review across agreed breakpoints;
- production build verification.

Do not test framework internals or trivial static markup.

## 21. Environment Configuration

Environment variables are:

- documented;
- validated at startup or build time;
- separated into server-only and public values;
- represented in a safe example file without secrets.

Never commit real credentials.

## 22. Naming

- React components: `PascalCase`;
- component files: one consistent project convention;
- functions and variables: `camelCase`;
- constants: project-agreed constant convention;
- route folders: locale-appropriate lowercase slugs;
- booleans: `is`, `has`, `can`, or `should` prefix;
- event handlers: `handle...`;
- hooks: `use...`.

Do not abbreviate domain names when clarity is lost.

## 23. Definition of Done

A frontend change is complete when:

- it follows the approved content and design documents;
- Server and Client Component boundaries are intentional;
- it does not access Prisma;
- loading, empty, error, and success states are handled;
- BG and EN behavior is considered;
- mobile and desktop layouts are verified;
- keyboard and accessibility behavior is verified;
- relevant tests, lint, type checking, and production build pass;
- no secret or personal data is exposed;
- documentation is updated when the behavior changes.

## 24. Official References

- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js caching](https://nextjs.org/docs/app/getting-started/caching)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js Server Actions](https://nextjs.org/docs/app/guides/server-actions)
- [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js `use client`](https://nextjs.org/docs/app/api-reference/directives/use-client)
