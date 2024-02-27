/** @type {import('next').NextConfig} */
const nextConfig = {output: 'standalone', images: {
  remotePatterns: [{
    'hostname': "i.imgur.com",
    protocol: 'https',
    pathname: '/**'
  }]
}}

module.exports = nextConfig
