/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:[
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ]
  },
}

module.exports = nextConfig
