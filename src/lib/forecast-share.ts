import { siteConfig } from "@/lib/site";

export function slugifyForecastLocation(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function forecastSlugToQuery(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .trim();
}

export function buildForecastSharePath(value: string) {
  return `/forecast/${slugifyForecastLocation(value)}`;
}

export function buildForecastShareUrl(value: string) {
  return `${siteConfig.domain}${buildForecastSharePath(value)}`;
}
