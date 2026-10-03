import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { SiteDictionary } from "@/i18n/dictionaries";

type HeroProps = Readonly<{
  bookingHref: string;
  content: SiteDictionary["hero"];
  locale: Locale;
}>;

export function Hero({ bookingHref, content, locale }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-foreground md:items-center"
    >
      <Image
        alt={content.imageAlt}
        className="object-cover object-[68%_center] sm:object-[66%_center] lg:object-center"
        fill
        priority
        sizes="100vw"
        src="/images/hero-placeholder.png"
      />
      <div aria-hidden="true" className="hero-overlay absolute inset-0" />

      <Container className="relative z-10 pb-16 pt-32 sm:pb-20 md:py-36" size="wide">
        <div className="max-w-2xl text-surface-pure">
          <div aria-hidden="true" className="mb-6 h-px w-12 bg-rose-soft" />
          <h1
            className="font-display text-display-xl font-medium text-balance"
            id="hero-title"
            lang={locale === "bg" ? "en" : undefined}
          >
            {content.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-surface-pure/90 sm:text-lg">
            {content.description}
          </p>
          <div className="mt-8">
            <ButtonLink href={bookingHref} variant="inverted">
              {content.primaryAction}
            </ButtonLink>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-rose-soft">
            {content.placeholderNotice}
          </p>
        </div>
      </Container>
    </section>
  );
}
