import { Metadata } from 'next'
import { getEvent } from '@/api/events'
import { notFound } from 'next/navigation'

type Props = {
    params: { id: string }
}

export const metadata: Metadata = {
    title: 'Регистрация',
}

export default async function Page({ params }: Props) {
    const event = await getEvent(params.id)

    if (event === null) {
        notFound()
    }

    return `Регистрация на ${event.name}`
}
