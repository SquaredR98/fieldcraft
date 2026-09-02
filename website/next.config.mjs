import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@squaredr/fieldcraft-core', '@squaredr/fieldcraft-react'],
  async redirects() {
    return [
      // /roadmap became /changelog — keep old links and search results working.
      { source: '/roadmap', destination: '/changelog', permanent: true },
    ];
  },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
