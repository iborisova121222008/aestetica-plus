import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main>
      <div className="foundation">
        <nav aria-label={dictionary.navigation.language}>
          <ul className="language-list">
            {i18n.supportedLocales.map((supportedLocale) => {
              const label = i18n.localeLabels[supportedLocale];

              return (
                <li key={supportedLocale}>
                  <Link
                    aria-current={locale === supportedLocale ? "page" : undefined}
                    aria-label={label.languageName}
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

        <section>
          <p>{dictionary.foundation.eyebrow}</p>
          <h1>{dictionary.foundation.title}</h1>
          <p>{dictionary.foundation.description}</p>
        </section>
      </div>
    </main>
  );
}
