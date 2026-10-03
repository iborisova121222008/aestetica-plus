import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Hero } from "@/components/home/hero";
import { Introduction } from "@/components/home/introduction";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getLocalePath,
  getPublicRoutes,
  i18n,
  isLocale,
  type Locale,
} from "@/i18n/config";
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
  const routes = getPublicRoutes(locale);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {dictionary.navigation.skipToContent}
      </a>

      <SiteHeader locale={locale} navigation={dictionary.navigation} routes={routes} />

      <main id="main-content">
        <Hero bookingHref={routes.booking} content={dictionary.hero} locale={locale} />
        <Introduction content={dictionary.introduction} />
      </main>
    </>
  );
}
