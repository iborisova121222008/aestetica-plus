const supportedLocales = ["bg", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

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
