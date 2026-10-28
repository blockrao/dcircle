import type { MetadataRoute } from "next";

const SITE_URL = "https://dallascircle.com";

/**
 * Only include public pages that are intended to represent the current product.
 * Add business and editorial URLs after their canonical data contracts and
 * publication-quality gates exist. The legacy PHP service route is deliberately
 * excluded from discovery sitemaps pending a separate positioning decision.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/faq"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
