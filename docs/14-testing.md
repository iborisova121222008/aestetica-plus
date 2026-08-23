# Testing

## 1. Purpose

This document defines the testing strategy and release quality gates for Estetica Plus.

The goal is confidence in:

- premium responsive public pages;
- BG and EN content;
- exact service prices and durations;
- booking availability and concurrency;
- customer/admin authorization;
- image workflows;
- database migrations;
- deployment and recovery.

## 2. Principles

- test behavior, not framework implementation details;
- keep the test pyramid weighted toward fast unit/integration tests;
- use end-to-end tests for critical journeys;
- use real PostgreSQL for database-specific behavior;
- reproduce production boundaries where correctness depends on them;
- make tests deterministic;
- never use production customer data;
- a flaky required test is a defect;
- every bug fix includes a regression test when practical.

## 3. Test Layers

```text
Static checks
Unit tests
Component tests
API integration tests
Database/migration tests
End-to-end tests
Accessibility tests
Performance tests
Security tests
Deployment smoke tests
Restore drills
```

No single layer replaces the others.

## 4. Test Tool Direction

Use tools compatible with the final scaffold:

- TypeScript compiler;
- ESLint and formatter;
- Vitest or Jest according to workspace selection;
- NestJS testing utilities;
- React Testing Library for interactive components;
- Playwright for browser end-to-end tests;
- real PostgreSQL container for integration;
- accessibility automation such as axe;
- Lighthouse/field Web Vitals for performance diagnosis;
- API request tooling through test code.

The exact runner choice is fixed during project scaffold and used consistently. Do not install duplicate overlapping test stacks.

## 5. Test Environments

### Local

- fast unit/component loop;
- Docker PostgreSQL integration profile;
- isolated test data;
- mocked external email/Cloudinary where appropriate.

### CI

- clean dependency install;
- disposable PostgreSQL;
- migrations from zero;
- deterministic seed fixtures;
- production builds;
- browser tests against built applications where feasible.

### Production smoke

- read-only/safe checks;
- no fake customer bookings unless an approved synthetic procedure exists;
- verify public routes, health, TLS, and selected non-mutating API behavior.

## 6. Static Quality Gates

Required:

- formatting;
- lint;
- TypeScript checks for all workspaces;
- no forbidden imports/boundary violations;
- Prisma schema validation;
- environment-schema validation tests;
- build;
- secret/dependency checks according to CI policy.

Examples of forbidden boundaries:

- `apps/web` imports Prisma;
- client component imports server secrets;
- public bundle imports admin-only modules;
- NestJS business module imports Next.js code.

## 7. Unit Tests

Prioritize pure domain functions:

- money input/minor-unit conversion;
- price-type validation/presentation;
- duration range;
- blocked interval calculation;
- overlap and half-open interval rules;
- cancellation/reschedule deadline;
- booking lead time/window;
- confirmation initial status;
- schedule exception composition;
- locale formatting and route mapping;
- permission predicates;
- content publication requirements;
- image transformation presets.

Unit tests do not mock the entire application for simple business rules.

## 8. Frontend Component Tests

Test interactive behavior:

- navigation/menu keyboard behavior;
- locale switcher;
- booking step controls;
- date/time selection;
- form validation and focus;
- price/duration presentation;
- dialogs/drawers;
- admin service editor dynamic fields;
- upload progress/error state;
- status badges with non-color labels;
- unsaved-change warning.

Avoid snapshot-only tests for complex interactive behavior.

## 9. API Integration Tests

Each NestJS module tests:

- valid request/response;
- DTO rejection;
- unknown fields;
- authentication;
- role/permission;
- ownership;
- not-found;
- conflict;
- status transitions;
- persistence;
- audit/outbox side effects.

Use the actual global pipes, guards, filters, and serializers.

## 10. PostgreSQL Tests

Real PostgreSQL is mandatory for:

- migrations;
- unique/foreign-key/check constraints;
- transactions;
- isolation/concurrency;
- range/exclusion constraint;
- idempotency;
- indexes/query behavior where relevant;
- cancellation allocation release;
- reschedule rollback.

SQLite or mocked repositories cannot prove PostgreSQL booking correctness.

## 11. Migration Tests

CI database flow:

1. create empty database;
2. apply every committed migration;
3. validate custom SQL;
4. run seed;
5. rerun idempotent seed where intended;
6. execute integration tests;
7. optionally test upgrade from representative previous schema state.

Rules:

- never edit applied shared migrations;
- destructive migrations require explicit test and recovery plan;
- production uses `prisma migrate deploy`;
- schema and custom exclusion SQL are tested together.

## 12. Booking Concurrency Matrix

Required concurrent tests:

| Scenario | Expected |
| --- | --- |
| Two holds for same staff and interval | One succeeds, one conflicts |
| Hold overlaps existing appointment | Hold conflicts |
| Appointment attempt overlaps active hold | Appointment conflicts |
| Different staff, same single room | One succeeds, one conflicts |
| Different staff/rooms, same device | One succeeds, one conflicts |
| Different staff, rooms, and devices | Both may succeed |
| Pending manual appointment overlap | New booking conflicts |
| Request retry with same idempotency key | One appointment |
| Concurrent conversion of one hold | One appointment |
| Hold expires while conversion starts | One valid atomic outcome, no partial appointment |
| Concurrent reschedule to same slot | One succeeds |

The test must launch genuinely concurrent database operations.

## 13. Booking Business Tests

- min/max/booking duration;
- service default and specialist duration override resolution;
- complete blocked interval from booking duration with no separate buffer;
- 10-minute server-side hold lifetime;
- explicit hold release and scheduled expiry cleanup;
- expired/released hold conversion rejection;
- opaque hold-token validation;
- interval ending exactly at next start;
- weekly hours;
- break;
- blocked time;
- leave;
- holiday;
- extra working time;
- inactive service/staff/resource;
- eligible staff;
- required room/device;
- automatic confirmation;
- manual pending allocation;
- lead time;
- booking horizon;
- cancellation/reschedule snapshot;
- guest/profile linking;
- localized confirmation.

## 14. Time and Timezone Tests

Use `Europe/Sofia`.

Test:

- daylight-saving forward transition;
- daylight-saving backward transition;
- midnight/date boundary;
- month/year boundary;
- exactly at cancellation deadline;
- just before/after deadline;
- server UTC conversion;
- display in BG/EN;
- weekly rule validity range.

Freeze/control current time in tests rather than depending on wall clock.

## 15. Authentication Tests

- customer registration;
- duplicate/normalized email;
- email verification;
- login success/failure;
- neutral enumeration behavior;
- inactive account;
- access expiry;
- refresh rotation;
- concurrent refresh;
- refresh reuse detection;
- current/all-device logout;
- password reset single-use/expiry;
- password change and revocation;
- no token in public response/log;
- admin role provisioning restrictions.

## 16. Authorization Matrix

For each protected endpoint test:

```text
anonymous
CUSTOMER owner
CUSTOMER non-owner
STAFF allowed scope
STAFF outside scope
ADMIN
SUPER_ADMIN
inactive account
```

Hiding frontend controls is not tested as authorization evidence; API denial is.

## 17. Guest and Customer Tests

- guest booking without account;
- safe booking reference;
- guest management proof;
- account invitation;
- verified linking;
- unverified matching email does not expose history;
- ambiguous duplicate handling;
- customer sees only own appointments;
- cancellation/reschedule before/after deadline;
- locale preference.

## 18. Content and Admin Tests

- create/save draft;
- publish complete BG;
- reject incomplete publication;
- incomplete EN remains unpublished;
- price-type-specific fields;
- duration/buffer preview;
- enable booking only with operational requirements;
- archive preserves history;
- stale update conflict;
- category/slug uniqueness;
- cache revalidation after publication;
- audit event for sensitive changes.

## 19. Image Tests

- signed upload authorization;
- allowed/rejected types and sizes;
- completion-result validation;
- duplicate public ID;
- localized alt;
- focal point;
- responsive transformation preset;
- reference-aware deletion;
- hero desktop/mobile behavior;
- before/after consent blocks publication;
- restricted asset not exposed publicly;
- no original loaded for thumbnails.

External Cloudinary calls use contract tests/sandbox sparingly; most application behavior uses a controlled adapter.

## 20. Notification Tests

- correct event enqueued;
- booking commits even if later email delivery fails;
- retry idempotency;
- no notification for cancelled reminder;
- BG/EN template;
- localized date/price/service;
- no internal notes;
- reset/verification link safety;
- webhook validation if introduced.

## 21. End-to-End Critical Journeys

Public:

- BG homepage → service → booking;
- EN homepage → service → booking;
- responsive navigation;
- locale switch equivalent page;
- gallery loading.

Booking:

- guest automatic confirmation;
- guest manual request;
- authenticated booking;
- slot lost on submit;
- cancel;
- reschedule;

Customer:

- register/verify;
- login/session restore;
- view history;
- safe ownership.

Admin:

- login;
- service draft/publish;
- BG/EN edit;
- image upload/hero change;
- appointment create/confirm/cancel/reschedule;
- schedule exception;
- review moderation.

## 22. Accessibility Tests

Automated checks plus manual keyboard/screen-reader review.

Test:

- landmarks and headings;
- skip link;
- labels/errors;
- focus order and restoration;
- menus/dialogs/drawers;
- contrast;
- status not color-only;
- reduced motion;
- zoom/reflow;
- alt text;
- booking and admin workflows.

Automated tools do not replace manual accessibility testing.

## 23. Responsive and Visual Tests

Representative widths:

```text
320
360
390
768
1024
1280
1440+
```

Test:

- no horizontal overflow;
- hero face/text crop;
- navigation;
- service grids;
- booking forms;
- calendar/list adaptation;
- long BG/EN text;
- image aspect ratios;
- keyboard focus;
- browser zoom.

Use focused visual regression for stable high-value components, not every pixel of every page.

## 24. SEO Tests

- server-rendered localized content;
- title/description;
- canonical;
- reciprocal hreflang;
- HTML language;
- sitemap publication rules;
- robots by environment;
- JSON-LD validity/accuracy;
- protected route `noindex`;
- redirects and 404 status;
- social image metadata.

## 25. Performance Tests

Representative pages:

- homepage with real-size hero;
- category;
- service gallery;
- booking;
- admin media screen.

Measure:

- LCP;
- INP responsiveness diagnosis;
- CLS;
- JS transferred/executed;
- image payload;
- API latency;
- database slow queries;
- duplicate downloads.

Use budgets established in `docs/11-seo-performance.md`.

## 26. Security Tests

- DTO/mass assignment;
- IDOR/ownership;
- role escalation;
- CORS/CSRF;
- XSS/rich text;
- rate limiting;
- account enumeration;
- session/reset abuse;
- upload bypass;
- secret exposure;
- security headers;
- dependency/container/secret scans;
- public port exposure in deployment review.

## 27. Test Data

Use factories/builders for:

- users/roles;
- customers/guests;
- services/translations;
- staff/resources;
- schedules/exceptions;
- appointments/allocations;
- reviews/media.

Rules:

- deterministic;
- no real personal data;
- explicit locale/timezone;
- minimal required relations;
- unique values generated safely;
- clean isolation between tests.

The normalized workbook may feed seed tests, but tests must not depend on mutable external spreadsheet state.

## 28. Mocking

Mock:

- email transport;
- Cloudinary network;
- external analytics;
- current time where needed.

Do not mock:

- core booking interval logic under test;
- PostgreSQL exclusion behavior;
- NestJS Guards in authorization integration tests;
- Prisma when verifying migrations/transactions.

## 29. CI Quality Gates

Pull request:

- static checks;
- unit/component;
- PostgreSQL integration/migrations;
- production build;
- selected E2E;
- security checks.

Main/release:

- all PR gates;
- broader E2E;
- migration/seed from zero;
- image/API contract checks as configured;
- deployment artifact creation.

Production deploy:

- protected environment;
- migration;
- health;
- external smoke;
- alert on failure.

## 30. Flaky Tests

- do not blindly retry to hide instability;
- record and fix root cause;
- remove dependence on timing, shared state, and external networks;
- use deterministic waits based on UI/API state;
- quarantine only with owner, issue, and deadline;
- required critical-path tests cannot remain quarantined for launch.

## 31. Coverage

Coverage percentage is a diagnostic, not the goal.

High confidence is mandatory around:

- booking calculations and concurrency;
- authentication/session;
- authorization/ownership;
- money and policy snapshots;
- publication;
- migrations;
- customer privacy.

Do not write meaningless tests only to raise a global number.

## 32. Bug Regression

For a confirmed defect:

1. reproduce in a failing test when practical;
2. implement minimal fix;
3. verify related boundaries;
4. keep regression test;
5. document architecture change if the fix changes a decision.

## 33. Release Acceptance

A release is acceptable when:

- required CI is green;
- migrations work from clean database;
- concurrency tests pass;
- critical BG/EN E2E passes;
- accessibility blockers are resolved;
- performance budgets are reviewed;
- no unresolved critical/high security issue;
- deployment smoke and rollback compatibility are known;
- documentation matches implementation.

## 34. Official References

- NestJS testing: <https://docs.nestjs.com/fundamentals/testing>
- Next.js testing: <https://nextjs.org/docs/app/guides/testing>
- Playwright: <https://playwright.dev/docs/intro>
- Testing Library principles: <https://testing-library.com/docs/guiding-principles>
- OWASP Web Security Testing Guide: <https://owasp.org/www-project-web-security-testing-guide/>
