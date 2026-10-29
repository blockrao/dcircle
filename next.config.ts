import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Keep Cache Components / Partial Prefetching disabled on Cloudflare Workers
   * until the Next.js + OpenNext runtime supports the staged-render scheduling
   * reliably. With these enabled, Worker requests can hang and return 1101.
   */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
