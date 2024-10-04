import { getOrgTeamMembers } from '@/api/team.ts'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import * as React from 'react'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Команда',
}

export default function TalksHowTo() {
    return (
        <div className="max-w-7xl sm:px-6 lg:px-8 mx-2 sm:mx-auto">
            <h1 className="text-lg leading-6 font-medium text-gray-900">
                Команда
            </h1>

            <div className="flex flex-col gap-4 mt-6">
                <Suspense fallback={<MembersLoading />}>
                    <Members />
                </Suspense>
            </div>
        </div>
    )
}

async function Members() {
    const members = await getOrgTeamMembers()

    return members.map(
        ({
            id,
            firstName,
            lastName,
            bio,
            jobName,
            jobPosition,
            avatar,
            telegram,
            email,
        }) => {
            const fullName = `${firstName} ${lastName}`
            return (
                <section className="flex gap-4" key={id}>
                    <div className="min-w-[100px]">
                        <Image
                            loading="lazy"
                            src={avatar}
                            width={100}
                            height={100}
                            alt={fullName}
                        />
                    </div>

                    <div>
                        <h2 className="font-bold">{fullName}</h2>
                        {jobPosition && jobName && (
                            <p className="mb-4">
                                {jobPosition}, {jobName}
                            </p>
                        )}

                        <ul>
                            <li>
                                Телеграм:{' '}
                                <a
                                    href={`https://t.me/${telegram}`}
                                    className="underline hover:no-underline"
                                >
                                    {telegram}
                                </a>
                            </li>
                            {email && (
                                <li>
                                    Почта:{' '}
                                    <a
                                        href={`mailto:${email}`}
                                        className="underline hover:no-underline"
                                    >
                                        {email}
                                    </a>
                                </li>
                            )}
                        </ul>

                        {bio && (
                            <div className="mt-4">
                                <MDXRemote source={bio} />
                            </div>
                        )}
                    </div>
                </section>
            )
        }
    )
}

function MembersLoading() {
    return (
        <ul role="list" className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <li key={index} className="overflow-hidden">
                    <div className="flex h-full w-full gap-4">
                        <div className="min-w-[100px]">
                            <Skeleton className="w-[100px] h-[100px]" />
                        </div>

                        <div className="flex flex-col grow">
                            <Skeleton className="h-5 w-[300px] mb-1" />
                            <Skeleton className="h-5 w-[200px] mb-4" />
                            <Skeleton className="h-5 w-[200px] mb-1" />
                            <Skeleton className="h-5 w-[200px] mb-4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
