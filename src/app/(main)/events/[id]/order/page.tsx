import { Metadata } from 'next'
import { getEvent } from '@/api/events'
import { notFound } from 'next/navigation'
import { getTickets } from '@/api/qtickets'
import { OrderForm } from './form'

type Props = {
    params: { id: string }
}

export const metadata: Metadata = {
    title: 'Регистрация',
}

export default async function Page({ params }: Props) {
    const event = await getEvent(params.id)

    if (event === null || event.qtickets_id == undefined) {
        notFound()
    }

    const tickets = await getTickets(event.qtickets_id)

    if (!tickets || !tickets.is_active) {
        notFound()
    }

    return (
        <div className="max-w-96 mx-auto">
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <div className="mt-8">
                <OrderForm
                    eventId={params.id}
                    types={tickets.types}
                    payments={tickets.payments}
                />
            </div>
        </div>
    )
}
