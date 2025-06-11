/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["http://192.168.0.104:3000", "http://172.22.0.1:3000"],
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
