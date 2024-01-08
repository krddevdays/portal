import { Metadata } from 'next'
import { getEvent } from '@/api/events'
import { notFound } from 'next/navigation'
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import { PropsWithChildren } from 'react'
type Props = {
    params: { id: string }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const event = await getEvent(props.params.id)

    if (!event) {
        notFound()
    }

    const images: OpenGraph['images'] = []

    if (event.image_facebook) {
        images.push({
            url: event.image_facebook,
        })
    }

    if (event.image_vk) {
        images.push({
            url: event.image_vk,
        })
    }

    const title = {
        default: event.name,
        template: `%s — ${event.name}`,
    }

    return {
        title,
        description: event.short_description,
        openGraph: {
            title,
            description: event.short_description,
            images,
        },
    }
}

export default function Layout({ children }: PropsWithChildren) {
    return children
}
