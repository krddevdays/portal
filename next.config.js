/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    experimental: {
        typedRoutes: true,
    },
}

module.exports = nextConfig
