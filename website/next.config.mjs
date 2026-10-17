import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * Lets a phone on the same WiFi load the dev server by LAN IP.
   *
   * Next 16 blocks cross-origin dev requests by default: the HTML is
   * still served, but the HMR and RSC payloads are refused, so the page
   * LOOKS correct and nothing hydrates. Every interactive element is
   * silently dead — the hamburger opens nothing, the hero form will not
   * advance — with no error visible on the device.
   *
   * Private ranges only, and dev-only by nature: this setting has no
   * effect on a production build.
   */
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.16.*.*'],
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
