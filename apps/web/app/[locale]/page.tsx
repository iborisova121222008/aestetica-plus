import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";
import { getLocalePath, i18n, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteUrl } from "@/lib/site-url";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

function getCanonicalUrl(siteUrl: string, locale: Locale) {
  return `${siteUrl}${getLocalePath(locale)}`;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const siteUrl = getSiteUrl();
  const languages = Object.fromEntries(
    i18n.supportedLocales.map((supportedLocale) => [
      i18n.htmlLanguages[supportedLocale],
      getCanonicalUrl(siteUrl, supportedLocale),
    ]),
  );

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: getCanonicalUrl(siteUrl, locale),
      languages,
    },
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {dictionary.navigation.skipToContent}
      </a>

      <main className="min-h-screen bg-background py-8 sm:py-12 lg:py-20" id="main-content">
        <Container>
          <nav aria-label={dictionary.navigation.language} className="flex justify-end">
            <ul className="flex list-none gap-2 p-0">
            {i18n.supportedLocales.map((supportedLocale) => {
              const label = i18n.localeLabels[supportedLocale];
              const isCurrentLocale = locale === supportedLocale;

              return (
                <li key={supportedLocale}>
                  <Link
                    aria-current={isCurrentLocale ? "page" : undefined}
                    aria-label={label.languageName}
                    className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-xs font-bold tracking-wider transition-colors duration-motion-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isCurrentLocale
                        ? "border-rose-deep bg-rose-deep text-surface-pure"
                        : "border-border-strong bg-surface text-foreground hover:border-rose-strong hover:bg-rose-soft"
                    }`}
                    href={getLocalePath(supportedLocale)}
                    hrefLang={i18n.htmlLanguages[supportedLocale]}
                    lang={i18n.htmlLanguages[supportedLocale]}
                  >
                    {label.shortLabel}
                  </Link>
                </li>
              );
            })}
            </ul>
          </nav>

          <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-16">
            <section aria-labelledby="foundation-title">
              <div aria-hidden="true" className="mb-6 h-px w-12 bg-rose-strong" />
              <p className="text-xs font-bold uppercase tracking-widest text-rose-deep">
                {dictionary.foundation.eyebrow}
              </p>
              <h1
                className="mt-4 max-w-3xl font-display text-display-lg font-medium text-foreground"
                id="foundation-title"
              >
                {dictionary.foundation.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-soft">
                {dictionary.foundation.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="#preview-surface">
                  {dictionary.foundation.actions.primary}
                </ButtonLink>
                <ButtonLink href="#foundation-details" variant="secondary">
                  {dictionary.foundation.actions.secondary}
                </ButtonLink>
                <ButtonLink href="#main-content" variant="tertiary">
                  {dictionary.foundation.actions.tertiary}
                </ButtonLink>
              </div>
            </section>

            <Surface aria-labelledby="preview-title" id="preview-surface">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-deep">
                {dictionary.foundation.preview.label}
              </p>
              <h2
                className="mt-4 font-display text-heading-2 font-medium text-foreground"
                id="preview-title"
              >
                {dictionary.foundation.preview.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground-soft">
                {dictionary.foundation.preview.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                <span aria-hidden="true" className="size-2 rounded-full bg-success" />
                <span className="text-sm font-semibold text-foreground">
                  {dictionary.foundation.preview.statusLabel}:
                </span>
                <span className="text-sm text-muted-foreground">
                  {dictionary.foundation.preview.status}
                </span>
              </div>
            </Surface>
          </div>

          <p
            className="mt-12 max-w-content-narrow border-l-2 border-rose pl-5 text-sm leading-relaxed text-muted-foreground lg:mt-16"
            id="foundation-details"
          >
            {dictionary.foundation.details}
          </p>
        </Container>
      </main>
    </>
  );
}
