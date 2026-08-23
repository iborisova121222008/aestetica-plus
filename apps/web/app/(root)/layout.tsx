import type { ReactNode } from "react";

import { i18n } from "@/i18n/config";

import "../globals.css";

export default function RootRedirectLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={i18n.htmlLanguages[i18n.defaultLocale]}>
      <body>{children}</body>
    </html>
  );
}
