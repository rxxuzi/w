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
  async redirects() {
    return [
      {
        source: '/blog',
        destination: 'https://blog.rxxuzi.com',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: 'https://blog.rxxuzi.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
