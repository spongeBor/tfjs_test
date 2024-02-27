/** @type {import('next').NextConfig} */
const nextConfig = {output: 'standalone', images: {
  remotePatterns: [{
    'hostname': "pixijs.com",
    protocol: 'https',
    pathname: '/**'
  }]
}}

module.exports = nextConfig
