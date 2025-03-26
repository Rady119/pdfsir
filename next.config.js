/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      crypto: false,
      stream: false,
      os: false,
      path: false,
    };
    return config;
  },
}

module.exports = nextConfig