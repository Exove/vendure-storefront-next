import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["vendure.vendure-storefront-next-demo.exove.eu"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vendure.vendure-storefront-next-demo.exove.eu",
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
