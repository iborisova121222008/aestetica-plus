const supportedLocales = ["bg", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

export type PublicRoutes = Readonly<{
  home: `/${Locale}`;
  services: string;
  gallery: string;
  shop: string;
  booking: string;
}>;

type LocaleDetails = Readonly<{
  shortLabel: string;
  languageName: string;
}>;

export const i18n = {
  supportedLocales,
  defaultLocale: "bg",
  localeLabels: {
    bg: {
      shortLabel: "BG",
      languageName: "Български",
    },
    en: {
      shortLabel: "EN",
      languageName: "English",
    },
  },
  htmlLanguages: {
    bg: "bg",
    en: "en",
  },
  formattingLocales: {
    bg: "bg-BG",
    en: "en-GB",
  },
} as const satisfies Readonly<{
  supportedLocales: readonly Locale[];
  defaultLocale: Locale;
  localeLabels: Record<Locale, LocaleDetails>;
  htmlLanguages: Record<Locale, string>;
  formattingLocales: Record<Locale, string>;
}>;

export function isLocale(value: string): value is Locale {
  return i18n.supportedLocales.some((locale) => locale === value);
}

export function getLocalePath(locale: Locale): `/${Locale}` {
  return `/${locale}`;
}

const publicRoutes = {
  bg: {
    home: "/bg",
    services: "/bg/uslugi",
    gallery: "/bg/galeriya",
    shop: "/bg/magazin",
    booking: "/bg#booking-placeholder",
  },
  en: {
    home: "/en",
    services: "/en/services",
    gallery: "/en/gallery",
    shop: "/en/shop",
    booking: "/en#booking-placeholder",
  },
} as const satisfies Record<Locale, PublicRoutes>;

export function getPublicRoutes(locale: Locale): PublicRoutes {
  return publicRoutes[locale];
}
