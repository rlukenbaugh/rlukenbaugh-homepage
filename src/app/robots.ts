import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/privacy", "/support", "/terms"],
      disallow: ["/account", "/dashboard", "/sign-in", "/sign-up", "/api/"],
    },
    sitemap: "https://skiesready.com/sitemap.xml",
  };
}
