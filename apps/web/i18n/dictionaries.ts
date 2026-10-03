import type { Locale } from "./config";

export type SiteDictionary = Readonly<{
  metadata: Readonly<{
    title: string;
    description: string;
  }>;
  navigation: Readonly<{
    language: string;
    skipToContent: string;
    primary: string;
    services: string;
    gallery: string;
    about: string;
    contact: string;
    booking: string;
    openMenu: string;
    closeMenu: string;
    mobileMenu: string;
  }>;
  hero: Readonly<{
    headline: string;
    description: string;
    primaryAction: string;
    imageAlt: string;
    placeholderNotice: string;
  }>;
  introduction: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    bookingPlaceholder: string;
  }>;
}>;

const bg = {
  metadata: {
    title: "Красота по твоя стандарт | Aestetica Plus",
    description:
      "Aestetica Plus съчетава грижа, прецизност и внимание към детайла в елегантно пространство за красота и увереност.",
  },
  navigation: {
    language: "Избор на език",
    skipToContent: "Към основното съдържание",
    primary: "Основна навигация",
    services: "Услуги",
    gallery: "Галерия",
    about: "За нас",
    contact: "Контакти",
    booking: "Запази час",
    openMenu: "Отвори менюто",
    closeMenu: "Затвори менюто",
    mobileMenu: "Мобилна навигация",
  },
  hero: {
    headline: "Define Your Own Standard of Beauty",
    description:
      "Мястото, където грижата и вниманието към детайла се срещат, за да превърнат твоята визия в твой собствен критерий за красота и увереност.",
    primaryAction: "Запази своя час",
    imageAlt: "Временен редакционен портрет за началната страница на Aestetica Plus.",
    placeholderNotice: "Временна развойна фотография",
  },
  introduction: {
    eyebrow: "Aestetica Plus",
    title: "Грижата започва с внимание.",
    description:
      "Изграждаме спокойно и прецизно дигитално преживяване, което поставя яснотата, доверието и личния подход на първо място.",
    bookingPlaceholder:
      "Онлайн записването ще бъде добавено в следващ етап. Този бутон засега води до временна секция.",
  },
} as const satisfies SiteDictionary;

const en = {
  metadata: {
    title: "Beauty on Your Terms | Aestetica Plus",
    description:
      "Aestetica Plus brings care, precision, and attention to detail together in an elegant setting for beauty and confidence.",
  },
  navigation: {
    language: "Choose language",
    skipToContent: "Skip to main content",
    primary: "Primary navigation",
    services: "Services",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    booking: "Book",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileMenu: "Mobile navigation",
  },
  hero: {
    headline: "Define Your Own Standard of Beauty",
    description:
      "A place where care and attention to detail come together to transform your vision into your own standard of beauty and confidence.",
    primaryAction: "Book an Appointment",
    imageAlt: "Temporary editorial portrait for the Aestetica Plus homepage.",
    placeholderNotice: "Temporary development photography",
  },
  introduction: {
    eyebrow: "Aestetica Plus",
    title: "Care begins with attention.",
    description:
      "We are shaping a calm and precise digital experience that puts clarity, trust, and a personal approach first.",
    bookingPlaceholder:
      "Online booking will be added in a later phase. For now, this action leads to a temporary section.",
  },
} as const satisfies SiteDictionary;

const dictionaries = {
  bg,
  en,
} as const satisfies Record<Locale, SiteDictionary>;

export function getDictionary(locale: Locale): SiteDictionary {
  return dictionaries[locale];
}
