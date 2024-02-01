/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  distDir: 'out',
  output: "export",  // <=== enables static exports
  basePath: "/TasksTest",
};

export default nextConfig;