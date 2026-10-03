import { Container } from "@/components/ui/container";
import type { SiteDictionary } from "@/i18n/dictionaries";

type IntroductionProps = Readonly<{
  content: SiteDictionary["introduction"];
}>;

export function Introduction({ content }: IntroductionProps) {
  return (
    <section
      aria-labelledby="introduction-title"
      className="bg-background py-20 sm:py-24 lg:py-32"
      id="introduction"
    >
      <Container size="narrow">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-deep">
          {content.eyebrow}
        </p>
        <h2
          className="mt-4 font-display text-heading-2 font-medium text-foreground"
          id="introduction-title"
        >
          {content.title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-foreground-soft">
          {content.description}
        </p>
        <p
          className="mt-10 border-l-2 border-rose pl-5 text-sm leading-relaxed text-muted-foreground"
          id="booking-placeholder"
        >
          {content.bookingPlaceholder}
        </p>
      </Container>
    </section>
  );
}
