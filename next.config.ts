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
  ],
  /* config options here */
};

export default nextConfig;
