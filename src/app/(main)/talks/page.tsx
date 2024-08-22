import { Metadata } from 'next'
import { Suspense } from 'react'
import { getTalks } from '@/api/talks.ts'
import TalksList, {
    LoadingTalksList,
} from '@/components/TalksList/TalksList.tsx'

export const metadata: Metadata = {
    title: 'Мероприятия',
}

export default function Page() {
    return (
        <div className="max-w-7xl sm:px-6 lg:px-8 mx-2 sm:mx-auto">
            <h1 className="text-lg leading-6 font-medium text-gray-900">
                Доклады
            </h1>
            <div className="mt-6">
                <Suspense fallback={<LoadingTalksList />}>
                    <Talks />
                </Suspense>
            </div>
        </div>
    )
}

async function Talks() {
    const data = await getTalks()

    return <TalksList talks={data} />
}
