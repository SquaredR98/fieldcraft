import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@squaredr/fieldcraft-core', '@squaredr/fieldcraft-react'],
};

const withMDX = createMDX();
export default withMDX(nextConfig);
