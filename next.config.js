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
    assetPrefix: process.env.ASSET_PREFIX,
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    experimental: {
        typedRoutes: true,
    },
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
    nextConfig,
    {
        silent: true,
    },
    {
        widenClientFileUpload: true,
        hideSourceMaps: true,
        disableLogger: true,
    }
)
