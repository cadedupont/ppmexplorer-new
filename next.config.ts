import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ppmdata.blob.core.windows.net',
        port: '',
        pathname: '/ppm/images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
