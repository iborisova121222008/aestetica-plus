import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { i18n, isLocale } from "@/i18n/config";

import "../globals.css";

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return i18n.supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={i18n.htmlLanguages[locale]}>
      <body>{children}</body>
    </html>
  );
}
