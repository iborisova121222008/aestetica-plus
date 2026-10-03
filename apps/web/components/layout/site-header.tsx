"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { getLocalePath, i18n, type Locale, type PublicRoutes } from "@/i18n/config";
import type { SiteDictionary } from "@/i18n/dictionaries";

type SiteHeaderProps = Readonly<{
  locale: Locale;
  navigation: SiteDictionary["navigation"];
  routes: PublicRoutes;
}>;

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader({ locale, navigation, routes }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [isMenuOpen]);

  const hasSolidBackground = isScrolled || isMenuOpen;
  const navigationItems = [
    { href: routes.services, label: navigation.services },
    { href: routes.gallery, label: navigation.gallery },
    { href: routes.about, label: navigation.about },
    { href: routes.contact, label: navigation.contact },
  ];

  const navigationLinkClass = `inline-flex min-h-11 items-center text-sm font-semibold transition-colors duration-motion-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 ${
    hasSolidBackground
      ? "text-foreground hover:text-rose-deep focus-visible:ring-offset-surface"
      : "text-surface-pure hover:text-rose-soft focus-visible:ring-offset-foreground"
  }`;

  return (
    <>
      <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-motion-default ease-standard ${
        hasSolidBackground
          ? "border-border bg-surface/95 text-foreground shadow-design-soft backdrop-blur-md"
          : "border-transparent bg-transparent text-surface-pure"
      }`}
    >
      <div className="mx-auto flex h-header-mobile max-w-application items-center justify-between gap-2 px-5 md:px-8 xl:grid xl:h-header-desktop xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-8 xl:px-12 2xl:px-16">
        <nav aria-label={navigation.primary} className="hidden xl:block">
          <ul className="flex list-none items-center gap-8 p-0">
            {navigationItems.slice(0, 2).map((item) => (
              <li key={item.href}>
                <Link className={navigationLinkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <BrandLogo className="w-32 xl:w-56" href={routes.home} />

        <div className="hidden min-w-0 items-center justify-end gap-5 xl:flex">
          <nav aria-label={navigation.primary}>
            <ul className="flex list-none items-center gap-7 p-0">
              {navigationItems.slice(2).map((item) => (
                <li key={item.href}>
                  <Link className={navigationLinkClass} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={navigation.language}>
            <ul className="flex list-none items-center gap-1 p-0">
              {i18n.supportedLocales.map((supportedLocale) => (
                <li key={supportedLocale}>
                  <Link
                    aria-current={locale === supportedLocale ? "page" : undefined}
                    aria-label={i18n.localeLabels[supportedLocale].languageName}
                    className={`${navigationLinkClass} min-w-11 justify-center px-2 text-xs tracking-wider`}
                    href={getLocalePath(supportedLocale)}
                    hrefLang={i18n.htmlLanguages[supportedLocale]}
                    lang={i18n.htmlLanguages[supportedLocale]}
                  >
                    {i18n.localeLabels[supportedLocale].shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-design-md border px-4 text-sm font-bold transition-colors duration-motion-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 ${
              hasSolidBackground
                ? "border-rose-deep bg-rose-deep text-surface-pure hover:border-foreground hover:bg-foreground focus-visible:ring-offset-surface"
                : "border-surface-pure bg-surface-pure text-foreground hover:border-rose-soft hover:bg-rose-soft focus-visible:ring-offset-foreground"
            }`}
            href={routes.booking}
          >
            {navigation.booking}
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            className={`inline-flex min-h-11 items-center justify-center rounded-design-md border px-3 text-sm font-bold transition-colors duration-motion-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 ${
              hasSolidBackground
                ? "border-rose-deep bg-rose-deep text-surface-pure focus-visible:ring-offset-surface"
                : "border-surface-pure bg-surface-pure text-foreground focus-visible:ring-offset-foreground"
            }`}
            href={routes.booking}
          >
            {navigation.booking}
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={navigation.openMenu}
            className={`inline-flex size-11 items-center justify-center rounded-design-md border transition-colors duration-motion-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 ${
              hasSolidBackground
                ? "border-border-strong text-foreground focus-visible:ring-offset-surface"
                : "border-surface-pure/70 text-surface-pure focus-visible:ring-offset-foreground"
            }`}
            onClick={() => setIsMenuOpen(true)}
            ref={menuButtonRef}
            type="button"
          >
            <span aria-hidden="true" className="grid gap-1.5">
              <span className="h-px w-5 bg-current" />
              <span className="h-px w-5 bg-current" />
              <span className="h-px w-5 bg-current" />
            </span>
          </button>
        </div>
      </div>

      </header>

      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-motion-default ease-standard xl:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        inert={!isMenuOpen}
      >
        <button
          aria-label={navigation.closeMenu}
          className="absolute inset-0 bg-foreground/55"
          onClick={() => setIsMenuOpen(false)}
          tabIndex={-1}
          type="button"
        />
        <div
          aria-label={navigation.mobileMenu}
          aria-modal="true"
          className={`absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col bg-surface px-6 py-5 shadow-design-dialog transition-transform duration-motion-default ease-standard ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          id="mobile-navigation"
          ref={panelRef}
          role="dialog"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
            <BrandLogo className="w-36" href={routes.home} />
            <button
              aria-label={navigation.closeMenu}
              className="inline-flex size-11 items-center justify-center rounded-design-md border border-border-strong text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              onClick={() => setIsMenuOpen(false)}
              ref={closeButtonRef}
              type="button"
            >
              <span aria-hidden="true" className="text-2xl leading-none">×</span>
            </button>
          </div>

          <nav aria-label={navigation.mobileMenu} className="mt-8">
            <ul className="grid list-none gap-1 p-0">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex min-h-12 items-center border-b border-border px-2 font-display text-2xl text-foreground transition-colors hover:text-rose-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong"
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto grid gap-5 pt-8">
            <nav aria-label={navigation.language}>
              <ul className="flex list-none gap-2 p-0">
                {i18n.supportedLocales.map((supportedLocale) => (
                  <li key={supportedLocale}>
                    <Link
                      aria-current={locale === supportedLocale ? "page" : undefined}
                      aria-label={i18n.localeLabels[supportedLocale].languageName}
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-xs font-bold tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong ${
                        locale === supportedLocale
                          ? "border-rose-deep bg-rose-deep text-surface-pure"
                          : "border-border-strong text-foreground"
                      }`}
                      href={getLocalePath(supportedLocale)}
                      hrefLang={i18n.htmlLanguages[supportedLocale]}
                      lang={i18n.htmlLanguages[supportedLocale]}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {i18n.localeLabels[supportedLocale].shortLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-design-md bg-rose-deep px-5 font-bold text-surface-pure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              href={routes.booking}
              onClick={() => setIsMenuOpen(false)}
            >
              {navigation.booking}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
