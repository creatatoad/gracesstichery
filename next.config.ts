import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded images are served straight from /public/uploads with plain <img>
  // tags, so the image optimizer isn't needed.
  images: { unoptimized: true },
};

export default nextConfig;
