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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

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

      if (event.key !== "Tab" || !panelRef.current) return;

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

  const navigationItems = [
    { href: routes.services, label: navigation.services },
    { href: routes.gallery, label: navigation.gallery },
    { href: routes.shop, label: navigation.shop },
  ];
  const focusClasses =
    "focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-header-background";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-header-background text-text">
        <div
          className="mx-auto grid h-header-mobile max-w-application grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 xl:h-header-desktop xl:px-12 2xl:px-16"
          data-header-primary-row
        >
          <div className="flex min-w-0 justify-start">
            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={navigation.openMenu}
              className={`inline-flex size-11 items-center justify-center border border-text bg-transparent text-text transition-colors duration-motion-fast hover:border-primary hover:text-primary xl:hidden ${focusClasses}`}
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

            <nav aria-label={navigation.language} className="hidden xl:block">
              <ul className="flex list-none items-center gap-1 p-0">
                {i18n.supportedLocales.map((supportedLocale) => (
                  <li key={supportedLocale}>
                    <Link
                      aria-current={locale === supportedLocale ? "page" : undefined}
                      aria-label={i18n.localeLabels[supportedLocale].languageName}
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center bg-transparent px-2 text-xs font-semibold tracking-wider transition-colors hover:text-primary ${focusClasses}`}
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
          </div>

          <BrandLogo
            className="w-[clamp(7.5rem,34vw,11rem)] xl:w-52"
            href={routes.home}
          />

          <div className="flex min-w-0 justify-end">
            <Link
              className={`inline-flex min-h-11 items-center justify-center border-b border-text bg-transparent px-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary sm:px-3 sm:text-sm ${focusClasses}`}
              href={routes.booking}
            >
              {navigation.booking}
            </Link>
          </div>
        </div>

        <nav
          aria-label={navigation.primary}
          className="hidden h-header-navigation border-t border-border xl:block"
          data-desktop-navigation
        >
          <ul className="mx-auto grid h-full max-w-content grid-cols-3 list-none p-0">
            {navigationItems.map((item) => (
              <li className="min-w-0" key={item.href}>
                <Link
                  className={`flex h-full items-center justify-center border-x border-transparent bg-transparent px-5 text-sm font-semibold tracking-wide transition-colors duration-motion-fast hover:text-primary ${focusClasses}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
          className="absolute inset-0 bg-text/45"
          onClick={() => setIsMenuOpen(false)}
          tabIndex={-1}
          type="button"
        />
        <div
          aria-label={navigation.mobileMenu}
          aria-modal="true"
          className={`absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col border-l border-border bg-header-background px-6 py-5 shadow-design-dialog transition-transform duration-motion-default ease-standard ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          id="mobile-navigation"
          ref={panelRef}
          role="dialog"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
            <BrandLogo className="w-20" href={routes.home} />
            <button
              aria-label={navigation.closeMenu}
              className={`inline-flex size-11 items-center justify-center border border-text bg-transparent text-text transition-colors hover:border-primary hover:text-primary ${focusClasses}`}
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
                    className={`flex min-h-12 items-center border-b border-border bg-transparent px-2 font-display text-2xl text-text transition-colors hover:text-primary ${focusClasses}`}
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
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center border px-3 text-xs font-bold tracking-wider ${focusClasses} ${
                        locale === supportedLocale
                          ? "border-primary bg-transparent text-primary"
                          : "border-border-strong text-text"
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
              className={`inline-flex min-h-12 items-center justify-center border border-text bg-transparent px-5 font-bold text-text transition-colors hover:border-primary hover:text-primary ${focusClasses}`}
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
