import { Metadata } from 'next'
import EventsList from '@/components/EventsList/EventsList'
import { getEvents } from '@/api/events'

export const metadata: Metadata = {
    title: 'Мероприятия',
}

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <div className="max-w-7xl sm:px-6 lg:px-8 mx-2 sm:mx-auto">
            <h1 className="text-lg leading-6 font-medium text-gray-900">
                Мероприятия
            </h1>
            <div className="mt-6">
                <EventsList events={events} />
            </div>
        </div>
    )
}
