import { permanentRedirect } from "next/navigation";

import { getLocalePath, i18n } from "@/i18n/config";

export default function RootPage() {
  permanentRedirect(getLocalePath(i18n.defaultLocale));
}
