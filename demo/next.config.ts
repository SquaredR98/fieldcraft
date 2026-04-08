import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@squaredr/fieldcraft-core", "@squaredr/fieldcraft-react"],
};

export default nextConfig;
