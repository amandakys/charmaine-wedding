import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/charmaine-wedding",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
