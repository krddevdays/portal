import 'server-only'
import path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'
import { z } from 'zod'

const speakerSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    avatar: z.string().optional(),
    work: z.string().optional(),
    position: z.string().optional(),
})

// type Speaker = z.infer<typeof speakerSchema>

const talkSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    speaker: speakerSchema,
})

// type Talk = z.infer<typeof talkSchema>

const activityTalkSchema = z.object({
    type: z.literal('TALK'),
    start_date: z.string().optional(),
    finish_date: z.string().optional(),
    zone: z.string().optional(),
    thing: talkSchema,
})

type ActivityTalk = z.infer<typeof activityTalkSchema>

export function isActivityTalk(o: unknown): o is ActivityTalk {
    return activityTalkSchema.safeParse(o).success
}

const discussionSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
})

// type Discussion = z.infer<typeof discussionSchema>

const activityDiscussionSchema = z.object({
    type: z.literal('DISCUSSION'),
    start_date: z.string().optional(),
    finish_date: z.string().optional(),
    zone: z.string().optional(),
    thing: discussionSchema,
})

// type ActivityDiscussion = z.infer<typeof activityDiscussionSchema>

const activityWelcomeSchema = z.object({
    type: z.literal('WELCOME'),
    start_date: z.string(),
    finish_date: z.string(),
    zone: z.string(),
    thing: z.object({
        title: z.string(),
    }),
})

const activityCloseSchema = z.object({
    type: z.literal('CLOSE'),
    start_date: z.string(),
    finish_date: z.string(),
    zone: z.string(),
    thing: z.object({
        title: z.string(),
    }),
})

const activityCoffeeSchema = z.object({
    type: z.literal('COFFEE'),
    start_date: z.string(),
    finish_date: z.string(),
    zone: z.string(),
    thing: z.object({
        title: z.string(),
    }),
})

const activityLunchSchema = z.object({
    type: z.literal('LUNCH'),
    start_date: z.string(),
    finish_date: z.string(),
    zone: z.string(),
    thing: z.object({
        title: z.string(),
    }),
})

const activitySchema = z.discriminatedUnion('type', [
    activityTalkSchema,
    activityDiscussionSchema,
    activityWelcomeSchema,
    activityCoffeeSchema,
    activityLunchSchema,
    activityCloseSchema,
])

type Activity = z.infer<typeof activitySchema>

const scheduledActivitySchema = z.object({
    start_date: z.string(),
    finish_date: z.string(),
    zone: z.string(),
})

export function isScheduleActivity<T extends Activity>(
    activity: T
): activity is T & z.infer<typeof scheduledActivitySchema> {
    return scheduledActivitySchema.safeParse(activity).success
}

const activitiesSchema = z.array(activitySchema)

const venueSchema = z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
})

const schema = z.object({
    legacy_id: z.number(),
    qtickets_id: z.number().optional(),
    slug: z.string(),
    name: z.string(),
    start_date: z.string(),
    finish_date: z.string(),
    short_description: z.string(),
    ticket_description: z.string().optional(),
    full_description: z.string().optional(),
    image: z.string().optional(),
    image_vk: z.string().optional(),
    image_facebook: z.string().optional(),
    venue: venueSchema,
    activities: activitiesSchema.default([]),
    created_at: z.date(),
    modified_at: z.date(),
})

export type EventResponse = z.infer<typeof schema>

const eventsDirectory = path.join(process.cwd(), '/src/data/events')

export async function getEvent(id: string): Promise<EventResponse | null> {
    return (
        (await getEvents()).find(
            (event) => event.legacy_id?.toString() === id
        ) || null
    )
}

type EventsResponse = Array<EventResponse>

let events: null | EventsResponse = null

export async function getEvents(): Promise<EventsResponse> {
    if (events !== null) return events

    const fileNames = fs.readdirSync(eventsDirectory)

    return (events = fileNames
        .map((fileName) => {
            const fullPath = path.join(eventsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const fileStat = fs.statSync(fullPath)

            const matterResult = matter(fileContents)

            return schema.parse({
                ...matterResult.data,
                full_description: matterResult.content,
                created_at: fileStat.ctime,
                modified_at: fileStat.mtime,
            })
        })
        .sort(
            (a, b) =>
                new Date(b.start_date).getTime() -
                new Date(a.start_date).getTime()
        ))
}
