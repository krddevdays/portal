import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/events/*/order',
        },
        sitemap: 'https://krd.dev/sitemap.xml',
    }
}
