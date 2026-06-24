/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kitea.com",
        pathname: "/media/**"
      }
    ]
  }
};

export default nextConfig;
