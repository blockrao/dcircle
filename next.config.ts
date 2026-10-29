import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Keep Cache Components / Partial Prefetching disabled on Cloudflare Workers
   * until the Next.js + OpenNext runtime supports staged-render scheduling
   * reliably. Enabling these options caused Worker requests to hang (1101).
   */
  async redirects() {
    return [
      {
        source: "/php-rescue",
        destination: "/",
        permanent: true,
      },
    ];
  },
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
