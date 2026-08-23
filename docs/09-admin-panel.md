# Admin Panel

## 1. Purpose

This document defines the custom Estetica Plus administration interface.

The admin panel is part of the Next.js application and uses NestJS for every protected read and write. It allows authorized studio users to manage:

- appointments;
- services, categories, descriptions, durations, and prices;
- specialists;
- rooms and devices;
- working hours, breaks, leave, holidays, and blocked time;
- galleries, hero images, and before-and-after content;
- reviews;
- customers and appointment history;
- BG and EN website content;
- booking policies;
- notifications and operational settings.

The goal is a clear daily working tool, not a generic technical database editor.

## 2. Approved Architecture

```text
Next.js
├── Public website
├── Customer portal
└── Custom admin UI

NestJS
├── Auth and authorization
├── Services and content
├── Staff and resources
├── Booking
├── Reviews
├── Gallery metadata
├── Customers
└── Notifications

PostgreSQL
└── Authoritative application data
```

Approved:

- custom admin UI in Next.js;
- no Payload CMS in phase 1;
- NestJS is the only backend;
- NestJS is the only Prisma owner;
- the browser never accesses PostgreSQL directly;
- every admin mutation is authorized and validated by NestJS;
- Cloudinary stores image files;
- PostgreSQL stores image metadata and relationships.

## 3. Product Principles

The admin panel must be:

- easy for a non-technical studio owner;
- optimized for frequent daily actions;
- usable on desktop, tablet, and mobile;
- consistent with the Estetica Plus design system without copying the public luxury layout;
- explicit about draft, published, archived, pending, and confirmed states;
- safe against accidental destructive actions;
- bilingual-content aware from the beginning;
- accessible by keyboard and assistive technology;
- maintainable through reusable forms, tables, filters, and validation patterns.

Do not expose:

- Prisma model names as the main navigation;
- raw JSON editing for normal workflows;
- database IDs when a readable label is available;
- unrestricted HTML or CSS fields;
- Cloudinary transformation strings;
- security-sensitive configuration to ordinary administrators.

## 4. Admin Routes

Suggested route area:

```text
/{locale}/admin/
```

Examples:

```text
/bg/admin
/bg/admin/appointments
/bg/admin/services
/bg/admin/media
/en/admin
```

The admin interface locale and the edited content locale are separate concepts.

Example:

- the interface may be displayed in Bulgarian;
- the editor may switch between Bulgarian and English service content.

All routes require authenticated access. Next.js middleware may redirect unauthenticated users for user experience, but NestJS performs the authoritative role and permission check.

## 5. Roles and Permissions

Roles:

```text
STAFF
ADMIN
SUPER_ADMIN
```

`CUSTOMER` has no admin-panel access.

Initial permission direction:

| Area or action | STAFF | ADMIN | SUPER_ADMIN |
| --- | ---: | ---: | ---: |
| View permitted schedule | Yes | Yes | Yes |
| View assigned appointment details | Yes | Yes | Yes |
| Update permitted appointment status | Limited | Yes | Yes |
| Create/reschedule appointments | By permission | Yes | Yes |
| Manage services and prices | No | Yes | Yes |
| Manage content and translations | No | Yes | Yes |
| Manage media and galleries | No | Yes | Yes |
| Manage reviews | No | Yes | Yes |
| Manage working hours/resources | Limited | Yes | Yes |
| View customers | Limited | Yes | Yes |
| Manage administrators and roles | No | No | Yes |
| Security-sensitive settings | No | No | Yes |
| View audit records | No | Limited | Yes |

The final implementation uses permissions or policies in addition to broad role checks where needed.

Rules:

- hiding a button is not authorization;
- NestJS checks every protected operation;
- staff sees only the customer and schedule information needed for work;
- role changes require `SUPER_ADMIN`;
- ordinary daily work should not require `SUPER_ADMIN`;
- permissions are tested at API level.

## 6. Navigation

Initial primary navigation:

```text
Overview
Appointments
Services
Staff
Schedule
Resources
Customers
Media
Reviews
Content
Settings
```

`Users and roles` and `Audit log` appear only for authorized roles.

Navigation rules:

- labels use plain studio language;
- current location is visually clear;
- unavailable areas are omitted rather than shown as broken links;
- desktop uses a persistent or collapsible side navigation;
- mobile uses an accessible drawer;
- the most frequent actions remain reachable in one or two steps;
- notification badges are reserved for actionable items such as pending appointments or reviews.

## 7. Admin Layout

The admin layout includes:

- compact brand mark;
- page title and optional description;
- breadcrumb only when it clarifies hierarchy;
- global navigation;
- user menu and logout;
- locale switch for the interface;
- contextual primary action;
- feedback area for errors and successful saves.

The admin visual style may use the same typography and color tokens as the public site, but:

- data contrast takes priority over decorative luxury styling;
- tables remain readable;
- controls have visible boundaries;
- status colors are semantic and accessible;
- animation is subtle and never delays work;
- dense operational screens may use more compact spacing.

## 8. Responsive Behavior

The admin panel must remain functional on mobile, but desktop is the primary surface for complex content and calendar management.

### Desktop

- full navigation;
- day/week calendar;
- multi-column editing forms where appropriate;
- side-by-side image and metadata editing;
- data tables with useful visible columns.

### Tablet

- collapsible navigation;
- calendar with simplified controls;
- forms reduce to one or two columns;
- touch targets remain comfortable.

### Mobile

- list-first appointment view;
- day agenda instead of compressed week grid;
- one-column forms;
- sticky primary save/action area only when it does not cover content;
- table rows transform into cards or allow deliberate horizontal scrolling;
- destructive actions remain separated from frequent actions.

No essential action may exist only on hover.

## 9. Overview Dashboard

The dashboard answers:

- what is happening today;
- what needs attention;
- what is upcoming;
- whether content or configuration is incomplete.

Initial widgets:

- today’s appointments;
- next appointment;
- pending manual-confirmation requests;
- cancellations and changes;
- pending reviews;
- services missing required booking data;
- published content missing EN translation;
- recent administrative activity;
- quick actions.

Quick actions:

```text
Create appointment
Block time
Add service
Upload images
Review pending requests
```

Metrics must use clear definitions. Decorative charts are not required in phase 1.

The dashboard must not expose sensitive customer data beyond what the current role needs.

## 10. Appointment Management

Appointment views:

- day agenda;
- week calendar;
- searchable list;
- appointment detail drawer or page.

Filters:

```text
date range
status
service
specialist
room
device
customer
confirmation mode
```

Appointment list fields may include:

```text
start time
customer
service
specialist
status
confirmation mode
duration
contact indicator
```

Sensitive notes and full contact information appear only in authorized detail views.

## 11. Calendar

The calendar must display:

- treatment time;
- complete blocked time from the effective `bookingDurationMinutes`;
- specialist;
- service;
- room/device conflict context when relevant;
- pending versus confirmed state;
- active temporary holds in an operationally distinct, privacy-safe state when needed for support;
- breaks, blocked intervals, leave, holidays, and extra working time.

Rules:

- there are no separate buffer blocks in phase 1;
- active holds must not display customer details because the appointment may not exist yet;
- pending appointments still occupy resources;
- status is not communicated by color alone;
- overlapping invalid allocations must never be presented as normal;
- timezone is `Europe/Sofia`;
- the calendar does not calculate availability independently of NestJS.

Drag-and-drop rescheduling is deferred until the standard reschedule flow is correct and fully accessible.

If added later, drag-and-drop must:

- show a review step;
- use the same NestJS rescheduling command;
- handle conflict failure;
- preserve the original booking if the new slot fails.

## 12. Appointment Detail

The appointment detail view groups:

### Customer

- name;
- verified contact information;
- preferred locale;
- profile/guest state;
- safe link to customer history.

### Booking

- service;
- specialist;
- room and devices;
- starts and ends;
- booking duration;
- buffers;
- status;
- automatic or manual confirmation.

### Price and policy snapshot

- price type and amount/range;
- currency;
- cancellation deadline snapshot;
- rescheduling deadline snapshot.

### Notes

- customer note;
- internal note shown only to authorized staff.

### History

- created;
- confirmed;
- rescheduled;
- cancelled;
- completed;
- no-show;
- actor and reason where applicable.

Actions are shown only when valid for the current status and role.

## 13. Create Appointment

Admins may create an appointment on behalf of a customer.

Flow:

1. select existing customer or create a minimal customer record;
2. select service;
3. select or automatically resolve eligible specialist;
4. choose a current available slot;
5. confirm resources and effective policies;
6. add customer/internal notes;
7. review;
8. submit.

The admin flow uses:

- the same availability engine;
- the same resource allocations;
- the same transaction;
- the same database conflict constraint;
- the same snapshot rules.

An ordinary admin form cannot bypass a conflict.

## 14. Manual Confirmation Queue

Services with `MANUAL` confirmation create `PENDING` appointments that already reserve resources.

The queue shows:

- age of request;
- requested date/time;
- customer;
- service;
- contact status;
- conflict-free allocated resources;
- confirm and cancel actions.

Confirm:

- validates current status;
- changes to `CONFIRMED`;
- records history;
- queues localized confirmation.

Cancel:

- requires a customer-safe reason when appropriate;
- releases allocations transactionally;
- records history;
- queues localized notification.

## 15. Cancellation, Rescheduling, Completion, and No-Show

### Cancellation

- show the snapshotted customer policy;
- warn if the customer deadline has passed;
- allow authorized staff exception without rewriting the snapshot;
- require an internal reason for selected administrative cancellations;
- release allocations in the same transaction.

### Rescheduling

- open the authoritative availability selector;
- preserve the original appointment if securing the new slot fails;
- show changed date/time before confirmation;
- record history and notification.

### Completed

- available only for eligible past/current confirmed appointments;
- may enable a future verified review invitation;
- does not change historical price or service snapshots.

### No-show

- requires intentional confirmation;
- is recorded in status history;
- never silently deletes the appointment.

## 16. Service Catalog

The services area supports:

- section/category/subcategory navigation;
- list and searchable table;
- filters by publication, active, bookable, featured, translation completeness, and `needsReview`;
- create;
- edit;
- duplicate as draft;
- archive;
- reorder;
- preview BG and EN public pages.

Important states remain separate:

```text
isActive
isBookable
publicationStatus
isFeatured
needsReview
```

The UI explains their difference.

## 17. Service Editor

The form follows the approved content model.

### General

- stable service key for authorized technical users;
- section;
- category;
- optional subcategory;
- sort order;
- active;
- featured;
- publication status.

### Bulgarian

- name;
- slug;
- short description;
- full description;
- benefits;
- suitable-for content;
- process;
- preparation;
- aftercare;
- contraindications;
- recovery information;
- customer instructions;
- SEO title and description.

### English

- equivalent fields;
- independent draft/published state where supported;
- translation completeness indicator;
- visible missing-field warnings.

English fields are not generated or published automatically without editorial review.

### Duration

```text
durationMinMinutes
durationMaxMinutes
bookingDurationMinutes
```

The form shows:

- customer-facing range preview;
- complete resource-blocked calendar time;
- explanation that preparation or cleanup time is included in booking duration.

### Price

```text
priceType
priceAmountMinor
priceMaxAmountMinor
priceCurrency
```

The editor enters normal decimal currency values such as `80.00`; NestJS converts and validates authoritative minor units.

Dynamic fields:

- `FIXED`: one amount;
- `FROM`: starting amount;
- `RANGE`: minimum and maximum;
- `PER_AREA`: amount plus localized presentation;
- `PER_ITEM`: amount plus localized presentation;
- `CONSULTATION_REQUIRED`: no false fixed-price requirement.

### Booking

- bookable toggle;
- automatic/manual confirmation;
- eligible specialists;
- optional minimum, maximum, and booking-duration overrides for each eligible specialist;
- required room/device resources;
- lead-time override;
- booking-window override;
- cancellation/rescheduling overrides.

### Images

- cover image;
- gallery;
- before-and-after pairs;
- sort order;
- BG/EN alt text status.

## 18. Service Validation and Publication

Validation levels:

### Save draft

Allows incomplete editorial content while preserving structurally valid data.

### Publish

Requires:

- required BG content;
- valid localized slug;
- price semantics;
- valid durations;
- suitable cover/SEO data according to page requirements;
- no unresolved blocking review flag.

### Enable online booking

Additionally requires:

- valid booking duration;
- non-negative buffers;
- at least one active eligible specialist;
- satisfiable room/device requirements;
- confirmation mode;
- effective booking policies.

The interface displays blocking errors together, grouped by section, with direct links to fields.

## 19. Categories and Ordering

Authorized admins can:

- create and edit sections/categories/subcategories;
- edit BG and EN names/slugs;
- reorder through explicit controls;
- archive unused nodes;
- preview affected services.

Rules:

- a category referenced by services is archived rather than destructively deleted;
- moving services between categories is intentional and previewed;
- localized slug conflicts are caught before save;
- public navigation changes trigger appropriate cache revalidation.

## 20. Seed Import

Initial normalized source:

```text
estetika_plus_proceduri_seed_ready.xlsx
```

The workbook contains 76 normalized services for initial seed preparation.

Seed import is primarily a development/deployment workflow, not an unrestricted daily admin upload.

If an authorized import screen is added, it must:

1. upload to a temporary protected location;
2. validate the expected template and columns;
3. show a dry-run summary;
4. identify create, update, unchanged, invalid, and review-required rows;
5. require explicit confirmation;
6. import by stable `serviceKey`;
7. remain idempotent;
8. never publish imported services automatically;
9. produce an auditable result.

Arbitrary spreadsheet columns must never map directly to database fields without validation.

## 21. Staff Management

Staff management supports:

- profile and public display information;
- active/inactive state;
- role/account association;
- service eligibility;
- public visibility;
- profile image;
- weekly schedule;
- leave and exceptions.

Phase 1:

- one cosmetician;
- service price is shared;
- service duration provides defaults;
- each eligible specialist may have optional duration overrides.

Adding a specialist later must not require database redesign.

Deactivating staff:

- removes them from new availability;
- preserves historical appointments;
- warns about future appointments;
- never silently cancels or reassigns bookings.

## 22. Rooms and Devices

Resources area manages:

```text
STAFF
ROOM
DEVICE
```

Initial non-staff resources:

- one main room;
- each limited device that affects booking availability.

Admin actions:

- create;
- edit readable name;
- activate/deactivate;
- assign service requirements;
- view upcoming allocations;
- add schedule exceptions when needed.

Rules:

- capacity and parallel behavior are validated;
- a referenced resource is archived rather than deleted;
- deactivation warns about future appointments;
- ordinary admins do not edit raw allocation records.

## 23. Schedule Management

Schedule area contains:

- recurring weekly hours;
- breaks;
- blocked time;
- leave;
- holidays;
- extra working time.

The editor shows:

- resource/staff;
- local date;
- start/end;
- full-day option where applicable;
- type;
- internal reason;
- affected future appointments.

Before saving a change that intersects appointments:

1. NestJS calculates affected bookings;
2. the UI displays a warning and count;
3. the schedule change does not silently modify appointments;
4. the admin resolves appointments separately.

Schedule rules use `Europe/Sofia` and present local times.

## 24. Booking Settings

Global settings:

```text
slotIntervalMinutes
bookingLeadTimeMinutes
bookingWindowDays
defaultConfirmationMode
guestBookingEnabled
allowCustomerCancellation
cancellationDeadlineHours
allowCustomerReschedule
rescheduleDeadlineHours
```

Approved initial policy direction:

```text
slotIntervalMinutes: 15 recommended
defaultConfirmationMode: AUTOMATIC
guestBookingEnabled: true
allowCustomerCancellation: true
cancellationDeadlineHours: 24
allowCustomerReschedule: true
rescheduleDeadlineHours: 24
slotHoldMinutes: 10 (fixed phase-1 rule)
```

The 10-minute hold begins only after the customer selects a slot and clicks “Continue”. It is not created while the customer merely browses the calendar.

The admin UI shows:

- current global value;
- safe allowed range;
- services that override it;
- plain-language effect;
- warning for unusually restrictive values.

Changing a global setting affects future bookings. Existing appointments retain their snapshots.

Studio timezone is security/operations-sensitive and cannot be casually edited with the other fields.

## 25. Customer Management

Customer list supports:

- search by normalized name, email, phone, or appointment reference according to authorization;
- filter by profile/guest state and active state;
- view appointment history;
- create an appointment;
- update permitted contact/profile information;
- start a verified merge/link workflow;
- export or erase data only through approved privacy workflows.

Customer detail distinguishes:

```text
authenticated account
guest customer record
verified contact
unverified contact
linked appointment history
```

Rules:

- matching email or phone text is not sufficient to expose or merge history;
- sensitive fields are masked in list views where practical;
- internal notes are access-controlled;
- marketing consent is separate from necessary booking communication;
- account deletion and customer-record retention are not treated as a simple row-delete button.

## 26. Media Management

The media area implements `docs/07-images.md`.

It supports:

- signed direct upload;
- thumbnail grid/list;
- upload progress and errors;
- BG/EN alt text and captions;
- focal point;
- desktop/mobile crop preview;
- service/gallery relationships;
- role, publication, and placeholder state;
- reference-aware archive and deletion;
- consent state for before-and-after content.

Admins select semantic transformations such as `heroDesktop` or `serviceCard`; they do not enter arbitrary Cloudinary URLs.

## 27. Homepage and General Content

Content management includes:

- homepage hero;
- homepage sections;
- about page;
- contact details;
- displayed working hours;
- promotional banner;
- frequently asked questions;
- policy-page content;
- footer and social links.

The homepage hero editor includes:

- desktop image;
- optional mobile image;
- BG/EN headline;
- BG/EN description;
- BG/EN CTA label and destination;
- focal point;
- controlled overlay preset;
- publication state;
- responsive preview.

Initial headline:

```text
Define Your Own Standard of Beauty
```

The owner can later change the image, text, CTA, or overlay without a code deployment.

Structured fields are preferred over one unlimited page-builder in phase 1. This preserves design quality and prevents accidental layout breakage.

## 28. BG and EN Editing

Every localized editor clearly shows:

```text
Bulgarian
English
```

Requirements:

- no silent fallback that accidentally publishes Bulgarian text on an English page;
- show translation completeness;
- allow independent drafts;
- preview the correct locale URL;
- preserve unsaved changes when switching language tabs where possible;
- validate localized slug uniqueness;
- show which language a customer notification will use.

The admin interface itself should initially prioritize Bulgarian because the studio owner will use it daily. English interface translation may follow, but BG/EN public-content editing is required from the start.

## 29. Review Moderation

Review states:

```text
PENDING
APPROVED
REJECTED
```

Review queue shows:

- display name;
- rating;
- review text;
- locale;
- verified appointment indicator;
- submitted date;
- moderation status;
- featured state.

Actions:

- approve;
- reject with internal reason;
- feature/unfeature;
- preview;
- remove from publication.

Rules:

- reviews are not public before approval;
- admin editing must not materially rewrite customer meaning;
- inappropriate personal information may be handled through a documented moderation policy;
- moderation actions are audited;
- a rejected review is not necessarily physically deleted.

## 30. Notification Management

Phase 1 notification administration includes:

- template preview for BG and EN;
- enabled/disabled state for optional reminders;
- reminder timing configuration within safe ranges;
- delivery status for appointment-related messages;
- retry of eligible failed messages;
- visibility into failure without exposing secrets.

Core transactional templates should be version-controlled or tightly structured rather than fully arbitrary HTML.

An appointment remains valid even if email delivery fails. The admin panel clearly separates booking status from notification status.

## 31. Settings

Settings are grouped:

### Studio

- name;
- contact details;
- address;
- timezone;
- public social links.

### Booking

- global policies from section 24.

### Content

- default locale;
- publication defaults where approved;
- homepage and footer configuration.

### Notifications

- sender identity;
- reminder behavior;
- template controls.

### Security

- restricted to `SUPER_ADMIN`;
- session/security controls explicitly approved for UI management.

Secrets are never displayed in full or stored through ordinary content forms.

## 32. Draft, Publish, Archive, and Preview

Content lifecycle:

```text
DRAFT
PUBLISHED
ARCHIVED
```

### Draft

- not public;
- may be incomplete;
- visible in admin;
- previewable by authorized users.

### Published

- passes required validation;
- visible on intended locale routes;
- triggers public cache revalidation.

### Archived

- unavailable for new public use;
- retains historical references;
- can remain visible in appointment history snapshots;
- is not physically deleted by normal workflows.

Preview:

- requires secure, non-public access;
- does not make content indexable;
- clearly indicates locale and draft status;
- does not reuse public cache in a way that leaks draft content.

## 33. Forms

Standard form behavior:

- labels remain visible;
- required and optional fields are clear;
- help text explains business meaning;
- validation appears near the field and in a summary for long forms;
- the first invalid field can be focused;
- keyboard order is logical;
- errors are not communicated by color alone;
- save buttons show progress and prevent duplicate submission;
- server errors preserve safe user input;
- successful save shows a clear result;
- unsaved-change warning appears before navigation.

Long editors may use sections or tabs, but saving behavior must be predictable.

Avoid:

- saving on every keystroke;
- unexplained auto-publication;
- destructive icon-only controls;
- dialogs containing extremely long forms;
- optimistic success for operations that can produce resource or publication conflicts.

## 34. Tables, Search, Filters, and Pagination

Reusable data-table behavior:

- server-side pagination for large collections;
- stable sorting;
- debounced search where appropriate;
- filter state represented in the URL when useful;
- clear empty, loading, and error states;
- selectable rows only when a valid bulk action exists;
- columns chosen for task relevance;
- mobile alternative for wide tables.

Search input is sanitized and parameterized by NestJS/Prisma.

The UI must remain fast with thousands of media records and growing appointment history.

## 35. Destructive Actions

Destructive operations use risk-appropriate confirmation.

Examples:

- archive service: confirm impact;
- cancel appointment: show customer, date, and consequences;
- delete unreferenced media: confirm exact asset;
- deactivate staff/resource: show affected future appointments;
- change role: restricted and audited.

Rules:

- use archive instead of delete for historical business entities;
- do not use a generic “Are you sure?” when specific consequences are known;
- high-impact actions require explicit target context;
- success and failure are clearly reported;
- repeated requests are idempotent where appropriate.

## 36. Audit Log

Audit records are required for sensitive administrative actions.

Capture:

```text
actorUserId
action
entityType
entityId
timestamp
request/correlation ID
safe change summary
reason when required
```

Audit:

- appointment status changes;
- appointment rescheduling/cancellation;
- role changes;
- working-hours and exception changes;
- publication and unpublication;
- service price/duration changes;
- before-and-after consent/publication actions;
- media deletion;
- customer merge/link actions;
- security-sensitive settings.

Do not store:

- passwords;
- raw access or refresh tokens;
- full secret values;
- unnecessary sensitive customer content.

Audit access is restricted and cannot be altered by ordinary admins.

## 37. Cache Revalidation

After a successful content mutation, NestJS/Next.js integration revalidates only affected public content where practical.

Examples:

- service edit revalidates the service page, category page, sitemap-related data, and relevant featured sections;
- hero publication revalidates locale homepages;
- review moderation revalidates pages displaying reviews;
- media metadata update revalidates its published consumers.

Rules:

- admin reads do not depend on stale public caches;
- failed mutations do not trigger false success;
- cache invalidation happens only after authoritative persistence;
- availability and appointment screens use dynamic data rules from `docs/08-booking-engine.md`.

## 38. Error Handling

Admin errors are actionable but do not expose internals.

Examples:

```text
VALIDATION_ERROR
FORBIDDEN
CONFLICT
STALE_UPDATE
RESOURCE_IN_USE
PUBLICATION_REQUIREMENTS_NOT_MET
SLOT_NO_LONGER_AVAILABLE
UPLOAD_FAILED
```

The UI:

- identifies the affected field or record;
- preserves safe entered values;
- offers retry only when safe;
- refreshes stale data after conflicts;
- never displays raw SQL, stack traces, tokens, or provider secrets.

## 39. Concurrent Editing

The system should detect important stale updates.

Initial direction:

- return `updatedAt` or a version value;
- include it in update commands;
- reject an update when the stored record changed since the editor loaded it;
- show that another change exists;
- allow the user to reload and review.

Do not silently overwrite another administrator’s recent service, schedule, or content changes.

Real-time collaborative editing is not required in phase 1.

## 40. Security

- require HTTPS;
- enforce NestJS authentication and authorization;
- use short-lived access tokens and secure refresh-cookie rules from `docs/06-auth.md`;
- protect cookie-authenticated state changes against CSRF;
- rate-limit sensitive endpoints;
- validate DTOs and reject unknown fields;
- prevent mass assignment;
- sanitize/render rich content safely;
- use signed Cloudinary uploads;
- restrict file types and sizes;
- avoid personal data in URLs and logs;
- apply secure response headers;
- invalidate/restrict disabled accounts promptly;
- audit sensitive actions.

Admin pages must not be considered secure merely because their URLs are unlinked or blocked from search indexing.

## 41. Accessibility

Minimum requirements:

- full keyboard operation;
- visible focus;
- meaningful headings and landmarks;
- labels for every control;
- accessible dialogs and drawers;
- focus return after closing overlays;
- status not communicated only through color;
- sufficiently large touch targets;
- text and UI contrast meeting applicable WCAG requirements;
- reduced-motion support;
- accessible validation summary;
- screen-reader announcement for important save/error results.

Third-party UI primitives are tested after customization. Library defaults do not guarantee the finished interface remains accessible.

## 42. Performance

- route-level code splitting;
- load complex calendar/media tools only where needed;
- server-side pagination and filtering;
- transformed admin thumbnails rather than originals;
- avoid downloading full appointment history initially;
- avoid refetching every dashboard widget after one unrelated mutation;
- use skeletons only when they clarify loading;
- monitor slow API queries and large responses;
- virtualize very large lists only when measured need justifies complexity.

The admin panel does not need public SEO, but it must load quickly for daily work.

## 43. Testing

### Unit

- permission-to-action mapping;
- service form transformations;
- price and duration previews;
- publication requirements;
- translation completeness;
- destructive-action impact summaries.

### API Integration

- each role against every protected mutation;
- draft/publish/archive transitions;
- stale-update conflict;
- referenced-resource archive/delete behavior;
- booking settings validation;
- schedule changes intersecting appointments;
- audit event creation.

### End-to-End

- admin login and logout;
- create/edit/publish BG service;
- add and review EN translation;
- enable booking only after operational requirements;
- update price without changing historical appointment snapshot;
- upload and assign hero image;
- change homepage hero without deployment;
- create, confirm, cancel, and reschedule appointment;
- add break/leave and review affected appointments;
- moderate review;
- mobile appointment workflow;
- keyboard-only primary workflows.

### Security

- customer cannot access admin endpoints;
- staff cannot perform admin-only actions;
- admin cannot manage roles;
- disabled user cannot continue protected work;
- manipulated client payload cannot set forbidden fields;
- draft content and private media are not publicly exposed.

## 44. Observability

Track:

- admin authentication failures;
- authorization denials;
- mutation success/failure rate;
- booking conflicts;
- upload failures;
- slow admin API operations;
- notification failures;
- publication errors;
- stale-update conflicts;
- sensitive audit events.

Operational dashboards and alerts are defined further in `docs/15-observability.md`.

## 45. Implementation Order

1. authenticated admin shell and role-based navigation;
2. reusable form, table, feedback, and confirmation patterns;
3. service catalog and BG/EN editor;
4. media library and signed upload;
5. staff, rooms, devices, and schedules;
6. booking settings;
7. appointment list and day agenda;
8. appointment detail and status actions;
9. week calendar;
10. customer history;
11. review moderation;
12. homepage and general content;
13. audit and operational polish.

The full dashboard should not be built first. Its widgets depend on stable modules and queries from the functional areas.

## 46. Phase 1 Scope

Required:

- admin authentication and authorization;
- responsive admin shell;
- service/category management;
- BG/EN content editing;
- prices, service durations, specialist duration overrides, and booking settings;
- media and gallery management;
- one/multiple specialist-ready management;
- room/device management;
- working hours and exceptions;
- appointment list, agenda/calendar, creation, confirmation, cancellation, rescheduling, completion, and no-show;
- customer history;
- review moderation;
- homepage hero/general content;
- basic dashboard;
- audit of sensitive actions.

Not required in phase 1:

- Payload CMS;
- unrestricted page builder;
- real-time collaborative editing;
- payments/deposits;
- advanced analytics suite;
- complex drag-and-drop calendar;
- automatic AI content generation;
- staff-specific price overrides;
- native mobile app.

## 47. Acceptance Criteria

The admin panel is ready when:

- a non-technical owner can manage daily operations without database access;
- all mutations pass through authorized NestJS endpoints;
- BG and EN content are independently manageable;
- services cannot publish or become bookable with invalid required data;
- prices, service defaults, specialist duration overrides, staff, rooms, and devices are understandable in the UI;
- active holds are visibly distinct from appointments and expire without manual cleanup;
- appointments cannot bypass booking conflict protection;
- schedule changes warn about existing future appointments;
- hero imagery and copy can be changed without deployment;
- before-and-after publication requires recorded consent;
- historical appointment snapshots remain unchanged after catalog edits;
- destructive actions are explicit and audited;
- primary workflows work on desktop, tablet, and mobile;
- keyboard and assistive-technology use is supported;
- the interface remains usable with growing appointments and thousands of images.

## 48. Related Documents

- `docs/01-content-model.md`
- `docs/02-design-system.md`
- `docs/03-frontend.md`
- `docs/04-backend.md`
- `docs/05-database.md`
- `docs/06-auth.md`
- `docs/07-images.md`
- `docs/08-booking-engine.md`
- `docs/12-internationalization.md`
- `docs/13-security.md`
- `docs/14-testing.md`
- `docs/15-observability.md`
