import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is the demo only: the root opens the Overview.
  redirects: async () => [{ source: "/", destination: "/demo", permanent: false }],
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
