import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server-only packages used by the chat API; keep them out of the bundler
  serverExternalPackages: ['mongoose', 'googleapis', 'nodemailer'],
};

export default nextConfig;
