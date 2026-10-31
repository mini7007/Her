import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local images from /public are served through Next's optimizer.
    // Add remotePatterns here if Bacha's memories ever use external URLs.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
