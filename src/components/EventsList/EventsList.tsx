import * as React from 'react'
import Link from 'next/link'
import { EventDate } from '@/components/EventDate/EventDate'
import { Card, CardDescription, CardHeader } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

type Event = {
    id: string
    name: string
    start_date: string
    finish_date: string
    short_description: string
}

type EventsListProps = {
    events: Event[]
}

export default function EventsList(props: EventsListProps) {
    return (
        <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            {props.events.map((event, index) => (
                <li key={index}>
                    <Card className="relative h-full">
                        <Link
                            href={`/events/${encodeURIComponent(event.id)}`}
                            className="absolute inset-0 focus:none"
                        />
                        <CardHeader>
                            <CardDescription>
                                <span
                                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                                        new Date(event.start_date).getTime() >=
                                        Date.now()
                                            ? 'bg-green-100 text-green-800'
                                            : 'text-gray-500 bg-gray-100'
                                    }`}
                                >
                                    <EventDate
                                        startAt={new Date(event.start_date)}
                                        finishAt={new Date(event.finish_date)}
                                        compact={true}
                                    />
                                </span>
                            </CardDescription>
                            <CardDescription className="text-foreground font-medium">
                                {event.name}
                            </CardDescription>
                            <CardDescription>
                                {event.short_description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </li>
            ))}
        </ul>
    )
}

export function LoadingEventsList() {
    return (
        <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                    <Card className="relative h-full">
                        <CardHeader>
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </CardHeader>
                    </Card>
                </li>
            ))}
        </ul>
    )
}
