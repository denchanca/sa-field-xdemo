import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/analysis", destination: "/workflows", permanent: false },
      { source: "/analysis/:path*", destination: "/workflows", permanent: false },
    ];
  },
};

export default nextConfig;
