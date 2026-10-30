import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // src/styles/pdfThemes.js is also bundled for the /pdf-preview page (browser).
    // It only uses `fs` on the server, so stub it out in the client bundle.
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};

export default nextConfig;
