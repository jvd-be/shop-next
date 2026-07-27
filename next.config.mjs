/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [new URL('http://localhost:3000/**')],
  },

};

export default nextConfig;
