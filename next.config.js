/** @type {import('next').NextConfig} */

const baseApiUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Match any route starting with /api/
        destination: `${baseApiUrl}/:path*`, // Proxy to your backend server
      },
    ];
  },
};
