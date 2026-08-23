# Backend

## 1. Purpose

This document defines the conventions for the Estetica Plus NestJS API.

NestJS is the only application backend and the authority for:

- authentication and authorization;
- business rules;
- database access;
- services and pricing;
- staff and scheduling;
- booking and appointment state;
- reviews;
- gallery metadata;
- notifications;
- admin operations.

## 2. Approved Technology

- NestJS
- TypeScript with strict mode
- REST API
- Prisma
- PostgreSQL
- OpenAPI/Swagger for API documentation

The initial HTTP adapter is selected during scaffolding after dependency compatibility is verified. Business modules must not depend directly on adapter-specific request objects without a justified boundary.

## 3. Application Location

```text
apps/api/
```

Approved top-level business modules:

```text
src/
├── auth/
├── users/
├── services/
├── staff/
├── appointments/
├── reviews/
├── gallery/
├── admin/
└── notifications/
```

Infrastructure and shared technical concerns may be introduced under clearly named supporting folders when needed.

Do not create empty modules in advance.

## 4. Module Boundaries

Each feature module encapsulates its controllers, providers, DTOs, and domain behavior.

Typical direction:

```text
services/
├── services.module.ts
├── services.controller.ts
├── services.service.ts
├── dto/
├── repositories/
└── tests/
```

Rules:

- controllers handle HTTP concerns;
- services implement use cases and business coordination;
- repositories encapsulate Prisma queries when the query complexity justifies them;
- DTOs define external input;
- modules export only the providers that form their intentional public interface;
- avoid circular module dependencies;
- do not create a global “common service” containing unrelated behavior.

## 5. Controller Responsibilities

Controllers:

- define routes and HTTP methods;
- read validated path, query, body, and authentication context;
- call application services;
- return documented response DTOs;
- select appropriate status codes.

Controllers must not:

- contain Prisma queries;
- implement appointment conflict rules;
- hash passwords directly;
- construct Cloudinary signatures directly;
- send email directly;
- contain large transformation logic;
- trust client-provided ownership, price, role, or status.

## 6. Service Responsibilities

Services:

- implement business use cases;
- coordinate repositories and other approved module interfaces;
- enforce state-transition rules;
- open or participate in transactions;
- return domain/application results;
- throw consistent application exceptions.

A service should represent a business capability, not become a collection of unrelated utilities.

## 7. Database Access

Prisma is used only by NestJS.

Rules:

- one configured Prisma service/provider;
- database queries remain inside the API application;
- prefer explicit `select` to avoid returning unnecessary or sensitive columns;
- transactions protect multi-step changes;
- booking creation uses transactional revalidation;
- indexes and constraints support application invariants;
- custom SQL migrations are reviewed when advanced PostgreSQL constraints are required;
- no raw SQL built through string concatenation;
- no production schema changes outside migrations.

Detailed rules belong in `docs/05-database.md`.

## 8. REST API

The API is versioned from the beginning.

Initial direction:

```text
/api/v1/...
```

Example resource routes:

```text
GET    /api/v1/services
GET    /api/v1/services/:id
POST   /api/v1/admin/services
PATCH  /api/v1/admin/services/:id
GET    /api/v1/availability
POST   /api/v1/appointments
GET    /api/v1/me/appointments
```

Final route names are approved with each module.

Rules:

- use nouns for resources;
- use HTTP methods consistently;
- avoid action verbs when normal resource semantics work;
- explicit action endpoints are allowed for real state transitions;
- public, customer, staff, and admin access are documented;
- breaking API changes require a new version or an approved migration path.

## 9. Request Validation

All external input is validated at the system boundary.

Use a global validation policy with:

- transformation only where intentional;
- whitelisting of declared fields;
- rejection of unexpected fields for protected mutations;
- clear validation messages;
- explicit nested validation;
- explicit enum and numeric constraints.

Rules:

- DTOs are not Prisma models;
- partial-update DTOs permit only intentionally mutable fields;
- identifiers are parsed and validated;
- dates use one documented wire format;
- money arrives as an allowed integer-minor-unit representation or a documented admin input converted safely;
- the server ignores or rejects client-calculated authoritative values.

## 10. Response Models

Do not return raw Prisma objects by default.

Response DTOs:

- expose only approved fields;
- omit password hashes and token secrets;
- omit internal audit data from public responses;
- format dates consistently;
- distinguish localized public responses from admin editing responses;
- provide pagination metadata where relevant.

Public service responses normally return the requested locale rather than every draft translation.

Admin editing responses may return both BG and EN fields when authorized.

## 11. Error Format

Use one documented API error shape:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "The request contains invalid fields.",
  "details": [],
  "requestId": "..."
}
```

Rules:

- `code` is stable and machine-readable;
- `message` is safe for clients;
- field details are structured;
- production errors do not expose stack traces, SQL, secrets, or filesystem paths;
- a request/correlation ID supports diagnostics;
- known business conflicts use appropriate 4xx responses;
- unexpected failures use a generic 5xx response and are logged.

## 12. Authentication and Authorization

NestJS owns:

- registration;
- login;
- logout;
- access-token issuance;
- refresh-token rotation;
- password reset;
- session revocation;
- role enforcement.

Approved roles:

```text
CUSTOMER
STAFF
ADMIN
SUPER_ADMIN
```

Rules:

- Guards perform route authorization;
- resource ownership is verified inside the use case;
- role checks alone are insufficient for “own appointment” access;
- refresh tokens are not stored in plaintext;
- cookies use secure production attributes;
- authentication endpoints receive stricter rate limiting;
- login responses do not reveal whether an account exists unnecessarily.

Detailed rules belong in `docs/06-auth.md`.

## 13. CORS and CSRF

CORS:

- allow only approved web origins;
- do not combine wildcard origins with credentials;
- configure allowed methods and headers deliberately;
- development origins are separate from production configuration.

CSRF:

- cookie-authenticated state changes require a documented CSRF strategy;
- `SameSite` is helpful but not the only documented protection;
- validate request origin where appropriate;
- do not accept state-changing operations through `GET`.

Detailed policy belongs in `docs/13-security.md`.

## 14. Security Middleware

The API includes:

- security headers through an approved Helmet configuration;
- CORS configuration;
- rate limiting;
- body-size limits;
- secure cookie parsing/configuration;
- request correlation IDs;
- safe logging and redaction.

Middleware order is intentional so security headers and policies apply to all relevant routes.

## 15. Rate Limiting

Apply rate limits by risk:

- stricter limits for login and password reset;
- strict limits for public booking attempts;
- limits for reviews and contact forms;
- appropriate limits for signed-upload requests;
- broader normal limits for public catalog reads.

Rate limiting supplements validation and authorization; it does not replace them.

The production strategy must account for Nginx proxy configuration and the correct client IP.

## 16. Service Catalog

The services module owns:

- sections;
- categories;
- subcategories;
- services;
- localized content;
- prices;
- durations;
- publication state;
- bookable state;
- service ordering.

Rules follow `docs/01-content-model.md`.

Admin changes:

- validate content completeness;
- prevent public booking when operational fields are incomplete;
- retain archived services for historical appointments;
- trigger public-content revalidation after successful publication changes.

## 17. Staff

The staff module will own:

- staff profile;
- operational role;
- services the staff member can perform;
- regular working hours;
- exceptions, leave, and blocked time;
- approved optional specialist-specific duration overrides;
- future staff-specific price overrides only after a separate decision.

Effective duration resolves `StaffService` overrides first and service defaults second. The API never trusts an effective duration calculated by the client.

## 18. Appointments

The appointments module will own:

- availability calculation;
- slot selection;
- mandatory 10-minute temporary hold after the customer clicks “Continue”;
- hold expiration, release, and conversion;
- appointment creation;
- appointment status;
- rescheduling;
- cancellation;
- completion and no-show handling;
- status history;
- customer-visible appointment data;
- admin schedule operations.

Rules:

- the client cannot create an arbitrary authoritative price;
- availability is rechecked during creation;
- concurrent booking attempts are protected at database level;
- state transitions are explicit;
- cancellation and rescheduling rules are enforced server-side;
- historical appointment data remains interpretable if a service later changes;
- hold tokens are opaque and stored only as hashes where persistence is required;
- expired holds cannot be converted;
- hold creation and conversion use transactions and database-level conflict protection;
- scheduled cleanup releases expired holds, while server-side request checks remain authoritative.

Detailed rules belong in `docs/08-booking-engine.md`.

## 19. Reviews

The reviews module owns:

- review submission;
- optional appointment verification;
- moderation;
- publication;
- featured status;
- public listing.

Public review submission is rate-limited and sanitized. Unapproved reviews are never returned by public endpoints.

## 20. Gallery and Upload Metadata

The gallery module owns:

- Cloudinary public IDs;
- image dimensions and metadata;
- localized alt text and captions;
- galleries;
- before-and-after pairing;
- image order;
- publication state;
- signed-upload authorization.

The browser uploads directly to Cloudinary after receiving authorized signed parameters.

The API validates:

- authenticated role;
- allowed file type;
- size policy;
- intended folder or context;
- metadata requirements;
- relationship ownership.

Detailed rules belong in `docs/07-images.md`.

## 21. Notifications

The notifications module owns:

- appointment confirmations;
- cancellation messages;
- rescheduling messages;
- reminders;
- password-reset email dispatch;
- delivery state and retry policy.

Rules:

- appointment creation must not become inconsistent because an email provider is temporarily unavailable;
- notification work is recorded;
- retries are bounded;
- templates support BG and EN;
- sensitive data in emails is minimized;
- repeated failures are observable.

The exact email provider is configured behind an internal interface.

## 22. Admin Operations

The admin module provides admin-specific orchestration and dashboard endpoints where needed.

It must not duplicate every feature module.

Examples:

- daily schedule view;
- dashboard aggregates;
- cross-feature admin search;
- audit-focused actions.

Service creation remains in the services domain; appointment transitions remain in appointments.

## 23. Configuration

Use validated environment configuration.

Categories include:

- server port and environment;
- database connection;
- web origins;
- token secrets and expiry;
- cookie policy;
- Cloudinary credentials;
- email-provider credentials;
- observability configuration.

Rules:

- fail fast when required production configuration is missing;
- never log secrets;
- never commit production `.env` files;
- provide safe example keys without values;
- distinguish development, test, staging, and production behavior.

## 24. Logging and Observability

Logs are structured and include:

- timestamp;
- level;
- service/module context;
- request ID;
- safe route information;
- duration;
- safe error code.

Do not log:

- passwords;
- raw access or refresh tokens;
- reset tokens;
- full payment data;
- image-signing secrets;
- unnecessary personal or health-related content.

Detailed rules belong in `docs/15-observability.md`.

## 25. Background Work

Longer or retryable work should not depend on the original HTTP request remaining open.

Potential background tasks:

- reminders;
- failed-notification retries;
- image metadata reconciliation;
- cleanup of expired holds or sessions.

Do not add queue infrastructure until a real workflow requires it. The selected mechanism must support safe retries and idempotency.

## 26. Idempotency

Idempotency is required where duplicate client requests could create harmful repeated effects.

Candidates:

- appointment creation;
- payment/deposit callbacks if added;
- notification processing;
- external webhooks;
- image finalization.

Idempotency keys are scoped, validated, stored safely, and expired according to the use case.

## 27. Testing

Backend tests include:

- unit tests for pure business rules;
- module/service tests with dependency overrides;
- integration tests with a real test PostgreSQL database;
- authorization and ownership tests;
- concurrent appointment conflict tests;
- API contract and validation tests;
- migration and seed verification;
- notification failure-path tests.

Mocks must not replace database-level tests for constraints and transactions.

Detailed rules belong in `docs/14-testing.md`.

## 28. OpenAPI

The API provides OpenAPI documentation for development and authorized operational use.

Requirements:

- documented request and response DTOs;
- authentication schemes;
- error responses;
- pagination and filters;
- no accidental exposure of internal-only endpoints in production;
- generated documentation must match actual validation.

## 29. Definition of Done

A backend change is complete when:

- it is inside the correct feature boundary;
- controllers remain thin;
- DTO validation is complete;
- authorization and ownership are enforced;
- responses expose only approved data;
- transactions and constraints protect invariants;
- error behavior is documented;
- relevant unit and integration tests pass;
- lint, type checking, and build pass;
- OpenAPI and documentation are updated when the contract changes;
- no secrets or unnecessary personal data are logged.

## 30. Official References

- [NestJS modules](https://docs.nestjs.com/modules)
- [NestJS controllers](https://docs.nestjs.com/controllers)
- [NestJS providers](https://docs.nestjs.com/providers)
- [NestJS validation](https://docs.nestjs.com/techniques/validation)
- [NestJS authentication](https://docs.nestjs.com/security/authentication)
- [NestJS authorization](https://docs.nestjs.com/security/authorization)
- [NestJS Helmet](https://docs.nestjs.com/security/helmet)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [NestJS CSRF protection](https://docs.nestjs.com/security/csrf)
- [NestJS rate limiting](https://docs.nestjs.com/security/rate-limiting)
- [NestJS testing](https://docs.nestjs.com/fundamentals/testing)
