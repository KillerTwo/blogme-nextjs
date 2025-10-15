import type { NextConfig } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
    async rewrites() {
        return [
            {
                source: '/rest/:path*',
                destination: `${BASE_URL}/:path*`, // 代理到后端服务器
            },
            {
                source: '/uploads/:path*',
                destination: `${BASE_URL}/uploads/:path*`,
            },
        ]
    },
};

export default nextConfig;
