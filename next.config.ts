import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*",
    "isolated-vm",
    "@ai-sdk/google",
    "ai",
    "shelljs",
    "crawlee",
    "dayjs",
    "@xenova/transformers",
    "node-fetch",
    "isomorphic-git",
    "isomorphic-fetch",
    "jsinspect-plus",
    "jsdom",
    "@isomorphic-git/lightning-fs",
    "marked",
    "js-yaml",
    "vitest",
    "jszip",
    "zod",
    "eslintcc",
    "langsmith",
    "langsmith/vercel",
    "@copilotkit/runtime"
  ],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@copilotkit/react-core',
      '@copilotkit/react-ui',
      'lucide-react',
      'framer-motion'
    ]
  },

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          copilotkit: {
            test: /[\\/]node_modules[\\/]@copilotkit[\\/]/,
            name: 'copilotkit',
            chunks: 'all',
          },
          mastra: {
            test: /[\\/]src[\\/]mastra[\\/]/,
            name: 'mastra',
            chunks: 'all',
          }
        }
      };
    }
    return config;
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,
  poweredByHeader: false,

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
