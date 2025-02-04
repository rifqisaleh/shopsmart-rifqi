import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "content.r9cdn.net",
        pathname: "/**",
      },
     ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|ts|tsx|jsx)$/,
      exclude: [/old\/ShopSmart-React/], // Exclude the ShopSmart-React folder
    });
    return config;
  },
};

export default nextConfig;
