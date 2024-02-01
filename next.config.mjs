/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  distDir: "out",
  generateStaticPaths: async function () {
    return {
      // Define your static paths here
      paths: {
        "/": { page: "/" },
        // Add more paths as needed
      },
      // Additional options
      // fallback: false // Set to true if you want to enable fallback behavior
    };
  },
  basePath: "/TasksTest",
};

export default nextConfig;
