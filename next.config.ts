import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '30mb',
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'www.suntrixmedia.com' }],
        destination: 'https://suntrixmedia.com',
        statusCode: 301,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.suntrixmedia.com' }],
        destination: 'https://suntrixmedia.com/:path*',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
