import type { Locale } from "./config";

export type FoundationDictionary = Readonly<{
  metadata: Readonly<{
    title: string;
    description: string;
  }>;
  navigation: Readonly<{
    language: string;
  }>;
  foundation: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
}>;

const bg = {
  metadata: {
    title: "Проектна основа | Aestetica Plus",
    description: "Начална двуезична проектна основа на Aestetica Plus.",
  },
  navigation: {
    language: "Избор на език",
  },
  foundation: {
    eyebrow: "Начална проектна основа",
    title: "Основата на Aestetica Plus работи.",
    description: "Next.js приложението е готово за следващия етап на разработка.",
  },
} as const satisfies FoundationDictionary;

const en = {
  metadata: {
    title: "Project Foundation | Aestetica Plus",
    description: "Initial bilingual project foundation for Aestetica Plus.",
  },
  navigation: {
    language: "Choose language",
  },
  foundation: {
    eyebrow: "Initial project foundation",
    title: "Aestetica Plus foundation is running.",
    description: "The Next.js application is ready for the next implementation phase.",
  },
} as const satisfies FoundationDictionary;

const dictionaries = {
  bg,
  en,
} as const satisfies Record<Locale, FoundationDictionary>;

export function getDictionary(locale: Locale): FoundationDictionary {
  return dictionaries[locale];
}
