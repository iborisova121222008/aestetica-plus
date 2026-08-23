# Design System

## 1. Purpose

This document defines the visual and interaction direction for Estetica Plus.

The design must feel:

- minimal;
- elegant;
- neutral;
- soft and feminine without being decorative;
- clean and clinical without feeling cold;
- premium without relying on excessive gold, gloss, or visual effects.

The system applies to the public website, booking flow, customer portal, and custom admin interface. Operational admin screens may be denser, but they must use the same tokens and accessibility standards.

## 2. Brand Direction

### Visual Mood

The intended mood is:

- soft nude and ivory surfaces;
- matte white product-inspired cards;
- classic near-black typography;
- restrained dusty rose accents;
- generous whitespace;
- refined editorial headings;
- precise, modern body typography;
- high-quality photography as the main visual richness.

Avoid:

- bright pink;
- saturated purple;
- prominent metallic gold;
- glossy gradients;
- heavy shadows;
- excessive rounded “bubble” UI;
- ornamental script fonts;
- crowded beauty-salon clichés;
- animation that delays access to content.

## 3. Color System

### 3.1 Core Palette

| Token | HEX | Use |
| --- | --- | --- |
| `background` | `#F7F3EE` | Main ivory/cream page background |
| `background-soft` | `#FBF8F4` | Alternating soft page sections |
| `surface` | `#FFFCF9` | Primary cards and panels |
| `surface-pure` | `#FFFFFF` | Forms, product-style surfaces, admin tables |
| `surface-muted` | `#EEE7E1` | Muted panels and selected neutral areas |
| `foreground` | `#211D1B` | Primary near-black text |
| `foreground-soft` | `#4B4440` | Secondary headings and supporting text |
| `muted-foreground` | `#746B66` | Labels, metadata, placeholders |
| `border` | `#DED5CE` | Default borders and dividers |
| `border-strong` | `#C8BBB2` | Emphasized boundaries |
| `rose-soft` | `#E7D2D3` | Dusty rose background accent |
| `rose` | `#C7A0A4` | Marketing graphics and subtle highlights |
| `rose-strong` | `#956A70` | Accessible rose text, icons, and active details |
| `rose-deep` | `#704B51` | Strong accent states and selected controls |

### 3.2 Functional Colors

Functional colors communicate status and are not brand decoration.

| Token | HEX | Use |
| --- | --- | --- |
| `success` | `#496B58` | Confirmed, completed, successful |
| `success-soft` | `#E4EEE7` | Success background |
| `warning` | `#8A6736` | Attention and pending state |
| `warning-soft` | `#F5EBD9` | Warning background |
| `danger` | `#9A4545` | Destructive and error state |
| `danger-soft` | `#F6E3E1` | Error background |
| `info` | `#4D6575` | Neutral information |
| `info-soft` | `#E4EBEF` | Information background |

### 3.3 CSS Token Direction

Tokens should be exposed as semantic CSS variables rather than hardcoded component colors:

```css
:root {
  --background: #f7f3ee;
  --background-soft: #fbf8f4;
  --surface: #fffcf9;
  --surface-pure: #ffffff;
  --surface-muted: #eee7e1;

  --foreground: #211d1b;
  --foreground-soft: #4b4440;
  --muted-foreground: #746b66;

  --border: #ded5ce;
  --border-strong: #c8bbb2;

  --rose-soft: #e7d2d3;
  --rose: #c7a0a4;
  --rose-strong: #956a70;
  --rose-deep: #704b51;
}
```

Final implementation may convert HEX values into the color format required by Tailwind and shadcn/ui while preserving the visible colors.

### 3.4 Color Usage Rules

- Main pages use `background`.
- Cards normally use `surface` or `surface-pure`.
- Body text uses `foreground` or `foreground-soft`.
- Dusty rose is an accent, not the dominant page background.
- `rose` is appropriate for decorative backgrounds but not automatically appropriate for small text.
- Important text and controls use contrast-checked colors such as `foreground`, `rose-strong`, or `rose-deep`.
- Primary action buttons should use near-black or deep rose, not pale dusty rose with white text.
- Functional states always use functional colors.
- Color must never be the only indicator of state.

## 4. Typography

### 4.1 Font Pairing

Approved direction:

- Display and editorial headings: `Playfair Display`
- Body, navigation, forms, and admin: `Inter`

Fonts should be self-hosted through the framework font system where possible to avoid layout shifts and unnecessary third-party requests.

Fallback stacks:

```text
Display: "Playfair Display", Georgia, "Times New Roman", serif
Body: "Inter", Arial, Helvetica, sans-serif
```

Do not introduce a third primary typeface without approval.

### 4.2 Type Scale

Use fluid sizes for public editorial headings and stable readable sizes for application UI.

| Token | Mobile | Desktop | Typical use |
| --- | ---: | ---: | --- |
| `display-xl` | 44px | 72px | Homepage hero |
| `display-lg` | 38px | 56px | Major page statement |
| `heading-1` | 34px | 48px | Page title |
| `heading-2` | 28px | 38px | Main section |
| `heading-3` | 23px | 30px | Subsection |
| `heading-4` | 19px | 22px | Card heading |
| `body-lg` | 18px | 18px | Introductory text |
| `body` | 16px | 16px | Standard body and forms |
| `body-sm` | 14px | 14px | Supporting information |
| `caption` | 12px | 12px | Compact labels and metadata |

Recommended implementation uses `clamp()` for display and major heading sizes.

### 4.3 Typography Rules

- Public headings use the display font.
- Forms, prices, navigation, buttons, tables, and admin screens use the body font.
- Body line height: approximately `1.6`.
- Large heading line height: approximately `1.05–1.15`.
- Avoid long centered paragraphs.
- Use uppercase only for short labels, with increased letter spacing.
- Do not use ultra-light body text.
- Prices must remain easy to scan.
- Bulgarian and English typography must be tested for real text length.

## 5. Spacing

Use a 4px base system:

```text
1  = 4px
2  = 8px
3  = 12px
4  = 16px
5  = 20px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
24 = 96px
```

Rules:

- Mobile horizontal page padding: `20px`.
- Tablet horizontal page padding: `32px`.
- Desktop horizontal page padding: `48–64px`, constrained by container width.
- Public section spacing should feel generous but not wasteful.
- Form spacing must prioritize clear grouping over decoration.
- Dense admin tables may use smaller vertical spacing while retaining touch-safe actions.

## 6. Layout

### 6.1 Containers

| Container | Maximum width | Use |
| --- | ---: | --- |
| `content-narrow` | 720px | Long-form content and policies |
| `content` | 1120px | Standard public sections |
| `content-wide` | 1320px | Galleries and premium desktop layouts |
| `application` | 1440px | Customer portal and admin |

Containers remain centered with responsive side padding.

### 6.2 Responsive Direction

Design mobile first.

Reference breakpoints:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Breakpoints should respond to content, not device names alone.

Rules:

- no required horizontal scrolling;
- touch targets are at least approximately 44×44px;
- booking actions remain easy to reach on mobile;
- desktop layouts may use asymmetry and editorial image placement;
- mobile layouts must retain clear reading order;
- cards should not be compressed into unreadable multi-column grids.

### 6.3 Grid Direction

- Mobile: primarily one column.
- Tablet: two columns where content supports it.
- Desktop services: three columns in most cases.
- Large editorial galleries may use controlled asymmetry.
- Admin forms use one column on mobile and logical two-column groups on wide screens.

## 7. Shape, Borders, and Elevation

### 7.1 Radius

| Token | Value | Use |
| --- | ---: | --- |
| `radius-sm` | 4px | Small controls |
| `radius-md` | 8px | Inputs and compact cards |
| `radius-lg` | 12px | Primary cards and dialogs |
| `radius-xl` | 18px | Selected editorial panels only |
| `radius-full` | 9999px | Pills, avatars, status indicators |

Avoid applying large rounding to every section.

### 7.2 Borders

- Default border: 1px `border`.
- Use dividers and whitespace before adding shadows.
- Form controls require a visible boundary.
- Focus styles must be stronger than the normal border.

### 7.3 Shadows

Shadows are restrained:

```text
shadow-soft: 0 8px 30px rgba(33, 29, 27, 0.06)
shadow-dialog: 0 20px 60px rgba(33, 29, 27, 0.14)
```

Avoid dark, sharp, or layered material-style shadows.

## 8. Buttons

### Primary

- near-black or `rose-deep` background;
- light text;
- clear hover, active, focus, and disabled states;
- used for the most important action, such as booking confirmation.

### Secondary

- transparent or light surface;
- visible dark border;
- dark text;
- used for alternative actions.

### Tertiary

- text or icon action;
- no card-like visual weight;
- visible hover and focus state.

### Destructive

- `danger` treatment;
- explicit wording;
- confirmation for material destructive actions.

Button rules:

- minimum touch height approximately 44px;
- labels use clear verbs;
- loading state prevents duplicate submission;
- disabled state does not rely only on opacity;
- icons support labels and do not replace unfamiliar action text.

## 9. Form Controls

Inputs use:

- matte white or `surface-pure` background;
- near-black text;
- visible neutral border;
- 8px radius;
- clear label above the control;
- helper and error text below;
- strong accessible focus ring.

Required states:

- default;
- hover;
- focus;
- filled;
- disabled;
- read-only;
- error;
- success when useful;
- loading.

Placeholder text must not replace a label.

The booking form should feel calm and guided, with one clear decision group at a time.

## 10. Cards

### Service Card

Contains:

- optimized image;
- category or short label;
- service name;
- duration;
- price presentation;
- short description when appropriate;
- clear details or booking action.

Rules:

- photography is the visual focus;
- metadata remains easy to scan;
- hover motion must not cause layout shift;
- the entire card may be clickable only when nested controls remain valid and accessible.

### Marketing Card

May use `rose-soft` or a photographic background with strong text contrast.

### Admin Card

Uses more restrained spacing and `surface-pure`. Operational clarity is more important than editorial styling.

## 11. Navigation

### Public Header

- simple logo area;
- essential navigation only;
- visible booking action;
- BG/EN language switcher;
- transparent-over-hero behavior only if contrast remains reliable;
- stable sticky behavior without large layout jumps.

### Mobile Navigation

- clear menu button;
- full keyboard support;
- focus trapping while open;
- body scroll lock;
- obvious close action;
- language switcher and booking action remain accessible.

### Admin Navigation

- clear role-appropriate sections;
- visible current location;
- collapsible only when it improves space;
- mobile operation remains possible.

## 12. Booking UI

The booking flow should be calm, explicit, and reversible.

Recommended steps:

1. Service
2. Staff preference when applicable
3. Date and time
4. Customer details
5. Review and confirmation

Rules:

- show progress without overwhelming the user;
- preserve valid input when moving backward;
- show duration and price before final confirmation;
- explain when a price is estimated or consultation-based;
- unavailable slots must not appear actionable;
- selected time must be revalidated by the server;
- errors should offer a next action;
- mobile may use a sticky bottom action area when it does not cover content.

The exact flow is finalized in `docs/08-booking-engine.md`.

## 13. Customer Portal

The portal uses the brand system with application-level clarity.

Priorities:

- upcoming appointment;
- appointment status;
- date, time, service, staff, and price;
- permitted reschedule or cancellation actions;
- appointment history;
- profile and security settings.

Avoid decorative dashboard charts unless they communicate useful customer information.

## 14. Admin Interface

The admin interface is custom, practical, and consistent with the public brand.

It may use:

- white surfaces;
- compact typography;
- stronger table borders;
- status chips;
- sticky table headers;
- filters and search;
- drawers or dialogs for focused actions;
- full pages for complex service editing.

Admin priorities:

1. correctness;
2. clear status;
3. efficient editing;
4. accessibility;
5. brand consistency.

Do not sacrifice usability to make operational screens resemble a marketing page.

## 15. Images

Photography carries most of the premium visual expression.

Rules:

- use authentic, high-resolution studio and treatment imagery;
- maintain natural skin texture;
- avoid misleading retouching;
- use consistent crops within one gallery;
- preserve focal points;
- provide BG and EN alternative text;
- reserve image dimensions to prevent layout shift;
- load only the appropriate responsive size;
- do not autoplay heavy background video on mobile;
- before-and-after imagery must be clearly labeled.

Common aspect ratios:

| Ratio | Use |
| --- | --- |
| `4:5` | Service cards and portrait treatment imagery |
| `3:2` | Editorial sections |
| `16:9` | Wide marketing and selected hero media |
| `1:1` | Compact galleries and profile imagery |

The homepage hero may use a custom art-directed crop per breakpoint.

## 16. Icons

- use one consistent outline icon family;
- default stroke should feel refined, not heavy;
- icons use `currentColor`;
- decorative icons are hidden from assistive technology;
- interactive icon-only buttons require accessible labels;
- avoid mixing filled, outlined, and illustrative icon styles.

## 17. Motion

Motion is subtle and purposeful.

Recommended:

- gentle opacity and small vertical entrance;
- refined image reveal;
- short hover elevation or scale;
- smooth accordion and dialog transitions;
- restrained page transition when it does not delay navigation.

Reference durations:

| Token | Duration |
| --- | ---: |
| `motion-fast` | 120ms |
| `motion-default` | 200ms |
| `motion-slow` | 360ms |

Reference easing:

```text
standard: cubic-bezier(0.22, 1, 0.36, 1)
exit: cubic-bezier(0.4, 0, 1, 1)
```

Rules:

- animations must not block interaction;
- avoid large parallax effects on mobile;
- avoid animating layout-heavy properties;
- prefer transform and opacity;
- support `prefers-reduced-motion`;
- reduced motion removes nonessential entrance and transition effects;
- Framer Motion is used only in Client Components that genuinely need it.

## 18. Accessibility

Minimum requirements:

- target WCAG 2.2 AA;
- visible keyboard focus;
- logical heading hierarchy;
- semantic landmarks;
- keyboard-operable menus, dialogs, galleries, and booking;
- form labels and associated errors;
- status announcements where necessary;
- meaningful image alternative text;
- sufficient text and control contrast;
- touch-friendly targets;
- zoom and text resizing without loss of functionality;
- reduced-motion support;
- no information communicated by color alone.

Accessibility is part of component acceptance, not a final audit-only task.

## 19. Language and Content Length

Components must support Bulgarian and English without fixed text-height assumptions.

Rules:

- buttons should not depend on one short label;
- navigation must tolerate longer English or Bulgarian terms;
- cards should use controlled content limits, not clipped essential information;
- translated text may wrap naturally;
- do not shrink body text to make translations fit;
- admin translation completeness must be visible.

## 20. Design Tokens and Component Ownership

Tokens are the source of truth for:

- colors;
- typography;
- spacing;
- radius;
- borders;
- shadows;
- motion;
- container widths;
- layer order.

Components consume semantic tokens. They must not introduce arbitrary one-off HEX colors or spacing values without a documented reason.

shadcn/ui provides accessible primitives and initial behavior. Components must be restyled to match this design system rather than retaining the default visual appearance.

## 21. Initial Component Set

Public:

- header;
- mobile navigation;
- language switcher;
- footer;
- button;
- service card;
- category navigation;
- price display;
- duration display;
- image gallery;
- before-and-after viewer;
- review card;
- FAQ accordion;
- booking call-to-action;
- contact block.

Forms and booking:

- input;
- textarea;
- select;
- checkbox;
- radio group;
- date picker;
- slot picker;
- step indicator;
- validation message;
- confirmation summary.

Admin:

- application shell;
- sidebar/navigation;
- data table;
- filters;
- status badge;
- form section;
- translation tabs;
- image uploader;
- confirmation dialog;
- empty state;
- notification/toast.

Components are added only when required by an approved page or workflow.

## 22. Design Review Checklist

Before a component or page is accepted:

- does it match the ivory, matte white, dusty rose, and near-black system?
- is dusty rose used as an accent rather than everywhere?
- does text remain readable and contrast-safe?
- is the mobile experience complete?
- are touch targets large enough?
- is keyboard focus visible?
- does the page work with reduced motion?
- are loading, empty, error, and success states defined?
- are image dimensions reserved?
- does BG and EN content fit naturally?
- are arbitrary colors and spacing avoided?
- does the result feel premium without unnecessary decoration?

## 23. Decisions Requiring Visual Approval

Before public UI implementation is considered final, approve:

- logo and wordmark usage;
- final font rendering with real Bulgarian text;
- exact homepage hero treatment;
- service-card image ratio;
- primary button choice between near-black and deep rose;
- final photography direction;
- desktop header behavior;
- before-and-after interaction.

The token palette in this document is the approved implementation starting point and may be refined through explicit visual review.
