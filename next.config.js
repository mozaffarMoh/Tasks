/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const basePath = process.env.NODE_ENV === "production" ? "/TasksTest" : "";

const nextConfig = withPlugins([], {
  output: "export",
  reactStrictMode: true,
  basePath,
});

module.exports = nextConfig;
