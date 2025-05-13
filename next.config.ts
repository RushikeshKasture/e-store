import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "utfs.io",
  //       port: "",
  //     },
  //   ],
  //   domains: [
  //     "res.cloudinary.com",
  //     "images.unsplash.com",
  //     "cdn.shopify.com",
  //     "cdn.pixabay.com",
  //   ],
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
