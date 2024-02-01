/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  distDir: 'out',
  exportPathMap: async function () {
    return {
      '/': { page: '/' }, // Example path to export statically
      // Add more paths as needed
    };
  },
  basePath: "/TasksTest",
};

export default nextConfig;
