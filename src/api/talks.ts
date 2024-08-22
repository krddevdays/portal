import 'server-only'
import { getEvents } from '@/api/events.ts'

type Talk = {
    title: string
    description?: string
    speaker: {
        first_name: string
        last_name: string
        avatar?: string
        work?: string
        position?: string
    }
    event: {
        legacy_id: number
        slug: string
        name: string
        start_date: string
        finish_date: string
    }
}

export async function getTalks() {
    const events = await getEvents()

    const talks: Talk[] = []

    for (const event of events) {
        for (const activity of event.activities) {
            if (activity.type === 'TALK' && activity.thing) {
                talks.push({
                    title: activity.thing.title,
                    description: activity.thing.description,
                    speaker: activity.thing.speaker,
                    event: {
                        legacy_id: event.legacy_id,
                        slug: event.slug,
                        name: event.name,
                        start_date: event.start_date,
                        finish_date: event.finish_date,
                    },
                })
            }
        }
    }

    talks.sort((a, b) => {
        return (
            new Date(b.event.start_date).getTime() -
            new Date(a.event.start_date).getTime()
        )
    })

    return talks
}
