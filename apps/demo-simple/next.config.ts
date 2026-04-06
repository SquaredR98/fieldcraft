import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@squaredr/formengine-core", "@squaredr/formengine-react"],
};

export default nextConfig;
