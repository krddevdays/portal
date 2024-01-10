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
    async redirects() {
        return [
            {
                source: '/cfp',
                destination:
                    'https://forms.yandex.ru/cloud/5adc61cf6162d77e2714831c',
                permanent: false,
            },
        ]
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
        tunnelRoute: '/monitoring-tunnel',
    }
)
