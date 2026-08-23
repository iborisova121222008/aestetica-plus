import type { Locale } from "./config";

export type FoundationDictionary = Readonly<{
  metadata: Readonly<{
    title: string;
    description: string;
  }>;
  navigation: Readonly<{
    language: string;
    skipToContent: string;
  }>;
  foundation: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    actions: Readonly<{
      primary: string;
      secondary: string;
      tertiary: string;
    }>;
    preview: Readonly<{
      label: string;
      title: string;
      description: string;
      statusLabel: string;
      status: string;
    }>;
    details: string;
  }>;
}>;

const bg = {
  metadata: {
    title: "Проектна основа | Aestetica Plus",
    description: "Начална двуезична проектна основа на Aestetica Plus.",
  },
  navigation: {
    language: "Избор на език",
    skipToContent: "Към основното съдържание",
  },
  foundation: {
    eyebrow: "Визуална основа",
    title: "Дизайн системата на Aestetica Plus е готова за преглед.",
    description:
      "Това е временен визуален пример на споделените цветове, типография, форми и ритъм — не завършената начална страница.",
    actions: {
      primary: "Виж визуалния пример",
      secondary: "Прочети за основата",
      tertiary: "Към началото",
    },
    preview: {
      label: "Примерен компонент",
      title: "Спокойна, ясна и последователна основа",
      description:
        "Матова повърхност, деликатен контур и премерен акцент показват как бъдещите интерфейси могат да останат елегантни и лесни за използване.",
      statusLabel: "Състояние",
      status: "Основа в разработка",
    },
    details:
      "Този екран демонстрира само базовите визуални решения и достъпни състояния. Реалното съдържание и финалната начална страница предстоят.",
  },
} as const satisfies FoundationDictionary;

const en = {
  metadata: {
    title: "Project Foundation | Aestetica Plus",
    description: "Initial bilingual project foundation for Aestetica Plus.",
  },
  navigation: {
    language: "Choose language",
    skipToContent: "Skip to main content",
  },
  foundation: {
    eyebrow: "Visual foundation",
    title: "The Aestetica Plus design system is ready for review.",
    description:
      "This is a temporary visual preview of the shared colours, typography, shapes, and rhythm — not the finished homepage.",
    actions: {
      primary: "View the visual preview",
      secondary: "Read about the foundation",
      tertiary: "Back to the top",
    },
    preview: {
      label: "Sample component",
      title: "A calm, clear, and consistent foundation",
      description:
        "A matte surface, delicate border, and measured accent show how future interfaces can remain elegant and easy to use.",
      statusLabel: "Status",
      status: "Foundation in progress",
    },
    details:
      "This screen demonstrates only the base visual decisions and accessible states. Real content and the final homepage will follow later.",
  },
} as const satisfies FoundationDictionary;

const dictionaries = {
  bg,
  en,
} as const satisfies Record<Locale, FoundationDictionary>;

export function getDictionary(locale: Locale): FoundationDictionary {
  return dictionaries[locale];
}
