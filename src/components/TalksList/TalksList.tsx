import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import Author from '@/components/Author/Author.tsx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

type Event = {
    id: string
    name: string
    start_date: string
    finish_date: string
}

type Speaker = {
    first_name: string
    last_name: string
    avatar?: string
    work?: string
    position?: string
}

type Talk = {
    event: Event
    start_date?: string
    finish_date?: string
    zone?: string
    title: string
    description?: string
    speaker: Speaker
}

type TalksListProps = {
    talks: Talk[]
}

export default function TalksList(props: TalksListProps) {
    return (
        <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
            {props.talks.map((talk, index) => (
                <li
                    key={index}
                    className="group bg-white rounded-lg shadow divide-y divide-gray-200 overflow-hidden"
                >
                    <div className="h-full w-full p-6 flex flex-col justify-between relative">
                        <div className="flex-1 text-gray-900 font-medium">
                            {talk.title}
                        </div>
                        <Author className="mt-10" {...talk.speaker} />
                        {talk.description && (
                            <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 bg-white text-xs overflow-auto">
                                <MDXRemote source={talk.description} />
                            </div>
                        )}
                        <Link
                            href={`/events/${encodeURIComponent(talk.event.id)}`}
                            className="absolute inset-0 focus:none"
                        />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export function LoadingTalksList() {
    return (
        <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <li
                    key={index}
                    className="group bg-white rounded-lg shadow divide-y divide-gray-200 overflow-hidden"
                >
                    <div className="h-full w-full p-6 flex flex-col justify-between relative">
                        <div className="flex-1 text-gray-900 font-medium">
                            <Skeleton className="h-5 w-full" />
                        </div>
                        <Skeleton className="mt-10 h-12 w-full" />
                    </div>
                </li>
            ))}
        </ul>
    )
}
