# Internationalization

## 1. Purpose

This document defines Bulgarian and English routing, content, formatting, metadata, admin editing, and translation behavior for Estetica Plus.

Approved locales:

```text
bg — Bulgarian
en — English
```

Bulgarian is the primary business and editorial locale. English is a complete public locale, not an automatic visual translation layer.

## 2. Core Decisions

- every public route has an explicit locale segment;
- Bulgarian routes use `/bg/...`;
- English routes use `/en/...`;
- the root `/` redirects through an approved locale-selection rule;
- public content and system UI messages are localized separately;
- NestJS remains the authority for localized persistent content;
- translations are stored as structured records, not one mixed rich-text field;
- incomplete English content remains draft;
- no automatic fallback may silently publish Bulgarian copy on an English page.

## 3. Route Shape

```text
app/
└── [locale]/
    ├── (public)/
    ├── account/
    └── admin/
```

Examples:

```text
/bg
/bg/uslugi
/bg/uslugi/pochistvane-na-lice
/en
/en/services
/en/services/facial-cleansing
/bg/account
/bg/admin
```

The exact translated static segments are defined once in the routing layer. Do not scatter route translations across components.

## 4. Supported Locale Configuration

One typed configuration defines:

```text
supportedLocales
defaultLocale
locale labels
HTML language values
date/number formatting locale
route-segment mappings
```

Direction:

```text
supportedLocales: ["bg", "en"]
defaultLocale: "bg"
```

Unknown locale segments return an intentional not-found result or approved redirect. They must not be accepted as arbitrary strings.

## 5. Root Locale Resolution

The root `/` may consider:

1. explicit saved visitor preference;
2. supported browser language;
3. Bulgarian default.

Rules:

- do not redirect repeatedly;
- do not override an explicit `/bg` or `/en` URL;
- preserve the requested deep route when switching locale;
- avoid locale detection that makes crawlers see unstable content at one URL;
- canonical indexable content remains on explicit locale URLs.

The final root behavior is tested for SEO, privacy, and cache correctness.

## 6. Locale Switcher

The locale switcher:

- displays `BG` and `EN`;
- links to the equivalent translated page where published;
- preserves relevant safe navigation state;
- does not preserve sensitive query parameters;
- is keyboard accessible;
- announces the language clearly;
- stores preference only when useful.

If an equivalent EN page is not published:

- do not invent a route;
- offer the EN homepage or a clearly explained alternative;
- do not show a broken link.

## 7. Localized Slugs

Each translated entity owns its locale-specific slug.

Examples:

```text
bg: pochistvane-na-lice
en: facial-cleansing
```

Unique constraints:

```text
(locale, slug)
```

Rules:

- slugs are lowercase and stable;
- changing a published slug creates a redirect;
- IDs remain the internal relationship identity;
- locale switch resolves by entity ID, not by guessing the other slug;
- transliteration is allowed for Bulgarian URL slugs, while visible names remain Cyrillic;
- editors may review generated slug suggestions before publication.

## 8. Content Translation Model

Localized content uses translation records such as:

```text
Service
└── ServiceTranslation
    ├── locale
    ├── name
    ├── slug
    ├── descriptions
    ├── treatment information
    └── SEO fields
```

Operational fields remain language-neutral:

```text
duration
price
currency
booking rules
staff/resource relationships
publication identity
```

Do not duplicate operational services only to translate text.

## 9. Translation Status

Suggested status:

```text
MISSING
DRAFT
READY_FOR_REVIEW
APPROVED
PUBLISHED
```

At minimum, the system must distinguish incomplete/draft from published.

The admin panel shows:

- missing fields;
- last update;
- translation status;
- source locale context;
- public preview;
- blocking publication errors.

## 10. Fallback Rules

### Public indexable content

No cross-language text fallback for primary page copy.

If EN is not ready:

- EN page is not published;
- EN URL is absent from sitemap and hreflang;
- the locale switcher handles the missing equivalent intentionally.

### Non-critical UI

A temporary development fallback to Bulgarian or a translation key may be allowed only in non-production and must be detectable by tests.

### Data without language

Prices, dates, durations, and identifiers use shared operational data formatted for the current locale.

## 11. UI Translation Keys

Interface strings live in locale dictionaries.

Example namespaces:

```text
common
navigation
booking
auth
account
admin
validation
errors
emails
```

Keys describe meaning:

```text
booking.actions.confirm
```

Avoid:

```text
buttonText1
```

Rules:

- dictionaries have typed or validated parity;
- missing production keys fail tests or builds according to implementation;
- components do not contain duplicated translated literals;
- long content remains in the content API/database rather than UI dictionaries.

## 12. Bulgarian Language Rules

- use natural contemporary Bulgarian;
- preserve Cyrillic;
- use consistent formal/informal voice approved by the brand;
- avoid awkward direct English calques;
- use correct Bulgarian quotation and punctuation;
- review treatment terminology with the studio professional;
- customer communication uses consistent terms for appointment, service, cancellation, and confirmation.

Initial brand voice is warm, elegant, clear, and not overly medical or sales-heavy.

## 13. English Language Rules

- use professional natural English;
- translate meaning rather than word order;
- avoid unsupported medical claims;
- use consistent treatment vocabulary;
- review service names used in international beauty/aesthetic contexts;
- do not publish machine-generated text without human review;
- preserve the Estetica Plus brand name.

The hero headline remains:

```text
Define Your Own Standard of Beauty
```

## 14. Numbers, Currency, and Prices

Use `Intl.NumberFormat` or the approved server/client formatting abstraction.

Authoritative currency:

```text
EUR
```

The database stores integer minor units.

Formatting differs by locale, but value does not:

```text
bg: 80,00 €
en: €80.00 or approved locale convention
```

Price types receive localized labels:

```text
FIXED
FROM
RANGE
PER_AREA
PER_ITEM
CONSULTATION_REQUIRED
```

Do not compose translated price phrases by fragile string concatenation.

## 15. Dates and Times

Studio timezone:

```text
Europe/Sofia
```

Use locale-aware date/time formatting.

Rules:

- show customer appointments in studio time unless a future feature explicitly adds another view;
- include date, time, and useful timezone context in confirmations;
- avoid ambiguous numeric-only dates in critical messages;
- use timezone-aware calculations on the server;
- do not translate stored timestamps;
- weekday and month names come from locale-aware formatters.

## 16. Durations

Localized presentation examples:

```text
bg: 60–80 мин.
en: 60–80 min
```

Duration formatting uses semantic helpers, not hardcoded suffixes in components.

Booking duration remains an operational value and is not confused with customer-facing duration copy. Phase 1 has no separate buffer fields; any additional operational time is included in `bookingDurationMinutes`.

## 17. Validation and Errors

NestJS returns stable error codes and structured field information.

Next.js maps them to localized messages.

Example:

```text
SLOT_NO_LONGER_AVAILABLE
```

Rules:

- API business logic does not depend on translated error sentences;
- client does not parse English text to determine behavior;
- validation field names are localized;
- fallback errors remain safe and understandable;
- admin errors may be more operationally detailed but never expose internals.

## 18. Booking Flow

Booking content localizes:

- steps;
- service name/description;
- price type;
- duration;
- date/time;
- status;
- confirmation mode;
- cancellation/rescheduling policy;
- consent text;
- success and conflict messages.

The appointment snapshots:

- service name in the booking locale;
- customer preferred locale;
- relevant policy meaning/data.

Notifications use the locale selected at booking unless the verified customer later changes an approved preference.

## 19. Emails

Every customer-facing transactional template supports BG and EN.

Templates:

```text
booking requested
booking confirmed
booking cancelled
booking rescheduled
reminder
email verification
password reset
account invitation
```

Rules:

- locale is resolved explicitly;
- subject and body match;
- links lead to the same locale;
- date, price, and service name are localized;
- missing translation does not silently send a mixed-language production email;
- preview and tests cover both locales.

## 20. Images

Meaningful images support:

```text
altBg
altEn
captionBg
captionEn
```

Rules:

- alt text describes the image in the page language;
- captions are independent;
- decorative images may use empty alt;
- missing required EN alt blocks or warns on EN publication;
- Cloudinary public IDs are language-neutral;
- one image may serve both locales with separate metadata.

## 21. SEO

Each published locale page provides:

- localized title and description;
- self-canonical;
- reciprocal hreflang for available translations;
- correct HTML `lang`;
- localized Open Graph content;
- localized structured visible data;
- sitemap membership.

An unpublished locale does not appear in alternates.

Detailed requirements are in `docs/11-seo-performance.md`.

## 22. Admin Experience

The admin interface is Bulgarian-first.

Content editors see explicit:

```text
BG
EN
```

Requirements:

- preserve unsaved text when switching tabs where practical;
- display translation completeness;
- prevent accidental EN publication;
- preview exact locale route;
- show localized-slug conflicts;
- keep operational fields outside translation tabs;
- show shared fields clearly.

An English admin-interface translation is optional after phase 1; English public-content management is required from the start.

## 23. API Direction

Public content requests identify locale through the route/query/header contract defined in `docs/04-backend.md`.

Rules:

- locale is validated against the allowlist;
- API responses do not combine languages unpredictably;
- administrative endpoints may return all translation records;
- locale-independent IDs support cross-locale linking;
- caches include locale in their key.

## 24. Accessibility

- set correct document language;
- mark isolated foreign-language phrases when useful;
- language switcher labels are understandable to screen readers;
- translated text does not break control sizes;
- do not use flags as the only language identifier;
- test Cyrillic and Latin font coverage;
- preserve readable line length in both languages.

## 25. Testing

Automated tests cover:

- only `bg` and `en` accepted;
- root locale resolution;
- direct locale URL is respected;
- locale switch between equivalent entities;
- missing translation behavior;
- localized slug uniqueness;
- reciprocal hreflang;
- sitemap locale pairs;
- number, price, date, and duration formatting;
- booking and auth errors in both locales;
- email templates in both locales;
- missing dictionary keys;
- no mixed-language production pages.

End-to-end tests cover representative BG and EN public, booking, account, and admin flows.

## 26. Adding a Future Locale

Adding a locale requires:

1. architecture decision;
2. locale configuration;
3. route mappings;
4. UI dictionaries;
5. database translations;
6. content review workflow;
7. emails;
8. metadata, sitemap, hreflang;
9. formatting tests;
10. accessibility and SEO review.

Do not add a locale only by copying dictionary files.

## 27. Acceptance Criteria

- every public route uses `/bg` or `/en`;
- Bulgarian is the default editorial language;
- EN pages publish only when reviewed;
- locale switch uses entity relationships, not slug guessing;
- operational data is shared and formatted per locale;
- customer notifications use the correct locale;
- errors are localized from stable codes;
- public metadata and hreflang match publication state;
- BG/EN alt text is supported;
- admin clearly separates shared and translated fields;
- no production page silently mixes Bulgarian and English.

## 28. Official References

- Next.js internationalization guide: <https://nextjs.org/docs/app/guides/internationalization>
- Google localized versions: <https://developers.google.com/search/docs/specialty/international/localized-versions>
- MDN `Intl`: <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl>
