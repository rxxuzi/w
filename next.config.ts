import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/dev',
        destination: '/develop',
      },
      {
        source: '/dev/:slug',
        destination: '/develop/:slug',
      },
    ]
  },
};

export default nextConfig;
