import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'storage.googleapis.com',
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Transpile packages for proper SSR handling
  transpilePackages: ['leaflet'],
  
  webpack: (config, { isServer }) => {
    // Handle Leaflet on client side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
