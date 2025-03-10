import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["vendure.rebl-shop-staging.exove.eu"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vendure.rebl-shop-staging.exove.eu",
        pathname: "/assets/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
