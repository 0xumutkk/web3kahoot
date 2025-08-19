/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['worldcoin.org'],
  },
  env: {
    WORLD_APP_ID: process.env.WORLD_APP_ID,
    WORLD_ACTION_NAME: process.env.WORLD_ACTION_NAME,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
