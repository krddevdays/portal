import { getEvents } from '@/api/events.ts'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const events = await getEvents()

    return events.map((event) => ({
        url: `https://krd.dev/events/${encodeURIComponent(event.id)}`,
        lastModified: event.modified_at,
    }))
}
