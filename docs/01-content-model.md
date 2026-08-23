# Content Model

## 1. Purpose

This document defines how Estetica Plus content is organized, translated, validated, displayed, and prepared for the database.

It covers:

- service sections, categories, subcategories, and services;
- Bulgarian and English content;
- prices and duration ranges;
- online-booking settings;
- images and galleries;
- reviews and general website content;
- admin form behavior;
- seed-data conventions.

It does not define the final Prisma schema. The final relational implementation belongs in `docs/05-database.md` after the booking rules are approved.

## 2. Content Principles

1. Bulgarian is the primary content locale.
2. English is an independently editable translation, not an automatic public translation.
3. Public content must be publishable without a deployment.
4. Admin users work with understandable studio terminology, not raw database fields.
5. A service represents one distinct bookable offer.
6. Prices use integer minor units.
7. Display duration and calendar-blocking duration are separate concepts.
8. Missing business information is marked for review rather than invented.
9. Images are referenced through Cloudinary public IDs.
10. Deleted business content should usually be archived instead of permanently removed.

## 3. Content Hierarchy

The public service catalog uses the hierarchy:

```text
Section
└── Category
    └── Subcategory (optional)
        └── Service
```

Example:

```text
Лице
└── Plasma Pen / неоперативен лифтинг
    └── Фибропластика
        └── Фибропластика / неоперативен лифтинг на шия
```

Another example without a subcategory:

```text
Лазерна епилация
└── Лазерна епилация
    └── Подмишници
```

The admin UI must keep the terms `Section`, `Category`, and `Subcategory` visible and understandable even if the final database uses a reusable hierarchical category table.

## 4. Section

A section is the highest public grouping of services.

Initial sections:

- `Лице`
- `Лазерна епилация`
- `Тяло`

Required fields:

| Field | Description |
| --- | --- |
| `key` | Stable internal identifier |
| `nameBg` | Bulgarian name |
| `nameEn` | English name |
| `slugBg` | Bulgarian-route slug |
| `slugEn` | English-route slug |
| `descriptionBg` | Optional Bulgarian introduction |
| `descriptionEn` | Optional English introduction |
| `sortOrder` | Manual display order |
| `isActive` | Whether it can be used in admin forms |
| `publicationStatus` | Draft, published, or archived |
| `heroImageId` | Optional image reference |

Rules:

- `key` never changes after creation.
- Slugs must be unique within their locale and route scope.
- An archived section is unavailable for new services.
- A section cannot be publicly published without a Bulgarian name and slug.

## 5. Category

A category groups related services inside a section.

Examples:

- `Диагностика и почистване`
- `Вежди и мигли`
- `Химични пилинги и терапии`
- `Plasma Pen / неоперативен лифтинг`
- `RF Microneedling`
- `Мезотерапия и регенерация`
- `Лазерна епилация`
- `Апаратни процедури`

Required fields:

| Field | Description |
| --- | --- |
| `key` | Stable internal identifier |
| `sectionId` | Parent section |
| `nameBg` | Bulgarian name |
| `nameEn` | English name |
| `slugBg` | Bulgarian-route slug |
| `slugEn` | English-route slug |
| `descriptionBg` | Optional Bulgarian category text |
| `descriptionEn` | Optional English category text |
| `sortOrder` | Order inside the section |
| `isActive` | Available for content management |
| `publicationStatus` | Draft, published, or archived |
| `coverImageId` | Optional category image |

## 6. Subcategory

A subcategory is optional and provides a third navigation and grouping level.

Examples:

- `Почистване`
- `Консултация`
- `Ламиниране`
- `Пилинг`
- `Anti-age терапия`
- `Карбокситерапия`
- `Фибропластика`
- `Фракционен плазма пилинг`
- `Мезотерапия`

Required fields:

| Field | Description |
| --- | --- |
| `key` | Stable internal identifier |
| `categoryId` | Parent category |
| `nameBg` | Bulgarian name |
| `nameEn` | English name |
| `slugBg` | Bulgarian-route slug if used publicly |
| `slugEn` | English-route slug if used publicly |
| `sortOrder` | Order inside the category |
| `isActive` | Available for assignment |
| `publicationStatus` | Draft, published, or archived |

A service may belong directly to a category when no meaningful subcategory exists.

## 7. Service

A service is one public and potentially bookable offer.

Examples:

- `RF Microneedling на лице`
- `Цели крака`
- `Ламиниране на вежди`
- `Фибропластика / неоперативен лифтинг на шия`

Different treatment zones with different prices or durations are separate services. They are not stored as unstructured price text.

### 7.1 Identity and Organization

| Field | Required | Description |
| --- | --- | --- |
| `serviceKey` | Yes | Stable internal identifier used by seed data |
| `sectionId` | Yes | Parent section |
| `categoryId` | Yes | Parent category |
| `subcategoryId` | No | Optional parent subcategory |
| `sortOrder` | Yes | Manual display order |
| `isActive` | Yes | Available for management and relationships |
| `publicationStatus` | Yes | `DRAFT`, `PUBLISHED`, or `ARCHIVED` |
| `isFeatured` | Yes | Whether the service may appear in featured areas |

`serviceKey`:

- is unique;
- is not translated;
- is not shown to customers;
- must not change when a public name or slug changes.

### 7.2 Localized Content

Each service supports Bulgarian and English values:

| Field | BG required for publication | EN required for EN publication |
| --- | --- | --- |
| Name | Yes | Yes |
| Slug | Yes | Yes |
| Short description | Recommended | Recommended |
| Full description | Recommended | Recommended |
| Benefits | Optional | Optional |
| Suitable for | Optional | Optional |
| Treatment process | Optional | Optional |
| Preparation | Optional | Optional |
| Aftercare | Optional | Optional |
| Contraindications | Optional | Optional |
| Recovery information | Optional | Optional |
| SEO title | Optional override | Optional override |
| SEO description | Optional override | Optional override |

Admin fields should be presented in separate `BG` and `EN` tabs.

English content must not be generated and published silently. A service may be published in Bulgarian while its English translation remains draft.

### 7.3 Slugs

Rules:

- `slugBg` and `slugEn` may differ.
- Slugs use lowercase Latin characters, numbers, and hyphens.
- Slugs are editable after automatic generation.
- A slug must be unique within its locale and route scope.
- Changing a published slug should create a redirect from the previous public URL.
- Internal relationships use IDs or stable keys, never slugs.

Example:

```text
nameBg: RF Microneedling на лице
slugBg: rf-microneedling-na-litse

nameEn: RF Microneedling for the Face
slugEn: rf-microneedling-face
```

## 8. Duration Model

Every bookable service uses:

```text
durationMinMinutes
durationMaxMinutes
bookingDurationMinutes
```

Meaning:

| Field | Meaning |
| --- | --- |
| `durationMinMinutes` | Shortest expected treatment time shown to customers |
| `durationMaxMinutes` | Longest expected treatment time shown to customers |
| `bookingDurationMinutes` | Time blocked in the appointment calendar |

Examples:

| Public duration | Min | Max | Booking |
| --- | ---: | ---: | ---: |
| 60 min | 60 | 60 | 60 |
| 60–80 min | 60 | 80 | 80 |
| 30–35 min | 30 | 35 | 35 |

Validation:

- all values are positive whole minutes;
- `durationMinMinutes <= durationMaxMinutes`;
- `bookingDurationMinutes >= durationMinMinutes`;
- `bookingDurationMinutes` may exceed the displayed maximum when operational cleanup time is included;
- an online-bookable service requires `bookingDurationMinutes`;
- missing duration prevents online booking until reviewed.

The service values are defaults. `StaffService` may provide optional specialist-specific overrides:

```text
durationMinMinutesOverride?
durationMaxMinutesOverride?
bookingDurationMinutesOverride?
```

Effective values use the specialist override when present and otherwise use the service default. All three effective values must pass the same duration validation.

There is no separate before/after buffer in phase 1. Any preparation, cleanup, or rest time that must block the calendar is included in the effective `bookingDurationMinutes`.

## 9. Price Model

### 9.1 Core Fields

```text
priceAmountMinor
priceMaxAmountMinor
priceCurrency
priceType
```

Initial currency:

```text
EUR
```

Examples:

| Displayed price | Stored value |
| --- | ---: |
| €25.00 | `2500` |
| €80.00 | `8000` |
| €155.00 | `15500` |

JavaScript floating-point values must not be used for authoritative money calculations.

### 9.2 Price Types

```text
FIXED
FROM
RANGE
PER_AREA
PER_ITEM
CONSULTATION_REQUIRED
```

Rules:

| Type | Required fields | Example display |
| --- | --- | --- |
| `FIXED` | `priceAmountMinor` | `€80` |
| `FROM` | `priceAmountMinor` | `from €80` |
| `RANGE` | Both price amounts | `€80–€120` |
| `PER_AREA` | `priceAmountMinor` | `€125 per area` |
| `PER_ITEM` | `priceAmountMinor` | `€20 per item` |
| `CONSULTATION_REQUIRED` | No numeric price required | `Price after consultation` |

Validation:

- `priceCurrency` is required when a numeric price exists;
- `priceAmountMinor` is a non-negative integer;
- `priceMaxAmountMinor >= priceAmountMinor`;
- `RANGE` requires a maximum value;
- types other than `RANGE` normally leave `priceMaxAmountMinor` empty;
- public price wording is translated;
- the frontend never calculates or accepts an authoritative booking price.

The imported BGN values remain source-reference data and are not the authoritative launch price.

## 10. Online Booking Fields

Every service includes:

| Field | Description |
| --- | --- |
| `isBookable` | Can be selected in the online booking flow |
| `bookingDurationMinutes` | Calendar time blocked |
| `bookingLeadTimeMinutes` | Optional minimum notice before booking |
| `bookingWindowDays` | Optional maximum future booking window |
| `requiresConsultation` | Whether consultation is required first |
| `customerInstructionsBg` | Bulgarian booking-specific instructions |
| `customerInstructionsEn` | English booking-specific instructions |

Initial import behavior:

- valid price and duration: `isBookable = true`;
- missing required information: `isBookable = false`, `needsReview = true`;
- archived or inactive service: not bookable;
- unpublished service: not publicly bookable.

Staff, resource, slot-hold, payment, and confirmation rules are defined in `docs/08-booking-engine.md`. Phase 1 has no separate buffer fields; operational time is included in the effective booking duration.

## 11. Publication Status

Content uses:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Meaning:

| Status | Behavior |
| --- | --- |
| `DRAFT` | Editable but not publicly visible |
| `PUBLISHED` | Publicly visible in the relevant locale |
| `ARCHIVED` | Hidden from new public use but retained for history |

`isActive` and `publicationStatus` are different:

- `isActive` controls operational use;
- `publicationStatus` controls editorial visibility.

An archived service remains connected to historical appointments.

## 12. Images and Galleries

### 12.1 Image Metadata

The database stores:

| Field | Description |
| --- | --- |
| `publicId` | Cloudinary public ID |
| `resourceType` | Cloudinary resource type |
| `width` | Original width |
| `height` | Original height |
| `format` | Original format metadata |
| `altBg` | Bulgarian alternative text |
| `altEn` | English alternative text |
| `captionBg` | Optional Bulgarian caption |
| `captionEn` | Optional English caption |
| `sortOrder` | Display order |
| `isActive` | Availability in admin |
| `publicationStatus` | Public visibility |

The database must not store a permanent transformed delivery URL.

### 12.2 Image Roles

An image may be assigned as:

- service cover;
- service gallery item;
- before image;
- after image;
- category cover;
- homepage hero;
- marketing image.

Before-and-after pairs require:

- explicit pairing;
- matching orientation where practical;
- clear labels;
- consistent ordering;
- consent confirmation;
- no misleading transformation.

Detailed upload and transformation behavior belongs in `docs/07-images.md`.

## 13. Reviews

Review content includes:

| Field | Description |
| --- | --- |
| `customerId` | Optional authenticated customer |
| `appointmentId` | Optional verified appointment |
| `displayName` | Approved public name |
| `rating` | Whole number from 1 to 5 |
| `body` | Review text |
| `locale` | Language of the review |
| `moderationStatus` | Pending, approved, or rejected |
| `isFeatured` | Homepage or marketing placement |
| `publishedAt` | Public publication date |

Reviews are not public before moderation. Admin editing must not change the meaning of a customer review without a visible moderation policy.

## 14. General Website Content

Editable content includes:

- homepage hero;
- homepage introduction;
- featured services;
- about page;
- contact details;
- working-hour presentation;
- promotional banners;
- frequently asked questions;
- policy pages;
- footer content;
- social links.

Global content must support BG and EN independently.

Structured content fields are preferred over one unrestricted rich-text field when the page has a stable design.

### 14.1 Homepage Hero

The homepage hero is editable content and must not be hardcoded permanently inside a page component.

Required fields:

| Field | Description |
| --- | --- |
| `eyebrowBg` | Optional short Bulgarian label |
| `eyebrowEn` | Optional short English label |
| `headlineBg` | Hero headline used on the BG homepage |
| `headlineEn` | Hero headline used on the EN homepage |
| `descriptionBg` | Bulgarian supporting copy |
| `descriptionEn` | English supporting copy |
| `primaryCtaLabelBg` | Bulgarian primary-action label |
| `primaryCtaLabelEn` | English primary-action label |
| `primaryCtaHrefBg` | BG locale destination |
| `primaryCtaHrefEn` | EN locale destination |
| `desktopImageId` | Desktop hero image |
| `mobileImageId` | Optional mobile-specific crop or image |
| `imageAltBg` | Bulgarian alternative text |
| `imageAltEn` | English alternative text |
| `focalPointX` | Horizontal focal point used for responsive cropping |
| `focalPointY` | Vertical focal point used for responsive cropping |
| `overlayStrength` | Controlled overlay preset, not arbitrary CSS |
| `publicationStatus` | Draft, published, or archived |

Initial approved copy:

```text
headlineBg:
Define Your Own Standard of Beauty

descriptionBg:
Мястото, където грижата и вниманието към детайла се срещат, за да
превърнат твоята визия в твой собствен критерий за красота и увереност.

primaryCtaLabelBg:
Запази своя час
```

The English headline remains the same because it is treated as a brand statement on the Bulgarian homepage.

Initial English draft:

```text
headlineEn:
Define Your Own Standard of Beauty

descriptionEn:
A place where care and attention to detail come together to transform
your vision into your own standard of beauty and confidence.

primaryCtaLabelEn:
Book an Appointment
```

The English supporting copy must be reviewed before publication.

Development may use a licensed placeholder image. Production must use the approved original image of the studio representative or model. The reference screenshot is visual inspiration only and must not be shipped as a project asset.

## 15. Admin Service Form

The service editor is organized into understandable sections:

### General

- service key for authorized technical users;
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
- benefits and treatment information;
- SEO fields.

### English

- equivalent English fields;
- translation completeness indicator.

### Duration

- minimum duration;
- maximum duration;
- booking duration;
- human-readable preview.

### Price

- price type;
- currency;
- minimum/fixed amount;
- maximum amount when required;
- human-readable preview.

### Booking

- online-bookable toggle;
- consultation requirement;
- customer instructions;
- later staff/resource settings.

### Images

- cover image;
- gallery;
- before-and-after pairs;
- BG/EN alternative text;
- sorting.

The form must:

- show validation near the relevant field;
- hide irrelevant price inputs based on `priceType`;
- warn before leaving with unsaved changes;
- prevent publishing incomplete required BG content;
- prevent enabling online booking without required operational data.

## 16. Seed Workbook Mapping

The normalized workbook `estetika_plus_proceduri_seed_ready.xlsx` contains 76 services.

Main sheet:

```text
Услуги за seed
```

Important mapping:

| Workbook column | Content meaning |
| --- | --- |
| `serviceKey` | Stable seed identifier |
| `sortOrder` | Initial order |
| `sectionBg` | Section name |
| `categoryBg` | Category name |
| `subcategoryBg` | Optional subcategory |
| `nameBg`, `nameEn` | Localized names |
| `slugBg`, `slugEn` | Localized slugs |
| `descriptionBg`, `descriptionEn` | Initial descriptions |
| duration columns | Duration model |
| price columns | Price model |
| `isActive` | Operational state |
| `isBookable` | Initial online-booking state |
| `needsReview` | Manual review flag |
| `notes` | Import notes |

Seed-import rules:

- import by stable key, not row number;
- imports must not create duplicates when re-run;
- category and section names are normalized before relationship creation;
- blank EN fields remain blank;
- `needsReview` records are reported;
- imported records are not automatically published;
- source data is validated before any production import.

## 17. Current Data Decisions

Approved:

- 76 distinct services from the workbook;
- each priced treatment zone is a separate service;
- EUR is the authoritative seed currency;
- money uses integer minor units;
- range durations use min, max, and booking duration;
- current maximum duration becomes initial booking duration;
- missing price or duration disables online booking;
- English content remains empty until reviewed;
- original source values remain available for audit.

Requires manual review:

- `Почистване на лице` has no confirmed duration or price.

## 18. Deferred Decisions

The following are intentionally deferred:

- staff-specific service prices;
- deposits and payments;
- packages, memberships, and promotions;
- time-limited price history;
- consultation prerequisites;
- simultaneous resource capacity.

Approved elsewhere and no longer deferred:

- specialist-specific duration overrides;
- no separate service buffers;
- rooms and limited equipment as booking resources;
- 10-minute temporary slot hold.

Online payments are not part of phase 1. Optional Stripe prepayment may be considered later through a separate decision.

## 19. Acceptance Criteria

The content model is implemented correctly when:

- admin users can create a service without technical database knowledge;
- BG and EN content are independently editable;
- incomplete EN content cannot accidentally publish;
- fixed and range durations display correctly;
- booking duration blocks the correct calendar time;
- all price types validate and display correctly;
- money remains exact;
- archived services preserve historical relationships;
- image metadata supports accessible BG/EN output;
- seed import is repeatable and reports incomplete data;
- public routes resolve the correct localized slug and content.
