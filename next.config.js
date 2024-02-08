/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');

const basePath = process.env.NODE_ENV === 'production' ? '/TasksTest' : '';

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath,
};

module.exports = nextConfig;