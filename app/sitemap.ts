import type { MetadataRoute } from "next";

const SITE_URL = "https://dallascircle.com";

/**
 * Keep this list limited to real, canonical, indexable pages that return HTTP 200.
 * Add dynamic business, category, and editorial URLs only after their route and
 * data contracts are implemented and verified. Reassess /php-rescue if the
 * product positioning changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/faq",
    "/php-rescue",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
