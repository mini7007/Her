import type { MetadataRoute } from "next";

/**
 * Discourage all search indexing. This is a personal experience, not a
 * public website. (Note: robots.txt is a courtesy signal, not access control.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
