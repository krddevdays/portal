/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.yandexcloud.net',
                pathname: '/krddev-content/**',
            },
        ],
    },
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    experimental: {
        typedRoutes: true,
    },
}

module.exports = nextConfig
