/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v2/:path*",
        destination: "http://localhost:5001/api/v2/:path*", // Added missing /
      },
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:5001/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
