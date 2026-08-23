const localSiteUrl = "http://localhost:3000";

export function getSiteUrl(): string {
  const configuredValue = process.env.SITE_URL?.trim() || localSiteUrl;

  let siteUrl: URL;

  try {
    siteUrl = new URL(configuredValue);
  } catch {
    throw new Error("SITE_URL must be a valid absolute HTTP(S) URL.");
  }

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw new Error("SITE_URL must use the http or https protocol.");
  }

  if (
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error("SITE_URL must contain an origin only, without credentials, a path, query, or hash.");
  }

  return siteUrl.origin;
}
